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
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const game_service_1 = require("./game.service");
const socket_io_1 = require("socket.io");
const create_game_dto_1 = require("./dto/create-game.dto");
const jsonwebtoken_1 = require("jsonwebtoken");
const accept_request_dto_1 = require("./dto/accept-request.dto");
const pong_game_1 = require("./pong-game/pong-game");
const common_1 = require("@nestjs/common");
let GameGateway = class GameGateway {
    constructor(gameService, pongGame) {
        this.gameService = gameService;
        this.pongGame = pongGame;
    }
    handleConnection(client) {
        try {
            const jwtSecret = process.env.JWT_SECRET;
            const token = client.handshake.headers.authorization;
            ;
            if (!token) {
                client.emit('error', 'Authorization token missing');
                client.disconnect(true);
                return;
            }
            let decodedToken = (0, jsonwebtoken_1.verify)(token, jwtSecret);
            const username = decodedToken['username'];
            this.gameService.handleConnection(client, username);
        }
        catch (error) {
            return;
        }
    }
    create(createGameDto, soketId) {
        try {
            return this.gameService.createGameRandom(createGameDto, soketId, this.server, this.pongGame);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    createGameFriend(createGameDto, soketId) {
        try {
            return this.gameService.matchingFriends(createGameDto, soketId, this.server);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    acceptreques(acceptRequestDto, soketId) {
        try {
            return this.gameService.acceptRequest(acceptRequestDto, soketId, this.server, this.pongGame);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    rejectrequest(acceptRequestDto, soketId) {
        try {
            return this.gameService.rejectrequest(acceptRequestDto, soketId, this.server);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    refreshGame(soketId) {
        try {
            return this.gameService.refreshGame(soketId);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    updateGameUp(data, soketId) {
        try {
            let roomName = null;
            for (const [name, players] of this.gameService.players) {
                if (players.includes(data.username)) {
                    roomName = name;
                    break;
                }
            }
            if (roomName != null) {
                if (this.gameService.players.get(roomName)[0] === data.username) {
                    this.pongGame.setUpPressed(data.isup);
                }
                else {
                    this.pongGame.setWPressed(data.isup);
                }
            }
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    updateGameDown(data, soketId) {
        try {
            let roomName = null;
            for (const [name, players] of this.gameService.players) {
                if (players.includes(data.username)) {
                    roomName = name;
                    break;
                }
            }
            if (roomName != null) {
                if (this.gameService.players.get(roomName)[0] === data.username) {
                    this.pongGame.setDownPressed(data.isdown);
                }
                else {
                    this.pongGame.setSPressed(data.isdown);
                }
            }
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
};
exports.GameGateway = GameGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('createGame'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_game_dto_1.CreateGameDto, typeof (_b = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "create", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('inviteFriend'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_game_dto_1.CreateGameDto, typeof (_c = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "createGameFriend", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('acceptrequest'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [accept_request_dto_1.AcceptRequestDto, typeof (_d = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "acceptreques", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('rejectrequest'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [accept_request_dto_1.AcceptRequestDto, typeof (_e = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _e : Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "rejectrequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('refreshGame'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _f : Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "refreshGame", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateGameUp'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_g = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _g : Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "updateGameUp", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateGameDown'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_h = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _h : Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "updateGameDown", null);
exports.GameGateway = GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' }, namespace: 'game' }),
    __metadata("design:paramtypes", [game_service_1.GameService, pong_game_1.PongGame])
], GameGateway);
//# sourceMappingURL=game.gateway.js.map