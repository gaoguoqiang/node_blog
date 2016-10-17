/**
 * Created by hasee-pc on 2016/10/16.
 */

$(function () {
   var $reg = $('#reg');
   var $login = $('#login');
   var $userInfo = $('#userInfo');
    $reg.find('a').on('click', function () {
        $reg.hide();
        $login.show();
    });
    $login.find('a').on('click', function () {
        $reg.show();
        $login.hide();
    });
    $reg.find('[name="submit"]').on('click',function () {
        $.ajax({
            type: 'post',
            url: '/api/user/register',
            data: {
                username: $reg.find('[name="username"]').val(),
                password: $reg.find('[name="password"]').val(),
                repassword: $reg.find('[name="repassword"]').val()
            },
            dataType: 'json',
            success: function (data) {
                $reg.find('.info').html(data.message);
                if(!data.code){
                    setTimeout(function () {
                        $reg.hide();
                        $login.show();
                    },1000);
                }
            }
        });
    });
    $login.find('[name="submit"]').on('click',function () {
        $.ajax({
            type: 'post',
            url: '/api/user/login',
            data:{
                username: $login.find('[name="username"]').val(),
                password: $login.find('[name="password"]').val(),
            },
            dataType: 'json',
            success: function (data) {
                $login.find('.info').html(data.message);

                if(!data.code) {
                    setTimeout(function () {
                        window.location.reload();
                        /*$login.hide();
                        $userInfo.show().find('.name').html(data.userInfo.username);
                        $userInfo.find('.info').html('您好，欢迎光临我的个人博客');*/
                    },1000);
                }

            }
        });
    });
});


