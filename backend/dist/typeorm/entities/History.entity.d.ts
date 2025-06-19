import { User } from './User.entity';
export declare class HistoryEntity {
    id: number;
    date: Date;
    resulteOfUser: number;
    resulteOfCompetitor: number;
    user: User;
    userCompetitor: User;
    setDateOnInsert(): void;
    setDateOnUpdate(): void;
}
