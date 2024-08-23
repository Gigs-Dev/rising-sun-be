"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../../controller/user/auth.controller");
const router = (0, express_1.Router)();
router.post('/sendotp', auth_controller_1.sendOtp);
router.post('/createnewsession', auth_controller_1.newUser);
router.post('/session', auth_controller_1.login);
exports.default = router;
