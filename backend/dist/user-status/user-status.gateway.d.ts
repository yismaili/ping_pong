import { Socket, Server } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';
import { UserService } from 'src/user/user.service';
export declare class UserStatusGateway {
    private readonly chatService;
    private userService;
    server: Server;
    constructor(chatService: ChatService, userService: UserService);
    handleConnection(client: Socket): Promise<any>;
    handleDisconnect(client: Socket): Promise<any>;
}
