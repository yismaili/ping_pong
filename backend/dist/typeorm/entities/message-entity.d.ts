import { User } from './User.entity';
import { ChatRoom } from './chat-room.entity';
export declare class Message {
    id: number;
    user: User;
    date: Date;
    message: string;
    chatRoom: ChatRoom;
    setDateOnInsert(): void;
    setDateOnUpdate(): void;
}
