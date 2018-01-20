$(function () {

    var urL = url();//服务器地址

    var orderList = '/backOrder/info';//订单列表

    var orderPro='/backOrder/goods';//商品列表

    var log='/backOrder/log';//辅助信息

    var sendOver='/backOrder/sendOver';//订单确认送达

    var orderId = document.location.hash.slice(4);//截取hash内容

    var userId = $.cookie("bUserId");//拿到用户id

    var details;//订单信息缓存

    $.ajax({
        url: urL + orderList,
        type: 'get',
        data: {

            orderId: orderId

        },
        success: function (res) {

            console.log(res);

            details=res.data;//缓存订单信息

            /*页面数据填充*/
            showHtml('order_time', details.createTime);//订单时间

            showHtml('order_address', details.cneeInfo);//收货人

            showHtml('orderNum',details.orderCode);//订单编号

            showHtml('order_status', showStatus(details.status));//订单状态

            showHtml('orderPay', showPayMode(details.payMode));//支付方式

            showHtml('orderDiscount',details.couponsAmount);//优惠券

            showHtml('redpacketAmount',details.redpacketAmount);//购物红包

            showHtml('cashAmount',details.cashAmount);//现金红包

            showHtml('invoice',details.invoiceInfo+','+details.invoiceTitle+','+showInvoiceType(details.invoiceType));//发票抬头

            showHtml('remark',details.orderRemarks);//备注

            showHtml('should_pay',details.realPay);//备实际支付金额

            showButton(details.status);//按照订单状态显示按钮


            /*写页面方法，参数1为元素id，参数2是页面填充html内容*/
            function showHtml(id, html) {

                document.getElementById(id).innerHTML = html;

            }


            /*显示按钮的方法，参数为状态*/
            function showButton(num) {

                if(num==11){

                    document.getElementById('order_check').style.display='block';

                    document.getElementById('order_return').style.display='none'

                    document.getElementById('order_check').addEventListener('click',function () {


                        $.confirm({
                            title: '标题',
                            text: '内容文案',
                            onOK: function () {
                                $.ajax({
                                    type: 'post',
                                    url: urL + sendOver,

                                    data: {
                                        orderId: details.id,
                                        executorId: userId
                                    },
                                    success: function (res) {

                                        console.log(res);

                                        window.location.reload()

                                    },

                                    error: function (res) {

                                        console.log(res)

                                        jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});

                                    }
                                })
                            },
                            onCancel: function () {
                            }
                        });



                    },false)

                }

                else if(num==21||num== 24 ||num==27){

                    document.getElementById('order_return').style.display='block';

                    document.getElementById('order_check').style.display='none';

                }

            }


            //订单状态
            function showStatus(num) {
                if (num == 11)
                    return '分拣完成'
                else if (num == 1)
                    return '代付款'
                else if (num == 7)
                    return '已付款'
                else if (num == 21)
                    return '送达'
                else if (num == 31)
                    return '已完成（无退款）'
                else if (num == 24)
                    return '部分退'
                else if (num == 27)
                    return '全退'
                else if (num == 4)
                    return '已取消'
                else if (num == 0)
                    return '失败单'
                else if (num == -1)
                    return '过程单'
                else
                    return '其他'
            }

            /*支付方式*/
            function showPayMode(num){
                if (num == 1)
                    return '微信'
                else if (num == 2)
                    return '支付宝'
                else if (num == 3)
                    return '货到付款'
                else
                    return '其他'
            }

            /*发票抬头*/
            function showInvoiceType(num){
                if (num == 1)
                    return '个人'
                else if (num == 2)
                    return '公司'
                else if (num == 3)
                    return '以后统一开票'
                else
                    return '其他'

            }


        },

        error: function (res) {

            console.log(res);

            jfShowTips.toastShow({'text': "系统繁忙，请稍后再试"})

        }

    });


    //商品

    $.ajax({

        url: urL + orderPro,
        type: 'get',
        data: {

            orderId: orderId

        },

        success: function (res) {

            console.log(res)

            var html = template('orderGoosList', {list: res.data});

            document.getElementById('order_goods').innerHTML=html


        },

        error: function (res) {

            console.log(res);

            jfShowTips.toastShow({'text': "系统繁忙，请稍后再试"})

        }

    });



    //日志

    $.ajax({

        url: urL + log,
        type: 'get',
        data: {

            orderId: orderId

        },

        success: function (res) {

            console.log(res)

            var html = template('orderInfoLog', {list: res.data});

            document.getElementById('order_log').innerHTML=html


        },

        error: function (res) {

            console.log(res);

            jfShowTips.toastShow({'text': "系统繁忙，请稍后再试"})

        }

    });

    /*


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
     */


})