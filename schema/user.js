//定义表单数据验证规则的包
const joi = require('joi');

//定义验证规则
const username = joi.string().alphanum().min(1).max(10).required();
const password = joi.string().pattern(/^[\S]{6,12}$/).required();
// const id = joi.number().integer().min(1).required();
const nickname = joi.string().required();
const email = joi.string().email().required();
//头像，base64格式的字符串
//例：data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
const avatar = joi.string().dataUri().required();

//定义验证注册和登录表单数据的规则对象
exports.reg_login_schema = {
    body: {
        username,
        password,
    }
}

//定义更新用户信息的规则对象
exports.update_userinfo_schema = {
    body: {
        nickname,
        email,
    }
}

//重置密码
exports.update_password_schema = {
    body: {
        oldPwd: password,
        //新密码不能等于旧密码，其它验证规则不变
        newPwd: joi.not(joi.ref('oldPwd')).concat(password),
    }
}

//更换头像
exports.update_avatar_schema = {
    body: {
        avatar,
    }
}