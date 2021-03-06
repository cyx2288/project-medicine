
$(function() {

    var urL = url();
    var loginUrl = '/backUser/login';
    var mobileNum;

    //验证手机号码
    $("#telNum").blur(function () {
        mobileNum = $("#telNum").val();
        if (mobileNum == '') {
            return;
        }
        checkTel(mobileNum);
        return;
    });


    //登陆系统
    $("#logSystem").on('click', function lonIn() {
        mobileNum = $("#telNum").val();
        var psw1 = $('#pswNum').val();
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



        $.ajax({
            type: 'post',
            url: urL + loginUrl,

            data: {
                mobileNum: mobileNum,
                loginPsw: psw1
            },
            success: function (res) {

                if(res.status==200){

                    $.cookie('bUserId',res.data.id , { expires: 30 ,path: '/'});

                    $.cookie('bStoreId',res.data.storeId , { expires: 30 ,path: '/'});

                    $.cookie('bType',res.data.buType , { expires: 30 ,path: '/'});

                    setTimeout(function(){

                        if(res.data.buType==11) {
                            document.location.href = '../manager_order/order_list.html'
                        }
                        else if(res.data.buType==21){


                        }


                    },50)

                }

                jfShowTips.toastShow({'text': res.msg });


            },
            error: function (res) {

                console.log(res)

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


});
