"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../../controller/user/user.controller");
const router = (0, express_1.Router)();
router.get('/referrals/:referalId', user_controller_1.getReferals);
router.patch('/', user_controller_1.creditReferer);
exports.default = router;
