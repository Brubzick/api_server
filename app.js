const express = require('express');
const app = express();

const joi = require('joi');

app.use('/api', express.static(__dirname + '/public'));

//支持跨域访问的中间件
const cors = require('cors');
app.use(cors());

//配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件
app.use(express.urlencoded({ extended: false }));

//封装res.cc函数
app.use((req, res, next) => {
    //status默认为1，表示失败
    res.cc = function(err, status = 1) {
        res.send({
            status,
            //err的值可能是错误对象，也可能是一串字符串
            message: err instanceof Error ? err.message : err,
        });
    }
    next();
});

//导入配置文件
const config = require('./schema/config');
//导入，配置解析token的中间件
const expressJWT = require('express-jwt');
app.use(expressJWT({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api\//] }));


//导入并使用用户路由模块
const userRouter = require('./router/user');
app.use('/api', userRouter);
//导入并使用获取用户信息的路由模块
const userinfoRouter = require('./router/userinfo');
app.use('/my', userinfoRouter);


//定义错误级别的中间件
app.use((err, req, res, next) => {
    //验证失败导致的错误
    if (err instanceof joi.ValidationError) return res.cc(err);
    //身份认证失败的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！');
    //未知错误
    res.cc(err);
});

app.listen(3180, () => {
    console.log('api server running at http://127.0.0.1:3180');
})