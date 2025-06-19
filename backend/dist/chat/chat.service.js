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
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const User_entity_1 = require("../typeorm/entities/User.entity");
const Profile_entity_1 = require("../typeorm/entities/Profile.entity");
const Relation_entity_1 = require("../typeorm/entities/Relation.entity");
const History_entity_1 = require("../typeorm/entities/History.entity");
const Achievement_entity_1 = require("../typeorm/entities/Achievement.entity");
const chat_entity_1 = require("../typeorm/entities/chat-entity");
const message_entity_1 = require("../typeorm/entities/message-entity");
const chat_room_entity_1 = require("../typeorm/entities/chat-room.entity");
const chat_room_users_entity_1 = require("../typeorm/entities/chat-room-users.entity");
const bcrypt = require("bcrypt");
const auth_service_1 = require("../auth/auth.service");
const fs = require("fs");
const path = require('path');
const cloudinary_1 = require("cloudinary");
let ChatService = class ChatService {
    constructor(userRepository, profileRepository, relationRepository, historyRepository, achievementRepository, messageRepository, chatRepository, chatRoomRepository, chatRoomUserRepository, authService) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.relationRepository = relationRepository;
        this.historyRepository = historyRepository;
        this.achievementRepository = achievementRepository;
        this.messageRepository = messageRepository;
        this.chatRepository = chatRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.chatRoomUserRepository = chatRoomUserRepository;
        this.authService = authService;
        this.rooms = new Map();
        this.isconnected = new Map();
        this.connectedClients = new Map();
    }
    async createChatDirect(createChatDto, clientId, server) {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    username: createChatDto.user,
                },
            });
            const secondUser = await this.userRepository.findOne({
                where: {
                    username: createChatDto.secondUser,
                },
            });
            if (!user || !secondUser) {
                throw new Error('user not found');
            }
            let roomName = `Room_${user.username}_${secondUser.username}`;
            clientId.join(roomName);
            const newChatMessage = this.chatRepository.create({
                message: createChatDto.message,
                user: user,
                secondUser: secondUser,
            });
            await this.chatRepository.save(newChatMessage);
            for (const [room, sockets] of this.isconnected) {
                if (room === secondUser.username) {
                    for (const socket of sockets) {
                        await socket.join(roomName);
                    }
                }
            }
            const chats = await this.chatRepository.find({
                where: { id: newChatMessage.id },
                relations: ['user']
            });
            server.to(roomName).emit('message', chats);
            return;
        }
        catch (error) {
            console.error('Error in createChatDirect:', error);
            throw error;
        }
    }
    generateUniqueRoomName(user, chatRoomName) {
        let roomName = `Room_${user.username}+${chatRoomName}`;
        let count = 1;
        while (this.rooms.has(roomName)) {
            roomName = `Room_${user.username}+${chatRoomName}_${count}`;
            count++;
        }
        return roomName;
    }
    async createChatRoom(createChatRoomDto) {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    username: createChatRoomDto.user,
                },
            });
            if (!user) {
                throw new Error('his user not exist');
            }
            const allowedStatuses = ['protected', 'public', 'private'];
            if (!allowedStatuses.includes(createChatRoomDto.status)) {
                throw new Error("Status of the chat room is not correct.");
            }
            let hash = "Dexter's is here";
            if (createChatRoomDto.password != null && createChatRoomDto.status === 'protected') {
                const saltOrRounds = 10;
                hash = await bcrypt.hash(createChatRoomDto.password, saltOrRounds);
            }
            const roomId = this.authService.generateRandom(30);
            const ischatRoomExist = await this.chatRoomRepository.findOne({
                where: { chatRoomUser: { id: user.id }, RoomId: createChatRoomDto.name + roomId }
            });
            if (ischatRoomExist) {
                throw new Error('his chat room exist');
            }
            let file_path = process.env.DEFAULTIMAGECHATROOM;
            if (createChatRoomDto.picture != null) {
                const imageBuffer = createChatRoomDto.picture;
                const filePath = './uploads';
                const filename = Date.now() + '-' + Math.round(Math.random() * 1e9) + '.jpg';
                const fullFilePath = path.join(filePath, filename);
                try {
                    fs.writeFileSync(fullFilePath, imageBuffer);
                }
                catch (error) {
                    console.error('Error saving the image:', error);
                }
                const ret = await this.uploadImageToCould(fullFilePath);
                file_path = ret.url;
            }
            const newChatRoom = this.chatRoomRepository.create({
                RoomId: `${createChatRoomDto.name}_${roomId}`,
                name: createChatRoomDto.name,
                status: createChatRoomDto.status,
                password: hash,
                picture: file_path
            });
            const savedNewChatRoom = await this.chatRoomRepository.save(newChatRoom);
            const chatRoom = await this.chatRoomRepository.findOne({
                where: {
                    id: savedNewChatRoom.id,
                },
            });
            const newChatRoomUser = this.chatRoomUserRepository.create({
                statusPermissions: 'admin',
                owner: true,
                statusUser: 'member',
                user: user,
                chatRooms: chatRoom
            });
            await this.chatRoomUserRepository.save(newChatRoomUser);
            const chatRommInfo = await this.chatRoomRepository.findOne({
                where: {
                    id: savedNewChatRoom.id
                },
                select: ['id', 'RoomId', 'name', 'status']
            });
            return chatRommInfo;
        }
        catch (error) {
            console.error(error);
            throw new Error('Error creating chat room');
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
    async joinUserToChatRoom(joinUserToChatRoom) {
        const user = await this.userRepository.findOne({
            where: {
                username: joinUserToChatRoom.username,
            },
        });
        const chatRoom = await this.chatRoomRepository.findOne({
            where: {
                RoomId: joinUserToChatRoom.chatRoomName,
            },
        });
        if (!chatRoom) {
            throw new Error('Chat room does not exist');
        }
        const ismember = await this.chatRoomUserRepository.findOne({
            where: {
                user: { id: user.id },
                statusUser: 'banned',
                chatRooms: { id: chatRoom.id }
            },
        });
        if (ismember) {
            throw new Error('You are not allowed here; you are banned or not a member.');
        }
        if (!user) {
            throw new Error('User does not exist');
        }
        const adminUser = await this.userRepository.findOne({
            where: {
                username: joinUserToChatRoom.adminUsername,
            },
        });
        if (!adminUser) {
            throw new Error('Admin user does not exist');
        }
        const adminUserChatRoom = await this.chatRoomUserRepository.findOne({
            where: {
                user: { id: adminUser.id },
                statusPermissions: 'admin',
                chatRooms: { id: chatRoom.id },
            },
        });
        if (!adminUserChatRoom) {
            throw new Error('You are not an admin to add users');
        }
        const isUserExistInChatRoom = await this.chatRoomUserRepository.findOne({
            where: {
                user: { id: user.id },
                chatRooms: { id: chatRoom.id },
            },
        });
        if (isUserExistInChatRoom) {
            throw new Error('User already exists in this chat room');
        }
        const createChatRoomUser = this.chatRoomUserRepository.create({
            statusPermissions: joinUserToChatRoom.statusPermissions,
            user: user,
            statusUser: 'member',
            chatRooms: chatRoom,
        });
        return await this.chatRoomUserRepository.save(createChatRoomUser);
    }
    async sendMessage(sendMessageToChatRoom, clientId, server) {
        try {
            const user = await this.userRepository.findOne({
                where: { username: sendMessageToChatRoom.username },
            });
            const chatRoom = await this.chatRoomRepository.findOne({
                where: { RoomId: sendMessageToChatRoom.chatRoomName },
            });
            if (!chatRoom) {
                throw new Error('Chat room not found.');
            }
            const isMember = await this.chatRoomUserRepository.findOne({
                where: {
                    user: { id: user.id },
                    chatRooms: { id: chatRoom.id },
                },
            });
            if (!isMember) {
                throw new Error('You are not allowed here; you are muted or not a member.');
            }
            const currentDate = new Date();
            if (isMember.statusUser === 'muted') {
                if (currentDate.getTime() > isMember.time.getTime()) {
                    const unmuteUserDto = {
                        username: sendMessageToChatRoom.username,
                        chatRoomName: sendMessageToChatRoom.chatRoomName,
                    };
                    await this.unmuteUser(unmuteUserDto);
                }
            }
            if (isMember.statusUser != 'muted') {
                const newMessage = await this.messageRepository.create({
                    user: user,
                    message: sendMessageToChatRoom.message,
                    chatRoom: chatRoom,
                });
                await this.messageRepository.save(newMessage);
                const roomName = await this.generateUniqueRoomName(user, sendMessageToChatRoom.chatRoomName);
                const roomInfo = {
                    username: user.username,
                    chatRoomName: sendMessageToChatRoom.chatRoomName,
                };
                const chatRoomUsers = await this.getAllUserOfChatRoom(roomInfo);
                for (const chatRoomUser of chatRoomUsers) {
                    const username = chatRoomUser.user.username;
                    for (const socket of this.isconnected.get(username) || []) {
                        await socket.join(roomName);
                    }
                }
                const chatRoomConversation = await this.messageRepository.findOne({
                    where: {
                        id: newMessage.id
                    },
                    relations: ['user']
                });
                server.to(roomName).emit('message', chatRoomConversation);
            }
            else {
                throw new Error('You are not allowed here; you are muted');
            }
        }
        catch (error) {
            throw new Error('Error to send message');
        }
    }
    async findAllChatRoomConversation(getChatRoomMessages) {
        const chatRoom = await this.chatRoomRepository.findOne({
            where: {
                RoomId: getChatRoomMessages.chatRoomName,
            },
        });
        const chatRoomConversation = await this.messageRepository.find({
            where: {
                chatRoom: { id: chatRoom.id },
            },
            relations: ['user'],
            order: {
                id: 'ASC',
            },
        });
        return chatRoomConversation;
    }
    async joinChatRoomWithAdmin(joinChatRoom) {
        const user = await this.userRepository.findOne({
            where: { username: joinChatRoom.username }
        });
        const chatRoom = await this.chatRoomRepository.findOne({
            where: { RoomId: joinChatRoom.chatRoomName }
        });
        if (!chatRoom) {
            throw new Error('chat room not exist');
        }
        const ismember = await this.chatRoomUserRepository.findOne({
            where: {
                user: { id: user.id },
                chatRooms: { id: chatRoom.id },
                statusUser: 'banned'
            }
        });
        if (ismember) {
            throw new Error('You are not allowed here');
        }
        const isUserExistInchatRoom = await this.chatRoomUserRepository.findOne({
            where: {
                user: { id: user.id },
                chatRooms: { id: chatRoom.id },
            }
        });
        if (!isUserExistInchatRoom) {
            throw new Error('this user not in this chat room');
        }
        const conversation = await this.messageRepository.find({
            where: {
                chatRoom: { id: chatRoom.id },
            }
        });
        return conversation;
    }
    async findConversationBetweenUsers(createChatDto) {
        const user1 = await this.userRepository.findOne({ where: { username: createChatDto.user } });
        const user2 = await this.userRepository.findOne({ where: { username: createChatDto.secondUser } });
        if (!user1 || !user2) {
            return [];
        }
        const chats = await this.chatRepository.find({
            where: [
                { user: { id: user1.id }, secondUser: { id: user2.id } },
                { user: { id: user2.id }, secondUser: { id: user1.id } },
            ],
            relations: ['user'],
            order: {
                id: 'ASC',
            },
        });
        return chats;
    }
    async findMessageById(id) {
        return this.chatRepository.findOne({
            where: {
                id: id,
            }
        });
    }
    async update(updateChatDto) {
        const chat = await this.findMessageById(updateChatDto.id);
        if (!chat) {
            throw new common_1.NotFoundException(`Chat message with ID ${updateChatDto.id} not found`);
        }
        chat.message = updateChatDto.message;
        const upadteMessage = await this.chatRepository.save(chat);
        return upadteMessage;
    }
    async getClientName(username) {
        try {
            const client = await this.userRepository.findOne({
                where: { username: username },
            });
            if (client) {
                return client.username;
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }
    async remove(updateChatDto) {
        const chat = await this.chatRepository.findOne({
            where: {
                id: updateChatDto.id,
            }
        });
        if (!chat) {
            throw new common_1.NotFoundException(`Chat message with ID ${updateChatDto.id} not found`);
        }
        await this.chatRepository.remove(chat);
    }
    async removeConversation(updateChatDto) {
        const user1 = await this.userRepository.findOne({ where: { username: updateChatDto.user } });
        const user2 = await this.userRepository.findOne({ where: { username: updateChatDto.secondUser } });
        const chats = await this.chatRepository.find({
            where: [
                { user: { id: user1.id }, secondUser: { id: user2.id } },
                { user: { id: user2.id }, secondUser: { id: user1.id } },
            ],
        });
        if (!chats) {
            throw new common_1.NotFoundException(`Chat message with ID ${updateChatDto.id} not found`);
        }
        await this.chatRepository.remove(chats);
        return await this.chatRepository.find({
            where: [
                { user: { id: user1.id }, secondUser: { id: user2.id } },
                { user: { id: user2.id }, secondUser: { id: user1.id } },
            ],
        });
    }
    async banUser(banUserDto) {
        const isAdmin = await this.userRepository.findOne({
            where: { username: banUserDto.username },
        });
        const chatRoom = await this.chatRoomRepository.findOne({
            where: {
                RoomId: banUserDto.chatRoomName,
            }
        });
        const adminUserChatRoom = await this.chatRoomUserRepository.findOne({
            where: {
                user: { id: isAdmin.id },
                statusPermissions: 'admin',
                chatRooms: { id: chatRoom.id },
            },
        });
        if (!adminUserChatRoom) {
            throw new Error('You are not an owner or admin to ban users');
        }
        const user = await this.userRepository.findOne({
            where: {
                username: banUserDto.userGetBan,
            },
        });
        const isNotAdmin = await this.chatRoomUserRepository.findOne({
            where: {
                user: { id: user.id },
                statusPermissions: 'admin',
                chatRooms: { id: chatRoom.id }
            },
        });
        if (isNotAdmin && adminUserChatRoom.owner === false) {
            throw new Error('You cannot ban an admin or owner user');
        }
        const chatRoomUser = await this.chatRoomUserRepository.findOne({
            where: {
                user: { id: user.id },
                chatRooms: { id: chatRoom.id }
            },
        });
        if (chatRoomUser) {
            chatRoomUser.statusUser = 'banned';
            await this.chatRoomUserRepository.save(chatRoomUser);
            return { message: 'User banned successfully' };
        }
        else {
            return { message: 'User not found in the chat room' };
        }
    }
    async kickUser(kickUserDto) {
        const isAdmin = await this.userRepository.findOne({
            where: { username: kickUserDto.username },
        });
        const chatRoom = await this.chatRoomRepository.findOne({
            where: {
                RoomId: kickUserDto.chatRoomName,
            }
        });
        const adminUserChatRoom = await this.chatRoomUserRepository.findOne({
            where: {
                user: { id: isAdmin.id },
                statusPermissions: 'admin',
                chatRooms: { id: chatRoom.id },
            },
        });
        if (!adminUserChatRoom) {
            throw new Error('You are not an admin to kick users');
        }
        const user = await this.userRepository.findOne({
            where: {
                username: kickUserDto.userGetkick,
            },
        });
        const isNotAdmin = await this.chatRoomUserRepository.findOne({
            where: {
                user: { id: user.id },
                statusPermissions: 'admin',
                chatRooms: { id: chatRoom.id }
            },
        });
        if (isNotAdmin && adminUserChatRoom.owner === false) {
            throw new Error('You cannot kick an admin user');
        }
        const isBanned = await this.chatRoomUserRepository.findOne({
            where: {
                user: { id: user.id },
                statusUser: 'banned',
                chatRooms: { id: chatRoom.id }
            },
        });
        if (isBanned) {
            throw new Error('You are not allowed here; you are banned or not a member.');
        }
        const chatRoomUser = await this.chatRoomUserRepository.findOne({
            where: {
                user: { id: user.id },
                chatRooms: { id: chatRoom.id }
            },
        });
        if (chatRoomUser) {
            await this.chatRoomUserRepository.delete(chatRoomUser.id);
            return { message: 'User kicked successfully' };
        }
        else {
            return { message: 'User not found in the chat room' };
        }
    }
    async muteUser(muteUserDto) {
        const isAdmin = await this.userRepository.findOne({
            where: { username: muteUserDto.username },
        });
        const chatRoom = await this.chatRoomRepository.findOne({
            where: {
                RoomId: muteUserDto.chatRoomName,
            }
        });
        const adminUserChatRoom = await this.chatRoomUserRepository.findOne({
            where: {
                user: { id: isAdmin.id },
                statusPermissions: 'admin',
                chatRooms: { id: chatRoom.id },
            },
        });
        if (!adminUserChatRoom) {
            throw new Error('You are not an admin to mute users');
        }
        const user = await this.userRepository.findOne({
            where: {
                username: muteUserDto.userGetmute,
            },
        });
        const isNotAdmin = await this.chatRoomUserRepository.findOne({
            where: {
                user: { id: user.id },
                statusPermissions: 'admin',
                chatRooms: { id: chatRoom.id },
            },
        });
        if (isNotAdmin && adminUserChatRoom.owner === false) {
            throw new Error('You cannot mute an admin user');
        }
        const isBanned = await this.chatRoomUserRepository.findOne({
            where: {
                user: { id: user.id },
                statusUser: 'banned',
                chatRooms: { id: chatRoom.id }
            },
        });
        if (isBanned && adminUserChatRoom.owner === false) {
            throw new Error('You are not allowed here; you are banned or not a member.');
        }
        const chatRoomUser = await this.chatRoomUserRepository.findOne({
            where: {
                user: { id: user.id, },
                chatRooms: { id: chatRoom.id }
            },
        });
        const originalTimestamp = new Date();
        const additionalMinutes = muteUserDto.time;
        const originalUnixTime = originalTimestamp.getTime();
        const newUnixTime = originalUnixTime + additionalMinutes * 60 * 1000;
        const newTimestamp = new Date(newUnixTime);
        if (chatRoomUser) {
            chatRoomUser.statusUser = 'muted';
            chatRoomUser.time = newTimestamp;
            await this.chatRoomUserRepository.save(chatRoomUser);
            return { message: 'User muted successfully' };
        }
        else {
            return { message: 'User not found in the chat room' };
        }
    }
    async getAllChatRoomOfUser(chatRoomOfUserDto) {
        const user = await this.userRepository.findOne({
            where: {
                username: chatRoomOfUserDto.username,
            }
        });
        const allChatRooms = await this.chatRoomUserRepository.find({
            where: {
                user: { id: user.id },
                statusUser: (0, typeorm_2.Not)('banned'),
            },
            relations: ['chatRooms'],
        });
        return allChatRooms;
    }
    async unbannedUser(unbannedUserDtoo) {
        const isAdmin = await this.userRepository.findOne({
            where: { username: unbannedUserDtoo.username },
        });
        const chatRoom = await this.chatRoomRepository.findOne({
            where: {
                RoomId: unbannedUserDtoo.chatRoomName,
            }
        });
        const adminUserChatRoom = await this.chatRoomUserRepository.findOne({
            where: {
                user: { id: isAdmin.id },
                statusPermissions: 'admin',
                chatRooms: { id: chatRoom.id },
            },
        });
        if (!adminUserChatRoom) {
            throw new Error('You are not an admin to unbanned users');
        }
        const user = await this.userRepository.findOne({
            where: {
                username: unbannedUserDtoo.userGetBan,
            },
        });
        const chatRoomUser = await this.chatRoomUserRepository.findOne({
            where: {
                user: { id: user.id },
                chatRooms: { id: chatRoom.id }
            },
        });
        if (chatRoomUser) {
            chatRoomUser.statusUser = 'member';
            await this.chatRoomUserRepository.save(chatRoomUser);
            return { message: 'User unbanned successfully' };
        }
        else {
            return { message: 'User not found in the chat room' };
        }
    }
    async changePermissionToUser(changePermissionToUserDto) {
        const isAdmin = await this.userRepository.findOne({
            where: { username: changePermissionToUserDto.username },
        });
        const chatRoom = await this.chatRoomRepository.findOne({
            where: {
                RoomId: changePermissionToUserDto.chatRoomName,
            }
        });
        const adminUserChatRoom = await this.chatRoomUserRepository.findOne({
            where: {
                user: { id: isAdmin.id },
                statusPermissions: 'admin',
                chatRooms: { id: chatRoom.id },
            },
        });
        if (!adminUserChatRoom) {
            throw new Error('You are not an admin to unbanned users');
        }
        const user = await this.userRepository.findOne({
            where: {
                username: changePermissionToUserDto.userGetBan,
            },
        });
        const chatRoomUser = await this.chatRoomUserRepository.findOne({
            where: {
                user: { id: user.id },
                chatRooms: { id: chatRoom.id }
            },
        });
        if (chatRoomUser) {
            chatRoomUser.statusPermissions = 'admin';
            await this.chatRoomUserRepository.save(chatRoomUser);
            return { message: 'User unbanned successfully' };
        }
        else {
            return { message: 'User not found in the chat room' };
        }
    }
    async leaveChatRoom(leaveChatRoomDto, server) {
        const isAdmin = await this.userRepository.findOne({
            where: { username: leaveChatRoomDto.username },
        });
        const chatRoom = await this.chatRoomRepository.findOne({
            where: {
                RoomId: leaveChatRoomDto.chatRoomName,
            }
        });
        const chatRoomUser = await this.chatRoomUserRepository.findOne({
            where: {
                user: { id: isAdmin.id },
                chatRooms: { id: chatRoom.id },
            },
        });
        if (chatRoomUser) {
            await this.chatRoomUserRepository.delete(chatRoomUser.id);
            const getUser = await this.chatRoomUserRepository.findOne({
                where: {
                    chatRooms: { id: chatRoom.id },
                    statusPermissions: 'admin'
                }
            });
            if (getUser) {
                getUser.owner = true;
                await this.chatRoomUserRepository.save(getUser);
            }
            else {
                const getUser = await this.chatRoomUserRepository.findOne({
                    where: {
                        chatRooms: { id: chatRoom.id },
                    }
                });
                if (getUser) {
                    getUser.statusPermissions = 'admin';
                    getUser.owner = true;
                    await this.chatRoomUserRepository.save(getUser);
                }
                else {
                    return;
                }
            }
            return { message: 'User leaved successfully' };
        }
        else {
            return { message: 'User not found in the chat room' };
        }
    }
    async deleteChatRoom(deleteChatRoomDto, server) {
        try {
            const user = await this.userRepository.findOne({
                where: { username: deleteChatRoomDto.username },
            });
            if (!user) {
                throw new Error('User not found');
            }
            const chatRoom = await this.chatRoomRepository.findOne({
                where: {
                    RoomId: deleteChatRoomDto.chatRoomName
                }
            });
            if (!chatRoom) {
                throw new Error('chat room not found');
            }
            const adminUserChatRoom = await this.chatRoomUserRepository.findOne({
                where: {
                    user: { id: user.id },
                    statusPermissions: 'admin',
                    owner: true,
                    chatRooms: { RoomId: deleteChatRoomDto.chatRoomName },
                },
            });
            if (!adminUserChatRoom) {
                throw new Error('You do not have the necessary permissions to delete this chat room.');
            }
            const messages = await this.messageRepository.find({
                where: { chatRoom: { RoomId: deleteChatRoomDto.chatRoomName } }
            });
            const usersOfChatRoom = await this.chatRoomUserRepository.find({
                where: { chatRooms: { RoomId: deleteChatRoomDto.chatRoomName } }
            });
            let roomName = `RoomDel ${chatRoom.RoomId}`;
            const roomInfo = {
                username: user.username,
                chatRoomName: deleteChatRoomDto.chatRoomName,
            };
            const chatRoomUsers = await this.getAllUserOfChatRoom(roomInfo);
            await this.messageRepository.remove(messages);
            await this.chatRoomUserRepository.remove(usersOfChatRoom);
            await this.chatRoomRepository.delete(chatRoom.id);
            for (const chatRoomUser of chatRoomUsers) {
                const username = chatRoomUser.user.username;
                for (const socket of this.isconnected.get(username) || []) {
                    await socket.join(roomName);
                }
            }
            server.to(roomName).emit('deleteChatRoom', { delete: true });
        }
        catch (error) {
            console.error('Error while deleting chat room:', error);
            throw new Error('Error to delete this chat room');
        }
    }
    async getAllChatRoom(chatRoomOfUserDto) {
        const user = await this.userRepository.findOne({
            where: {
                username: chatRoomOfUserDto.username,
            }
        });
        if (!user) {
            throw new Error('this user not exist');
        }
        const chatRoom = await this.chatRoomRepository.find({
            where: {
                status: (0, typeorm_2.Not)('private')
            }
        });
        return chatRoom;
    }
    async joinChatRoom(joinRoom) {
        const user = await this.userRepository.findOne({
            where: {
                username: joinRoom.username,
            },
        });
        if (!user) {
            throw new Error('User does not exist');
        }
        const chatRoomID = await this.chatRoomRepository.findOne({
            where: {
                RoomId: joinRoom.chatRoomName,
            },
        });
        const ismember = await this.chatRoomUserRepository.findOne({
            where: {
                user: { id: user.id },
                statusUser: 'banned',
                chatRooms: { id: chatRoomID.id }
            }
        });
        if (ismember) {
            throw new Error('You are not allowed here; you are banned or not a member.');
        }
        let chatRoom = await this.chatRoomRepository.findOne({
            where: {
                RoomId: joinRoom.chatRoomName,
                status: 'protected'
            },
        });
        if (chatRoom) {
            const isMatch = await bcrypt.compare(joinRoom.password, chatRoom?.password);
            if (!isMatch) {
                throw new common_1.NotFoundException('Invalid password');
            }
        }
        else {
            chatRoom = await this.chatRoomRepository.findOne({
                where: {
                    RoomId: joinRoom.chatRoomName,
                    status: 'public',
                },
            });
        }
        const isUserExistInChatRoom = await this.chatRoomUserRepository.findOne({
            where: {
                user: { id: user.id },
                chatRooms: { id: chatRoom.id },
            },
        });
        if (isUserExistInChatRoom) {
            throw new Error('User already exists in this chat room');
        }
        const createChatRoomUser = this.chatRoomUserRepository.create({
            statusPermissions: 'member',
            user,
            statusUser: 'member',
            chatRooms: chatRoom,
        });
        await this.chatRoomUserRepository.save(createChatRoomUser);
        const conversation = await this.messageRepository.find({
            where: {
                chatRoom: { id: chatRoom.id },
            }
        });
        return conversation;
    }
    async unmuteUser(unmuteUserDto) {
        const user = await this.userRepository.findOne({
            where: {
                username: unmuteUserDto.username,
            }
        });
        const charRoom = await this.chatRoomRepository.findOne({
            where: { RoomId: unmuteUserDto.chatRoomName },
        });
        const chatRoomUser = await this.chatRoomUserRepository.findOne({
            where: {
                user: { id: user.id },
                chatRooms: { id: charRoom.id },
                statusUser: 'muted'
            },
        });
        chatRoomUser.statusUser = 'member';
        await this.chatRoomUserRepository.save(chatRoomUser);
    }
    async getAllUserOfChatRoom(usersOfChatRoom) {
        const charRoom = await this.chatRoomRepository.findOne({
            where: { RoomId: usersOfChatRoom.chatRoomName },
        });
        const chatRoomUser = await this.chatRoomUserRepository.find({
            where: {
                chatRooms: { id: charRoom.id },
            },
            relations: ['user']
        });
        if (!chatRoomUser) {
            throw new Error('User not exists in this chat room');
        }
        const users = await this.userRepository.find({
            where: {
                chatRoomUsers: { chatRooms: { id: charRoom.id } },
            }
        });
        return (chatRoomUser);
    }
    async updateChatRoomInfo(updateChatRoomInf, server) {
        try {
            const user = await this.userRepository.findOne({
                where: { username: updateChatRoomInf.username }
            });
            if (!user) {
                throw new Error("User NOt found!!");
            }
            const chatRoomInfo = await this.chatRoomRepository.findOne({
                where: { RoomId: updateChatRoomInf.roomId }
            });
            if (!chatRoomInfo) {
                throw new Error("chat room not found");
            }
            const adminUserChatRoom = await this.chatRoomUserRepository.findOne({
                where: {
                    user: { id: user.id },
                    statusPermissions: 'admin',
                    owner: true,
                    chatRooms: { id: chatRoomInfo.id },
                },
            });
            if (!adminUserChatRoom) {
                throw new Error("User not admin to update this chat room");
            }
            let hash = chatRoomInfo.password;
            let file_path = chatRoomInfo.picture;
            let chatRoomName = chatRoomInfo.picture;
            let chatRoomStatus = updateChatRoomInf.status;
            if (updateChatRoomInf.status != null) {
                chatRoomStatus = updateChatRoomInf.status;
            }
            if (updateChatRoomInf.chatRoomName != null) {
                chatRoomName = updateChatRoomInf.chatRoomName;
            }
            if (updateChatRoomInf.password != null) {
                const saltOrRounds = 10;
                hash = await bcrypt.hash(updateChatRoomInf.password, saltOrRounds);
            }
            if (updateChatRoomInf.picture != null) {
                const imageBuffer = updateChatRoomInf.picture;
                const filePath = './uploads';
                const filename = Date.now() + '-' + Math.round(Math.random() * 1e9) + '.jpg';
                const fullFilePath = path.join(filePath, filename);
                try {
                    fs.writeFileSync(fullFilePath, imageBuffer);
                }
                catch (error) {
                    throw new Error('Error saving the image');
                }
                const ret = await this.uploadImageToCould(fullFilePath);
                file_path = ret.url;
            }
            let roomName = `RoomDel ${chatRoomInfo.RoomId}`;
            const roomInfo = {
                username: user.username,
                chatRoomName: updateChatRoomInf.roomId,
            };
            const chatRoomUsers = await this.getAllUserOfChatRoom(roomInfo);
            chatRoomInfo.name = chatRoomName,
                chatRoomInfo.status = chatRoomStatus,
                chatRoomInfo.password = hash,
                chatRoomInfo.picture = file_path;
            const saveChatRoomUP = await this.chatRoomRepository.save(chatRoomInfo);
            for (const chatRoomUser of chatRoomUsers) {
                const username = chatRoomUser.user.username;
                for (const socket of this.isconnected.get(username) || []) {
                    await socket.join(roomName);
                }
            }
            server.to(roomName).emit('updateChatRoomInfo', { update: true });
            return saveChatRoomUP;
        }
        catch (error) {
            throw new Error('Error to update chat room');
        }
    }
    async addUserWithSocketId(username, clientId) {
        try {
            if (!this.isconnected.has(username)) {
                this.isconnected.set(username, []);
            }
            this.isconnected.get(username).push(clientId);
            clientId.on('disconnect', () => {
                if (this.isconnected.has(username)) {
                    this.isconnected.delete(username);
                }
            });
        }
        catch (error) {
            throw error;
        }
    }
    async gitAllUsers() {
        try {
            const users = await this.userRepository.find({
                select: ['id', 'username', 'uniquename', 'firstName', 'lastName', 'status', 'email', 'picture']
            });
            if (!users) {
                throw new Error("Users not found!!!");
            }
            return users;
        }
        catch (Error) {
            throw new Error("Error to find all users");
        }
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(Profile_entity_1.Profile)),
    __param(2, (0, typeorm_1.InjectRepository)(Relation_entity_1.Relation)),
    __param(3, (0, typeorm_1.InjectRepository)(History_entity_1.HistoryEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(Achievement_entity_1.Achievement)),
    __param(5, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(6, (0, typeorm_1.InjectRepository)(chat_entity_1.Chat)),
    __param(7, (0, typeorm_1.InjectRepository)(chat_room_entity_1.ChatRoom)),
    __param(8, (0, typeorm_1.InjectRepository)(chat_room_users_entity_1.ChatRoomUser)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _e : Object, typeof (_f = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _f : Object, typeof (_g = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _g : Object, typeof (_h = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _h : Object, typeof (_j = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _j : Object, auth_service_1.AuthService])
], ChatService);
//# sourceMappingURL=chat.service.js.map