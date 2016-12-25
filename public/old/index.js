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
    //分类信息
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
                    var id = {
                        id: this.name[index]._id
                    }
                }else{
                    var id = {
                        id: null
                    }
                }
                //出发change事件，用来刷新content中的数据
                Bus.$emit('change', id);
            }
        },
        //生命周期钩子
        //由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
        //当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。
        updated: function () {
            $('#category li').click(function () {
                $('#category li').removeClass('active')
                $(this).addClass('active');
            })
        }
    });
    //内容列表
    var content = new Vue({
        el: '#content',
        data: {
            content : null,
            page: 0,
            pages: 0,
            limit: 0,
            count: 0,
            categoryId: null,
            onOff: true
        },
        methods: {
            getData: function (json) {
                var _this = this;
                var url = '';
                if(json){
                    //在首页中点击翻页按钮
                    if(json.page && !json.id){
                        url = '/api/main/contents?page='+json.page;
                    }
                    //切换分类
                    if(!json.page && json.id){
                        url = '/api/main/contents?id='+json.id;
                    }
                    //分类内点击翻页按钮
                    if(json.page && json.id){
                        url = '/api/main/contents?page='+json.page+'&id='+json.id;
                    }
                    //点击首页按钮
                    if(!json.page && !json.id){
                        url = '/api/main/contents';
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
            },
            jump: function (value) {
                console.log(value);
                this.onOff = false;
                Bus.$emit('aaa', value);
            }
        },
        created: function () {
            var _this = this;
            Bus.$on('change', function (value) {
                _this.categoryId = value.id;
                _this.getData(value)
            })
        }
    });
    //内容详情
    var particular = new Vue({
        el: "#particular",
        data: {
            onOff: false,
            content: null,
        },
        methods: {
            getData: function (value) {
                console.log("ok");
                var _this = this;
                $.ajax({
                    type: 'post',
                    url: '/api/main/particular',
                    data: {
                        id: value
                    },
                    success: function (data) {
                        //console.log(data);
                        _this.content = data.content;
                        console.log(_this.content)
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
        beforeCreate: function () {
            var _this = this;
            Bus.$on('aaa', function (value) {
                _this.onOff = true;
                _this.getData(value);
            })
        }
    })
    content.getData();
    category.getData();
};






