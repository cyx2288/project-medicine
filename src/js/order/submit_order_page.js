$(function () {
    var urL = url();


    function plusReady() {

    }

    document.addEventListener("plusready", plusReady, false);

    /*
    * 数组存cookie方法
    * */

    /*function decode(str){
        var _str = str.join(',');
        return _str;
    }
    function encode(str){
        var _arr = str.split(',');
        return _arr;
    }
    var arr = [1001,1002,1003,1004];
    $.cookie('the_cookie', decode(arr), { expires: 7 });//存入
    var newArr = encode($.cookie('the_cookie'));//读取
    //console.log(newArr)*/


    var userId = $.cookie('userId');
    var storeId = $.cookie('storeId');

    var goodIdList;

    if (getParam('goodIdList') !== null) {
        goodIdList = (getParam('goodIdList').split(',') ) || $.cookie('goodList') || '';
    } else {
        goodIdList = $.cookie('goodIdList') || '';
    }

    console.log(goodIdList);
    //$.cookie('goodIdList',goodIdList);
    //goodIdList = $.cookie('goodList');
    //$.cookie('goodIdList', '', {expires: -1});

    var packageId = getParam('packageId') || $.cookie('packageId') || '';
    //$.cookie('packageId',packageId);
    //packageId = $.cookie('packageId');
    //$.cookie('packageId', '', {expires: -1});
    console.log(typeof(packageId));

    var goodId = getParam('goodId') || $.cookie('goodId') || '';
    //$.cookie('goodId',goodId);
    //goodId = $.cookie('goodId');
    //$.cookie('goodId', '', {expires: -1}, { path :'/' } );

    var buyGoodNum = getParam('buyGoodNum') || $.cookie('buyGoodNum') || '';
    //$.cookie('buyGoodNum',buyGoodNum);
    //buyGoodNum = $.cookie('buyGoodNum');
    //$.cookie('buyGoodNum', '', {expires: -1});

    //地址ID
    var addressId = $.cookie('addressId');
    $.cookie('addressId', '', {expires: -1, path: '/'});
    console.log(goodIdList);
    console.log(packageId);
    console.log(goodId);
    console.log(buyGoodNum);
    console.log(addressId);


    // $.cookie('goodIdList',goodIdList);
    // $.cookie('packageId',packageId);
    // $.cookie('goodId',goodId);
    // $.cookie('buyGoodNum',buyGoodNum);


    // $.cookie('goodIdList', '', {expires: -1});
    // $.cookie('packageId', '', {expires: -1});
    // $.cookie('goodId', '', {expires: -1, path :'/' } );
    // $.cookie('buyGoodNum', '', {expires: -1});
    //$.cookie('addressId','',{expires: -1} );

    //提交订单信息
    //1. 收货人信息
    var cneeInfo, orderAmount;
    //地址列表
    var userAddrList = '/userAddr/list/';
    //默认地址
    var userAddrDefault = '/userAddr/default/';
    //红包
    var userDetailRedPackage = '/userDetail/redPackage';
    //购物车
    var cartList = '/cart/list';
    //优惠券
    var availableList = '/coupon/available/list';
    //库存
    var stockList = '/stock/list';
    //某个地址
    var userAddr = '/userAddr/';
    //套餐商品详情
    var goodPackageDetail = '/good/package/detail';
    //单个商品详情
    var goodDesc = '/good/desc';
    //提交订单
    var orderCreate = '/order/create';
    //单个商品提交订单
    var stocksigle = '/stock';

    var cartGoodIdList=$.cookie('goodIdList');

    console.log("card "+cartGoodIdList)

    var cartGoodNum=$.cookie('goodNum');

    //总价,实付
    var totalPrices = 0;
    var amountPayable = 0;
    var inputValueOne = 0;

    var inputValueTwo=0
    //优惠券:condition:满足条件,couponId:优惠券ID,couponType:优惠券类型（1:立减；2：满减）,"deduction": 抵扣金额,"usableDate": "优惠券过期时间",
    var couponId, condition, usableDate, deduction;
    var objdata1, objdata2;

    //商品id和数量,orderSource订单来源
    var orderGoodsList, orderSource;


    //判断用户是否有地址
    $.ajax({
        url: urL + userAddrList + userId,
        anysc:false,
        data: {
            userId: userId
        },
        success: function (info) {
            if (!info.data) {
                var suggest = confirm("请新增地址");
                if (suggest == true) {

                    //存cookie,
                    // 付款方式，优惠券，红包金额，发票信息，抬头，备注，应付金额，
                    $.cookie('pay', $('.pay_choose input:checked').attr('data-payid'));
                    $.cookie('voucherId', $('.tickets select').find("option:selected").attr('data-voucherId'));
                    $.cookie('shopRedPackage', $('.RedPackage input').val());
                    $.cookie('moneyRedPackage', $('.cashAmount input').val());
                    $.cookie('invoiceId', $('.invoice_input input:checked').attr('data-invoiceId'));
                    $.cookie('invoiceMsg', $('.invoice_msg textarea').val());
                    $.cookie('remark', $('.remark_msg textarea').val());
                    $.cookie('amountPayable1', $('.fixed_order span:eq(1)').text());
                    $.cookie('couponId', $('#tickets_select option:selected').attr('data-couponId'))
                    console.log($('.fixed_order span:eq(1)').text());


                    $.cookie('goodIdList', goodIdList);
                    $.cookie('packageId', packageId);
                    $.cookie('goodId', goodId);
                    $.cookie('buyGoodNum', buyGoodNum);



                    location.href = "../../html/order/edit_adress.html"
                }
            }else{
                //地址(初始化)
                if (addressId) {
                    $.ajax({
                        url: urL + userAddr + addressId,
                        data: {
                            id: addressId
                        },
                        success: function (info) {
                            console.log(info);
                            if (info.status !== 200) {
                                jfShowTips.toastShow({'text':info.msg});
                                return;
                            };
                            storeId = info.data.storeId;
                            var html = template('address_tem', {list: info.data});
                            $('.check_address').html(html);
                            cneeInfo = info.data.cneeName + ',' + info.data.cneeMobile + ',' + info.data.cneeArea + info.data.detailAddr;
                            clickBtn();

                            goodsList();

                        },
                        error: function () {
                            jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
                        }
                    })
                } else {
                    $.ajax({
                        url: urL + userAddrDefault + userId,
                        data: {
                            userId: userId
                        },
                        success: function (info) {
                            console.log(info);
                            if (info.status !== 200) {
                                jfShowTips.toastShow({'text':info.msg});
                                return;
                            };
                            storeId = info.data.storeId;
                            var html = template('address_tem', {list: info.data});
                            $('.check_address').html(html);
                            cneeInfo = info.data.cneeName + ',' + info.data.cneeMobile + ',' + info.data.cneeArea + info.data.detailAddr;
                            clickBtn();

                            goodsList();


                        },
                        error: function () {
                            jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
                        }
                    })
                }
            }
        }
    });







    //税号，选择为公司的时候
    var flagg = false;
    $('.invoice_input').on('click', 'input', function () {
        if ($('.invoice_input input:checked').attr('data-invoiceId') == "2") {
            if ($('.invoice_ein').length !== 0) {
                return;
            }
            $('.invoice').append(
                '<label class="yao_alignment_left invoice_ein">' +
                '<span>税号：</span>' +
                '<div>' +
                '<textarea type="text" placeholder="请填写税号" rows="2"></textarea>' +
                '</div>' +
                '</label>'
            )
        } else {
            $('.invoice_ein').remove();
        }
    })

    //提交订单
    var flag = false;
    $('.put_order').click(function () {

        //判断库存，如果不足，拦截
        if($('.repertory')[0]){
            jfShowTips.toastShow({'text':'您提交的商品中，有库存不足，请重新提交'});
            return;
        };

        $.cookie('goodIdList', '', {expires: -1});
        $.cookie('packageId', '', {expires: -1});
        $.cookie('goodId', '', {expires: -1});
        $.cookie('buyGoodNum', '', {expires: -1});
        $.cookie('addressId', '', {expires: -1, path: '/'});

        flag = true;
        $(this).attr('disabled', true);
        //获取数据
        //订单总额
        orderAmount = parseFloat($('.orderAmount_money').text().substring(1));
        //券抵扣金额（未使用优惠券则为0）
        var couponsAmount = parseFloat($('#tickets_select option:selected').attr('data-deduction')) || 0;
        console.log(couponsAmount);
        //购物红包抵扣金额（未使用红包则为0）
        var shopPacketAmount = parseFloat($('.RedPackage input').val()) || 0;//购物红包
        console.log(shopPacketAmount);
        //现金红包
        var cashPacketAmount= parseFloat($('.cashAmount input').val()) || 0;//现金红包

        console.log(cashPacketAmount);

        //应付金额
        var shouldPay = parseFloat($('.shouldPay_money').text().substring(1));
        console.log(shouldPay);
        //备注
        var orderRemarks = $('.orderRemarks_html').val() || '';
        console.log(orderRemarks);
        //优惠券ID
        var couponsId = $('#tickets_select option:selected').attr('data-couponId');
        console.log(couponsId);
        //发票类型（1个人，2公司，3集中开票）
        var invoiceType = $('.invoice_input input:checked').attr('data-invoiceId');
        console.log(invoiceType);
        //发票抬头
        var invoiceTitle = $('.invoice_msg textarea').val();
        console.log(invoiceTitle);
        //公司开票时提供的税号等信息，用逗号分隔
        var invoiceInfo = $('.invoice_ein textarea').val() || '';
        console.log(invoiceInfo);
        //支付方式（1微信，2支付宝，3货到付款）
        var payMode = $('.pay_choose input:checked').attr('data-payid');
        console.log(payMode);
        //订单列表
        console.log(orderGoodsList);
        //orderAux
        var storeId1 = $('.yao_alignment_center').attr('data-storeId');
        var areaAllCode = $('.yao_alignment_center').attr('data-areaAllCode');
        console.log(storeId1);
        console.log(areaAllCode);
        console.log(orderSource);

        var orderAuxobj = {
            storeId: storeId1,
            areaAllCode: areaAllCode,
            orderSource: orderSource
        };

        var orderObj = {
            userId: userId,
            cneeInfo: cneeInfo,
            orderAmount: orderAmount,
            couponsAmount: couponsAmount,
            redpacketAmount: shopPacketAmount,
            cashAmount:cashPacketAmount,
            shouldPay: shouldPay,
            orderRemarks: orderRemarks,
            couponsId: couponsId,
            invoiceType: invoiceType,
            invoiceTitle: invoiceTitle,
            invoiceInfo: invoiceInfo,
            payMode: payMode
        }

        var orderObj1 = {
            order: orderObj,
            orderGoodsList: orderGoodsList,
            orderAux: orderAuxobj
        }

        //提交订单
        $.ajax({
            url: urL + orderCreate,
            type: 'post',
            data: JSON.stringify(orderObj1),
            contentType: "application/json;charset=UTF-8",
            success: function (info) {
                console.log(info);
                if (info.status !== 200) {
                    jfShowTips.toastShow({'text':info.msg});
                    flag = false;
                    return;
                }
                jfShowTips.toastShow({'text':info.msg});
                //存订单号
                var orderNumber = info.data;

                $(this).attr('disabled', true);
                flag = false;
                //跳页面
                location.href = 'check_order_page.html?orderNumber=' + orderNumber;
            },
            error: function (info) {
                console.log(info)
                jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
            }
        })
    })


    //商品列表(初始化)
    function goodsList(){

        //判断商品来源

        if (cartGoodIdList) {
            orderSource = 1;



            $.ajax({
                url: urL + cartList,
                anysc: false,
                data: {
                    userId: userId,
                    goodIdList: goodIdList
                },
                traditional: true,
                success: function (info) {
                    console.log(info);
                    if (info.status !== 200) {
                        jfShowTips.toastShow({'text':info.msg});
                        return;
                    }
                    ;
                    var html = template('product_html', {list: info.data});
                    $('.order_main_html').html(html);
                    objdata1 = info.data;
                    //库存
                    $.ajax({
                        url: urL + stockList,
                        data: {
                            goodIdList: goodIdList,
                            storeId: storeId
                        },
                        traditional: true,
                        success: function (info1) {
                            console.log(info1);
                            if (info1.status !== 200) {
                                jfShowTips.toastShow({'text':info1.msg});
                                return;
                            }
                            ;
                            objdata2 = info1.data;
                            stock2();
                        },
                        error: function () {
                            jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
                        }
                    })
                },
                error: function () {
                    jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
                }
            })
        } else if (packageId) {
            orderSource = 3;
            jfShowTips.toastShow({'text':orderSource})
            $.ajax({
                url: urL + goodPackageDetail,
                anysc: false,
                data: {
                    packageId: packageId
                },
                traditional: true,
                success: function (info) {
                    console.log(info);
                    if (info.status !== 200) {
                        jfShowTips.toastShow({'text':info.msg});
                        return;
                    };
                    var html = template('product_html_meal', {list: info.data});
                    $('.order_main_html').html(html);
                    objdata1 = info.data;
                    //获取goodIdList
                    var mainGoodIdList = [];
                    for (var i = 0; i < info.data.length; i++) {
                        mainGoodIdList.push(info.data[i].goodId);
                    }
                    console.log(mainGoodIdList);
                    //库存

                    //获取一下当前地址的门店ID
                    storeId = $('.yao_alignment_center').attr('data-storeid');
                    console.log(storeId);
                    $.ajax({
                        url: urL + stockList,
                        data: {
                            goodIdList: mainGoodIdList,
                            storeId: storeId
                        },
                        traditional: true,
                        success: function (info1) {
                            console.log(info1);
                            if (info1.status !== 200) {
                                jfShowTips.toastShow({'text':info1.msg});
                                return;
                            }
                            ;
                            objdata2 = info1.data;
                            //库存判断
                            orderGoodsList = [];
                            for (var i = 0; i < objdata1.length; i++) {
                                if (objdata1[i].buyCount > objdata2[i].stock) {
                                    $('#product_list_meal' + i).addClass('repertory');
                                }
                                ;
                                console.log(parseInt(objdata1[i].sellingPrice));
                                console.log(parseInt(objdata1[i].buyNum));
                                totalPrices += (parseInt(objdata1[i].sellingPrice) * parseInt(objdata1[i].buyNum));

                                //获取orderGoodsList
                                orderGoodsList.push(
                                    {
                                        goodId: objdata1[i].goodId,
                                        goodCount: objdata1[i].buyNum
                                    }
                                )
                            }
                            console.log(totalPrices);
                            /*
                            * TODO
                            * 两位小数
                            * */
                            //totalPrices = parseFloat(totalPrices.tofixed(2));
                            $('.fixed_price span:eq(1)').html('￥' + totalPrices);
                            $('.fixed_order span:eq(1)').html('￥' + totalPrices);
                            amountPayable = totalPrices;

                            //优惠券:condition:满足条件,couponId:优惠券ID,couponType:优惠券类型（1:立减；2：满减）,"deduction": 抵扣金额,"usableDate": "优惠券过期时间",
                            var couponId, condition, usableDate, deduction;

                            redPackmoney = parseFloat($('.RedPackage input').val());
                            //优惠券
                            $.ajax({
                                url: urL + availableList,
                                data: {
                                    userId: userId,
                                    orderTotal: totalPrices
                                },
                                success: function (info) {
                                    console.log(info);
                                    var html = template('tickets_option', {list: info.data});
                                    $('.tickets select').append(html);

                                    //获取当前减去红包的金额
                                    amountPayable = parseFloat($('.fixed_order span:eq(1)').text().substring(1));
                                    console.log(amountPayable);
                                    //优惠券选择
                                    $('#tickets_select').bind('change', function () {
                                        couponId = $('#tickets_select option:selected').attr('data-couponId');
                                        condition = parseFloat($('#tickets_select option:selected').attr('data-condition')) || 0;
                                        deduction = parseFloat($('#tickets_select option:selected').attr('data-deduction')) || 0;
                                        usableDate = $('#tickets_select option:selected').attr('data-usableDate');

                                        //判断是否小于当前的支付金额
                                        //获取当前
                                        console.log((amountPayable - deduction));
                                        console.log(deduction);
                                        console.log(amountPayable);
                                        console.log((deduction > amountPayable));

                                        //获取红包钱数
                                        var ShopPackage = parseFloat($('.RedPackage input').val());

                                        var cashPackage=parseFloat($('. cashAmount input').val());


                                        if (deduction > (totalPrices - ShopPackage-cashPackage)) {
                                            jfShowTips.toastShow({'text':'优惠券的价值超过实际价格，请重新选择优惠券'});
                                            $('#tickets_select option:eq(0)').attr('selected', true);
                                            inputValueOne = parseFloat($('.RedPackage input').val()) || 0;

                                            inputValueTwo = parseFloat($('.cashAmount input').val()) || 0;
                                            $('.fixed_order span:eq(1)').html('￥' + (totalPrices - ShopPackage-cashPackage));
                                            return;
                                        }
                                        //设置价格
                                        inputValueOne = parseFloat($('.RedPackage input').val()) || 0;

                                        inputValueTwo = parseFloat($('.cashAmount input').val()) || 0;

                                        $('.fixed_order span:eq(1)').html('￥' + parseFloat(totalPrices - deduction - inputValueOne-inputValueTwo));
                                    })
                                    redpage();
                                },
                                error: function () {
                                    jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
                                }
                            })
                        },
                        error: function () {
                            jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
                        }
                    })
                },
                error: function () {
                    jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
                }
            })
        } else if (goodId) {
            orderSource = 2;
           // jfShowTips.toastShow(orderSource)
            $.ajax({
                url: urL + goodDesc,
                anysc: false,
                data: {
                    id: goodId
                },
                traditional: true,
                success: function (info) {
                    console.log(info);
                    if (info.status !== 200) {
                        jfShowTips.toastShow({'text':info.msg});
                        return;
                    }
                    ;
                    var html = template('product_html', {list: info.data});
                    $('.order_main_html').html(html);
                    objdata1 = info.data;
                    $('span[data-buycount]').text('X' + buyGoodNum);
                    //库存
                    //获取一下当前地址的门店ID
                    storeId = $('.yao_alignment_center').attr('data-storeid');
                    console.log(storeId);
                    $.ajax({
                        url: urL + stocksigle,
                        data: {
                            goodId: goodId,
                            storeId: storeId
                        },
                        traditional: true,
                        success: function (info1) {
                            console.log(info1);
                            /*if (info1.status !== 200) {
                                jfShowTips.toastShow(info1.msg);
                                return;
                            };*/
                            objdata2 = info1.data;

                            if(info1.data == null){
                                //info1.data = objdata2 = {};
                                objdata2 = {};
                                objdata2['stock'] = 0;
                                console.log(objdata2);
                            };

                            //库存判断
                            if (buyGoodNum > objdata2.stock) {
                                $('#product_list0').addClass('repertory');
                            }
                            totalPrices = parseFloat(buyGoodNum) * parseFloat(info.data[0].sellingPrice);
                            //获取orderGoodsList
                            orderGoodsList = [];
                            orderGoodsList.push(
                                {
                                    goodId: objdata1[0].id,
                                    goodCount: buyGoodNum
                                }
                            )
                            /*
                            * TODO
                            * 两位小数
                            * */
                            $('.fixed_price span:eq(1)').html('￥' + totalPrices);
                            $('.fixed_order span:eq(1)').html('￥' + totalPrices);
                            amountPayable = totalPrices;

                            //优惠券:condition:满足条件,couponId:优惠券ID,couponType:优惠券类型（1:立减；2：满减）,"deduction": 抵扣金额,"usableDate": "优惠券过期时间",
                            var couponId, condition, usableDate, deduction;

                            redPackmoney = parseFloat($('.RedPackage input').val());
                            //优惠券
                            $.ajax({
                                url: urL + availableList,
                                data: {
                                    userId: userId,
                                    orderTotal: totalPrices
                                },
                                success: function (info) {
                                    console.log(info);
                                    var html = template('tickets_option', {list: info.data});
                                    $('.tickets select').append(html);

                                    //获取当前减去红包的金额
                                    amountPayable = parseFloat($('.fixed_order span:eq(1)').text().substring(1));
                                    console.log(amountPayable);
                                    //优惠券选择
                                    $('#tickets_select').bind('change', function () {
                                        couponId = $('#tickets_select option:selected').attr('data-couponId');
                                        condition = parseFloat($('#tickets_select option:selected').attr('data-condition')) || 0;
                                        deduction = parseFloat($('#tickets_select option:selected').attr('data-deduction')) || 0;
                                        usableDate = $('#tickets_select option:selected').attr('data-usableDate');

                                        //判断是否小于当前的支付金额
                                        //获取当前
                                        console.log((amountPayable - deduction));
                                        console.log(deduction);
                                        console.log(amountPayable);
                                        console.log((deduction > amountPayable));

                                        //获取红包钱数
                                        var RedPackage = parseFloat($('.RedPackage input').val());

                                        if (deduction > (totalPrices - RedPackage)) {
                                            jfShowTips.toastShow({'text':'优惠券的价值超过实际价格，请重新选择优惠券'});
                                            $('#tickets_select option:eq(0)').attr('selected', true);
                                            inputValueOne = parseFloat($('.RedPackage input').val()) || 0;

                                            inputValueTwo = parseFloat($('.cashAmount input').val()) || 0;
                                            $('.fixed_order span:eq(1)').html('￥' + (totalPrices - RedPackage));
                                            return;
                                        }
                                        //设置价格
                                        inputValueOne = parseFloat($('.RedPackage input').val()) || 0;

                                        inputValueTwo = parseFloat($('.cashAmount input').val()) || 0;
                                        $('.fixed_order span:eq(1)').html('￥' + parseFloat(totalPrices - deduction - inputValueOne - inputValueTwo));
                                    })
                                    redpage();
                                },
                                error: function () {
                                    jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
                                }
                            })
                        }
                    })

                },
                error: function () {
                    jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
                }
            })
        }
    }





    function stock2() {
        //库存判断
        orderGoodsList = [];
        for (var i = 0; i < objdata1.length; i++) {
            if (objdata1[i].buyCount > objdata2[i].stock) {
                $('#product_list' + i).addClass('repertory');
            }
            ;

            console.log(parseInt(objdata1[i].sellingPrice));
            console.log(parseInt(objdata1[i].buyCount));
            totalPrices += (parseInt(objdata1[i].sellingPrice) * parseInt(objdata1[i].buyCount));

            //获取orderGoodsList
            orderGoodsList.push(
                {
                    goodId: objdata1[i].id,
                    goodCount: objdata1[i].buyCount
                }
            )
        }
        console.log(orderGoodsList);
        console.log(totalPrices);


        /*
        * TODO
        * 两位小数
        * */
        //totalPrices = parseFloat(totalPrices.tofixed(2));
        $('.fixed_price span:eq(1)').html('￥' + totalPrices);
        $('.fixed_order span:eq(1)').html('￥' + totalPrices);
        amountPayable = totalPrices;

        //优惠券:condition:满足条件,couponId:优惠券ID,couponType:优惠券类型（1:立减；2：满减）,"deduction": 抵扣金额,"usableDate": "优惠券过期时间",
        var couponId, condition, usableDate, deduction;

        redPackmoney = parseFloat($('.RedPackage input').val());
        //优惠券
        $.ajax({
            url: urL + availableList,
            data: {
                userId: userId,
                orderTotal: totalPrices
            },
            success: function (info) {
                console.log(info);
                var html = template('tickets_option', {list: info.data});
                $('.tickets select').append(html);

                //获取当前减去红包的金额
                amountPayable = parseFloat($('.fixed_order span:eq(1)').text().substring(1));
                console.log(amountPayable);
                //优惠券选择
                $('#tickets_select').bind('change', function () {
                    couponId = $('#tickets_select option:selected').attr('data-couponId');
                    condition = parseFloat($('#tickets_select option:selected').attr('data-condition')) || 0;
                    deduction = parseFloat($('#tickets_select option:selected').attr('data-deduction')) || 0;
                    usableDate = $('#tickets_select option:selected').attr('data-usableDate');

                    //判断是否小于当前的支付金额
                    //获取当前
                    console.log((amountPayable - deduction));
                    console.log(deduction);
                    console.log(amountPayable);
                    console.log((deduction > amountPayable));

                    //获取红包钱数
                    var RedPackage = parseFloat($('.RedPackage input').val());

                    if (deduction > (totalPrices - RedPackage)) {
                        jfShowTips.toastShow({'text':'优惠券的价值超过实际价格，请重新选择优惠券'});
                        $('#tickets_select option:eq(0)').attr('selected', true);
                        inputValueOne = parseFloat($('.RedPackage input').val()) || 0;

                        inputValueTwo = parseFloat($('.cashAmount input').val()) || 0;
                        $('.fixed_order span:eq(1)').html('￥' + (totalPrices - RedPackage));
                        return;
                    }
                    //设置价格
                    inputValueOne = parseFloat($('.RedPackage input').val()) || 0;

                    inputValueTwo = parseFloat($('.cashAmount input').val()) || 0;
                    $('.fixed_order span:eq(1)').html('￥' + parseFloat(totalPrices - deduction - inputValueOne - inputValueTwo));
                })
                redpage();
            },
            error: function () {
                jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
            }
        })
    }

    function redpage() {
        //红包(初始化)
        var RedPackageNum = 0;

        var cashNum=0;

        $.ajax({
            url: urL + userDetailRedPackage,
            anysc: false,
            data: {
                userId: userId
            },
            success: function (info) {
                console.log(info);
                if (info.status !== 200) {
                    $('.RedPackage input').attr('disabled', true);

                    $('.cashAmount input').attr('disabled', true);
                    return;
                }
                ;
                var redhtml = template('RedPackage_html', {list: info.data});
                $('.RedPackage').append(redhtml);

                var cashHtml=template('cash_html', {list: info.data});
                $('.cashAmount').append(cashHtml);

                RedPackageNum = info.data.shopRedPackage;

                cashNum=info.data.moneyRedPackag;

                //输入购物红包
                $('.RedPackage input').change(function () {

                    //输入的红包金额
                    var inputValue = parseFloat($('.RedPackage input').val())
                    if ((inputValue + deduction) > RedPackageNum) {
                        jfShowTips.toastShow({'text':'您的金额超了哦，请重新输入'});
                        //置空
                        $('.RedPackage input').val('');
                        deduction = parseFloat($('#tickets_select option:selected').attr('data-deduction')) || 0;
                        $('.fixed_order span:eq(1)').html('￥' + parseFloat(totalPrices - deduction));
                        return;
                    }
                    //判断是否有超总金额
                    deduction = parseFloat($('#tickets_select option:selected').attr('data-deduction')) || 0;
                    console.log(typeof(deduction));
                    console.log((inputValue + deduction));

                    var inputValueCash=parseFloat($('.cashAmount input').val());

                    if ((inputValue+inputValueCash + deduction) > totalPrices) {
                        //plus.ui.jfShowTips.toastShow('您的红包抵扣金额大于订单金额，请重新输入！');
                        jfShowTips.toastShow('您的红包抵扣金额大于订单金额，请重新输入！');
                        //置空
                        $('.RedPackage input').val('');
                        deduction = parseFloat($('#tickets_select option:selected').attr('data-deduction')) || 0;
                        $('.fixed_order span:eq(1)').html('￥' + parseFloat(totalPrices - deduction));
                        return;
                    }
                    ;
                    deduction = parseFloat($('#tickets_select option:selected').attr('data-deduction')) || 0;
                    //计算应付金额
                    amountPayable = (totalPrices * 100 - inputValue * 100 -inputValueCash*100 - deduction * 100) / 100;
                    $('.fixed_order span:eq(1)').html('￥' + amountPayable);
                })


                //输入现金红包
                $('.RedPackage input').change(function () {

                    //输入的红包金额
                    var inputValue = parseFloat($('.cashAmount input').val())
                    if ((inputValue + deduction) > cashNum) {
                        jfShowTips.toastShow({'text':'您的金额超了哦，请重新输入'});
                        //置空
                        $('.RedPackage input').val('');
                        deduction = parseFloat($('#tickets_select option:selected').attr('data-deduction')) || 0;
                        $('.fixed_order span:eq(1)').html('￥' + parseFloat(totalPrices - deduction));
                        return;
                    }
                    //判断是否有超总金额
                    deduction = parseFloat($('#tickets_select option:selected').attr('data-deduction')) || 0;
                    console.log(typeof(deduction));
                    console.log((inputValue + deduction));
                    var inputValueRed=parseFloat($('.cashAmount input').val());
                    if ((inputValue + inputValueRed+ deduction) > totalPrices) {
                        //plus.ui.jfShowTips.toastShow('您的红包抵扣金额大于订单金额，请重新输入！');
                        jfShowTips.toastShow('您的红包抵扣金额大于订单金额，请重新输入！');
                        //置空
                        $('.RedPackage input').val('');
                        deduction = parseFloat($('#tickets_select option:selected').attr('data-deduction')) || 0;
                        $('.fixed_order span:eq(1)').html('￥' + parseFloat(totalPrices - deduction));
                        return;
                    }
                    ;
                    deduction = parseFloat($('#tickets_select option:selected').attr('data-deduction')) || 0;
                    //计算应付金额
                    amountPayable = (totalPrices * 100 - inputValue * 100 - -inputValueRed*100 - deduction * 100) / 100;
                    $('.fixed_order span:eq(1)').html('￥' + amountPayable);
                })
            },
            error: function () {
                jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
            }
        })
    }


    function clickBtn() {
        //取cookie
        var pay = $.cookie('pay') || 1;
        var voucherId = $.cookie('voucherId') || 101;
        var RedPackageMoney = $.cookie('RedPackageMoney') || '';
        var invoiceId = $.cookie('invoiceId') || 1;
        var invoiceMsg = $.cookie('invoiceMsg') || '';
        var remark = $.cookie('remark') || '';
        var amountPayable1 = $.cookie('amountPayable1');
        var couponId = $.cookie('couponId') || '0';
        console.log(couponId);

        //设置用户选择的
        $('.pay_choose input[data-payid=' + pay + ']').prop('checked', true);
        $('.tickets select').find('option[data-voucherId=' + voucherId + ']').prop('selected', true);
        $('.RedPackage input').val(RedPackageMoney);
        $('.invoice_input input[data-invoiceId=' + invoiceId + ']').prop('checked', true);
        $('.invoice_msg textarea').val(invoiceMsg);
        $('.remark_msg textarea').val(remark);
        $('.fixed_order span:eq(1)').text(amountPayable1);
        $('#tickets_select option[data-couponId=' + couponId + ']').attr('selected', true);
        console.log($('#tickets_select option[data-couponId=' + couponId + ']'));

        //删除cookie
        $.cookie('pay', '', {expires: -1});
        $.cookie('voucherId', '', {expires: -1});
        $.cookie('RedPackageMoney', '', {expires: -1});
        $.cookie('invoiceId', '', {expires: -1});
        $.cookie('invoiceMsg', '', {expires: -1});
        $.cookie('remark', '', {expires: -1});
        $.cookie('amountPayable1', '', {expires: -1});
        $.cookie('couponId', '', {expires: -1});

        //点击地址
        $('.order_page').on('click', '.address_change', function () {
            //存cookie,
            // 付款方式，优惠券，红包金额，发票信息，抬头，备注，应付金额，
            $.cookie('pay', $('.pay_choose input:checked').attr('data-payid'));
            $.cookie('voucherId', $('.tickets select').find("option:selected").attr('data-voucherId'));
            $.cookie('RedPackageMoney', $('.RedPackage input').val());
            $.cookie('invoiceId', $('.invoice_input input:checked').attr('data-invoiceId'));
            $.cookie('invoiceMsg', $('.invoice_msg textarea').val());
            $.cookie('remark', $('.remark_msg textarea').val());
            $.cookie('amountPayable1', $('.fixed_order span:eq(1)').text());
            $.cookie('couponId', $('#tickets_select option:selected').attr('data-couponId'))
            console.log($('.fixed_order span:eq(1)').text());


            $.cookie('goodIdList', goodIdList);
            $.cookie('packageId', packageId);
            $.cookie('goodId', goodId);
            $.cookie('buyGoodNum', buyGoodNum);

            //跳选择页面
            location.href = 'choose_address.html';
        })
    }

    //点击地址
    $('.order_page').on('click', '.address_change', function () {
        //存cookie,
        // 付款方式，优惠券，红包金额，发票信息，抬头，备注，应付金额，
        $.cookie('pay', $('.pay_choose input:checked').attr('data-payid'));
        $.cookie('voucherId', $('.tickets select').find("option:selected").attr('data-voucherId'));
        $.cookie('RedPackageMoney', $('.RedPackage input').val());
        $.cookie('invoiceId', $('.invoice_input input:checked').attr('data-invoiceId'));
        $.cookie('invoiceMsg', $('.invoice_msg textarea').val());
        $.cookie('remark', $('.remark_msg textarea').val());
        $.cookie('amountPayable1', $('.fixed_order span:eq(1)').text());
        $.cookie('couponId', $('#tickets_select option:selected').attr('data-couponId'))
        console.log($('.fixed_order span:eq(1)').text());


        $.cookie('goodIdList', goodIdList);
        $.cookie('packageId', packageId);
        $.cookie('goodId', goodId);
        $.cookie('buyGoodNum', buyGoodNum);

        //跳选择页面
        location.href = 'choose_address.html';
    })


    /**
     * 对日期进行格式化，
     * @param date 要格式化的日期
     * @param format 进行格式化的模式字符串
     *     支持的模式字母有：
     *     y:年,
     *     M:年中的月份(1-12),
     *     d:月份中的天(1-31),
     *     h:小时(0-23),
     *     m:分(0-59),
     *     s:秒(0-59),
     *     S:毫秒(0-999),
     *     q:季度(1-4)
     * @return String
     * @author yanis.wang
     * @see    http://yaniswang.com/frontend/2013/02/16/dateformat-performance/
     */
    template.helper('dateFormat', function (date, format) {

        if (typeof date === "string") {
            var mts = date.match(/(\/Date\((\d+)\)\/)/);
            if (mts && mts.length >= 3) {
                date = parseInt(mts[2]);
            }
        }
        date = new Date(date);
        if (!date || date.toUTCString() == "Invalid Date") {
            return "";
        }

        var map = {
            "M": date.getMonth() + 1, //月份
            "d": date.getDate(), //日
            "h": date.getHours(), //小时
            "m": date.getMinutes(), //分
            "s": date.getSeconds(), //秒
            "q": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };


        format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
            var v = map[t];
            if (v !== undefined) {
                if (all.length > 1) {
                    v = '0' + v;
                    v = v.substr(v.length - 2);
                }
                return v;
            }
            else if (t === 'y') {
                return (date.getFullYear() + '').substr(4 - all.length);
            }
            return all;
        });
        return format;
    });


    /*获取url上的参数值的方法*/
    function getParam(name) {
        var search = document.location.search;
        //jfShowTips.toastShow(search);
        var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
        var matcher = pattern.exec(search);
        var items = null;
        if (null != matcher) {
            try {
                items = decodeURIComponent(decodeURIComponent(matcher[1]));
            } catch (e) {
                try {
                    items = decodeURIComponent(matcher[1]);
                } catch (e) {
                    items = matcher[1];
                }
            }
        }
        return items;
    };


    //获取url上的参数值的方法
    function getProductid(str) {
        var str1 = str.slice(1);
        var arr = str1.split("=");
        var obj = {};
        obj[arr[0]] = arr[1];
        return obj[arr[0]];
    }

    /*获取url上的参数值的方法*/
    function getParam(name) {
        var search = document.location.search;
        //jfShowTips.toastShow(search);
        var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
        var matcher = pattern.exec(search);
        var items = null;
        if (null != matcher) {
            try {
                items = decodeURIComponent(decodeURIComponent(matcher[1]));
            } catch (e) {
                try {
                    items = decodeURIComponent(matcher[1]);
                } catch (e) {
                    items = matcher[1];
                }
            }
        }
        return items;
    };
    
    
    
    //判断当前在浏览器还是app中打开

    judgeBrowser();
    
    function judgeBrowser(){

        var zfbPay=document.getElementsByClassName('zfb_pay')[0];//微信浏览器中，支付宝付款方式隐藏

        if(browser.supplier.weixin){

            zfbPay.style.display="none";
        }
        
    }

})