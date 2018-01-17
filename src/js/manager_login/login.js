
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
    var loginUrl = '/backUser/manager_login';
    var mobileNum;
    var psw;
    var userIds;
    var buType;

    var storeId;

    //验证手机号码
    $("#telNum").blur(function () {
        mobileNum = $("#telNum").val();
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
        mobileNum = $("#telNum").val();
        var psw1 = $('#pswNum').val();
        psw = $.md5($('#pswNum').val() + 'zbkj');
        console.log(psw);
        if (mobileNum == '') {
            jfShowTips.toastShow({'text':'账号不能为空'});
            return;
        }
        ;
        if (psw1 == '') {
            jfShowTips.toastShow({'text':'密码不能为空'});
            return;
        }
        ;
        if (psw == '') {
            jfShowTips.toastShow({'text':'密码不能为空'});
            return;
        }


        $.ajax({
            type: 'post',
            url: urL + loginUrl,
            data: {
                mobileNum: mobileNum,
                loginPsw: psw
            },
            success: function (res) {
                console.log(res);
                if (res.status !== 200) {
                    jfShowTips.toastShow({'text':res.msg});
                    return;
                }
                userIds = res.data.id;

                buType=res.data.buType;

                storeId=res.data.storeId;

                $.cookie('userId', userIds , { expires: 30 ,path: '/'});

                $.cookie('buType', buType , { expires: 30 ,path: '/'});

                $.cookie('storeId', storeId , { expires: 30 ,path: '/'});

                window.location.href = "../manager_order/order_list.html";

            },
            error: function () {
                console.log("登录失败")
                jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
            }
        });

    });

    //手机号正则表达式
    function checkTel(tel) {
        var reg = /^1[3|4|5|7|8][0-9]{9}$/;
        if (!reg.test(tel)) {
            jfShowTips.toastShow({'text':'手机号有误，请重新输入'});
            return false;
        }
    }
    //验证密码
    function checkPsw(psw) {
        var reg = /^[\w]{6,12}$/;
        if (!reg.test(psw)) {
            jfShowTips.toastShow({'text':'密码为6-16位'});
            return false;
        }
    }

});
