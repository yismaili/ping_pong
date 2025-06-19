import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { TwoFactorAuthenticationCodeDto } from './dtos/TwoFactorAuthenticationCode.dto';
import { Server } from 'socket.io';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    private userService;
    server: Server;
    constructor(authService: AuthService, userService: UserService);
    response: any;
    googlelogin(res: Response): any;
    googleAuthRedirect(req: any, res: Response): Promise<any>;
    intraAuthRedirect(req: any, res: Response): Promise<any>;
    register(req: any): Promise<any>;
    turnOnTwoFactorAuthentication(request: any, twoFactorAuthenticationCode: TwoFactorAuthenticationCodeDto): Promise<void>;
    turnOffTwoFactorAuthentication(request: any, twoFactorAuthenticationCode: TwoFactorAuthenticationCodeDto): Promise<void>;
    authenticate(twoFactorAuthenticationCode: TwoFactorAuthenticationCodeDto): Promise<{
        token: any;
        user: any;
        success: boolean;
    }>;
}
