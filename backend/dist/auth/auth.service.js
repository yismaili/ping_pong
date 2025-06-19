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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jsonwebtoken_1 = require("jsonwebtoken");
const User_entity_1 = require("../typeorm/entities/User.entity");
const Profile_entity_1 = require("../typeorm/entities/Profile.entity");
const Relation_entity_1 = require("../typeorm/entities/Relation.entity");
const History_entity_1 = require("../typeorm/entities/History.entity");
const Achievement_entity_1 = require("../typeorm/entities/Achievement.entity");
const otplib_1 = require("otplib");
const user_service_1 = require("../user/user.service");
const qrcode_1 = require("qrcode");
let AuthService = class AuthService {
    constructor(userRepository, profileRepository, relationRepository, historyRepository, achievementRepository, userService) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.relationRepository = relationRepository;
        this.historyRepository = historyRepository;
        this.achievementRepository = achievementRepository;
        this.userService = userService;
    }
    generateRandom(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    async randomAvatar() {
        const avatarObject = {
            avatar1: 'https://res.cloudinary.com/doymqpyfk/image/upload/v1697940567/numbuh_glitch_by_pinkandorangesunset_dfjncnp_zrfxfs.png',
            avatar2: 'https://res.cloudinary.com/doymqpyfk/image/upload/v1697940566/numbuh_1197_by_pinkandorangesunset_dfjncfj_udm2py.png',
            avatar3: 'https://res.cloudinary.com/doymqpyfk/image/upload/v1697940564/numbuh_750_by_pinkandorangesunset_dfjncfc_1_altcgc.png',
            avatar4: 'https://res.cloudinary.com/doymqpyfk/image/upload/v1697940562/numbuh_1997_by_pinkandorangesunset_dfjncfq_bydwyk.png',
            avatar5: 'https://res.cloudinary.com/doymqpyfk/image/upload/v1697940562/numbuh_1197_by_pinkandorangesunset_dfjncfj_1_kz2urp.png',
            avatar6: 'https://res.cloudinary.com/doymqpyfk/image/upload/v1697940560/numbuh_95_by_pinkandorangesunset_dfjncnj_k5na6z.png',
            avatar7: 'https://res.cloudinary.com/doymqpyfk/image/upload/v1697940560/numbuh_750_by_pinkandorangesunset_dfjncfc_gaijcu.png',
            avatar8: 'https://res.cloudinary.com/doymqpyfk/image/upload/v1697940559/numbuh_580_by_pinkandorangesunset_dfjncfg_cch46y.png',
            avatar9: 'https://res.cloudinary.com/doymqpyfk/image/upload/v1697940559/numbuh_k2_by_pinkandorangesunset_dfjncnr_zef2ii.png',
            avatar10: 'https://res.cloudinary.com/doymqpyfk/image/upload/v1697940558/numbuh_7_by_pinkandorangesunset_dfjncab_qhzkzb.png'
        };
        const avatarKeys = Object.keys(avatarObject);
        const randomIndex = Math.floor(Math.random() * avatarKeys.length);
        const randomAvatarUrl = avatarObject[avatarKeys[randomIndex]];
        return randomAvatarUrl;
    }
    async googleAuthenticate(userDetails) {
        let { email, firstName, username, lastName, picture } = userDetails;
        const existingUser = await this.userRepository.findOne({
            where: { email: email },
            relations: ['profile']
        });
        if (existingUser) {
            if (existingUser.isTwoFactorAuthEnabled === true) {
                return { user: existingUser, success: true };
            }
            const token = (0, jsonwebtoken_1.sign)({ ...existingUser }, process.env.JWT_SECRET);
            return { token, user: existingUser, success: true };
        }
        else {
            let newUsername = this.generateRandom(8);
            const existingUsername = await this.userRepository.findOne({
                where: {
                    username: newUsername,
                },
            });
            if (existingUsername) {
                const randomString = this.generateRandom(13);
                newUsername = randomString;
            }
            picture = await this.randomAvatar();
            username = newUsername;
            const newUser = this.userRepository.create({
                firstName: firstName,
                lastName: lastName,
                username: username,
                email: email,
                picture: picture,
                uniquename: username
            });
            const newProfile = this.profileRepository.create({
                score: 0,
                win: 0,
                los: 0,
                xp: 0,
                level: 0,
            });
            if (newProfile) {
                newUser.profile = newProfile;
            }
            const savedUser = await this.userRepository.save(newUser);
            const token = (0, jsonwebtoken_1.sign)({ ...savedUser }, process.env.JWT_SECRET);
            return { token, user: savedUser, success: true };
        }
    }
    async findUserById(user) {
        try {
            const existingUser = await this.userRepository.findOne({
                where: {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
            });
            return existingUser;
        }
        catch (error) {
            return null;
        }
    }
    async generateTwoFactorAuthSecret(user) {
        const secret = otplib_1.authenticator.generateSecret();
        const otpauthUrl = otplib_1.authenticator.keyuri(user.email, 'transcendence', secret);
        await this.userService.setTwoFactorAuthenticationSecret(secret, user.username);
        return ({ secret, otpauthUrl });
    }
    async generateQrCodeDataURL(otpAuthUrl) {
        return (0, qrcode_1.toDataURL)(otpAuthUrl);
    }
    async isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode, username) {
        try {
            const user = await this.userRepository.findOne({ where: { username: username } });
            if (user) {
                const ret = await otplib_1.authenticator.verify({
                    token: twoFactorAuthenticationCode.code,
                    secret: user.twoFactorAuthSecret
                });
                return ret;
            }
            else {
                throw new Error('User not found.');
            }
        }
        catch (error) {
            console.error("Error occurred:", error);
            throw new Error(`Error two factor auth`);
        }
    }
    async generateTocken(username) {
        try {
            const user = await this.userRepository.findOne({ where: { username: username } });
            if (user) {
                const token = (0, jsonwebtoken_1.sign)({ ...user }, process.env.JWT_SECRET);
                return { token, user: user, success: true };
            }
            else {
                throw new Error('User not found.');
            }
        }
        catch (error) {
            throw new Error(`Error two factor auth`);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(Profile_entity_1.Profile)),
    __param(2, (0, typeorm_1.InjectRepository)(Relation_entity_1.Relation)),
    __param(3, (0, typeorm_1.InjectRepository)(History_entity_1.HistoryEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(Achievement_entity_1.Achievement)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _e : Object, user_service_1.UserService])
], AuthService);
//# sourceMappingURL=auth.service.js.map