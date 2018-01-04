
$(function() {


    if (window.plus) {
        plusReady();
    } else {
        document.addEventListener('plusready', plusReady, false);
    }

    // H5 plus事件处理
    function plusReady() {
        // 设置cookie
    }

    var urL = url();
    var loginUrl = '/user/login';
    var mobileNum;
    var psw;
    var userIds

    //验证手机号码
    $("#phNum").blur(function () {
        mobileNum = $("#phNum").val();
        if (mobileNum == '') {
            return;
        }
        checkTel(mobileNum);
        return;
    });

    //验证密码
    $("#pswNum").blur(function () {
        psw = $("#pswNum").val();
        if (psw == '') {
            return;
        }
        checkPsw(psw);
        return;
    });

    //登陆系统
    $("#logSystem").on('click', function lonIn() {
        mobileNum = $("#phNum").val();
        var psw1 = $('#pswNum').val();
        psw = $.md5($('#pswNum').val() + 'zbkj');
        console.log(psw);
        if (mobileNum == '') {
            alert('账号不能为空');
            return;
        }
        ;
        if (psw1 == '') {
            alert('密码不能为空');
            return;
        }
        ;
        if (psw == '') {
            alert('密码不能为空');
            return;
        }
        $.ajax({
            type: 'post',
            url: urL + loginUrl,
            data: {
                mobileNum: mobileNum,
                psw: psw
            },
            success: function (res) {
                console.log(res);
                if (res.status !== 200) {
                    alert(res.msg);
                    return;
                }
                userIds = res.data.id;
                //plus.storage.setItem("userId",userIds);
                //var foo = plus.storage.getItem("userId");
                //alert(foo);
                // $.cookie('userId', userIds , { expires: 30 ,path: '/'});
                console.log(plus)
                plus.navigator.setCookie('login_system.html', 'userId=' + userIds + '; expires=60; path=/');
                window.location.href = "../homepage/main.html";

            },
            error: function () {
                alert('系统繁忙，请稍后再试');
            }
        });

    });


    //手机号正则表达式
    function checkTel(tel) {
        var reg = /^1[3|4|5|7|8][0-9]{9}$/;
        if (!reg.test(tel)) {
            alert('手机号有误，请重新输入');
            return false;
        }
    }

    //验证密码
    function checkPsw(psw) {
        var reg = /^[\w]{6,12}$/;
        if (!reg.test(psw)) {
            alert("密码为6-16位");
            return false;
        }
    }

    //跳转短信验证码登录
    $("#messageLogin").click(function () {
        window.location.href = "messageLogin.html";
    });
    //跳转找回密码页面
    $("#findPassword").click(function () {
        window.location.href = "findPassword.html";
    });
    //跳转注册页面
    $("#nowLogin").click(function () {
        window.location.href = "userLogin.html";
    });

});
