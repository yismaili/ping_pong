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
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const chat_service_1 = require("./chat.service");
const update_chat_dto_1 = require("./dto/update-chat.dto");
const socket_io_1 = require("socket.io");
const message_chat_dto_1 = require("./dto/message-chat.dto");
const create_chatRoom_dto_1 = require("./dto/create-chatRoom.dto");
const join_user_to_chatRoom_dto_1 = require("./dto/join-user-to-chatRoom.dto");
const send_message_to_chatRomm_1 = require("./dto/send-message-to-chatRomm");
const get_chatRoom_messages_1 = require("./dto/get-chatRoom-messages");
const join_chat_room_1 = require("./dto/join-chat-room");
const ban_user_dto_1 = require("./dto/ban-user.dto");
const kick_user_dto_1 = require("./dto/kick-user.dto");
const mut_user_dto_1 = require("./dto/mut-user.dto");
const chatRoom_of_user_dto_1 = require("./dto/chatRoom-of-user.dto");
const leave_ChatRoom_dto_1 = require("./dto/leave-ChatRoom.dto");
const join_room_dto_1 = require("./dto/join-room.dto");
const users_of_chatRoom_dto_1 = require("./dto/users-of-chatRoom.dto");
const update_chat_room_dto_1 = require("./dto/update-chat-room.dto");
const common_1 = require("@nestjs/common");
const update_UI_dto_1 = require("./dto/update-UI.dto");
const jsonwebtoken_1 = require("jsonwebtoken");
let ChatGateway = class ChatGateway {
    constructor(chatService) {
        this.chatService = chatService;
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
            let decodedToken = (0, jsonwebtoken_1.verify)(token, jwtSecret);
            const username = decodedToken['username'];
            this.chatService.addUserWithSocketId(username, client);
        }
        catch (error) {
            return;
        }
    }
    async createChat(createChatDto, client) {
        try {
            return await this.chatService.createChatDirect(createChatDto, client, this.server);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async updateUI(updateUIDto, client) {
        try {
            let roomName = `Room_` + updateUIDto.message;
            client.join(roomName);
            this.server.emit('updateUI', updateUIDto.message);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async createChatRoom(createChatRoomDto, client, file) {
        try {
            return await this.chatService.createChatRoom(createChatRoomDto);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async joinUsarToChatRoom(joinUsertoChatRoom, client) {
        try {
            return await this.chatService.joinUserToChatRoom(joinUsertoChatRoom);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async sendMessage(sendMessageToChatRoom, client) {
        try {
            return await this.chatService.sendMessage(sendMessageToChatRoom, client, this.server);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async findAllChatRoomConversation(getChatRoomMessages, client) {
        try {
            return await this.chatService.findAllChatRoomConversation(getChatRoomMessages);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async joinChatRoomWithAdmin(joinChatRoom) {
        try {
            return await this.chatService.joinChatRoomWithAdmin(joinChatRoom);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async findAllMessagesOfUser(createChatDto) {
        try {
            return await this.chatService.findConversationBetweenUsers(createChatDto);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async findOne(id) {
        try {
            return await this.chatService.findMessageById(id);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async update(updateChatDto) {
        try {
            return await this.chatService.update(updateChatDto);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async remove(updateChatDto) {
        try {
            return await this.chatService.remove(updateChatDto);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async removeConversation(updateChatDto) {
        try {
            return await this.chatService.removeConversation(updateChatDto);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async banUser(banUserDto) {
        try {
            return await this.chatService.banUser(banUserDto);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async kickUser(kickUserDto) {
        try {
            return await this.chatService.kickUser(kickUserDto);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async muteUser(muteUserDto) {
        try {
            return await this.chatService.muteUser(muteUserDto);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async getAllChatRoomOfUser(chatRoomOfUserDto) {
        try {
            return await this.chatService.getAllChatRoomOfUser(chatRoomOfUserDto);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async unbannedUser(unbannedUserDtoo) {
        try {
            return await this.chatService.unbannedUser(unbannedUserDtoo);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async changePermissionToUser(changePermissionToUserDto) {
        try {
            return await this.chatService.changePermissionToUser(changePermissionToUserDto);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async leaveChatRoom(leaveChatRoomDto) {
        try {
            return await this.chatService.leaveChatRoom(leaveChatRoomDto, this.server);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async deleteChatRoom(deleteChatRoomDto) {
        try {
            return await this.chatService.deleteChatRoom(deleteChatRoomDto, this.server);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async typing(isTyping, client) {
        try {
            client.emit('istyping', { isTyping });
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async getAllChatRoom(chatRoomOfUserDto) {
        try {
            return await this.chatService.getAllChatRoom(chatRoomOfUserDto);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async joinChatRoom(joinRoom) {
        try {
            return await this.chatService.joinChatRoom(joinRoom);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async getAllUserOfChatRoom(usersOfChatRoom) {
        return await this.chatService.getAllUserOfChatRoom(usersOfChatRoom);
    }
    async updateChatRoomInf(usersOfChatRoom) {
        try {
            return await this.chatService.updateChatRoomInfo(usersOfChatRoom, this.server);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    async gitAllUsers() {
        try {
            return await this.chatService.gitAllUsers();
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('createChat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [message_chat_dto_1.MessageChatDto, typeof (_b = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "createChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateUI'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_UI_dto_1.UpdateUIDto, typeof (_c = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "updateUI", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('createChatRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_chatRoom_dto_1.CreateChatRoomDto, typeof (_d = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _d : Object, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "createChatRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('JoinUsertoRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_user_to_chatRoom_dto_1.JoinUsertoChatRoom, typeof (_e = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "joinUsarToChatRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessageToChatRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_message_to_chatRomm_1.SendMessageToChatRoom, typeof (_f = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "sendMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('findAllChatRoomConversation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_chatRoom_messages_1.GetChatRoomMessages, typeof (_g = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "findAllChatRoomConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinChatRoomWithAdmin'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_chat_room_1.JoinChatRoom]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "joinChatRoomWithAdmin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('findAllChat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [message_chat_dto_1.MessageChatDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "findAllMessagesOfUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('findOneChat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "findOne", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('editMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_chat_dto_1.UpdateChatDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "update", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('deleteMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_chat_dto_1.UpdateChatDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "remove", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('deleteConversation'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_chat_dto_1.UpdateChatDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "removeConversation", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('banUser'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ban_user_dto_1.BanUserDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "banUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('kickUser'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kick_user_dto_1.KickUserDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "kickUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('muteUser'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mut_user_dto_1.MuteUserDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "muteUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('chatRoomOfUser'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chatRoom_of_user_dto_1.ChatRoomOfUserDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getAllChatRoomOfUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unbannedUser'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ban_user_dto_1.BanUserDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "unbannedUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('changePermission'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ban_user_dto_1.BanUserDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "changePermissionToUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveChatRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [leave_ChatRoom_dto_1.LeaveChatRoomDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "leaveChatRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('deleteChatRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [leave_ChatRoom_dto_1.LeaveChatRoomDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "deleteChatRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('istyping'),
    __param(0, (0, websockets_1.MessageBody)('isTyping')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, typeof (_h = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "typing", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('AllchatRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [chatRoom_of_user_dto_1.ChatRoomOfUserDto]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getAllChatRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinChatRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_room_dto_1.JoinRoom]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "joinChatRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('getAllUserOfChatRoom'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_of_chatRoom_dto_1.UsersOfChatRoom]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "getAllUserOfChatRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateChatRoomInfo'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_chat_room_dto_1.updateChatRoom]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "updateChatRoomInf", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('gitAllUsers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "gitAllUsers", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' }, namespace: 'chat' }),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map