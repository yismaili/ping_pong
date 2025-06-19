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
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const User_entity_1 = require("../typeorm/entities/User.entity");
const typeorm_1 = require("@nestjs/typeorm");
const Profile_entity_1 = require("../typeorm/entities/Profile.entity");
const Relation_entity_1 = require("../typeorm/entities/Relation.entity");
const History_entity_1 = require("../typeorm/entities/History.entity");
const Achievement_entity_1 = require("../typeorm/entities/Achievement.entity");
const chat_room_entity_1 = require("../typeorm/entities/chat-room.entity");
const typeorm_2 = require("typeorm");
const jsonwebtoken_1 = require("jsonwebtoken");
let GameService = class GameService {
    constructor(userRepository, profileRepository, relationRepository, historyRepository, achievementRepository, chatRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.relationRepository = relationRepository;
        this.historyRepository = historyRepository;
        this.achievementRepository = achievementRepository;
        this.chatRepository = chatRepository;
        this.players = new Map();
        this.isconnected = new Map();
    }
    async createGameRandom(createGameDto, playerId, server, pongGame) {
        try {
            const user = await this.userRepository.findOne({
                where: { username: createGameDto.username },
            });
            if (!user) {
                throw new Error('User does not exist');
            }
            let roomName = '';
            for (const [name, players] of this.players) {
                if (players.includes(user.username)) {
                    roomName = name;
                    break;
                }
            }
            if (roomName && this.players.get(roomName).length >= 2) {
                await playerId.join(roomName);
            }
            else {
                const maxPlayersPerRoom = 2;
                for (const [name, players] of this.players) {
                    if (players.length < maxPlayersPerRoom && name !== user.username) {
                        roomName = name;
                        break;
                    }
                }
                if (!roomName) {
                    roomName = user.username;
                }
                await playerId.join(roomName);
                if (!this.players.has(roomName)) {
                    this.players.set(roomName, []);
                }
            }
            this.players.get(roomName).push(user.username);
            if (this.players.get(roomName).length === 2) {
                if (this.players.get(roomName)[0] === user.username) {
                    await this.handleLeaveRoom(playerId, roomName);
                }
                else {
                    await this.startGame(roomName, playerId, server, pongGame);
                }
            }
            else {
                playerId.on('cancelGame', async () => {
                    await this.handleLeaveRoom(playerId, roomName);
                });
            }
        }
        catch (error) {
            console.error('Error in createGameRandom:', error);
            throw error;
        }
    }
    async getGameRoom(username) {
        try {
            for (const [name, players] of this.players) {
                for (const player of players) {
                    if (player === username) {
                        return name;
                    }
                }
            }
            return null;
        }
        catch (error) {
            throw new Error("...");
        }
    }
    async handleLeaveRoom(client, roomName) {
        client.leave(roomName);
        if (this.players.has(roomName)) {
            this.players.delete(roomName);
        }
    }
    async statusInGame(username) {
        try {
            const user = await this.userRepository.findOne({ where: { username: username } });
            if (!user) {
                throw new Error("user not found");
            }
            user.status = 'inGame';
            return await this.userRepository.save(user);
        }
        catch (error) {
            throw error;
        }
    }
    async statusOutGame(username) {
        try {
            const user = await this.userRepository.findOne({ where: { username: username } });
            if (!user) {
                throw new Error("user not found");
            }
            user.status = 'online';
            return await this.userRepository.save(user);
        }
        catch (error) {
            throw error;
        }
    }
    async waitMinute() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 6000);
        });
    }
    async startGame(roomName, playerId, server, pongGame) {
        const [rootUser, friendUser] = this.players.get(roomName);
        await this.setStatusOfUser(playerId, rootUser);
        await this.setStatusOfUser(playerId, friendUser);
        const user = await this.userRepository.findOne({ where: { username: rootUser } });
        const userFriend = await this.userRepository.findOne({ where: { username: friendUser } });
        server.to(roomName).emit('players', {
            user,
            userFriend,
        });
        await this.waitMinute();
        pongGame.start();
        const intervalId = setInterval(async () => {
            const gameData = {
                ballX: pongGame.getBallX(),
                ballY: pongGame.getBallY(),
                leftPaddle: pongGame.getLeftPaddle(),
                rightPaddle: pongGame.getRightPaddle(),
                leftPlayerScore: pongGame.getlLeftPlayerScore(),
                rightPlayerScore: pongGame.getrRightPlayerScore(),
            };
            server.to(roomName).emit('GameUpdated', gameData);
            if (!pongGame.getStatus()) {
                clearInterval(intervalId);
                if (pongGame.winnerPlayer === 'right') {
                    server.to(roomName).emit('gameOver', {
                        gameOver: true, winner: user, loser: userFriend,
                        winnerScore: pongGame.getrRightPlayerScore(),
                        loserScore: pongGame.getlLeftPlayerScore(),
                    });
                }
                if (pongGame.winnerPlayer === 'left') {
                    server.to(roomName).emit('gameOver', {
                        gameOver: true, winner: userFriend, loser: user,
                        winnerScore: pongGame.getlLeftPlayerScore(),
                        loserScore: pongGame.getrRightPlayerScore(),
                    });
                }
                const history = {
                    resulteOfCompetitor: gameData.leftPlayerScore,
                    resulteOfUser: gameData.rightPlayerScore,
                    username: rootUser,
                    userCompetitor: friendUser
                };
                await this.handleLeaveRoom(playerId, roomName);
                await this.addHistory(history);
                pongGame.leftPlayerScore = 0;
                pongGame.rightPlayerScore = 0;
            }
        }, 1000 / 60);
    }
    async getUser(client) {
        const jwtSecret = process.env.JWT_SECRET;
        const token = client.handshake.headers.authorization;
        if (!token) {
            client.emit('error', 'Authorization token missing');
            client.disconnect(true);
            return;
        }
        let decodedToken = (0, jsonwebtoken_1.verify)(token, jwtSecret);
        const username = decodedToken['username'];
        return username;
    }
    async checkRelatonStatus(rootUsername, friendUsername) {
        try {
            const rootUser = await this.userRepository.findOne({
                where: { username: rootUsername },
            });
            const friendUser = await this.userRepository.findOne({
                where: { username: friendUsername }
            });
            if (!rootUser) {
                throw new Error("user not found !!");
            }
            const relationStatus = await this.relationRepository.findOne({
                where: [{ user: { id: rootUser.id }, friend: { id: friendUser.id }, status: (0, typeorm_2.Not)('blocked') },
                    { friend: { id: rootUser.id }, user: { id: friendUser.id }, status: (0, typeorm_2.Not)('blocked') }
                ]
            });
            if (!relationStatus) {
                return (0);
            }
            return (1);
        }
        catch (error) {
            throw new Error("Error check relation status");
        }
    }
    async matchingFriends(createGameDto, playerId, server) {
        try {
            const user = await this.userRepository.findOne({ where: { username: createGameDto.username } });
            const competitor = await this.userRepository.findOne({ where: { username: createGameDto.friendUsername } });
            if (!user || !competitor) {
                throw new Error('User or competitor not found');
            }
            let competitorRoom = competitor.username;
            for (const [room, sockets] of this.isconnected) {
                if (room === competitor.username) {
                    for (const socket of sockets) {
                        socket.join(competitorRoom);
                    }
                }
            }
            server.to(competitorRoom).emit('inviteFriend', { sender: user, receiver: competitor });
        }
        catch (error) {
            console.error('Error in matching friends:', error);
        }
    }
    async acceptRequest(acceptRequestDto, playerId, server, pongGame) {
        try {
            const user = await this.userRepository.findOne({ where: { username: acceptRequestDto.username } });
            const competitor = await this.userRepository.findOne({ where: { username: acceptRequestDto.userCompetitor } });
            if (!user || !competitor) {
                throw new Error("User not found!");
            }
            let roomName = `room_${user.username}_${competitor.username}`;
            if (!this.players.get(roomName)) {
                this.players.set(roomName, []);
            }
            this.players.get(roomName).push(user.username);
            this.players.get(roomName).push(competitor.username);
            let competitorRoom = competitor.username;
            for (const [room, sockets] of this.isconnected) {
                if (room === competitor.username) {
                    for (const socket of sockets) {
                        socket.join(roomName);
                        socket.join(competitorRoom);
                    }
                }
            }
            for (const [room, sockets] of this.isconnected) {
                if (room === user.username) {
                    for (const socket of sockets) {
                        socket.join(roomName);
                    }
                }
            }
            if (this.players.get(roomName).length === 2) {
                server.to(competitorRoom).emit('acceptrequest', { sender: user });
                this.startGame(roomName, playerId, server, pongGame);
            }
        }
        catch (error) {
            throw new Error('Unable to accept the request.');
        }
    }
    async rejectrequest(acceptRequestDto, playerId, server) {
        try {
            const user = await this.userRepository.findOne({ where: { username: acceptRequestDto.username } });
            const competitor = await this.userRepository.findOne({ where: { username: acceptRequestDto.userCompetitor } });
            if (!user || !competitor) {
                throw new Error("User not found!");
            }
            let competitorRoom = competitor.username;
            for (const [room, sockets] of this.isconnected) {
                if (room === competitor.username) {
                    for (const socket of sockets) {
                        socket.join(competitorRoom);
                    }
                }
                server.to(competitorRoom).emit('rejectrequest', { sender: user });
            }
        }
        catch (error) {
            throw new Error('Unable to accept the request.');
        }
    }
    async addHistory(addhistory) {
        try {
            const user = await this.userRepository.findOne({
                where: { username: addhistory.username }
            });
            const competitor = await this.userRepository.findOne({
                where: { username: addhistory.userCompetitor }
            });
            if (!user || !competitor) {
                throw new Error('User not found');
            }
            const newHistory = this.historyRepository.create({
                user: user,
                userCompetitor: competitor,
                resulteOfUser: addhistory.resulteOfUser,
                resulteOfCompetitor: addhistory.resulteOfCompetitor,
            });
            await this.historyRepository.save(newHistory);
            if (addhistory.resulteOfUser > addhistory.resulteOfCompetitor) {
                await this.updateWin(user.username);
                await this.updateLos(competitor.username);
                await this.updateXp(user.username);
                await this.updateLevel(user.username);
            }
            else {
                await this.updateWin(competitor.username);
                await this.updateLos(user.username);
                await this.updateXp(competitor.username);
                await this.updateLevel(competitor.username);
            }
            await this.updateScore(competitor.username);
            await this.updateScore(user.username);
            return;
        }
        catch (error) {
            throw new Error('Failed to add history: ' + error.message);
        }
    }
    async updateWin(username) {
        try {
            const user = await this.userRepository.findOne({
                where: { username: username }
            });
            if (!user) {
                throw new Error('User does not exist');
            }
            const profile = await this.profileRepository.findOne({
                where: { user: { id: user.id } }
            });
            if (!profile) {
                throw new Error('profile does not exist');
            }
            let countWin = profile.win;
            countWin++;
            profile.win = countWin;
            return await this.profileRepository.save(profile);
        }
        catch (error) {
            throw new Error('Failed to update profile: ' + error.message);
        }
    }
    async updateLos(username) {
        try {
            const user = await this.userRepository.findOne({
                where: { username: username }
            });
            if (!user) {
                throw new Error('User does not exist');
            }
            const profile = await this.profileRepository.findOne({
                where: { user: { id: user.id } }
            });
            if (!profile) {
                throw new Error('profile does not exist');
            }
            let countLos = profile.los;
            countLos++;
            profile.los = countLos;
            return await this.profileRepository.save(profile);
        }
        catch (error) {
            throw new Error('Failed to update profile: ' + error.message);
        }
    }
    async updateXp(username) {
        try {
            const user = await this.userRepository.findOne({
                where: { username: username }
            });
            if (!user) {
                throw new Error('User does not exist');
            }
            const profile = await this.profileRepository.findOne({
                where: { user: { id: user.id } }
            });
            if (!profile) {
                throw new Error('profile does not exist');
            }
            const winCount = profile.win;
            let xp = profile.xp;
            if (winCount % 2 === 0) {
                xp += 2;
            }
            profile.xp = xp;
            return await this.profileRepository.save(profile);
        }
        catch (error) {
            throw new Error('Failed to update profile: ' + error.message);
        }
    }
    async updateScore(username) {
        try {
            const user = await this.userRepository.findOne({
                where: { username: username }
            });
            if (!user) {
                throw new Error('User does not exist');
            }
            const profile = await this.profileRepository.findOne({
                where: { user: { id: user.id } }
            });
            if (!profile) {
                throw new Error('profile does not exist');
            }
            let score = profile.score;
            score++;
            profile.score = score;
            return await this.profileRepository.save(profile);
        }
        catch (error) {
            throw new Error('Failed to update profile: ' + error.message);
        }
    }
    async updateLevel(username) {
        try {
            const user = await this.userRepository.findOne({
                where: { username: username }
            });
            if (!user) {
                throw new Error('User does not exist');
            }
            const profile = await this.profileRepository.findOne({
                where: { user: { id: user.id } }
            });
            if (!profile) {
                throw new Error('profile does not exist');
            }
            let level = profile.level;
            const winCount = profile.win;
            if (winCount % 2 === 0) {
                level *= 2;
            }
            else {
                level += 1;
            }
            profile.level = level;
            return await this.profileRepository.save(profile);
        }
        catch (error) {
            throw new Error('Failed to update profile: ' + error.message);
        }
    }
    async getGameRequest(createGameDto) {
        const user = await this.userRepository.findOne({
            where: { username: createGameDto.username }
        });
        if (!user) {
            throw new Error('user do not exist');
        }
        const request = await this.historyRepository.find({
            where: { user: { id: user.id } }
        });
        return request;
    }
    async accepteGameRequest(createGameDto) {
        try {
            const user = await this.userRepository.findOne({
                where: { username: createGameDto.username }
            });
            const friend = await this.userRepository.findOne({
                where: { username: createGameDto.friendUsername }
            });
            if (!user || !friend) {
                throw new Error('User does not exist');
            }
            const request = await this.historyRepository.findOne({
                where: {
                    user: { id: user.id },
                    userCompetitor: { id: friend.id }
                }
            });
            if (!request) {
                throw new Error('Game request not found');
            }
            const acceptedRequest = await this.historyRepository.save(request);
            return acceptedRequest;
        }
        catch (error) {
            throw error;
        }
    }
    async UpdateResult(updateResultDto) {
        const gameHistory = await this.historyRepository.findOne({
            where: { id: updateResultDto.id }
        });
        if (!gameHistory) {
            throw new Error('history not found');
        }
        gameHistory.resulteOfUser = updateResultDto.userResult;
        gameHistory.resulteOfCompetitor = updateResultDto.competitorResult;
        const saveUpdate = await this.historyRepository.save(gameHistory);
        return saveUpdate;
    }
    async handleConnection(socketId, username) {
        try {
            if (!this.isconnected.has(username)) {
                this.isconnected.set(username, []);
            }
            this.isconnected.get(username).push(socketId);
            socketId.on('disconnect', async () => {
                if (this.isconnected.has(username)) {
                    this.isconnected.delete(username);
                }
            });
        }
        catch (error) {
            socketId.emit('error', 'Authentication failed');
            socketId.disconnect(true);
        }
    }
    async setStatusOfUser(socketId, username) {
        try {
            const user = await this.userRepository.findOne({
                where: { username: username }
            });
            user.status = 'inGame';
            await this.userRepository.save(user);
            socketId.on('disconnect', async () => {
                user.status = 'online';
                await this.userRepository.save(user);
            });
        }
        catch (error) {
            socketId.emit('error', 'Authentication failed');
            socketId.disconnect(true);
        }
    }
    async refreshGame(socketId) {
        try {
            const jwtSecret = process.env.JWT_SECRET;
            const token = socketId.handshake.headers.authorization;
            if (!token) {
                socketId.emit('error', 'Authorization token missing');
                socketId.disconnect(true);
                return;
            }
            let decodedToken = (0, jsonwebtoken_1.verify)(token, jwtSecret);
            const username = decodedToken['username'];
            let roomName = null;
            for (const [name, players] of this.players) {
                if (players.includes(username)) {
                    roomName = name;
                    break;
                }
            }
            for (const [room, sockets] of this.isconnected) {
                if (room === username) {
                    for (const socket of sockets) {
                        socket.join(roomName);
                    }
                }
            }
        }
        catch (error) {
            socketId.emit('error', 'Authentication failed');
            socketId.disconnect(true);
        }
    }
};
exports.GameService = GameService;
exports.GameService = GameService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(Profile_entity_1.Profile)),
    __param(2, (0, typeorm_1.InjectRepository)(Relation_entity_1.Relation)),
    __param(3, (0, typeorm_1.InjectRepository)(History_entity_1.HistoryEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(Achievement_entity_1.Achievement)),
    __param(5, (0, typeorm_1.InjectRepository)(chat_room_entity_1.ChatRoom)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _e : Object, typeof (_f = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _f : Object])
], GameService);
//# sourceMappingURL=game.service.js.map