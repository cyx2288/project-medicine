$(function () {
    var urL = url();

    //注册接口
    var userRegister = '/user/register';
    //发送验证码接口
    var userSendMsg = '/user/sendMsg';


    //获取文本框数据
    var mobileNum = '';
    var userRegisterpws = '';
    var msgNum = '';
    var hash = '';
    var tamp = '';
    var userIds = '';


    //验证手机号
    $('#user_registertel').blur(function () {
        mobileNum = $('#user_registertel').val();
        if (mobileNum == '') {
            return;
        };
        checkTel(mobileNum);
        return;
    });

    //验证密码
    $('#user_registerpws').blur(function () {
        userRegisterpws = $('#user_registerpws').val();
        if (userRegisterpws == '') {
            return;
        };
        checkPsw(userRegisterpws);
        return;
    })

    //推荐人手机号
    $('#recommend_tel').blur(function(){
        var referrerPhone = $('#recommend_tel').val();
        if (referrerPhone == '') {
            return;
        };
        checkTel(mobileNum);
        return;
    })


    //获取验证码
    verify(urL, userSendMsg, mobileNum);

    $('#login_register').click(function () {

        mobileNum = $('#user_registertel').val();
        msgNum = $('#user_registerverify').val();
        var userRegisterpws1 = $('#user_registerpws').val();
        userRegisterpws = $.md5($('#user_registerpws').val() + 'zbkj');
        var referrerPhone = $('#recommend_tel').val();
        if (mobileNum == '') {
            jfShowTips.toastShow('账号不能为空');
            return;
        };
        if (userRegisterpws1 == '') {
            jfShowTips.toastShow('登录密码不能为空');
            return;
        };
        if (msgNum == '') {
            jfShowTips.toastShow('验证码不能为空');
            return;
        };
        $.ajax({
            url: urL + userRegister,
            type: 'put',
            data: {
                mobileNum: mobileNum,
                psw: userRegisterpws,
                requestHash: hash,
                tamp: tamp,
                msgNum: msgNum,
                referrerPhone:referrerPhone
            },
            success: function (info) {
                console.log(info)
                if (info.status !== 200) {
                    jfShowTips.toastShow(info.msg);
                    return;
                }
                jfShowTips.toastShow(info.msg);

                //plus.storage.setItem('storeId', 1); //默认门店id，初始化使用。
                userIds = info.data.id;
                //plus.storage.setItem('userId', userIds);

                $.cookie('storeId', 1, {path: '/'});
                $.cookie('userId', userIds, {path: '/'});
                location.href = 'registerSuccess.html';
            },
            error: function (info) {

                console.log(info)
                jfShowTips.toastShow('系统繁忙，请稍后再试');
            }
        })
    })


    /*封装部分*/

    //1. 获取验证码
    function verify(urL, userSendMsg, mobileNum) {

        document.getElementById('user_sendMs').addEventListener('click',function () {
            mobileNum = $('#user_registertel').val();
            if(mobileNum == ''){
                jfShowTips.toastShow('账号不能为空');
                return;
            }

            $.ajax({
                url: urL + userSendMsg,
                type: 'get',
                data: {
                    mobileNum: mobileNum
                },
                success: function (info) {
                    console.log(info);
                    inputFn.inputCheck(60);//发送验证码

                    if (info.status == 200) {
                        hash = info.data.hash;
                        tamp = info.data.tamp;
                    }
                },
                error: function () {
                    jfShowTips.toastShow('系统繁忙，请稍后再试');
                }
            })
        },false)
    }

    //2. 手机号正则表达式
    function checkTel(tel) {
        var reg = /^1[3|4|5|7|8][0-9]{9}$/;
        if (!reg.test(tel)) {
            jfShowTips.toastShow('手机号有误，请重新输入');
            return false;
        }
    }

    //3. 验证密码
    function checkPsw(psw) {
        var reg = /^[\w]{6,12}$/;
        if (!reg.test(psw)) {
            jfShowTips.toastShow("密码为6-16位");
            return false;
        }
    }
})