"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const google_strategy_1 = require("./strategy/google.strategy");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const jwt_guard_1 = require("./guard/jwt.guard");
const intra_strategy_1 = require("./strategy/intra.strategy");
const typeorm_2 = require("typeorm");
const User_entity_1 = require("../typeorm/entities/User.entity");
const Profile_entity_1 = require("../typeorm/entities/Profile.entity");
const Relation_entity_1 = require("../typeorm/entities/Relation.entity");
const Achievement_entity_1 = require("../typeorm/entities/Achievement.entity");
const History_entity_1 = require("../typeorm/entities/History.entity");
const chat_room_entity_1 = require("../typeorm/entities/chat-room.entity");
const chat_room_users_entity_1 = require("../typeorm/entities/chat-room-users.entity");
const message_entity_1 = require("../typeorm/entities/message-entity");
const chat_entity_1 = require("../typeorm/entities/chat-entity");
const user_service_1 = require("../user/user.service");
const chat_service_1 = require("../chat/chat.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([User_entity_1.User, Profile_entity_1.Profile, Relation_entity_1.Relation, Achievement_entity_1.Achievement, History_entity_1.HistoryEntity, chat_room_entity_1.ChatRoom, chat_room_users_entity_1.ChatRoomUser, message_entity_1.Message, chat_entity_1.Chat]),
            passport_1.PassportModule.register(google_strategy_1.GoogleStrategy),
            passport_1.PassportModule.register(intra_strategy_1.IntraStrategy),
            jwt_1.JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '48h' } }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, google_strategy_1.GoogleStrategy, config_1.ConfigService, intra_strategy_1.IntraStrategy, jwt_guard_1.JwtAuthGuard, typeorm_2.Repository, user_service_1.UserService, chat_service_1.ChatService]
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map