$(function () {

    var urL = url();

    var ticketsList="coupon/backorder/list";//优惠券

    var redPackage="manager_order/redPackage";//红包信息

    var partBack="manager_order/partBack";//提交并修改

    var orderGoods='/backOrder/goods';//订单商品信息

    var userId = $.cookie("userId");

    var orderId=$.cookie("orderId");

    var shouldPay=$.cookie("shouldPay");

    var orderAmount=$.cookie("orderAmount");//订单总额

    var couponsId=$.cookie("couponsId");//卡券ID


    //订单商品信息
    $.ajax({
        url:url+orderGoods,
        type:'get',
        data:{
            orderId:orderId
        },
        success:function (res) {
            console.log(res);
            if(res.status !== 200){
                jfShowTips.toastShow({'text':res.data});
                return;
            };

            var html = template('goodsList', {list: res.data});
            $('#return_goods').html(html);

            $('#shouldPay').text(shouldPay+'元');

            $.cookie('shouldPay', '', {expires: -1});


        },
        error:function (res) {

            console.log(res);
            jfShowTips.toastShow({'text': "系统繁忙，请稍后再试"})

        }

    });

    var TotalMonay;


    $('.goodsChoose').on("click",function () {

        if($('.goosbox').is(':checked')){

            console.log($('.goosbox').is(':checked'))

        }


    })


    ticketShow(orderAmount);

    function ticketShow() {
        //优惠券初始化
        $.ajax({
            url:url+ticketsList,
            type:'get',
            data:{
                orderId:orderId,
                orderTotal:orderAmount,
                couponId:couponsId
            },
            success:function (res) {

                console.log(res);

                var html = template('couponList', {list: res.data});

                $('#select_couponId').html(html);

            },
            error:function (res) {

                console.log(res);
                jfShowTips.toastShow({'text': "系统繁忙，请稍后再试"})

            }
        })
    }










})