$(function () {

    var urL = url();

    var changeStore='backOrder/changeSendUser';

    var str = window.location.search;

  //  var orderId = getOrderId(str);

    var userId = $.cookie("userId");

    var orderId=$.cookie("orderId");

    // 获取url上的参数值
    function getOrderId(str){

        var orderStr=str.toString().substr(4);

        return orderStr;
    }

    $('#selected_store').on('click',function () {

        var selectID=$('input:checked').attr('userId');

        $.ajax({

            url:urL+changeStore,

            type:"POST",

            data:{

                orderId:orderId,

                executorId :userId,

                sendUserId :selectID
            },
            success:function (res) {

                $.cookie('orderId', '', {expires: -1});

                window.location.href='order_details.html';

            },
            error:function (res) {

                jfShowTips.toastShow({'text':'系统繁忙请稍后'});

            }

        })




    });





})