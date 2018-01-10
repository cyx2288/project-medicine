$(function () {

    var urL = url();
    //商品基本信息
    var goodDesc = '/good/desc';
    //库存接口
    var goodStock = '/stock';
    //用药讲究
    var goodSuggest = '/good/suggest';
    //套餐参考
    var goodPackage = '/good/package';
    //加入购物车
    var cartAdd = '/cart/add';
    //套餐加入购物车/立即购买
    var cartAddPackage = '/cart/addPackage';
    //商品轮播图
    var imgList = '/img/list';
    //商品详情
    var goodDetail = '/good/detail';


    //取页面传过来的商品ID
    var str = location.search;
    var productID = getProductid(str);

    //门店ID
    var storeId = $.cookie('storeId');
    //var userId = plus.cookie('userId');
    var userId = $.cookie('userId');
    var buyCount = '';
    var goodId = '';





    //套餐商品ID
    var cateId1 = 0;
    var packageIndex = 1;
    var flag = true;


    $.cookie('goodIdList', '', {expires: -1});
    $.cookie('packageId', '', {expires: -1});
    $.cookie('goodId', '', {expires: -1});



    //地址初始化
    if($.cookie('addressHtml')){
        console.log($.cookie('addressHtml'));
        $('#address_info').text($.cookie('addressHtml'));
    };


    //请求页面
    $.ajax({
        url: urL + goodDesc,
        async: false,
        data: {
            id: productID
        },
        success: function (info) {
            console.log(info);

            if (info.status !== 200) {
                jfShowTips.toastShow(info.msg);
                return;
            }
            ;
            var html = template('goodDesc_html', {list: info.data});
            $('#goodDesc').html(html);
            cateId1 = info.data[0].cateId;
            console.log($('.parameter_table'));
            $('.parameter_table').html('<p>' + info.data[0].goodDesc + '</p>');
        },
        error: function () {
            jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
        }
    })

    //商品图片轮播图
    $.ajax({
        url: urL + imgList,
        data: {
            imgType: 1,
            businessId: productID
        },
        success: function (info) {

            console.log(info);
            var html = template('autoPlay_img', {list: info.data});
            $('.product_autoPlay').html(html);

            /*商品详情页图片滚动以及缩放*/
            productInfoPlay.init({

                "moveEle": "product_details_autoPlay",//包裹所有图片的class选择器

                "moveEleParent": "product_autoPlay",//包括点点以及图片的父元素，class选择器

                "allShowEle": "product_show_content",//弹出模块框架的class值

                "scaleEleParent": "jdshow_center_center",//缩放元素的父元素，class值

                fn: function () {//执行相应的脚本

                    // jfProductDetails.scrollEle(document.getElementById('NavTab'),45)
                }
            });
        },
        error: function () {
            jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
        }
    })

    //商品详情
    $.ajax({
        url: urL + goodDetail,
        data: {
            id: productID
        },
        success: function (info) {
            console.log(info);
            //$('.parameter_table').html(info.data[0].goodDetails)
            $('.images_info').html(info.data[0].goodDetails)
        },
        error: function () {
            jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
        }
    })

    //库存接口
    $.ajax({
        url: urL + goodStock,
        data: {
            goodId: productID,
            storeId: storeId
        },
        success: function (info) {

            console.log(info);
            if (info.status !== 200) {
                jfShowTips.toastShow(info.msg);
                return;
            }
            ;
            var html = template('goodDesc_htmlstock', {list: info.data});
            $('.original_price').html(html);
            var sellingPrice = info.data.storePrice - $('.price').attr('data-sellingPrice');
            sellingPrice = Math.floor(sellingPrice * 100) / 100;
            console.log(sellingPrice);
            if (sellingPrice) {
                $('#provincePrice').html(sellingPrice + "元");
            } else {
                $('#provincePrice').html(0 + "元");
            }
        },
        error: function () {
            jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
        }
    })

    //用药讲究
    $.ajax({
        url: urL + goodSuggest,
        data: {
            id: productID
        },
        success: function (info) {
            console.log(info);
            if (info.status !== 200) {
                jfShowTips.toastShow(info.msg);
                return;
            }
            ;
            var html = template('goodSuggest_html', {list: info.data});
            $('.medicine_usage').append(html);
        },
        error: function () {
            jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
        }
    })

    //单个商品加入购物车
    $('#addCar').click(function () {

        if (userId == undefined) {
            var suggest = confirm("请登录");
            if (suggest == true) {
                location.href = "../../html/login/login_system.html"
            }
        } else {
            buyCount = $('.volume_input').val();
            goodId = $('p').attr('data-goodId');
            console.log(goodId);
            $.ajax({
                url: urL + cartAdd,
                type: 'post',
                data: {
                    _method: "put",
                    userId: userId,
                    goodId: goodId,
                    buyCount: buyCount,
                },
                success: function (info) {

                    if (info.status !== 200) {
                        jfShowTips.toastShow(info.msg);
                        return;
                    }
                    ;
                    jfShowTips.toastShow(info.msg);

                },
                error: function () {
                    jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
                }
            })
        }

    })

    //单个商品立即购买
    $('#goShopping').click(function () {
        if (userId == undefined) {
            var suggest = confirm("请登录");
            if (suggest == true) {
                location.href = "../../html/login/login_system.html"
            }
        } else {
            buyCount = $('.volume_input').val();
            goodId = $('p').attr('data-goodId');
            console.log(goodId);
            //数量
            var buyGoodNum = $('.volume_input').val();
            console.log(buyGoodNum);
            //$.cookie('goodId',goodId,{path:'/'});
            //$.cookie('buyGoodNum',buyGoodNum,{path:'/'});
            location.href = "../../html/order/submit_order_page.html?goodId=" + goodId + '&buyGoodNum=' + buyGoodNum;
        }


    })

    //套餐加入购物车
    $('.meal_add_car').click(function () {
        if (userId == undefined) {
            var suggest = confirm("请登录");
            if (suggest == true) {
                location.href = "../../html/login/login_system.html"
            }
        }else{
            var packageId = $('.cloum p').attr('data-id');
            $.ajax({
                url: urL + cartAddPackage,
                type: 'put',
                data: {
                    userId: userId,
                    packageId: packageId,
                },
                success: function (info) {
                    if (info.status !== 200) {
                        jfShowTips.toastShow(info.msg);
                        return;
                    }
                    ;
                    jfShowTips.toastShow(info.msg);
                },
                error: function () {
                    jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
                }
            })
        }

    })

    //套餐立即购买
    $('.meal_add_buy').click(function () {
        if (userId == undefined) {
            var suggest = confirm("请登录");
            if (suggest == true) {
                location.href = "../../html/login/login_system.html"
            }
        }else{
            var packageId = $('.cloum p').attr('data-id');
            //$.cookie('packageId',packageId,{path:'/'});
            location.href = "../../html/order/submit_order_page.html?packageId=" + packageId;
        }


    })


    //套餐购买参考(初始化)
    getmealList(cateId1, packageIndex);

    //套餐上下功能
    $('#prev').click(function () {
        packageIndex--;
        getmealList(cateId1, packageIndex);
    });
    $('#next').click(function () {
        packageIndex++;
        getmealList(cateId1, packageIndex);
    })

    $('.details_shopping').click(function(){
        if (userId == undefined) {
            var suggest = confirm("请登录");
            if (suggest == true) {
                location.href = "../../html/login/login_system.html"
            }
        }else{
            location.href = '../../html/shopping_cart/shopping_cart_main.html';
        }
    })


    /*封装部分*/

    // 1. 获取url上的参数值的方法
    function getProductid(str) {
        var str1 = str.slice(1);
        var arr = str1.split("=");
        var obj = {};
        obj[arr[0]] = arr[1];
        return obj[arr[0]];
    }

    // 2. 获取套餐参考列表
    function getmealList(cateId, packageIndex1) {
        $.ajax({
            url: urL + goodPackage,
            data: {
                cateId: cateId,
                packageIndex: packageIndex1
            },
            success: function (info) {
                if (!info.data) {
                    $('.medicine_reference').remove();
                    return;
                }


                console.log(info)
                if (info.status !== 200) {
                    //jfShowTips.toastShow(info.msg);
                    return;
                }
                ;
                //判断
                //

                $("#prev").attr("disabled", false);
                $('#next').attr("disabled", false);
                var html1 = template('goodpackage_title', {list: info});
                $('.cloum').html(html1);
                var html2 = template('goodpackage_text', {list: info.data.packageDetails})
                $('.product_reference').html(html2);
                packageIndex = info.data.packageIndex;
                console.log(packageIndex);


                if (!info.data.nextPackage) {
                    //jfShowTips.toastShow('已经是最后一个套餐了');
                    packageIndex--;
                    $('#next').attr("disabled", true);
                    $("#prev").attr("disabled", false);
                    packageIndex += 1;
                }
                if (info.data.packageIndex == 1) {
                    //jfShowTips.toastShow('这是第一个套餐');
                    packageIndex = 1;
                    $('#prev').attr("disabled", true);
                    $('#next').attr("disabled", false);

                }
            },
            error: function () {
                jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
            }
        })
    }


    //  添加商品信息


    //分享
    var Share = {};
    Share.info = {
        id: 'H592CDC09',
        name: 'YAO-APP',
        head_image: "../../images/icon_search.png",
        introduce: '推荐感冒灵999冲剂给你，手机买药还送到家。'
    };
    /**
     * 更新分享服务
     */
    var shares = null;

    function getSerivces() {
        plus.share.getServices(function (s) {

            shares = {};
            for (var i in s) {
                var t = s[i];
                shares[t.id] = t;
            }
        }, function (e) {
            console.log("获取分享服务列表失败：" + e.message);
        });
    };

    function shareAction(id, ex) {
        var s = null;

        if (!id || !(s = shares[id])) {
            console.log("无效的分享服务！");
            return;
        }
        if (s.authenticated) {
            console.log("---已授权---");
            shareMessage(s, ex);
        } else {
            console.log("---未授权---");
            // 授权无法回调，有bug
            s.authorize(function () {
                console.log('授权成功...')
                shareMessage(s, ex);
            }, function (e) {
                console.log("认证授权失败：" + e.code + " - " + e.message);
            });
        }
    };
    var sharecount = 0;

    /**
     * 发送分享消息
     * @param
     */
    function shareMessage(s, ex) {
        plus.nativeUI.showWaiting();
        var msg = {
            extra: {
                scene: ex
            }
        };
        msg.href = "http://2.mchch.applinzi.com" + "?id=" + goodId;
        msg.title = "平价实体药店，24H送药到家";
        msg.content = Share.info.introduce;
        //取本地图片
        var img = plus.io.convertAbsoluteFileSystem(Share.info.head_image.replace('file://', ''));
        console.log(img);
        msg.thumbs = [img];
        if (sharecount > 0) {
            //如果本地图片过大，导致分享失败，递归时重新分享获取默认图片
            msg.thumbs = ["../../images/icon_search.png"];
        }
        console.log(JSON.stringify(msg));
        s.send(msg, function () {
            plus.nativeUI.closeWaiting();
            var strtmp = "分享到\"" + s.description + "\"成功！ ";
            console.log(strtmp);
            plus.nativeUI.toast(strtmp, {
                verticalAlign: 'center'
            });

            if(strtmp != undefined){
                if(ex == "WXSceneSession"){
                    shareTypes = 1
                }else{
                    shareTypes = 2
                }
                $.ajax({
                    type:"POST",
                    url: urL + '/shareHistory',
                    data:{
                        userId: userId,
                        businessType: '1',
                        businessId: goodId,
                        shareType: shareTypes
                    },
                    success:function(){
                    },
                    error:function(){
                    }
                });
            }






            sharecount = 0;
        }, function (e) {
            plus.nativeUI.closeWaiting();
            if (e.code == -2) {
                plus.nativeUI.toast('已取消分享', {
                    verticalAlign: 'center'
                });
                sharecount = 0;
            } else if (e.code == -3 || e.code == -8) {
                console.log(e.code);
                if (++sharecount < 2) {
                    // 分享失败可能是图片过大的问题，递归取默认图片重新分享
                    shareMessage(s, ex);
                } else {
                    sharecount = 0;
                    plus.nativeUI.toast('分享失败', {
                        verticalAlign: 'center'
                    });
                }
            } else {
                console.error('分享失败:' + JSON.stringify(e))
            }
            console.log("分享到\"" + s.description + "\"失败: " + e.code + " - " + e.message);
        });
    };

    function share() {
        bhref = true;
        var ids = [{
                id: "weixin",
                ex: "WXSceneSession"
            }, {
                id: "weixin",
                ex: "WXSceneTimeline"
            }],
            bts = [{
                title: "发送给微信好友"
            }, {
                title: "分享到微信朋友圈"
            }];
        plus.nativeUI.actionSheet({
                cancel: "取消",
                buttons: bts
            },
            function (e) {
                var i = e.index;
                if (i > 0) {
                    shareAction(ids[i - 1].id, ids[i - 1].ex);
                }
            }
        );
    };
    Share.share = share;
    window.Share = Share;

    function plusReady() {
        $(".share").on('click', function () {
            getSerivces();
            shareAction();
            share();
        })
    }

    document.addEventListener("plusready", plusReady, false);

})