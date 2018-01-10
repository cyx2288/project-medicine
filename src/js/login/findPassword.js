$(function(){
    var urL = url();

    //找回密码接口
    var userUpdatePsw = '/user/updatePsw';
    //发送验证码
    var userSendMsg = '/user/sendMsg';

    var mobileNum = '';
    var userUpdatepsw = '';

    var hash = '';
    var tamp = '';
    var user_updateverify = '';

    //验证手机号
    $('#user_updatetel').blur(function(){
        mobileNum = $('#user_updatetel').val();
        if(mobileNum == ''){
            return;
        };
        checkTel(mobileNum);
    });

    //验证密码
    $('#user_updatenew').blur(function(){
        userUpdatepsw = $('#user_updatenew').val();
        if(userUpdatepsw == ''){
            return;
        };
        checkPsw(userUpdatepsw);
    });

    //获取验证码
    $('#user_updateget').click(function(){
        mobileNum = $('#user_updatetel').val();
        if(mobileNum == ''){
            jfShowTips.toastShow('账号不能为空');
            return;
        };
        $.ajax({
            url:urL + userSendMsg,
            async:false,
            data:{
                mobileNum:mobileNum
            },
            success:function(info){
                console.log(info);
                inputFn.inputCheck(60);//发送验证码
                if(info.status !==200){
                    jfShowTips.toastShow(info.msg);
                    return;
                }
                hash = info.data.hash;
                tamp = info.data.tamp;
            },
            error: function() {
                jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
            }
        })
    })

    //修改密码
    $('#findPassword_button').click(function(){
        mobileNum = $('#user_updatetel').val();
        userUpdatepsw = $.md5($('#user_updatenew').val() + 'zbkj');
        user_updateverify = $('#user_updateverify').val();
        if(mobileNum == ''){
            jfShowTips.toastShow('账号不能为空');
            return;
        };
        if(userUpdatepsw == ''){
            jfShowTips.toastShow('账号不能为空');
            return;
        };
        if(user_updateverify == ''){
            jfShowTips.toastShow('账号不能为空');
            return;
        };
        $.ajax({
            url:urL + userUpdatePsw,
            type:'post',
            data:{
                mobileNum:mobileNum,
                psw:userUpdatepsw,
                requestHash:hash,
                tamp:tamp,
                msgNum:user_updateverify
            },
            success:function(info){
                console.log(info);
                if(info.status !== 200){
                    jfShowTips.toastShow(info.msg);
                    return;
                };
                //jfShowTips.toastShow(info.msg);
                window.location.href = "../homepage/main.html";
            },
            error: function() {
                jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
            }
        })
    })


    /*封装部分*/

    //1. 手机号正则表达式
    function checkTel(tel){
        var reg = /^1[3|4|5|7|8][0-9]{9}$/;
        if(!reg.test(tel)){
            jfShowTips.toastShow('手机号有误，请重新输入');
            return false;
        }
    }

    //2. 验证密码
    function checkPsw(psw){
        var reg = /^[\w]{6,12}$/;
        if(!reg.test(psw)){
            jfShowTips.toastShow("密码为6-16位");
            return false;
        }
    }

})