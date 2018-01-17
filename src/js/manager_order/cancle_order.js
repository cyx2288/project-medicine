
$(function() {

    var urL = url();

    var orderCancle = 'backOrder/cancel';//取消订单

    var userId = $.cookie("bUserId");

    var storeId = $.cookie("bStoreId");

    var orderId=$.cookie("orderId");

    $('#submit_cancle').on("click",function () {

        var cancleReason=$('#cancle_reason').val()

        //订单列表
        $.ajax({
            url: urL + orderCancle,
            type: 'POST',
            data: {
                userId: userId,
                orderId:orderId,
                cancelCause: cancleReason,

            },
            success: function (res) {

                jfShowTips.toastShow({'text': "取消成功"});
                $.cookie('orderId', '', {expires: -1});

            },
            error: function (res) {
                console.log(res);
                jfShowTips.toastShow({'text': "系统繁忙，请稍后再试"})
            }
        })


    })






})