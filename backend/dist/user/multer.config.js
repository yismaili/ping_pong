"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerOptions = void 0;
const multer_1 = require("multer");
exports.multerOptions = {
    storage: (0, multer_1.diskStorage)({
        destination: './uploads',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const extension = file.originalname.split('.').pop();
            callback(null, `${uniqueSuffix}.${extension}`);
        },
    }),
};
//# sourceMappingURL=multer.config.js.map