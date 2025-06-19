"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const Profile_entity_1 = require("./Profile.entity");
const Relation_entity_1 = require("./Relation.entity");
const Achievement_entity_1 = require("./Achievement.entity");
const History_entity_1 = require("./History.entity");
const chat_room_users_entity_1 = require("./chat-room-users.entity");
const chat_entity_1 = require("./chat-entity");
const message_entity_1 = require("./message-entity");
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "uniquename", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "picture", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "twoFactorAuthSecret", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isTwoFactorAuthEnabled", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Profile_entity_1.Profile, profile => profile.user, { cascade: true }),
    __metadata("design:type", Profile_entity_1.Profile)
], User.prototype, "profile", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Relation_entity_1.Relation, relation => relation.user),
    __metadata("design:type", Array)
], User.prototype, "userRelations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Relation_entity_1.Relation, relation => relation.friend),
    __metadata("design:type", Array)
], User.prototype, "friendRelations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Achievement_entity_1.Achievement, achievement => achievement.user),
    __metadata("design:type", Array)
], User.prototype, "achievements", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => History_entity_1.HistoryEntity, history => history.user),
    __metadata("design:type", Array)
], User.prototype, "histories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chat_room_users_entity_1.ChatRoomUser, chatRoomUser => chatRoomUser.user),
    __metadata("design:type", Array)
], User.prototype, "chatRoomUsers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chat_entity_1.Chat, chat => chat.user),
    __metadata("design:type", Array)
], User.prototype, "userChats", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => chat_entity_1.Chat, chat => chat.secondUser),
    __metadata("design:type", Array)
], User.prototype, "secondUserChats", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => message_entity_1.Message, message => message.user),
    __metadata("design:type", Array)
], User.prototype, "messages", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
//# sourceMappingURL=User.entity.js.map