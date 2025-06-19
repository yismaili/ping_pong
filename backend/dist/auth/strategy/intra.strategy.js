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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntraStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_42_1 = require("passport-42");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("../auth.service");
let IntraStrategy = class IntraStrategy extends (0, passport_1.PassportStrategy)(passport_42_1.Strategy) {
    constructor(configService, authService) {
        super({
            clientID: configService.get('INTRA_CLIENT_ID'),
            clientSecret: configService.get('INTRA_CLIENT_SECRET'),
            callbackURL: configService.get('OAUTH_INTRA_REDIRECT_URL'),
            scope: ['public']
        });
        this.configService = configService;
        this.authService = authService;
    }
    async validate(accessToken, refreshToken, profile, done) {
        const user = {
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails?.[0]?.value,
            picture: profile._json.image.link,
            accessToken,
        };
        done(null, user);
    }
};
exports.IntraStrategy = IntraStrategy;
exports.IntraStrategy = IntraStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object, auth_service_1.AuthService])
], IntraStrategy);
//# sourceMappingURL=intra.strategy.js.map