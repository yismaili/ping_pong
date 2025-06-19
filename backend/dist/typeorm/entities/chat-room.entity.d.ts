import { ChatRoomUser } from "./chat-room-users.entity";
import { Message } from "./message-entity";
export declare class ChatRoom {
    id: number;
    RoomId: string;
    name: string;
    status: string;
    password: string;
    picture: string;
    messages: Message[];
    chatRoomUser: ChatRoomUser;
}
