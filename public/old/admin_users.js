/**
 * Created by hasee-pc on 2016/11/27.
 */
window.onload = function () {
    var usersList = new Vue({
        el: '#users',
        data: {
            users: null,
            page: 0,
            pages: 0,
            limit: 0,
            count: 0
        },
        methods: {
            getData: function (json) {
                var _this = this;
                var url = json?'/api/user/usersList?page=' + json.page:'/api/user/usersList';
                // if(json){
                //     url = '/api/user/usersList?page=' + json.page;
                // }else{
                //     url = '/api/user/usersList';
                // }
                $.ajax({
                    type: 'post',
                    url: url,
                    success: function (info) {
                        //console.log(typeof info.page)
                        _this.users = info.users;
                        _this.page = info.page;
                        _this.pages = info.pages;
                        _this.limit = info.limit;
                        _this.count = info.count;
                    }
                })
            }
        }
    });
    usersList.getData();
};