/**
 * Created by hasee-pc on 2016/10/15.
 */

var express = require('express');
var router = express.Router();
var User = require('../models/User');

//统一返回数据的格式
var responseData;

router.use(function (req, res, next) {
    responseData = {
        code: 0,
        message: ''
    };
    next();
});
/*
* 用户注册
*   注册逻辑
* */
router.post('/user/register', function (req, res, next) {
   //console.log(req.body);
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;
    if(username == ''){
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }

    if(password == ''){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }

    if(repassword == ''){
        responseData.code = 3;
        responseData.message = '两次输入的密码不一致';
        res.json(responseData);
        return;
    }
    //用户名是否已经被注册了，如果数据库中已经存在和我们要注册的用户名相同的数据，表示用户名已经被注册了
    User.findOne({
        username:username
    }).then(function (userInfo) {
        console.log(userInfo)
       if(userInfo){
           //表示数据库中已有记录
           responseData.code = 4;
           responseData.message = '用户名已经被注册了';
           res.json(responseData);
           return;
       }
       var user = new User({
           username:username,
           password:password
       });
       return user.save();
    }).then(function (newUserInfo) {
        console.log(newUserInfo);
        responseData.message = '注册成功';
        res.json(responseData);
    });

});
//登录
router.post('/user/login', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    if(username == '' || password == ''){
        responseData.code = 1;
        responseData.message = '用户名或密码不能为空';
        res.json(responseData);
        return;
    }
    
    User.findOne({
        username:username,
        password:password
    }).then(function (userInfo) {
        if(!userInfo){
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        }
        responseData.message = '登录成功';
        responseData.userInfo = {
            id:userInfo._id,
            username:userInfo.username
        };
        req.cookies.set('userInfo', JSON.stringify({
            id:userInfo._id,
            username:userInfo.username
        }));
        res.json(responseData);
        return;
    })
});

module.exports = router;