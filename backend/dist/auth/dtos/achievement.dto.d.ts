import { User } from "src/typeorm/entities/User.entity";
export declare class AchievementDto {
    id: number;
    type: string;
    description: string;
    user: User;
}
