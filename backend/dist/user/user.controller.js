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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const achievement_dto_1 = require("../auth/dtos/achievement.dto");
const jwt_guard_1 = require("../auth/guard/jwt.guard");
const jwt_strategy_1 = require("../auth/strategy/jwt.strategy");
;
const platform_express_1 = require("@nestjs/platform-express");
const multer_config_1 = require("./multer.config");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getDetailsProfile(req, username) {
        const authorization = req.user;
        if (authorization.username == username) {
            return this.userService.findProfileByUsername(username);
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
    async updateProfileDetails(req, username, userData, imageData) {
        const authorization = req.user;
        if (authorization.username === username) {
            if (!imageData) {
                throw new Error('No image file provided.');
            }
            return await this.userService.updateProfileByUsername(username, userData, imageData);
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
    async addUniquename(req, username, uniquename) {
        const authorization = req.user;
        if (authorization.username == username) {
            return this.userService.addUniquename(username, uniquename.uniquename);
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
    async searchToFrindByUsername(req, username, secondUsername) {
        const authorization = req.user;
        if (authorization.username == username) {
            return this.userService.searchToFrindByUsername(username, secondUsername);
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
    async historyFriend(req, username, secondUsername) {
        const authorization = req.user;
        if (authorization.username == username) {
            return this.userService.historyFriend(username, secondUsername);
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
    async searchToUserByUsername(req, username, secondUsername) {
        const authorization = req.user;
        if (authorization.username == username) {
            return this.userService.searchToUserByUsername(username, secondUsername);
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
    async getFriendsOfUser(req, username) {
        const authorization = req.user;
        if (authorization.username == username) {
            return this.userService.findAllHistoryOfUser(username);
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
    async addAchievementOfUser(req, username, achievementDto) {
        const authorization = req.user;
        if (authorization.username == username) {
            return this.userService.addAchievementOfUser(username, achievementDto);
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
    async getachievementOfUser(req, username) {
        const authorization = req.user;
        if (authorization.username == username) {
            return this.userService.findAllAchievementOfUser(username);
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
    async sendRequest(req, username, secondUsername) {
        const authorization = req.user;
        if (authorization.username == username) {
            return this.userService.sendRequest(username, secondUsername);
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
    async getFriendOfUser(req, username) {
        const authorization = req.user;
        if (authorization.username == username) {
            return this.userService.findAllFriendsOfUser(username);
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
    async getBlockedOfUser(req, username) {
        const authorization = req.user;
        if (authorization.username == username) {
            return this.userService.findAllBlockedOfUser(username);
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
    async getAllRequestsOfUser(req, username) {
        const authorization = req.user;
        if (authorization.username == username) {
            return this.userService.getAllRequestsOfUser(username);
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
    async getAllRequistsSendFromUser(req, username) {
        const authorization = req.user;
        if (authorization.username == username) {
            return this.userService.getAllRequistsSendFromUser(username);
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
    async UpdateStatusOfUser(req, username, secondUser) {
        const authorization = req.user;
        if (authorization.username == username) {
            return this.userService.blockUser(username, secondUser);
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
    async unblockUser(req, username, secondUser) {
        const authorization = req.user;
        if (authorization.username == username) {
            return this.userService.unblockUser(username, secondUser);
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
    async acceptRequist(req, username, secondUser) {
        const authorization = req.user;
        if (authorization.username == username) {
            return this.userService.acceptRequest(username, secondUser);
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
    async rejectRequist(req, username, secondUser) {
        const authorization = req.user;
        if (authorization.username == username) {
            return this.userService.rejectRequest(username, secondUser);
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
    async cancelRequist(req, username, secondUser) {
        const authorization = req.user;
        if (authorization.username == username) {
            return this.userService.cancelRequist(username, secondUser);
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
    async cancelRelation(req, username, secondUser) {
        const authorization = req.user;
        if (authorization.username == username) {
            return this.userService.cancelRelation(username, secondUser);
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
    async getSatatusOfUser(req, username) {
        const authorization = req.user;
        if (authorization.username == username) {
            return this.userService.getStatusOfUsers(username);
        }
        else {
            throw new common_1.ForbiddenException();
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_strategy_1.JwtStrategy),
    (0, common_1.Get)('profile/:username'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getDetailsProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_strategy_1.JwtStrategy),
    (0, common_1.Put)('profile/:username/updateProfile'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', multer_config_1.multerOptions)),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfileDetails", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_strategy_1.JwtStrategy),
    (0, common_1.Post)('profile/:username/addUniquename'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addUniquename", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_strategy_1.JwtStrategy),
    (0, common_1.Get)('profile/:username/searchTofriend/:secondUsername'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Param)('secondUsername')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "searchToFrindByUsername", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_strategy_1.JwtStrategy),
    (0, common_1.Get)('profile/:username/historyFriend/:secondUsername'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Param)('secondUsername')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "historyFriend", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_strategy_1.JwtStrategy),
    (0, common_1.Get)('profile/:username/searchTouser/:secondUsername'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Param)('secondUsername')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "searchToUserByUsername", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_strategy_1.JwtStrategy),
    (0, common_1.Get)('profile/:username/history'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getFriendsOfUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_strategy_1.JwtStrategy),
    (0, common_1.Post)('profile/:username/achievements'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, achievement_dto_1.AchievementDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addAchievementOfUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_strategy_1.JwtStrategy),
    (0, common_1.Get)('profile/:username/achievements'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getachievementOfUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_strategy_1.JwtStrategy),
    (0, common_1.Post)('profile/:username/sendRequest/:secondUsername'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Param)('secondUsername')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "sendRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_strategy_1.JwtStrategy),
    (0, common_1.Get)('profile/:username/friends'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getFriendOfUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_strategy_1.JwtStrategy),
    (0, common_1.Get)('profile/:username/blocked'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getBlockedOfUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_strategy_1.JwtStrategy),
    (0, common_1.Get)('profile/:username/requests'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllRequestsOfUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_strategy_1.JwtStrategy),
    (0, common_1.Get)('profile/:username/requistsSend'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllRequistsSendFromUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_strategy_1.JwtStrategy),
    (0, common_1.Put)('profile/:username/block/:secondUser'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Param)('secondUser')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "UpdateStatusOfUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_strategy_1.JwtStrategy),
    (0, common_1.Put)('profile/:username/unblock/:secondUser'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Param)('secondUser')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "unblockUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_strategy_1.JwtStrategy),
    (0, common_1.Put)('profile/:username/acceptRequest/:secondUser'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Param)('secondUser')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "acceptRequist", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_strategy_1.JwtStrategy),
    (0, common_1.Delete)('profile/:username/rejectRequest/:secondUser'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Param)('secondUser')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "rejectRequist", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_strategy_1.JwtStrategy),
    (0, common_1.Delete)('profile/:username/cancelRequest/:secondUser'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Param)('secondUser')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "cancelRequist", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_strategy_1.JwtStrategy),
    (0, common_1.Delete)('profile/:username/cancelRelation/:secondUser'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __param(2, (0, common_1.Param)('secondUser')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "cancelRelation", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard, jwt_strategy_1.JwtStrategy),
    (0, common_1.Get)('profile/:username/online'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getSatatusOfUser", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map