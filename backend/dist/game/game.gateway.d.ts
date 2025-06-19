import { GameService } from './game.service';
import { Socket, Server } from 'socket.io';
import { CreateGameDto } from './dto/create-game.dto';
import { AcceptRequestDto } from './dto/accept-request.dto';
import { PongGame } from './pong-game/pong-game';
export declare class GameGateway {
    private readonly gameService;
    private readonly pongGame;
    server: Server;
    constructor(gameService: GameService, pongGame: PongGame);
    handleConnection(client: Socket): void;
    create(createGameDto: CreateGameDto, soketId: Socket): Promise<void>;
    createGameFriend(createGameDto: CreateGameDto, soketId: Socket): Promise<void>;
    acceptreques(acceptRequestDto: AcceptRequestDto, soketId: Socket): Promise<any>;
    rejectrequest(acceptRequestDto: AcceptRequestDto, soketId: Socket): Promise<any>;
    refreshGame(soketId: Socket): Promise<void>;
    updateGameUp(data: any, soketId: Socket): void;
    updateGameDown(data: any, soketId: Socket): void;
}
