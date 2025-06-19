"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jsonwebtoken_1 = require("jsonwebtoken");
const Achievement_entity_1 = require("../typeorm/entities/Achievement.entity");
const History_entity_1 = require("../typeorm/entities/History.entity");
const Profile_entity_1 = require("../typeorm/entities/Profile.entity");
const Relation_entity_1 = require("../typeorm/entities/Relation.entity");
const User_entity_1 = require("../typeorm/entities/User.entity");
const chat_room_entity_1 = require("../typeorm/entities/chat-room.entity");
const typeorm_2 = require("typeorm");
const cloudinary_1 = require("cloudinary");
let UserService = class UserService {
    constructor(userRepository, profileRepository, relationRepository, historyRepository, achievementRepository, chatRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.relationRepository = relationRepository;
        this.historyRepository = historyRepository;
        this.achievementRepository = achievementRepository;
        this.chatRepository = chatRepository;
    }
    async findProfileByUsername(userName) {
        try {
            const existingUser = await this.userRepository.findOne({
                where: {
                    username: userName,
                },
                relations: ['profile'],
            });
            if (!existingUser) {
                throw new Error('User profile not found!');
            }
            return existingUser;
        }
        catch (error) {
            throw new Error('Failed to find profile');
        }
    }
    async uploadImageToCould(fileUrl) {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader.upload(fileUrl, { public_id: 'olympic_flag' }, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    async updateProfileByUsername(userName, userData, imageData) {
        try {
            const existingUser = await this.findProfileByUsername(userName);
            if (!existingUser) {
                throw new Error('User not found');
            }
            const ret = await this.uploadImageToCould(imageData.path);
            existingUser.firstName = userData.firstName;
            existingUser.lastName = userData.lastName;
            existingUser.uniquename = userData.uniquename;
            existingUser.picture = ret.url;
            const updatedUser = await this.userRepository.save(existingUser);
            const token = (0, jsonwebtoken_1.sign)({ ...updatedUser }, process.env.JWT_SECRET);
            return { token, user: updatedUser, success: true };
        }
        catch (error) {
            throw new Error('Failed to update profile: ' + error);
        }
    }
    async addUniquename(username, uniquename) {
        try {
            const user = await this.userRepository.findOne({
                where: { username: username },
            });
            if (!user) {
                throw new Error('User not found');
            }
            const uniqueNameExist = await this.userRepository.findOne({
                where: { uniquename: uniquename },
            });
            if (uniqueNameExist) {
                throw new Error('Try again to set a unique name.');
            }
            user.uniquename = uniquename;
            const updateUser = await this.userRepository.save(user);
            return updateUser;
        }
        catch (error) {
            throw new Error(`Error to set unique name`);
        }
    }
    async findAllHistoryOfUser(username) {
        try {
            const user = await this.userRepository.findOne({
                where: { username: username },
            });
            if (!user) {
                throw new Error('User not found');
            }
            const histories = await this.historyRepository.find({
                where: [{ user: { id: user.id } }, { userCompetitor: { id: user.id } }],
                relations: ['user', 'userCompetitor'],
            });
            if (!histories) {
                throw new Error('User histories not found');
            }
            const historyDtos = histories.map((history) => ({
                id: history.id,
                resulteOfCompetitor: history.resulteOfCompetitor,
                resulteOfUser: history.resulteOfUser,
                date: history.date,
                user: history.user,
                userCompetitor: history.userCompetitor,
            }));
            return historyDtos;
        }
        catch (error) {
            throw new Error(`Error fetching history`);
        }
    }
    async searchToFrindByUsername(username, secondUsername) {
        try {
            const user = await this.userRepository.findOne({
                where: { username: username },
            });
            const secondUser = await this.userRepository.findOne({
                where: { username: secondUsername },
                select: [
                    'id',
                    'username',
                    'uniquename',
                    'firstName',
                    'lastName',
                    'email',
                    'picture',
                ],
                relations: ['profile', 'achievements', 'histories'],
            });
            if (!user || !secondUser) {
                throw new Error('User not found');
            }
            const relation = await this.relationRepository.findOne({
                where: [
                    {
                        friend: { id: user.id },
                        user: { id: secondUser.id },
                        status: 'friends',
                    },
                    {
                        friend: { id: secondUser.id },
                        user: { id: user.id },
                        status: 'friends',
                    },
                ],
            });
            if (!relation) {
                throw new Error("you don't have access to user");
            }
            return secondUser;
        }
        catch (error) {
            throw new Error(`Error fetching user profile`);
        }
    }
    async historyFriend(username, secondUsername) {
        try {
            const user = await this.userRepository.findOne({
                where: { username: username },
            });
            const secondUser = await this.userRepository.findOne({
                where: { username: secondUsername },
            });
            if (!user || !secondUser) {
                throw new Error('User not found');
            }
            const history = await this.historyRepository.find({
                where: [{ user: { id: secondUser.id } }, { user: { id: user.id } }],
                relations: ['user', 'userCompetitor'],
            });
            return history;
        }
        catch (error) {
            throw new Error(`Error fetching user profile`);
        }
    }
    async searchToUserByUsername(username, secondUsername) {
        try {
            const user = await this.userRepository.findOne({
                where: { username: username },
            });
            const secondUser = await this.userRepository.findOne({
                where: { username: secondUsername },
                select: [
                    'id',
                    'username',
                    'uniquename',
                    'firstName',
                    'lastName',
                    'email',
                    'picture',
                ],
                relations: ['profile', 'achievements', 'histories'],
            });
            if (!user || !secondUser) {
                throw new Error('User not found');
            }
            const relation = await this.relationRepository.findOne({
                where: [
                    {
                        friend: { id: user.id },
                        user: { id: secondUser.id },
                        status: 'blocked',
                    },
                    {
                        friend: { id: secondUser.id },
                        user: { id: user.id },
                        status: 'blocked',
                    },
                ],
            });
            if (relation) {
                throw new Error("you don't have access to this user");
            }
            return secondUser;
        }
        catch (error) {
            throw new Error(`Error fetching user profile`);
        }
    }
    async addAchievementOfUser(userName, addAchievementOfUser) {
        try {
            const existingUser = await this.findProfileByUsername(userName);
            if (!existingUser) {
                throw new Error('User not found');
            }
            const newHistory = this.achievementRepository.create({
                ...addAchievementOfUser,
                user: existingUser,
            });
            await this.achievementRepository.save(newHistory);
            const updatedUser = await this.findProfileByUsername(userName);
            return updatedUser;
        }
        catch (error) {
            throw new Error('Failed to add history: ' + error.message);
        }
    }
    async findAllAchievementOfUser(username) {
        try {
            const user = await this.userRepository.findOne({
                where: { username: username },
            });
            if (!user) {
                throw new Error('User not found');
            }
            const achievements = await this.achievementRepository.find({
                where: { user: { id: user.id } },
                relations: ['user'],
            });
            if (!achievements) {
                throw new Error('User histories not found');
            }
            const achievementDtos = achievements.map((achievement) => ({
                id: achievement.id,
                type: achievement.type,
                description: achievement.description,
                user: achievement.user,
            }));
            return achievementDtos;
        }
        catch (error) {
            throw new Error(`Error fetching history`);
        }
    }
    async sendRequest(userName, secondUsername) {
        try {
            const existingUser = await this.userRepository.findOne({
                where: {
                    username: userName,
                },
            });
            const existingSecondUser = await this.userRepository.findOne({
                where: {
                    username: secondUsername,
                },
            });
            if (!existingUser || !existingSecondUser) {
                throw new Error('User not found');
            }
            const existingRelation = await this.relationRepository.findOne({
                where: [
                    {
                        friend: { id: existingUser.id },
                        user: { id: existingSecondUser.id },
                    },
                    {
                        friend: { id: existingSecondUser.id },
                        user: { id: existingUser.id },
                    },
                ],
            });
            if (existingRelation || userName === secondUsername) {
                throw new Error('Relationship already exists');
            }
            const newRelation = this.relationRepository.create({
                status: 'sendRequest',
                FromUser: existingUser.username,
                friend: { id: existingSecondUser.id },
                user: { id: existingUser.id },
            });
            await this.relationRepository.save(newRelation);
            return await this.findProfileByUsername(userName);
        }
        catch (error) {
            if (error.message === 'User not found') {
                throw new Error('One or both users do not exist');
            }
            else if (error.message === 'Relationship already exists') {
                throw new Error('A relationship between these users already exists');
            }
            else {
                throw new Error('Failed to add friend');
            }
        }
    }
    async findAllFriendsOfUser(username) {
        try {
            const friends = await this.relationRepository.find({
                where: [
                    { user: { username: username }, status: 'friends' },
                    { friend: { username: username }, status: 'friends' },
                ],
                relations: ['friend', 'user'],
            });
            if (!friends || friends.length === 0) {
                return [];
            }
            const relationDtos = friends.map((relation) => ({
                id: relation.id,
                status: relation.status,
                friend: relation.friend,
                user: relation.user,
            }));
            return relationDtos;
        }
        catch (error) {
            throw new Error(`Error fetching friend relationships: ${error.message}`);
        }
    }
    async findAllBlockedOfUser(username) {
        try {
            const userBlocked = await this.relationRepository.find({
                where: [
                    { user: { username }, status: 'blocked', FromUser: username },
                    { friend: { username }, status: 'blocked', FromUser: username },
                ],
                relations: ['friend', 'user'],
            });
            if (!userBlocked) {
                throw new Error('relations not found');
            }
            const relationDtos = userBlocked.map((relation) => ({
                id: relation.id,
                status: relation.status,
                friend: relation.friend,
                user: relation.user,
            }));
            return relationDtos;
        }
        catch (error) {
            throw new Error(`Error fetching friend relationships`);
        }
    }
    async getAllRequestsOfUser(username) {
        try {
            const friendRequests = await this.relationRepository.find({
                where: [{ friend: { username }, status: 'sendRequest' }],
                relations: ['user'],
            });
            if (!friendRequests) {
                throw new Error('friendRequests not found');
            }
            const relationDtos = friendRequests.map((relation) => ({
                id: relation.id,
                status: relation.status,
                friend: relation.friend,
                user: relation.user,
            }));
            return relationDtos;
        }
        catch (error) {
            throw new Error(`Error fetching friend requests`);
        }
    }
    async getAllRequistsSendFromUser(username) {
        try {
            const friendRequests = await this.relationRepository.find({
                where: [{ user: { username }, status: 'sendRequest' }],
                relations: ['friend'],
            });
            if (!friendRequests) {
                throw new Error('friendRequests not found');
            }
            const relationDtos = friendRequests.map((relation) => ({
                id: relation.id,
                status: relation.status,
                friend: relation.friend,
                user: relation.user,
            }));
            return relationDtos;
        }
        catch (error) {
            throw new Error(`Error fetching friend requests`);
        }
    }
    async blockUser(username, secondUser) {
        try {
            const existingRelation = await this.relationRepository.findOne({
                where: [
                    {
                        user: { username },
                        friend: { username: secondUser },
                        status: (0, typeorm_2.Not)('blocked'),
                    },
                    {
                        friend: { username },
                        user: { username: secondUser },
                        status: (0, typeorm_2.Not)('blocked'),
                    },
                ],
            });
            if (!existingRelation || username === secondUser) {
                throw new Error('Relation not found');
            }
            existingRelation.status = 'blocked';
            existingRelation.FromUser = username;
            const updatedRelation = await this.relationRepository.save(existingRelation);
            return this.findProfileByUsername(secondUser);
        }
        catch (error) {
            throw new Error(`Error blocking friend`);
        }
    }
    async unblockUser(username, secondUser) {
        try {
            const existingRelation = await this.relationRepository.findOne({
                where: [
                    {
                        user: { username },
                        friend: { username: secondUser },
                        status: 'blocked',
                    },
                    {
                        user: { username: secondUser },
                        friend: { username },
                        status: 'blocked',
                    },
                ],
            });
            if (!existingRelation) {
                throw new Error('Blocked relation not found');
            }
            if (existingRelation.FromUser != username) {
                throw new Error('You cannot');
            }
            await this.relationRepository.remove(existingRelation);
            return this.findProfileByUsername(secondUser);
        }
        catch (error) {
            throw new Error(`Error unblocking friend: ${error.message}`);
        }
    }
    async acceptRequest(username, secondUser) {
        try {
            const existingRelation = await this.relationRepository.findOne({
                where: [
                    {
                        user: { username },
                        friend: { username: secondUser },
                        status: 'sendRequest',
                    },
                    {
                        user: { username: secondUser },
                        friend: { username },
                        status: 'sendRequest',
                    },
                ],
            });
            if (!existingRelation) {
                throw new Error('Friend request not found');
            }
            if (existingRelation.FromUser === username) {
                throw new Error('You cannot accept your own friend request');
            }
            existingRelation.status = 'friends';
            await this.relationRepository.save(existingRelation);
            const userProfile = await this.findProfileByUsername(secondUser);
            return userProfile;
        }
        catch (error) {
            throw new Error(`Error accepting friend request: ${error.message}`);
        }
    }
    async rejectRequest(username, secondUser) {
        try {
            const existingRelation = await this.relationRepository.findOne({
                where: [
                    {
                        user: { username },
                        friend: { username: secondUser },
                        status: 'sendRequest',
                    },
                    {
                        user: { username: secondUser },
                        friend: { username },
                        status: 'sendRequest',
                    },
                ],
            });
            if (!existingRelation) {
                throw new Error('Friend request not found');
            }
            if (existingRelation.FromUser === username) {
                throw new Error('You cannot reject your own friend request');
            }
            await this.relationRepository.remove(existingRelation);
            const userProfile = await this.findProfileByUsername(secondUser);
            return userProfile;
        }
        catch (error) {
            throw new Error(`Error rejecting friend request: ${error.message}`);
        }
    }
    async cancelRequist(username, secondUser) {
        try {
            const existingRelation = await this.relationRepository.findOne({
                where: [
                    {
                        user: { username },
                        friend: { username: secondUser },
                        status: 'sendRequest',
                    },
                    {
                        user: { username: secondUser },
                        friend: { username },
                        status: 'sendRequest',
                    },
                ],
            });
            if (!existingRelation) {
                throw new Error('Friend request not found');
            }
            if (existingRelation.FromUser != username) {
                throw new Error('You cannot accept your own friend request');
            }
            await this.relationRepository.remove(existingRelation);
            const userProfile = await this.findProfileByUsername(secondUser);
            return userProfile;
        }
        catch (error) {
            throw new Error(`Error rejecting friend request: ${error.message}`);
        }
    }
    async cancelRelation(username, secondUser) {
        try {
            const existingRelation = await this.relationRepository.findOne({
                where: [
                    {
                        user: { username },
                        friend: { username: secondUser },
                        status: 'friends',
                    },
                    {
                        user: { username: secondUser },
                        friend: { username },
                        status: 'friends',
                    },
                ],
            });
            if (!existingRelation) {
                throw new Error('Friend request not found');
            }
            await this.relationRepository.remove(existingRelation);
            const userProfile = await this.findProfileByUsername(secondUser);
            return userProfile;
        }
        catch (error) {
            throw new Error(`Error rejecting friend request: ${error.message}`);
        }
    }
    async getStatusOfUsers(username) {
        try {
            const friends = await this.relationRepository.find({
                where: [
                    {
                        friend: { username: username },
                        user: { status: 'online' },
                    },
                    {
                        user: { username: username },
                        friend: { status: 'online' },
                    },
                ],
                relations: ['user'],
            });
            const relationDtos = friends.map((relation) => ({
                id: relation.id,
                status: relation.status,
                friend: relation.friend,
                user: relation.user,
            }));
            return relationDtos;
        }
        catch (error) {
            throw new Error(`Error fetching friends: ${error.message}`);
        }
    }
    async setTwoFactorAuthenticationSecret(secret, username) {
        try {
            const user = await this.userRepository.findOne({
                where: { username: username },
            });
            if (user) {
                user.twoFactorAuthSecret = secret;
                await this.userRepository.save(user);
            }
            else {
            }
        }
        catch (error) {
            throw new Error('Error setting two-factor authentication secret');
        }
    }
    async turnOnTwoFactorAuthentication(username) {
        try {
            const user = await this.userRepository.findOne({
                where: { username: username },
            });
            if (user) {
                user.isTwoFactorAuthEnabled = true;
                await this.userRepository.save(user);
            }
            else {
                throw new Error('User not found.');
            }
        }
        catch (error) {
            throw new Error(`Error two factor auth ${error}`);
        }
    }
    async turnOffTwoFactorAuthentication(username) {
        try {
            const user = await this.userRepository.findOne({
                where: { username: username },
            });
            if (user) {
                user.isTwoFactorAuthEnabled = false;
                await this.userRepository.save(user);
            }
            else {
                throw new Error('User not found.');
            }
        }
        catch (error) {
            throw new Error(`Error two factor auth ${error}`);
        }
    }
    async setUserstatus(username, status) {
        try {
            const user = await this.userRepository.findOne({
                where: { username: username },
            });
            if (!user) {
                return;
            }
            user.status = status;
            const updatedUser = await this.userRepository.save(user);
            return updatedUser;
        }
        catch (error) {
            return;
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(Profile_entity_1.Profile)),
    __param(2, (0, typeorm_1.InjectRepository)(Relation_entity_1.Relation)),
    __param(3, (0, typeorm_1.InjectRepository)(History_entity_1.HistoryEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(Achievement_entity_1.Achievement)),
    __param(5, (0, typeorm_1.InjectRepository)(chat_room_entity_1.ChatRoom)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _e : Object, typeof (_f = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _f : Object])
], UserService);
//# sourceMappingURL=user.service.js.map