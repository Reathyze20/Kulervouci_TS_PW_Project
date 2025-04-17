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
exports.BasePage = void 0;
class BasePage {
    constructor(page) {
        this.page = page;
    }
    navigate(url) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Navigating to URL: ${url}`);
            // Případně: await this.page.goto(url);
        });
    }
    getTitle() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Getting page title...");
            return "Mock Title"; // Mock hodnota pro účely demonstrace
        });
    }
}
exports.BasePage = BasePage;
exports.default = BasePage;
