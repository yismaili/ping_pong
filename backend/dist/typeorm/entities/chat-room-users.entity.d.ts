import { User } from "./User.entity";
import { ChatRoom } from "./chat-room.entity";
export declare class ChatRoomUser {
    id: number;
    time: Date;
    statusPermissions: string;
    owner: boolean;
    statusUser: string;
    user: User;
    chatRooms: ChatRoom;
}
