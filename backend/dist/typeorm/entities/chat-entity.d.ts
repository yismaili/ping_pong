import { User } from './User.entity';
export declare class Chat {
    id: number;
    user: User;
    dateToSend: Date;
    message: string;
    secondUser: User;
    setDateOnInsert(): void;
    setDateOnUpdate(): void;
}
