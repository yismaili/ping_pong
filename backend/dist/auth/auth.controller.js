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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const google_guard_1 = require("./guard/google.guard");
const intra_guard_1 = require("./guard/intra.guard");
const jwt_guard_1 = require("./guard/jwt.guard");
const user_service_1 = require("../user/user.service");
const TwoFactorAuthenticationCode_dto_1 = require("./dtos/TwoFactorAuthenticationCode.dto");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const express_1 = require("express");
let AuthController = class AuthController {
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;
    }
    googlelogin(res) {
        return res.status(common_1.HttpStatus.OK).json(this.response);
    }
    async googleAuthRedirect(req, res) {
        const user = {
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            picture: req.user.picture,
        };
        const response = await this.authService.googleAuthenticate(user);
        if (response.success) {
            res.cookie('userData', { response });
            return res.redirect('/auth/home');
        }
        return res.status(common_1.HttpStatus.UNAUTHORIZED).json({ message: 'Authentication failed' });
    }
    async intraAuthRedirect(req, res) {
        const user = {
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            picture: req.user.picture,
        };
        const response = await this.authService.googleAuthenticate(user);
        if (response.success) {
            res.cookie('userData', { response });
            return res.redirect('/auth/home');
        }
        return res.status(common_1.HttpStatus.UNAUTHORIZED).json({ message: 'Authentication failed' });
    }
    async register(req) {
        const { otpauthUrl } = await this.authService.generateTwoFactorAuthSecret(req.user);
        return this.authService.generateQrCodeDataURL(otpauthUrl);
    }
    async turnOnTwoFactorAuthentication(request, twoFactorAuthenticationCode) {
        const isCodeValid = await this.authService.isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode, request.user.username);
        if (isCodeValid === false) {
            throw new common_1.UnauthorizedException('Wrong authentication code');
        }
        await this.userService.turnOnTwoFactorAuthentication(request.user.username);
    }
    async turnOffTwoFactorAuthentication(request, twoFactorAuthenticationCode) {
        const isCodeValid = await this.authService.isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode, request.user.username);
        if (isCodeValid === false) {
            throw new common_1.UnauthorizedException('Wrong authentication code');
        }
        await this.userService.turnOffTwoFactorAuthentication(request.user.username);
    }
    async authenticate(twoFactorAuthenticationCode) {
        const isCodeValid = await this.authService.isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode, twoFactorAuthenticationCode.username);
        if (!isCodeValid) {
            throw new common_1.UnauthorizedException('Wrong authentication code');
        }
        const response = await this.authService.generateTocken(twoFactorAuthenticationCode.username);
        return response;
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], AuthController.prototype, "server", void 0);
__decorate([
    (0, common_1.Get)('home'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "googlelogin", null);
__decorate([
    (0, common_1.UseGuards)(google_guard_1.AuthGoogleGuard),
    (0, common_1.Get)('google/callback'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, common_1.UseGuards)(intra_guard_1.AuthIntraGuard),
    (0, common_1.Get)('intra/callback'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "intraAuthRedirect", null);
__decorate([
    (0, common_1.Post)('2fa/generate'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('2fa/turn-on'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, TwoFactorAuthenticationCode_dto_1.TwoFactorAuthenticationCodeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "turnOnTwoFactorAuthentication", null);
__decorate([
    (0, common_1.Post)('2fa/turn-off'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, TwoFactorAuthenticationCode_dto_1.TwoFactorAuthenticationCodeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "turnOffTwoFactorAuthentication", null);
__decorate([
    (0, common_1.Post)('2fa/authenticate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TwoFactorAuthenticationCode_dto_1.TwoFactorAuthenticationCodeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authenticate", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService, user_service_1.UserService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map