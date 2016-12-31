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
                //点击不同的按钮，会有不同的json传输过来，所以要分情况对待
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
                //console.log(value);
                this.onOff = false;
                Bus.$emit('showParticular', value);
            }
        },
        created: function () {
            var _this = this;
            Bus.$on('change', function (value) {
                _this.categoryId = value.id;
                _this.getData(value);
                _this.onOff = true;
            })
        }
    });
    //内容详情
    var particular = new Vue({
        el: "#particular",
        data: {
            onOff: false,
            content: {},
            user: {},
            id: '',
            text: '',
            discuss: [],
            page:1,
            markdownContent: ''
        },
        computed: {
            //评论分页
            discussPage: function () {
                if(this.page <= 1){
                    this.page = 1;
                }else if(this.page >= Math.ceil(this.discuss.length/3)){
                    this.page = Math.ceil(this.discuss.length/3);
                }
                //console.log(this.page)
                return this.discuss.slice((this.page-1)*3,3*this.page);
            }  
        },
        methods: {
            /*
            * 有未知bug，大坑一个
            * json里嵌套json，会报错
            * */
            getData: function () {
                var _this = this;
                $.ajax({
                    type: 'post',
                    url: '/api/main/particular',
                    data: {
                        id: _this.id
                    },
                    success: function (data) {
                        _this.content = data.content;
                        _this.user = data.content.user;
                        _this.discuss = data.content.discuss;
                        _this.markdownContent = data.markdownContent;
                       //console.log(_this.discuss)
                    }
                })
            },
            //格式化时间
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
            //评论提交
            save: function () {
                var _this = this;
                if(_this.text == "" || _this.text.match(/^\s+$/)){
                    alert('评论不能为空！！！');
                }else{
                    $.ajax({
                        type: "post",
                        url: "/api/main/discussSave",
                        data: {
                            value: _this.text,
                            id: _this.id
                        },
                        success: function (data) {
                            _this.discuss = data;
                            _this.text = "";
                        }
                    })
                }
            }
        },
        //生命周期钩子
        beforeCreate: function () {
            var _this = this;

            Bus.$on('showParticular', function (value) {
                _this.onOff = true;
                _this.id = value;
                _this.getData();
            });
            Bus.$on('change', function (value) {
                _this.onOff = false;
            })
        }
    })
    content.getData();
    category.getData();
};






