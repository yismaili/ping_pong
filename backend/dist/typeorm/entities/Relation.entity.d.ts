import { User } from './User.entity';
export declare class Relation {
    id: number;
    status: string;
    FromUser: string;
    friend: User;
    user: User;
}
