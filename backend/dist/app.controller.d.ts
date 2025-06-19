import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    userRepository: any;
    connectedClients: any;
    constructor(appService: AppService);
    getHello(): string;
}
