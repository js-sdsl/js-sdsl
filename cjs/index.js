"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var LinkList_1 = __importDefault(require("./LinkList/LinkList"));
var Deque_1 = __importDefault(require("./Deque/Deque"));
var STL = {
    LinkList: LinkList_1.default,
    Deque: Deque_1.default
};
exports.default = STL;
