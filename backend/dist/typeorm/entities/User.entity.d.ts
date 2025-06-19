import { Profile } from './Profile.entity';
import { Relation } from './Relation.entity';
import { Achievement } from './Achievement.entity';
import { HistoryEntity } from './History.entity';
import { ChatRoomUser } from './chat-room-users.entity';
import { Chat } from './chat-entity';
import { Message } from './message-entity';
export declare class User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    uniquename: string;
    email: string;
    picture: string;
    status: string;
    twoFactorAuthSecret: string;
    isTwoFactorAuthEnabled: boolean;
    profile: Profile;
    userRelations: Relation[];
    friendRelations: Relation[];
    achievements: Achievement[];
    histories: HistoryEntity[];
    chatRoomUsers: ChatRoomUser[];
    userChats: Chat[];
    secondUserChats: Chat[];
    messages: Message[];
}
