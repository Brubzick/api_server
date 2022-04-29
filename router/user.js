const express = require('express');
//创建路由对象
const router = express.Router();

//导入处理函数对应的模块
const user_handler = require('../router_handler/user');

//导入验证数据的中间件
const expressJoi = require('@escook/express-joi');
//导入需要验证的规则对象
const { reg_login_schema } = require('../schema/user');

//注册
router.post('/register', expressJoi(reg_login_schema), user_handler.register);

//登录
router.post('/login', expressJoi(reg_login_schema), user_handler.login);

module.exports = router;