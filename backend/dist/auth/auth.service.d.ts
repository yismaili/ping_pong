import { Repository } from 'typeorm';
import { User } from 'src/typeorm/entities/User.entity';
import { Profile } from 'src/typeorm/entities/Profile.entity';
import { Relation } from 'src/typeorm/entities/Relation.entity';
import { HistoryEntity } from 'src/typeorm/entities/History.entity';
import { Achievement } from 'src/typeorm/entities/Achievement.entity';
import { UserDto } from './dtos/user.dto';
import { UserService } from 'src/user/user.service';
import { TwoFactorAuthenticationCodeDto } from './dtos/TwoFactorAuthenticationCode.dto';
export declare class AuthService {
    private userRepository;
    private profileRepository;
    private relationRepository;
    private historyRepository;
    private achievementRepository;
    private userService;
    constructor(userRepository: Repository<User>, profileRepository: Repository<Profile>, relationRepository: Repository<Relation>, historyRepository: Repository<HistoryEntity>, achievementRepository: Repository<Achievement>, userService: UserService);
    generateRandom(length: number): string;
    randomAvatar(): Promise<string>;
    googleAuthenticate(userDetails: Partial<UserDto>): Promise<any>;
    findUserById(user: Partial<User>): Promise<Partial<any>>;
    generateTwoFactorAuthSecret(user: User): Promise<{
        secret: any;
        otpauthUrl: any;
    }>;
    generateQrCodeDataURL(otpAuthUrl: string): Promise<any>;
    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: TwoFactorAuthenticationCodeDto, username: string): Promise<any>;
    generateTocken(username: string): Promise<{
        token: any;
        user: any;
        success: boolean;
    }>;
}
