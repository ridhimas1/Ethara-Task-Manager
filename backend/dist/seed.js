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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Seeding database...');
        const adminPassword = yield bcrypt_1.default.hash('Admin@123', 10);
        const admin = yield prisma.user.upsert({
            where: { email: 'admin@ethara.com' },
            update: {},
            create: {
                email: 'admin@ethara.com',
                name: 'Ethara Admin',
                password: adminPassword,
                role: 'ADMIN',
                bio: 'System Administrator for Ethara Task Manager',
                skills: 'Management, Leadership, Planning',
            },
        });
        const memberPassword = yield bcrypt_1.default.hash('Member@123', 10);
        const member = yield prisma.user.upsert({
            where: { email: 'member@ethara.com' },
            update: {},
            create: {
                email: 'member@ethara.com',
                name: 'Ethara Member',
                password: memberPassword,
                role: 'MEMBER',
                bio: 'Team Member at Ethara',
                skills: 'Development, Design, Marketing',
            },
        });
        console.log({ admin, member });
        console.log('Database seeded successfully.');
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
