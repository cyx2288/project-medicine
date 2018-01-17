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

    console.log('storeId='+storeId)

    var goodIdList;

    if (getParam('goodIdList') !== null) {
        goodIdList = (getParam('goodIdList').split(',') ) || $.cookie('goodList') || '';
    } else {
        goodIdList = $.cookie('goodIdList') || '';
    }

    console.log('goodIdList='+goodIdList);

    var packageId = getParam('packageId') || $.cookie('packageId') || '';

    console.log('packageId='+packageId)


    var goodId = getParam('goodId') || $.cookie('goodId') || '';

    console.log('goodId='+goodId)

    var buyGoodNum = getParam('buyGoodNum') || $.cookie('buyGoodNum') || '';

    console.log('buyGoodNum='+buyGoodNum)

    //地址ID
    var addressId = $.cookie('addressId');

   // $.cookie('addressId', '', {expires: -1, path: '/'});



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
    //库存（多个商品）
    var stockList = '/stock/list';
    //某个地址详细信息
    var userAddr = '/userAddr/';
    //套餐商品详情
    var goodPackageDetail = '/good/package/detail';
    //单个商品详情
    var goodDesc = '/good/desc';
    //提交订单
    var orderCreate = '/order/create';

    //单个商品提交订单库存
    var stocksigle = '/stock';


    //总价,实付
    var totalPrices = 0;
    var amountPayable = 0;
    var inputValueOne = 0;

    var inputValueTwo=0
    //优惠券:condition:满足条件,couponId:优惠券ID,couponType:优惠券类型（1:立减；2：满减）,"deduction": 抵扣金额,"usableDate": "优惠券过期时间",
    var couponId, condition, usableDate, deduction;
    var objdata1, objdata2;

    var orderGoodData,stockGoodData;//加入订单的商品信息数组以及目前库存的信息数组

    //商品id和数量,orderSource订单来源
    var orderGoodsList, orderSource;


    var cartGoodIdList,cartGoodNum;//购物车提交商品id数组以及对应购买数量

    //判断用户是否有默认地址



    //判断用户是否有地址
    $.ajax({
        url: urL + userAddrList + userId,
        anysc:false,
        data: {
            userId: userId
        },
        success: function (info) {//当前没有地址

            console.log('地址：'+info);

            console.log(info.data)

            if (!info.data) {


                jfShowTips.dialogShow({
                    'mainText': '请先去新增地址！',
                    'minText': ' ',
                    'noCancel':true,
                    'checkFn': function () {

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


                        $.cookie('goodIdList', goodIdList);
                        $.cookie('packageId', packageId);
                        $.cookie('goodId', goodId);
                        $.cookie('buyGoodNum', buyGoodNum);

                        location.href = "../../html/order/edit_adress.html"

                    }
                })

            }else{
                //地址(初始化)

                $.ajax({
                    url: urL + userAddrDefault + userId,
                    data: {
                        userId: userId
                    },
                    success: function (info) {

                        console.log('默认地址：'+info)
                        console.log(info);
                        /*if (info.status !== 200) {
                            jfShowTips.toastShow({'text':info.data});
                            return;
                        };*/

                        if(info.data){
                            storeId = info.data.storeId;
                            var html = template('address_tem', {list: info.data});
                            $('.check_address').html(html);
                            cneeInfo = info.data.cneeName + ',' + info.data.cneeMobile + ',' + info.data.cneeArea + info.data.detailAddr;
                        }else {
                            //如果没有默认地址，取地址列表
                            $.ajax({

                                type:'get',

                                url:urL+'/userAddr/list/'+userId,

                                data:{

                                    userId: userId

                                },

                                success:function (res) {

                                    if(res.data) {

                                        console.log('地址列表')

                                        console.log(res.data[0]);

                                        storeId = res.data[0].storeId;

                                        var thisDefaultList=res.data[0]

                                        console.log('storeID='+storeId)

                                        var html = template('address_tem', {list: thisDefaultList});
                                        $('.check_address').html(html);
                                        cneeInfo = thisDefaultList.cneeName + ',' + thisDefaultList.cneeMobile + ',' + thisDefaultList.cneeArea + thisDefaultList.detailAddr;

                                        $.cookie('addressHtml', res.data[0].cneeArea, {path: '/', expires: 30});


                                    }

                                },

                                error:function(res){

                                    console.log(res);

                                    jfShowTips.toastShow({'text':"读取地址失败"})

                                }


                            })
                        }


                        clickBtn();

                        goodsList();


                    },
                    error: function () {
                        jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
                    }
                })

               /* console.log('addressId='+addressId)

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

                            console.log('默认地址：'+info)
                            console.log(info);
                            /!*if (info.status !== 200) {
                                jfShowTips.toastShow({'text':info.data});
                                return;
                            };*!/

                            if(info.data){
                                storeId = info.data.storeId;
                                var html = template('address_tem', {list: info.data});
                                $('.check_address').html(html);
                                cneeInfo = info.data.cneeName + ',' + info.data.cneeMobile + ',' + info.data.cneeArea + info.data.detailAddr;
                            }else {
                                //如果没有默认地址，取地址列表
                                $.ajax({

                                    type:'get',

                                    url:urL+'/userAddr/list/'+userId,

                                    data:{

                                        userId: userId

                                    },

                                    success:function (res) {

                                        if(res.data) {

                                            console.log('地址列表')

                                            console.log(res.data[0]);

                                            storeId = res.data[0].storeId;

                                            var thisDefaultList=res.data[0]

                                            console.log('storeID='+storeId)

                                            var html = template('address_tem', {list: thisDefaultList});
                                            $('.check_address').html(html);
                                            cneeInfo = thisDefaultList.cneeName + ',' + thisDefaultList.cneeMobile + ',' + thisDefaultList.cneeArea + thisDefaultList.detailAddr;

                                            $.cookie('addressHtml', res.data[0].cneeArea, {path: '/', expires: 30});


                                        }

                                    },

                                    error:function(res){

                                        console.log(res);

                                        jfShowTips.toastShow({'text':"读取地址失败"})

                                    }


                                })
                            }




                            clickBtn();

                            goodsList();


                        },
                        error: function () {
                            jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
                        }
                    })
                }*/
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

        $.cookie('sumMoney','',{expires:1,path: '/'});

        $.cookie('totalMoney','',{expires:1,path: '/'});

        $.cookie('cartGoodIdList','',{expires:1,path: '/'});//清空

        console.log('清空购物车商品cookie'+$.cookie('cartGoodIdList'))

        $.cookie('cartGoodNum','',{expires:1,path: '/'});//清空

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
        console.log('orderGoodsList='+orderGoodsList);
        //orderAux
        var storeId1 = $('.yao_alignment_center').attr('data-storeId');
        var areaAllCode = $('.yao_alignment_center').attr('data-areaAllCode');
       // console.log(storeId1);
       // console.log(areaAllCode);
       // console.log(orderSource);

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

     console.log(orderObj1)


        //提交订单
        $.ajax({
            url: urL + orderCreate,
            type: 'post',
            data: JSON.stringify(orderObj1),
            contentType: "application/json;charset=UTF-8",
            success: function (info) {
                console.log(orderObj1)
                console.log(info);
                
                if (info.status !== 200) {
                    jfShowTips.toastShow({'text':info.msg});
                    flag = false;
                    return;
                }
                jfShowTips.toastShow({'text':info.msg});
                //存订单号
                var orderNumber = info.data;
                
                console.log('orderNumber='+orderNumber)

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

         cartGoodIdList=$.cookie('cartGoodIdList');

         cartGoodNum=$.cookie('cartGoodNum');

        var sumMoney=$.cookie('sumMoney');

        var totalMoney=$.cookie('totalMoney');

        //判断商品来源

        if (cartGoodIdList) {//购物车立即购买

            console.log('购物车商品:'+cartGoodIdList)

            orderSource = 1;

            cartGoodIdList=cartGoodIdList.split(',');

            cartGoodNum=cartGoodNum.split(',');

           /* orderGoodsList = [];

            for(var i=0;i<cartGoodIdList.length;i++){

                orderGoodsList.push(
                    {
                        goodId: cartGoodIdList[i],
                        goodCount: cartGoodNum[i]
                    }
                )

            }*/

            //加载商品信息
            $.ajax({
                url: urL + cartList,
                anysc: false,
                data: {
                    userId: userId,
                    goodIdList: cartGoodIdList
                },
                traditional: true,
                success: function (info) {
                    console.log('多个商品列表')
                    console.log(info.data)
                    if (info.status !== 200) {
                        jfShowTips.toastShow({'text':'购物车'+info.msg});
                        return;
                    }

                    var html = template('product_html', {list: info.data});
                    $('.order_main_html').html(html);

                    $('.orderAmount_money').text('¥'+sumMoney);

                    $('.shouldPay_money').text('¥'+totalMoney);

                    totalPrices=sumMoney;//订单总金额

                    orderGoodData = info.data;

                    orderGoodsList = [];
                    for (var i = 0; i < orderGoodData.length; i++) {



                        orderGoodsList.push(
                            {
                                goodId: orderGoodData[i].goodId,
                                goodCount: orderGoodData[i].buyNum
                            }
                        )
                    }



                   // inventoryInfo(cartGoodIdList);//多个商品库存判断，参数为商品ID数组


                    ticketsListInfo();//优惠券

                    RedPackageInfo();//红包信息


                },
                error: function () {
                    jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
                }
            })
        } else if (packageId) {//套餐购买

            console.log('套餐购买-packageId='+packageId)
            orderSource = 3;
            //套餐商品信息
            $.ajax({
                url: urL + goodPackageDetail,
                anysc: false,
                data: {
                    packageId: packageId
                },
                traditional: true,
                success: function (info) {

                    if (info.status !== 200) {

                        return;
                    };
                    var html = template('product_html_meal', {list: info.data});
                    $('.order_main_html').html(html);
                    orderGoodData = info.data;
                    //获取goodIdList
                    var packageGoodIdList = [];

                    for (var i = 0; i < info.data.length; i++) {

                        packageGoodIdList.push(info.data[i].goodId);

                        totalPrices += (parseInt(orderGoodData[i].sellingPrice) * parseInt(orderGoodData[i].buyNum));

                    }

                    $('.orderAmount_money').text('¥'+totalPrices);


                    console.log('套餐购买ID组='+packageGoodIdList);

                    storeId = $('.yao_alignment_center').attr('data-storeid');  //获取一下当前地址的门店ID

                    orderGoodsList = [];
                    for (var i = 0; i < orderGoodData.length; i++) {

                        orderGoodsList.push(
                            {
                                goodId: orderGoodData[i].goodId,
                                goodCount: orderGoodData[i].buyNum
                            }
                        )
                    }
                    //库存信息
                   // inventoryInfo(packageGoodIdList)//多个商品库存判断，参数为商品ID数组


                    ticketsListInfo();//优惠券

                    RedPackageInfo();//红包信息

                },
                error: function () {
                    jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
                }
            })
        } else if (goodId) {//单个商品提交

            console.log('单个商品--goodId='+goodId);
            orderSource = 2;

            $.ajax({
                url: urL + goodDesc,
                anysc: false,
                data: {
                    id: goodId
                },
               // traditional: true,
                success: function (info) {
                    console.log(info);
                    if (info.status !== 200) {
                        jfShowTips.toastShow({'text':info.msg});
                        return;
                    }
                    ;
                    var html = template('product_html', {list: info.data});
                    $('.order_main_html').html(html);
                    orderGoodData = info.data;
                    $('span[data-buycount]').text('X' + buyGoodNum);
                    //库存
                    //获取一下当前地址的门店ID
                    storeId = $('.yao_alignment_center').attr('data-storeid');

                    console.log('storeId='+storeId);

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
                            stockGoodData = info1.data;

                            if(info1.data == null){
                                //info1.data = objdata2 = {};
                                stockGoodData = {};
                                stockGoodData['stock'] = 0;
                                console.log(stockGoodData);
                            };

                            //库存判断
                            if (buyGoodNum > stockGoodData.stock) {
                                $('#product_list0').addClass('repertory');
                            }
                            totalPrices = parseFloat(buyGoodNum) * parseFloat(info.data[0].sellingPrice);
                            //获取orderGoodsList
                            orderGoodsList = [];
                            orderGoodsList.push(
                                {
                                    goodId: orderGoodData[0].id,
                                    goodCount: buyGoodNum
                                }
                            );


                            ticketsListInfo();//优惠券

                            RedPackageInfo();//红包信息
                        }
                    })

                },
                error: function () {
                    jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
                }
            })
        }
    }

    //多个商品的库存信息
    function inventoryInfo(goodIdListDemo){

        $.ajax({
            url: urL + stockList,
            data: {
                goodIdList: goodIdListDemo,
                storeId: storeId
            },
            traditional: true,

            success:function (res) {

                console.log(res);
                if (res.status !== 200) {
                    jfShowTips.toastShow({'text':res.msg});
                    return;
                }

                stockGoodData = res.data;//返回的商品库存数据信息

                console.log(orderGoodData);//


                console.log(stockGoodData);



                orderGoodsList = [];
                for (var i = 0; i < orderGoodData.length; i++) {
                    if (orderGoodData[i].buyCount > stockGoodData[i].stock) {
                        $('#product_list_meal' + i).addClass('repertory');
                    }


                    orderGoodsList.push(
                        {
                            goodId: orderGoodData[i].goodId,
                            goodCount: orderGoodData[i].buyNum
                        }
                    )
                }

            }
        })



    }

    //优惠券信息

    function ticketsListInfo() {

        $.ajax({
            url: urL + availableList,
            data: {
                userId: userId,
                orderTotal: totalPrices
            },
            success:function (res) {

                console.log(res);

                if (res.status !== 200) {

                    $('#tickets_select option:eq(0)').html('暂无优惠券').attr('selected', true);

                    $('#tickets_select').attr('disabled',true);

                    return;
                }

                var html = template('tickets_option', {list: res.data});

                $('.tickets select').append(html);

                var allTickets=res.data;

                console.log(allTickets)

                var allDeduction=[];//满足条件的优惠券金额

                var thisDeduction;//当前优惠券减去金额

                var lastDeduction;//最终使用优惠券减去金额


                //获取红包钱数
                inputValueOne = parseFloat($('.RedPackage input').val()) || 0;//现金红包

                inputValueTwo = parseFloat($('.cashAmount input').val()) || 0;//购物红包

                var totalPackageCash=inputValueOne+inputValueTwo;



                //选择最优的优惠券
                for(var i=0;i<allTickets.length;i++){

                    if(allTickets[i].couponType.toString().indexOf('1')>-1){//立减类型

                        var allConditions=allTickets[i].conditions;

                        if(totalPrices>allConditions){//满足立减条件

                            thisDeduction=parseFloat(allTickets[i].deduction);

                            allDeduction.push(thisDeduction)
                        }

                    }else {//满减类型

                        thisDeduction=parseFloat(allTickets[i].deduction);

                        allDeduction.push(thisDeduction)

                    }
                }

                lastDeduction=Math.max.apply(null, allDeduction);//当前立减最大值；

                var thisRightIndex=getTicketsIndex();

                console.log(allTickets.length)


                function getTicketsIndex() {

                    for(var j=0;j<allTickets.length;j++){


                        if(allTickets[j].deduction.toString().indexOf(lastDeduction)>-1){

                            return j

                        }

                    }
                }

                var thisTrueIndex=thisRightIndex+1;

                $('#tickets_select option:eq('+thisTrueIndex+')').attr('selected', true);

                var thisPayMoney=parseFloat(totalPrices - lastDeduction - totalPackageCash)

                $('.shouldPay_money').html('¥'+thisPayMoney.toFixed(2));


                //优惠券点击选择
                $('#tickets_select').bind('change', function () {
                    couponId = $('#tickets_select option:selected').attr('data-couponId');
                    condition = parseFloat($('#tickets_select option:selected').attr('data-conditions')) || 0;//条件
                    deduction = parseFloat($('#tickets_select option:selected').attr('data-deduction')) || 0;//减去金额
                    usableDate = $('#tickets_select option:selected').attr('data-usableDate');

                    //获取红包钱数
                    inputValueOne = parseFloat($('.RedPackage input').val()) || 0;//现金红包

                    inputValueTwo = parseFloat($('.cashAmount input').val()) || 0;//购物红包

                    var totalPackageCash=inputValueOne+inputValueTwo;

                    if(parseFloat(totalPrices)>parseFloat(condition)){

                        console.log('达到满级条件');

                        if (deduction > (totalPrices - totalPackageCash)) {
                            jfShowTips.toastShow({'text':'优惠券的价值超过实际价格，请重新选择优惠券'});

                            $('#tickets_select option:eq(0)').attr('selected', true);

                            $('.shouldPay_money').html('¥' + (totalPrices - totalPackageCash).toFixed(2));

                            return;
                        }else {

                            $('.shouldPay_money').html('¥' + parseFloat(totalPrices - deduction - totalPackageCash).toFixed(2));
                        }


                    }else {

                        jfShowTips.toastShow({'text':'当前订单总额没有达到满减金额'});
                    }

                    
                })
                
            },
            error:function (res) {
                console.log(res);
                jfShowTips.toastShow({'text':'优惠券加载失败'})

            }
        })

    }
    
    //红包信息
    
    function RedPackageInfo() {

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
                    $('.RedPackage input').attr({placeholder:'当前没有可用购物红包',disabled:true});

                    $('.cashAmount input').attr({placeholder:'当前没有可用现金红包',disabled:true});
                    return;
                }
                var redhtml = template('RedPackage_html', {list: info.data});

                $('.RedPackage').append(redhtml);

                var cashHtml=template('cash_html', {list: info.data});

                $('.cashAmount').append(cashHtml);

                RedPackageNum = info.data.shopRedPackage;

                cashNum=info.data.moneyRedPackag;

                var cashAndRed=parseFloat(RedPackageNum)+parseFloat(cashNum);

                var thisShouldPay=$('.shouldPay_money').html().toString().substr(1);//优惠券之后应该支付的金额

                if(thisShouldPay>cashAndRed){//分别填充红包的最大值

                    $('.RedPackage input').val(RedPackageNum);

                    $('.cashAmount input').val(cashNum);

                }else if(thisShouldPay<RedPackageNum){//金额小于其中购物红包

                    $('.RedPackage input').val(thisShouldPay);

                    $('.cashAmount input').val(0);//现金红包默认为0

                }

                thisShouldPay=thisShouldPay-cashAndRed;//减去红包之后应付的金额

                $('.shouldPay_money').html('￥'+thisShouldPay.toFixed(2));


                //输入购物红包
                $('.RedPackage input').change(function () {


                    var inputValue = parseFloat($('.RedPackage input').val()); //输入的红包金额

                    var inputValueCash=parseFloat($('.cashAmount input').val());//现金红包金额


                    if(inputValue>parseFloat(RedPackageNum)){//输入金额大雨红包金额,输入错误

                        jfShowTips.toastShow({'text':'您的金额超了哦，请重新输入'});

                        $('.RedPackage input').val(''); //置空

                        $('.shouldPay_money').html('¥' + parseFloat(totalPrices - deduction-inputValueCash).toFixed(2));

                    }else {

                        if((inputValue + deduction) > totalPrices){//购物红包+优惠券的金额>订单总金额

                            jfShowTips.toastShow({'text':'您的红包抵扣金额大于订单金额，请重新输入！'});
                            //置空
                            $('.RedPackage input').val('');

                            $('.shouldPay_money').html('¥' + parseFloat(totalPrices - deduction-inputValueCash).toFixed(2));

                            return;

                        }else if((inputValue+inputValueCash + deduction) > totalPrices){////现金红包+优惠券的金额>订单总金额

                            jfShowTips.toastShow({'text':'您的红包抵扣金额大于订单金额，请重新输入！'});
                            //置空
                            $('.RedPackage input').val('');

                            $('.shouldPay_money').html('¥' + parseFloat(totalPrices - deduction).toFixed(2));

                            return;

                        }else if((inputValue+inputValueCash + deduction) < totalPrices){//正常输入

                            $('.shouldPay_money').html('¥' + parseFloat(totalPrices-inputValue+inputValueCash + deduction).toFixed(2));
                        }

                    }

                    deduction = parseFloat($('#tickets_select option:selected').attr('data-deduction')) || 0;
                    //计算应付金额
                   // amountPayable = (totalPrices * 100 - inputValue * 100 -inputValueCash*100 - deduction * 100) / 100;

                })


                //输入现金红包
                $('.cashAmount input').change(function () {

                    var inputValue = parseFloat($('.cashAmount input').val()); //输入的红包金额

                    var inputValueCash=parseFloat($('.RedPackage input').val());//购物红包金额

                    if(inputValue>parseFloat(cashNum)){//输入金额大雨红包金额,输入错误

                        jfShowTips.toastShow({'text':'您的金额超了哦，请重新输入'});

                        $('.cashAmount input').val(''); //置空

                        $('.shouldPay_money').html('¥' + parseFloat(totalPrices - deduction-inputValueCash).toFixed(2));

                    }else {

                        if((inputValue + deduction) > totalPrices){//购物红包+优惠券的金额>订单总金额

                            jfShowTips.toastShow({'text':'您的红包抵扣金额大于订单金额，请重新输入！'});
                            //置空
                            $('.cashAmount input').val('');

                            $('.shouldPay_money').html('¥' + parseFloat(totalPrices - deduction-inputValueCash).toFixed(2));

                            return;

                        }else if((inputValue+inputValueCash + deduction) > totalPrices){////现金红包+优惠券的金额>订单总金额

                            jfShowTips.toastShow({'text':'您的红包抵扣金额大于订单金额，请重新输入！'});
                            //置空
                            $('.cashAmount input').val('');

                            $('.shouldPay_money').html('¥' + parseFloat(totalPrices - deduction).toFixed(2));

                            return;

                        }else if((inputValue+inputValueCash + deduction) < totalPrices){//正常输入

                            $('.shouldPay_money').html('¥' + parseFloat(totalPrices-inputValue+inputValueCash + deduction).toFixed(2));
                        }

                    }

                   // deduction = parseFloat($('#tickets_select option:selected').attr('data-deduction')) || 0;

                    //计算应付金额
                    // amountPayable = (totalPrices * 100 - inputValue * 100 -inputValueCash*100 - deduction * 100) / 100;
                })
            },
            error: function () {
                jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
            }
        })
    }
    
   
    
    function stock2() {
        //库存判断
        orderGoodsList = [];

        console.log('orderGoodData.length='+orderGoodData.length)

        console.log('orderGoodData.length='+orderGoodData.length)


        for (var i = 0; i < orderGoodData.length; i++) {
            if (orderGoodData[i].buyCount > stockGoodData[i].stock) {
                $('#product_list' + i).addClass('repertory');
            }
            ;

            console.log(parseInt(orderGoodData[i].sellingPrice));
            console.log(parseInt(orderGoodData[i].buyCount));
            totalPrices += (parseInt(orderGoodData[i].sellingPrice) * parseInt(orderGoodData[i].buyCount));

            //获取orderGoodsList
            orderGoodsList.push(
                {
                    goodId: orderGoodData[i].id,
                    goodCount: orderGoodData[i].buyCount
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

                    $('.RedPackage input').attr({placeholder:'当前没有可用购物红包',disabled:true});

                    $('.cashAmount input').attr({placeholder:'当前没有可用现金红包',disabled:true});

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

    //
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


        chooseAddress();//地址选择
    }



    chooseAddress();


    function chooseAddress() {//选择地址

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

        console.log($.cookie('packageId')+'套餐')
        $.cookie('goodId', goodId);
        $.cookie('buyGoodNum', buyGoodNum);

        //跳选择页面
        location.href = 'choose_address.html';
    })

    }



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