/**
 * Created by hasee-pc on 2016/11/27.
 */
window.onload = function () {

    Vue.component('my-component', {
        template: '\
        <tr>\
            <td v-text="category._id"></td>\
            <td v-if="onOff" v-text="category.name"></td>\
            <td v-else><input class="form-control" type="text" v-model="category.name"></td>\
            <td v-if="onOff">\
                <a @click="onOff=false" href="javascript:;">修改</a> |\
                <a @click="del" href="javascript:;">删除</a>\
            </td>\
            <td v-else>\
                <a @click="save" href="javascript:;">保存</a> |\
                <a @click="cancel" href="javascript:;">取消</a>\
            </td>\
        </tr>\
        ',
        props: ['category'],
        data: function () {
            //给每一个组件返回自己的私有开关
            return{
                onOff: true
            }
        },
        methods:{
            save: function () {
                var _this = this;
                window.location.href = '/admin/category/edit?id='+_this.category._id+'&name='+_this.category.name;
            },
            cancel: function () {
                this.onOff = true;
                this.$emit('getData');
            },
            del: function () {
                var _this = this
                window.location.href = '/admin/category/remove?id='+_this.category._id;
            }
        }
    });
    var app1 = new Vue({
        el: '#app1',
        data:{
            categories: null,
            page: 0,
            pages: 0,
            limit: 0,
            count: 0
        },
        methods: {
            getData: function (json) {
                var _this = this;
                var url = json?'/api/category/categoryList?page=' + json.page:'/api/category/categoryList';
                $.ajax({
                    type: 'post',
                    url: url,
                    success: function (info) {
                        _this.categories = info.categories;
                        _this.page = info.page;
                        _this.pages = info.pages;
                        _this.limit = info.limit;
                        _this.count = info.count;
                    }
                })
            }
        }
    });
    app1.getData();

};