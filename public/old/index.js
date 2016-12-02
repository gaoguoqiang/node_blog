/**
 * Created by hasee-pc on 2016/10/16.
 */
window.onload = function () {
    var Bus = new Vue();
    var user = new Vue({
        el: '#conter',
        data: {
            message:'',
            onOff: true,
            //登录表单信息
            loginInfo: {
                username: '',
                password: ''
            },
            //注册表单信息
            regInfo: {
                username: '',
                password: '',
                repassword: ''
            }
        },
        methods: {
            onoff: function () {
                this.onOff = !this.onOff;
                this.message = '';
            },
            //用户登录
            login: function () {
                $.ajax({
                    type: 'post',
                    url: '/api/user/login',
                    data: this.loginInfo,
                    dataType: 'json',
                    success: function (info) {
                        user.$data.message = info.message;
                        if(!info.code){
                            window.location.reload();
                        }
                    }
                })
            },
            //用户注册
            reg: function () {
                $.ajax({
                    type: 'post',
                    url: '/api/user/register',
                    data: this.regInfo,
                    success: function (info) {
                        user.$data.message = info.message;
                        if(!info.code){
                            setTimeout(function () {
                                user.$data.message = '';
                                user.$data.onOff = !user.$data.onOff;
                            }, 1000);
                        }
                    }
                })
            },
            //用户退出登录
            logout: function () {
                $.ajax({
                    type: 'get',
                    url: '/api/user/logout',
                    success: function (info) {
                        if(!info.code){
                            window.location.reload();
                        }
                    }
                })
            }
        }
    });

    var category = new Vue({
        el: '#category',
        data:{
            name: null
        },
        methods: {
            getData: function () {
                var _this = this;
                $.ajax({
                    type: 'post',
                    url: '/api/category/categories',
                    success: function (info) {
                        _this.name = info.categoryName;
                    }
                })
            },
            show: function (index) {
                if(index >= 0){
                    var id = this.name[index]._id;
                }else{
                    var id = null
                }

                Bus.$emit('change', id);
            }
        }
    });

    var content = new Vue({
        el: '#content',
        data: {
            content : null,
            page: 0,
            pages: 0,
            limit: 0,
            count: 0
        },
        methods: {
            getData: function (json) {
                var _this = this;
                var url = '';
                if(json){
                    if(json.page && !json.id){
                        url = '/api/main/contents?page='+json.page;
                    }
                    if(!json.page && json.id){
                        url = '/api/main/contents?id='+json.id;
                    }
                    if(json.page && json.id){
                        url = '/api/main/contents?page='+json.page+'&id='+json.id;
                    }
                }else{
                    url = '/api/main/contents';
                }
                $.ajax({
                    type: 'post',
                    url: url,
                    success: function (info) {
                        //console.log(info)
                        _this.content = info.contents;
                        _this.page = info.page;
                        _this.pages = info.pages;
                        _this.limit = info.limit;
                        _this.count = info.count;
                    }
                })
            },
            newTime: function (value) {
                var time = new Date(value),
                    year = time.getFullYear(),
                    month = time.getMonth()+1,
                    date = time.getDate(),
                    hours = time.getHours(),
                    min = time.getMinutes(),
                    seconds = time.getSeconds();
                var str = year + '年' + month + '月' + date + '日 ' + hours + ':' + min + ':' + seconds;
                return str;
            }
        },
        created: function () {
            var _this = this;
            Bus.$on('change', function (value) {
                if(value !== null){
                    _this.getData({
                        id:value
                    })
                }else{
                    _this.getData()
                }

            })
        }
    });
    content.getData();
    category.getData();
};



// $(function () {
//    var $reg = $('#reg');
//    var $login = $('#login');
//    var $userInfo = $('#userInfo');
//     $reg.find('a').on('click', function () {
//         $reg.hide();
//         $login.show();
//     });
//     $login.find('a').on('click', function () {
//         $reg.show();
//         $login.hide();
//     });
//     $reg.find('[name="submit"]').on('click',function () {
//         $.ajax({
//             type: 'post',
//             url: '/api/user/register',
//             data: {
//                 username: $reg.find('[name="username"]').val(),
//                 password: $reg.find('[name="password"]').val(),
//                 repassword: $reg.find('[name="repassword"]').val()
//             },
//             dataType: 'json',
//             success: function (data) {
//                 $reg.find('.info').html(data.message);
//                 if(!data.code){
//                     setTimeout(function () {
//                         $reg.hide();
//                         $login.show();
//                     },1000);
//                 }
//             }
//         });
//     });
//     $login.find('[name="submit"]').on('click',function () {
//         $.ajax({
//             type: 'post',
//             url: '/api/user/login',
//             data:{
//                 username: $login.find('[name="username"]').val(),
//                 password: $login.find('[name="password"]').val(),
//             },
//             dataType: 'json',
//             success: function (data) {
//                 $login.find('.info').html(data.message);
//
//                 if(!data.code) {
//                     setTimeout(function () {
//                         window.location.reload();
//                         /*$login.hide();
//                         $userInfo.show().find('.name').html(data.userInfo.username);
//                         $userInfo.find('.info').html('您好，欢迎光临我的个人博客');*/
//                     },1000);
//                 }
//
//             }
//         });
//     });
//     $userInfo.find('#logout').on('click', function () {
//         $.ajax({
//             type: 'get',
//             url: '/api/user/logout',
//             success: function (data) {
//                 if(!data.code){
//                     window.location.reload();
//                 }
//             }
//         })
//     })
// });


