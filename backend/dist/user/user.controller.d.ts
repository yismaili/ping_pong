import { UserService } from './user.service';
import { AchievementDto } from 'src/auth/dtos/achievement.dto';
import { HistoryDto } from 'src/auth/dtos/history.dto';
import { RelationDto } from 'src/auth/dtos/relation.dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getDetailsProfile(req: any, username: string): Promise<any>;
    updateProfileDetails(req: any, username: string, userData: any, imageData: any): Promise<any>;
    addUniquename(req: any, username: string, uniquename: any): Promise<any>;
    searchToFrindByUsername(req: any, username: string, secondUsername: string): Promise<any>;
    historyFriend(req: any, username: string, secondUsername: string): Promise<any>;
    searchToUserByUsername(req: any, username: string, secondUsername: string): Promise<any>;
    getFriendsOfUser(req: any, username: string): Promise<HistoryDto[]>;
    addAchievementOfUser(req: any, username: string, achievementDto: AchievementDto): Promise<any>;
    getachievementOfUser(req: any, username: string): Promise<AchievementDto[]>;
    sendRequest(req: any, username: string, secondUsername: string): Promise<any>;
    getFriendOfUser(req: any, username: string): Promise<RelationDto[]>;
    getBlockedOfUser(req: any, username: string): Promise<RelationDto[]>;
    getAllRequestsOfUser(req: any, username: string): Promise<RelationDto[]>;
    getAllRequistsSendFromUser(req: any, username: string): Promise<RelationDto[]>;
    UpdateStatusOfUser(req: any, username: string, secondUser: string): Promise<any>;
    unblockUser(req: any, username: string, secondUser: string): Promise<any>;
    acceptRequist(req: any, username: string, secondUser: string): Promise<any>;
    rejectRequist(req: any, username: string, secondUser: string): Promise<any>;
    cancelRequist(req: any, username: string, secondUser: string): Promise<any>;
    cancelRelation(req: any, username: string, secondUser: string): Promise<any>;
    getSatatusOfUser(req: any, username: string): Promise<RelationDto[]>;
}
