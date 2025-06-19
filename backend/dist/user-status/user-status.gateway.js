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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatusGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const jsonwebtoken_1 = require("jsonwebtoken");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("../chat/chat.service");
const user_service_1 = require("../user/user.service");
let UserStatusGateway = class UserStatusGateway {
    constructor(chatService, userService) {
        this.chatService = chatService;
        this.userService = userService;
    }
    handleConnection(client) {
        try {
            const jwtSecret = process.env.JWT_SECRET;
            const token = client.handshake.headers.authorization;
            if (!token) {
                client.emit('error', 'Authorization token missing');
                client.disconnect(true);
                return;
            }
            const decodedToken = (0, jsonwebtoken_1.verify)(token, jwtSecret);
            if (!decodedToken) {
                client.emit('error', 'Invalid or expired token');
                client.disconnect(true);
                return;
            }
            const username = decodedToken['username'];
            return this.userService.setUserstatus(username, 'online');
        }
        catch (error) {
            return;
        }
    }
    handleDisconnect(client) {
        try {
            const jwtSecret = process.env.JWT_SECRET;
            const token = client.handshake.headers.authorization;
            if (!token) {
                client.emit('error', 'Authorization token missing');
                client.disconnect(true);
                return;
            }
            let decodedToken = (0, jsonwebtoken_1.verify)(token, jwtSecret);
            const username = decodedToken['username'];
            return this.userService.setUserstatus(username, 'offline');
        }
        catch (error) {
            return;
        }
    }
};
exports.UserStatusGateway = UserStatusGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], UserStatusGateway.prototype, "server", void 0);
exports.UserStatusGateway = UserStatusGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } }),
    __metadata("design:paramtypes", [chat_service_1.ChatService, user_service_1.UserService])
], UserStatusGateway);
//# sourceMappingURL=user-status.gateway.js.map