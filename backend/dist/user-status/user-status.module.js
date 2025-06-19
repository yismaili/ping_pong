"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatusModule = void 0;
const common_1 = require("@nestjs/common");
const user_status_gateway_1 = require("./user-status.gateway");
const chat_service_1 = require("../chat/chat.service");
const user_service_1 = require("../user/user.service");
const user_module_1 = require("../user/user.module");
const typeorm_1 = require("@nestjs/typeorm");
const User_entity_1 = require("../typeorm/entities/User.entity");
const Profile_entity_1 = require("../typeorm/entities/Profile.entity");
const Relation_entity_1 = require("../typeorm/entities/Relation.entity");
const History_entity_1 = require("../typeorm/entities/History.entity");
const Achievement_entity_1 = require("../typeorm/entities/Achievement.entity");
const chat_room_entity_1 = require("../typeorm/entities/chat-room.entity");
const chat_room_users_entity_1 = require("../typeorm/entities/chat-room-users.entity");
const message_entity_1 = require("../typeorm/entities/message-entity");
const chat_entity_1 = require("../typeorm/entities/chat-entity");
const auth_module_1 = require("../auth/auth.module");
const chat_module_1 = require("../chat/chat.module");
const auth_service_1 = require("../auth/auth.service");
let UserStatusModule = class UserStatusModule {
};
exports.UserStatusModule = UserStatusModule;
exports.UserStatusModule = UserStatusModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            chat_module_1.ChatModule,
            auth_module_1.AuthModule,
            typeorm_1.TypeOrmModule.forFeature([User_entity_1.User, Profile_entity_1.Profile, Relation_entity_1.Relation, Achievement_entity_1.Achievement, History_entity_1.HistoryEntity, chat_room_entity_1.ChatRoom, chat_room_users_entity_1.ChatRoomUser, message_entity_1.Message, chat_entity_1.Chat])
        ],
        providers: [user_status_gateway_1.UserStatusGateway, chat_service_1.ChatService, user_service_1.UserService, auth_service_1.AuthService]
    })
], UserStatusModule);
//# sourceMappingURL=user-status.module.js.map