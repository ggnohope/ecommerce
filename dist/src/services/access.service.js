"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const shop_model_1 = __importDefault(require("../models/shop.model"));
const crypto_1 = __importDefault(require("crypto"));
const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
};
class AccessService {
}
_a = AccessService;
AccessService.signUp = (_b) => __awaiter(void 0, [_b], void 0, function* ({ name, email, password, }) {
    try {
        const shopHolder = yield shop_model_1.default.findOne({ email }).lean();
        if (shopHolder) {
            return {
                code: "xxx",
                message: "Shop already registered",
            };
        }
        const passwordHash = yield bcrypt_1.default.hash(password, 10);
        const newShop = yield shop_model_1.default.create({
            name,
            email,
            password: passwordHash,
            roles: [RoleShop.SHOP],
        });
        if (!newShop) {
            return {
                code: "xxx",
                message: "Sign up failed",
                status: "error",
            };
        }
        const { privateKey, publicKey } = crypto_1.default.generateKeyPairSync("rsa", {
            modulusLength: 4096,
        });
    }
    catch (error) {
        return {
            code: "xxx",
            message: error.message,
            status: "error",
        };
    }
});
AccessService.login = (_b) => __awaiter(void 0, [_b], void 0, function* ({ email, password, }) {
    try {
        const shopHolder = yield shop_model_1.default.findOne({ email }).lean();
        if (!shopHolder) {
            return {
                code: "xxx",
                message: "Shop not found",
                status: "error",
            };
        }
        console.log("[P]::login::", shopHolder.email, shopHolder.password);
        if (password !== shopHolder.password) {
            return {
                code: "xxx",
                message: "Password is incorrect",
                status: "error",
            };
        }
        return {
            code: "xxx",
            message: "Login successfully",
            shop: shopHolder,
            status: "success",
        };
    }
    catch (error) {
        return {
            code: "xxx",
            message: error.message,
            status: "error",
        };
    }
});
AccessService.getMe = (shopID) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shopHolder = yield shop_model_1.default.findOne({ _id: shopID }).lean();
        if (!shopHolder) {
            return {
                code: "xxx",
                message: "Shop not found",
                status: "error",
            };
        }
        return {
            code: "xxx",
            message: "Get me successfully",
            shop: shopHolder,
            status: "success",
        };
    }
    catch (error) {
        return {
            code: "xxx",
            message: error.message,
            status: "error",
        };
    }
});
exports.default = AccessService;
