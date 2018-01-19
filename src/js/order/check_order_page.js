
$(function(){
    var urL = url();
    var orderId = getProductid(location.search);
    //var orderId = 5;
    console.log(orderId);

    //订单基本信息
    var orderInfo = '/order/info';
    //订单商品信息
    var orderGoods = '/order/goods';
    //优惠券
    var coupon = '/coupon/';

    var accessToken='/wechat/portal/getAccessToken';

    var userOpenid;

    //支付接口
    var wxPay='/pay/wxPay';//微信

    var zfbApp='/pay/aliAPP';//支付宝APP

    var zfbWeb='/pay/aliWeb';//支付宝网页

    var wxChannel = null; // 微信支付
    var aliChannel = null; // 支付宝支付
    var channel = null;   //支付通道
// 1. 获取支付通道
    function plusReady(){
        // 获取支付通道
        plus.payment.getChannels(function(channels){
            for (var i in channels) {
                if (channels[i].id == "wxpay") {
                    wxChannel=channels[i];
                }else{
                    aliChannel=channels[i];
                }
            }
        },function(e){
            alert("获取支付通道失败："+e.message);
        });
    }
    document.addEventListener('plusready',plusReady,false);

//获取access_token以及openid
    $.ajax({
        url:urL+accessToken,
        type:'get',
        success:function (info) {

            var accessToken=info.data.access_token;

            console.log(info)

            console.log(accessToken)

       /*     $.ajax({
                url:'https://api.weixin.qq.com/cgi-bin/user/info',
                type:'get',
                data:{
                    access_token:accessToken
                },
                success:function (res) {
                    console.log(res)

                }
            })*/


        },
        error:function (info) {
            console.log('获取失败')
            console.log(info)
        }

    });


  /*  $.ajax({
        url:'https://api.weixin.qq.com/cgi-bin/token',
        type:'get',
        dataType:'jsonp',
        jsonp : 'callback', //指定一个查询参数名称来覆盖默认的 jsonp 回调参数名 callback
        jsonpCallback: 'handleResponse', //设置回调函数名
        data:{
            grant_type:"client_credential",
            appid:"wxa65cb239c6a0b470",
            secret:"c53390da60d0c82e72dc5a94feea763a"
        },
        success:function (info) {
            console.log(info);
        },
        error:function (info) {
            console.log('获取失败')
            console.log(info)
        }

    });*/


    //订单基本信息
    $.ajax({
        url:urL + orderInfo,
        data:{
            orderId:orderId
        },
        success:function(info){
            console.log(info);
            //地址
            var addressArray = info.data.cneeInfo.split(',');
            $('.address_select_name').text(addressArray[0]);
            $('.address_select_phone').text(addressArray[1]);
            $('.address_select_address').text(addressArray[2]);
            //付款方式
            if( info.data.payMode == '1'){
                $('.order_page_payMode').text('微信支付');
                $('.payMode').text('微信支付');
                $('.payMode').attr('data-payMode',info.data.payMode);
            }else if(info.data.payMode == '2'){
                $('.order_page_payMode').text('支付宝支付');
                $('.payMode').text('支付宝支付');
                $('.payMode').attr('data-payMode',info.data.payMode);
            }else if(info.data.payMode == '3'){
                $('.order_page_payMode').text('货到付款');
                $('.payMode').text('货到付款');
                $('.payMode').attr('data-payMode',info.data.payMode);
            };
            //优惠券信息
            $.ajax({
                url:urL + coupon + info.data.couponsId,
                success:function(info1){
                    if(info1.status !== 200){

                        $('.couponMsg').html('暂无优惠')

                        console.log(info1.mag)
                        //jfShowTips.toastShow(info1.mag);
                        return;
                    }
                    console.log(info1);
                    $('.couponMsg').html('满<i>'+info1.data.conditions+'元</i>减<i>'+info1.data.deduction+'元</i>')

                }
            })

            //发票信息
            $('.order_page_title').text(info.data.invoiceTitle + ',' + info.data.invoiceInfo);
            //备注
            $('.order_page_note').text(info.data.orderRemarks);

            //总金额
            $('.totalPrices').text('¥'+ info.data.orderAmount);
            //券、红包抵扣金额
            if(info.data.couponsAmount && info.data.redpacketAmount&&info.data.cashAmount){
                $('.couponsPrices').html('用券抵扣<span>'+info.data.couponsAmount+'元</span>' + ',' + '用购物红包抵扣<span>'+info.data.redpacketAmount+'元</span>'+ ',' + '用现金红包抵扣<span>'+info.data.cashAmount+'元</span>')
            }else if(info.data.couponsAmount){
                $('.couponsPrices').html('用券抵扣<span>'+info.data.couponsAmount+'元</span>')
            }else if(info.data.redpacketAmount){
                $('.couponsPrices').html('用购物红包抵扣<span>'+info.data.redpacketAmount+'元</span>')
            }else if(info.data.cashAmount){

                $('.couponsPrices').html('用购物红包抵扣<span>'+info.data.cashAmount+'元</span>')
            }

            //应付金额
            $('.amountPayable').text('¥' + info.data.realPay);


            //去支付
            $('.payMode').click(function(){

                var orderNote= $('.order_page_note').text();//订单备注

                var orderFee= $('.amountPayable').text().toString().substr(1);//订单金额

               if(info.data.payMode == '1'){//微信支付

             /*       var  wxPayObj={
                        orderId:orderId,
                        bodyInfo:orderNote,
                        subject: '订单标题测试',
                        deviceInfo: '订单信息测试',
                        tradeType:'JSAPI',//-公众号为JSAPI，H5为MWEB
                        openid:'',
                        spBillIp:returnCitySN.cip,
                        fee:orderFee
                    };

                    var wxCheckPay = {
                        payVO: wxPayObj
                    };

                   if(browser.supplier.weixin){//公总号支付

                       console.log(wxCheckPay)



                        //支付信息
                        $.ajax({
                            url:urL + wxPay,
                            type: 'post',
                            data:JSON.stringify(wxCheckPay),
                            contentType: "application/json;charset=UTF-8",
                            success:function(info){
                                console.log("12")
                                console.log(info);
                                function onBridgeReady(info){
                                    WeixinJSBridge.invoke(
                                        'getBrandWCPayRequest',{
                                            "appId":info.data.appId,     //公众号名称，由商户传入
                                            "timeStamp":info.data.timeStamp,         //时间戳，自1970年以来的秒数
                                            "nonceStr":info.data.nonceStr, //随机串
                                            "package":info.data.package,
                                            "signType":info.data.signType,         //微信签名方式：
                                            "paySign":info.data.paySign //微信签名
                                        },
                                        function(res){
                                            if(res.err_msg == "get_brand_wcpay_request:ok" ) {}     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                                        }
                                    );
                                }

                                console.log(typeof WeixinJSBridge == "undefined")
                                if (typeof WeixinJSBridge == "undefined"){
                                    if( document.addEventListener ){
                                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                                    }else if (document.attachEvent){
                                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                                    }
                                }else{
                                    onBridgeReady(info);
                                }
                            },
                            error: function(info) {
                                console.log('公众号支付')
                                console.log(info)
                                jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
                            }
                        })
                    }else {//H5支付



                       $.ajax({
                           url:urL + wxPay,
                           type: 'post',
                           data:JSON.stringify(wxCheckPay),
                           contentType: "application/json;charset=UTF-8",
                           success:function(info){

                               console.log('微信支付')
                               console.log(info.data.wxpayUrl);
                              // location.href = info.data.wxpayUrl;

                               pay('wxpay');
                           },
                           error: function(info) {

                               console.log(info)
                               jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
                           }
                       })
                   }*/


                    location.href = '../../html/order/shopping_order_pay.html';
                }else if(info.data.payMode == '2'){ //支付宝

                   /* var zfbAppObject={
                        orderId:orderId,
                        subject:'订单标题测试',
                        deviceInfo:'订单信息测试',
                        fee:orderFee
                    };

                    var zfbAppObject1={
                        payVO:zfbAppObject
                    };

                    //支付信息
                    $.ajax({
                        url:urL + zfbApp,
                        type: 'post',
                        data:JSON.stringify(zfbAppObject1),
                        contentType: "application/json;charset=UTF-8",
                        success:function(info){
                            console.log(info.data);

                           // document.getElementsByTagName('body')[0].innerHTML=info;

                           // document.forms[0].submit()

                            pay('alipay');

                        },
                        error: function(info) {
                            console.log('支付宝APP支付失败')
                            console.log(info)
                            jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
                        }
                    });*/


                    location.href = '../../html/order/shopping_order_pay.html';
                }else if(info.data.payMode == '3'){
                    //货到付款
                    location.href = '../../html/order/shopping_cart_order.html';
                };
            })


        },
        error: function() {
            jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
        }
    })

    //订单商品信息
    $.ajax({
        url:urL + orderGoods,
        data:{
            orderId:orderId
        },
        success:function(info){
            console.log(info);
            var html = template('product_html',{list:info.data});
            $('.productMsg').html(html);
        },
        error: function() {
            jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
        }
    })






//发起支付请求

     var ALIPAYSERVER='https://openapi.alipaydev.com/gateway.do';

   //  var ALIPAYSERVER='http://demo.dcloud.net.cn/helloh5/payment/alipay.php?total=';

     var WXPAYSERVER='http://demo.dcloud.net.cn/helloh5/payment/wxpay.php?total=';

    // 2. 发起支付请求
    function pay(id){
        // 从服务器请求支付订单
        var PAYSERVER='';
        if(id=='alipay'){
            PAYSERVER=ALIPAYSERVER;
            channel = aliChannel;

        }else if(id=='wxpay'){
            PAYSERVER=WXPAYSERVER;
            channel = wxChannel;
        }else{
            plus.nativeUI.alert("不支持此支付通道！",null,"捐赠");
            return;
        }
        var xhr=new XMLHttpRequest();
        var orderFee= $('.amountPayable').text().toString().substr(1);//订单金额

        xhr.onreadystatechange=function(){
            switch(xhr.readyState){
                case 4:
                    if(xhr.status==200){
                        plus.payment.request(channel,xhr.responseText,function(result){
                            plus.nativeUI.alert("支付成功！",function(){
                                back();
                            });
                        },function(error){
                            plus.nativeUI.alert("支付失败：" + error.code);
                        });
                    }else{
                        console.log('信息失败：'+xhr.status)
                        alert("获取订单信息失败！");
                    }
                    break;
                default:
                    break;
            }
        }
        xhr.open('GET',PAYSERVER+orderFee);
        xhr.send();

    }





//获取url上的参数值的方法
    function getProductid(str) {
        var str1 = str.slice(1);
        var arr = str1.split("=");
        var obj = {};
        obj[arr[0]] = arr[1];
        return obj[arr[0]];
    }


    //获取assess_token





})