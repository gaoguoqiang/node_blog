/**
 * Created by hasee-pc on 2016/11/27.
 */

window.onload = function () {

    Vue.component('my-component', {
        template: '\
        <tr>\
            <td v-text="content._id"></td>\
            <td v-text="content.category.name"></td>\
            <td v-text="content.title"></td>\
            <td v-text="content.user.username"></td>\
            <td>{{content.addTime | date}}</td>\
            <td v-text="content.views"></td>\
            <td>\
                <a :href="\'/admin/content/edit?id=\' + content._id">修改</a> |\
                <a :href="\'/admin/content/delet?id=\' + content._id">删除</a>\
            </td>\
        </tr>\
        ',
        props: ['content']
    });
    /*
    * 在vue2.*中，filter只能使用在“{{string | filter}}”表达式中,如果要在指令中使用filter过滤器，请使用计算属性
    * */
    Vue.filter('date', function (value) {
        var time = new Date(value),
            year = time.getFullYear(),
            month = time.getMonth()+1,
            date = time.getDate(),
            hours = time.getHours(),
            min = time.getMinutes(),
            seconds = time.getSeconds();
        var str = year + '年' + month + '月' + date + '日 ' + hours + ':' + min + ':' + seconds;
        return str;
    });


    var app1 = new Vue({
        el: '#app',
        data:{
            contents: null,
            page: 0,
            pages: 0,
            limit: 0,
            count: 0
        },
        methods: {
            getData: function (json) {
                var _this = this;
                var url = json?'/api/content/contentList?page=' + json.page:'/api/content/contentList';
                $.ajax({
                    type: 'post',
                    url: url,
                    success: function (info) {
                        _this.contents = info.contents;
                        _this.page = info.page;
                        _this.pages = info.pages;
                        _this.limit = info.limit;
                        _this.count = info.count;
                    }
                })
            }
        }
    });
    app1.getData()


};