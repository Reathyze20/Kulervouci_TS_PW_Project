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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const basePage_1 = require("./basePage");
class LoginPage extends basePage_1.BasePage {
    constructor(page) {
        super(page);
    }
    waitForPageToLoad() {
        console.log("Cekám, zda se stránka načetla...");
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("Stránka se načetla.");
                resolve();
            });
        });
    }
    login(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Přihlašuji se jako ${username} s heslem ${password}`);
        });
    }
}
exports.LoginPage = LoginPage;
