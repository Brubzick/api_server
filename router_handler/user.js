//导入数据库模块
const db = require('../db/index');
//加密密码的模块
const brcypt = require('bcryptjs');
//导入生成token的包
const jwt = require('jsonwebtoken');
//导入全局的配置文件
const config = require('../schema/config');

//注册的处理函数
exports.register = (req, res) => {
    userinfo = req.body;
    const sqlStr = 'select * from users where username=?';
    db.query(sqlStr, userinfo.username, (err, results) => {
        if (err) {
            //res.cc函数封装在app.js中
            return res.cc(err);
        }
        //判断用户名已被占用
        if (results.length > 0) {
            return res.cc('用户名已被占用')
        }
        //用户名可用
        //加密用户密码
        userinfo.password = brcypt.hashSync(userinfo.password, 10);
        //插入用户信息
        const sql = 'insert into users set ?';
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍候再试！');
            //成功
            res.cc('注册成功', 0);
        });
    })
}

//登录的处理函数
exports.login = (req, res) => {
    userinfo = req.body;
    //根据用户名查询用户信息
    const sqlStr = 'select * from users where username=?';
    db.query(sqlStr, userinfo.username, (err, results) => {
        if (err) return res.cc(err);
        //获取到的数据条数不等于1
        if (results.length !== 1) return res.cc('登录失败！');
        //判断密码是否正确，需要用compareSync()解码
        const compareResult = brcypt.compareSync(userinfo.password, results[0].password);
        if (!compareResult) return res.cc('密码错误！');
        //生成token
        //去除敏感信息，例如剔除密码和头像的值
        const user = {...results[0], password: '', user_pic: '' };
        //对用户信息加密，生成token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn });
        //把token响应给客户端
        res.send({
            status: 0,
            message: '登录成功',
            token: 'Bearer ' + tokenStr,
        });
    });
}