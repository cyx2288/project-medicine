$(function () {

    var urL = url();

    var orderInfo='/backOrder/info';//订单基本信息

    var orderGoods='/backOrder/goods';//订单商品信息

    var orderLog='/backOrder/log';//订单日志信息

    var sendOver='/backOrder/sendOver';//确认送达

    var changeStore='/backOrder/changeStore';//更换门店

    var userId = $.cookie("userId");

    var buType = $.cookie("buType");

    var storeId = $.cookie("storeId");

    var str = window.location.search;

    var orderId = getOrderId(str);

    $.cookie('orderId', orderId , {expires: -1});



    // 获取url上的参数值
    function getOrderId(str){

       var orderStr=str.toString().substr(4);

       return orderStr;
    }

    //订单基本信息
    $.ajax({
        url:url+orderInfo,
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

            $('#order_time').text(res.data.createTime);//创建时间

            $('#order_status').text(res.data.status);//订单状态

            var OrderStu=res.data.status.toString();

            if(OrderStu.indexOf('配送中')>-1){//配送中状态

                if(buType.indexOf('配送员')>-1){//配送员

                    $('#choose_sender').css('display','none');

                    $('.confirm_delivery').removeClass('cancle_order');

                    $('.confirm_delivery').on('click',function () {//点击确认送达

                        $('#order_retutn').removeClass('weui_btn_default').addClass('weui_btn_warn');//确认退货按钮可以点击

                        $('#order_status').text('已送达');

                        $(this).css('display','none');//送达按钮取消

                        $.ajax({
                            url:url+sendOver,
                            type:'POST',
                            data:{
                                orderId:orderId,
                                executorId:userId
                            },
                            success:function (res) {
                                jfShowTips.toastShow({'text': '送达成功'});
                            },
                            error:function (res) {

                                console.log(res)
                            }

                        })

                    })
                }else {//客服人员

                    $('#choose_sender').css('display','block');

                    $('.cancle_order').text('取消订单').removeClass('weui_btn_default').removeClass('confirm_delivery').addClass('weui_btn_warn');

                    $('.order_retutn').text('更换门店');

                    $('.order_retutn').on('click',function () {//更换门店

                        window.location.href= "choose_store.html"
                    });

                    $('#choose_sender').on('click',function () {//更换配送员

                        window.location.href= "choose_deilver.html"
                    });

                    $('.cancle_order').on("click",function () {//取消订单

                        window.location.href= "cancle_order.html"

                    })
                    

                }



            }

            $('#order_address').text(res.data.cneeInfo);//订单地址

            $('#orderNum').text(res.data.orderCode);//订单号

            $('#orderPay').text(res.data.payMode);//支付方式

            $('#orderDiscount').text(res.data.couponsAmount);//券抵扣金额

            $('#invoice').text(res.data.invoiceInfo);//发票信息

            $('#remark').text(res.data.orderRemarks);//备注

            $('#should_pay').text(res.data.shouldPay);//应收金额

            var shouldPay=$('#should_pay').text();

            $.cookie('shouldPay', shouldPay , {expires: -1});

            var orderAmount=res.data.orderAmount;//订单总额

            var couponsId=res.data.couponsId;//卡券ID

            $.cookie('orderAmount', orderAmount , {expires: -1});

        },
        error:function (res) {

            console.log(res);
            jfShowTips.toastShow({'text': "系统繁忙，请稍后再试"})

        }

    })


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

            var html = template('orderGoosList', {list: info.data});
            $('#order_goods').html(html);


        },
        error:function (res) {

            console.log(res);
            jfShowTips.toastShow({'text': "系统繁忙，请稍后再试"})

        }

    })



    //订单日志信息
    $.ajax({
        url:url+orderLog,
        type:'get',
        data:{
            orderId:orderId
        },
        success:function (res) {

            console.log(res);

            var html=template('orderInfoLog',{list: info.data});

            $('#order_log').html(html)

        },
        error:function (res) {

            console.log(res);

            jfShowTips.toastShow({'text': "系统繁忙，请稍后再试"})
        }

    })





})