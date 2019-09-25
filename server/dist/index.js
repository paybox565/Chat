"use strict";
exports.__esModule = true;
var chat_server_1 = require("./chat-server");
var app = new chat_server_1.ChatServer().getApp();
exports.app = app;
