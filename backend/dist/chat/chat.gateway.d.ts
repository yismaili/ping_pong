import { ChatService } from './chat.service';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Socket, Server } from 'socket.io';
import { MessageChatDto } from './dto/message-chat.dto';
import { CreateChatRoomDto } from './dto/create-chatRoom.dto';
import { JoinUsertoChatRoom } from './dto/join-user-to-chatRoom.dto';
import { SendMessageToChatRoom } from './dto/send-message-to-chatRomm';
import { GetChatRoomMessages } from './dto/get-chatRoom-messages';
import { JoinChatRoom } from './dto/join-chat-room';
import { BanUserDto } from './dto/ban-user.dto';
import { KickUserDto } from './dto/kick-user.dto';
import { MuteUserDto } from './dto/mut-user.dto';
import { ChatRoomOfUserDto } from './dto/chatRoom-of-user.dto';
import { LeaveChatRoomDto } from './dto/leave-ChatRoom.dto';
import { JoinRoom } from './dto/join-room.dto';
import { UsersOfChatRoom } from './dto/users-of-chatRoom.dto';
import { updateChatRoom } from './dto/update-chat-room.dto';
import { UpdateUIDto } from './dto/update-UI.dto';
export declare class ChatGateway {
    private readonly chatService;
    server: Server;
    constructor(chatService: ChatService);
    handleConnection(client: Socket): void;
    createChat(createChatDto: MessageChatDto, client: Socket): Promise<any>;
    updateUI(updateUIDto: UpdateUIDto, client: Socket): Promise<void>;
    createChatRoom(createChatRoomDto: CreateChatRoomDto, client: Socket, file: any): Promise<any>;
    joinUsarToChatRoom(joinUsertoChatRoom: JoinUsertoChatRoom, client: Socket): Promise<any>;
    sendMessage(sendMessageToChatRoom: SendMessageToChatRoom, client: Socket): Promise<any>;
    findAllChatRoomConversation(getChatRoomMessages: GetChatRoomMessages, client: Socket): Promise<any>;
    joinChatRoomWithAdmin(joinChatRoom: JoinChatRoom): Promise<any>;
    findAllMessagesOfUser(createChatDto: MessageChatDto): Promise<import("../typeorm/entities/chat-entity").Chat[]>;
    findOne(id: number): Promise<import("../typeorm/entities/chat-entity").Chat>;
    update(updateChatDto: UpdateChatDto): Promise<import("../typeorm/entities/chat-entity").Chat>;
    remove(updateChatDto: UpdateChatDto): Promise<any>;
    removeConversation(updateChatDto: UpdateChatDto): Promise<any>;
    banUser(banUserDto: BanUserDto): Promise<{
        message: string;
    }>;
    kickUser(kickUserDto: KickUserDto): Promise<{
        message: string;
    }>;
    muteUser(muteUserDto: MuteUserDto): Promise<{
        message: string;
    }>;
    getAllChatRoomOfUser(chatRoomOfUserDto: ChatRoomOfUserDto): Promise<any>;
    unbannedUser(unbannedUserDtoo: BanUserDto): Promise<{
        message: string;
    }>;
    changePermissionToUser(changePermissionToUserDto: BanUserDto): Promise<any>;
    leaveChatRoom(leaveChatRoomDto: LeaveChatRoomDto): Promise<any>;
    deleteChatRoom(deleteChatRoomDto: LeaveChatRoomDto): Promise<any>;
    typing(isTyping: boolean, client: Socket): Promise<void>;
    getAllChatRoom(chatRoomOfUserDto: ChatRoomOfUserDto): Promise<any>;
    joinChatRoom(joinRoom: JoinRoom): Promise<any>;
    getAllUserOfChatRoom(usersOfChatRoom: UsersOfChatRoom): Promise<any>;
    updateChatRoomInf(usersOfChatRoom: updateChatRoom): Promise<any>;
    gitAllUsers(): Promise<any>;
}
