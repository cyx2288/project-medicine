$(function(){

    var mobileNum;
    var msgNum;


    if (window.plus) {
        plusReady();
    } else {
        document.addEventListener('plusready', plusReady, false);
    }

    // H5 plus事件处理
    function plusReady() {
        // 设置cookie
    }


    //验证手机号码
    $("#phNum").blur(function(){
        mobileNum = $("#phNum").val();
        if(mobileNum == ''){
            return;
        };
        checkTel(mobileNum);
        return;
    });




    //验证并登陆
    $("#verifyLogin").on('click',function(){
        mobileNum = $("#phNum").val();
        msgNum = $("#sendMsgNum").val();
        if(mobileNum == ''){
            jfShowTips.toastShow({'text':'账号不能为空'});
            return;
        };
        if(msgNum == ''){
            jfShowTips.toastShow({'text':'验证码不能为空'});
            return;
        };

    });


    // 手机号正则表达式
    function checkTel(tel){
        var reg = /^1[3|4|5|7|8][0-9]{9}$/;
        if(!reg.test(tel)){
            jfShowTips.toastShow({'text':'手机号有误，请重新输入'});
            return false;
        }
    }



});
