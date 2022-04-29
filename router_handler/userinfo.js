const db = require('../db/index');
const bcrypt = require('bcryptjs');

//获取用户信息
exports.getUserInfo = (req, res) => {
    const sql = 'select id, username, nickname, email, user_pic from bwc_users where id=?';
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc('获取用户信息失败！');
        //成功
        res.send({
            status: 0,
            message: '获取用户信息成功！',
            data: results[0],
        });
    })
}

//更新用户信息
exports.updateUserInfo = (req, res) => {
    const sql = 'update bwc_users set ? where id=?';
    db.query(sql, [req.body, req.user.id], (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('更新用户信息失败！');
        //成功
        res.cc('更新用户信息成功！', 0);
    });
}

//重置密码
exports.updatePassword = (req, res) => {
    //先查询用户信息
    const sql = 'select * from bwc_users where id=?';
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc('用户不存在');
        //判断旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password);
        if (!compareResult) return res.cc('旧密码错误');
        //更新密码
        const sql2 = 'update bwc_users set password=? where id=?';
        newPwd = bcrypt.hashSync(req.body.newPwd, 10);
        db.query(sql2, [newPwd, req.user.id], (err, results) => {
            if (err) return res.cc(err);
            if (results.affectedRows !== 1) return res.cc('更新失败！');
            //成功
            res.cc('更新密码成功！', 0);
        });
    })
}

//更换头像
exports.updateAvatar = (req, res) => {
    const sql = 'update bwc_users set user_pic=? where id=?';
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        if (err) return res.cc(err);
        if (results.affectedRows !== 1) return res.cc('更换头像失败！');
        //成功
        res.cc('修换头像成功！', 0);
    });
}