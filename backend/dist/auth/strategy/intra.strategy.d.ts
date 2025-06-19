import { VerifyCallback } from 'passport-42';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
declare const IntraStrategy_base: any;
export declare class IntraStrategy extends IntraStrategy_base {
    private readonly configService;
    private readonly authService;
    constructor(configService: ConfigService, authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<void>;
}
export {};
