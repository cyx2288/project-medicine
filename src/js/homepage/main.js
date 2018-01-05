$(function(){
    var urL = url();

    //图片轮播
    var bannerUrl='/ad/banner';
    //排名商品获取
    var goodsUrl = '/rank/goods';
    //品牌排名广场
    var urlBrand = '/rank/brand';
    //套餐参考
    var urlPackage = '/rank/package';
    //分类
    var urlList = '/category/list';
    //门店
    var storeList = '/store/list';
    //分类排名8
    var rankCategory = '/rank/category';
    //广告--推广软文
    var adBanner='/ad/info';

    $.cookie('goodIdList', '', {expires: -1});
    $.cookie('packageId', '', {expires: -1});
    $.cookie('goodId', '', {expires: -1});

    var userId = $.cookie('userId');


    //轮播图 静态

    //地址初始化
    if($.cookie('addressHtml')){
        console.log($.cookie('addressHtml'));
        $('#address_info').text($.cookie('addressHtml'));
    };

    //1. 活动特价部分（初始化）
    goodsList(21,1001,'sale_box',$('.sale_box'),4);
    //2. 近期热卖部分（初始化）
    goodsList(21,1001,'hot_list',$('.hot_list'),4);
    //3. 品牌广场部分（初始化）
    $.ajax({
        url:urL + urlBrand,
        data:{
            categoryId:31,
            total:4
        },
        success:function(info){
            console.log(info);
            if(info.status !== 200){
                alert(info.msg);
                return;
            };
            var html = template('list_brand',{list:info.data});
            $('.list_brand').html(html);
        },
        error: function() {
            alert('系统繁忙，请稍后再试');
        }
    })
    //4. 套餐参考部分（初始化）
    $.ajax({
        url:urL + urlPackage,
        data:{
            categoryId:41,
            total:8
        },
        success:function(info){
            console.log(info);
            if(info.status !== 200){
                alert(info.msg);
                return;
            };
            var html = template('normal_box',{list:info.data});
            $('.normal_box').html(html);
            //存goodIdlist


            //套餐立即购买
            $('.normal_box').on('click','.gobuy',function(){
                alert(1)
                var packageId = $('.gobuy').attr('data-id');
                //$.cookie('packageId',packageId);
                //console.log($.cookie('packageId'));
                //跳页面
                console.log(packageId);
                location.href = "../../html/order/submit_order_page.html?packageId=" + packageId;

            })
            $('.normal_box_a').click(function(){
                //alert(1)

            })
        },
        error: function() {
            alert('系统繁忙，请稍后再试');
        }
    })
    //5. 分类部分
    //5.1 药品（初始化）
    categoryList(101,'category_list1',$('.category_list1'));
    //5.2 医疗保健器械（初始化）
    categoryList(102,'category_list2',$('.category_list2'));
    //5.2 保健品（初始化）
    categoryList(103,'category_list3',$('.category_list3'));
    //5.2 计生用品（初始化）
    categoryList(104,'category_list4',$('.category_list4'));
    //门店信息
    $('.store_list').click(function(){
        location.href = '../medicine_store/store_list.html';
    })
    //门店
    $.ajax({
        url:urL + storeList,
        data:{
            total:2
        },
        success:function(info){
            console.log(info);
            if(info.status !== 200){
                alert(info.msg);
                return;
            };
            var html = template('store_list_html',{list:info.data});
            $('.store_list1').html(html);
        },
        error: function() {
            alert('系统繁忙，请稍后再试');
        }
    })
    
    
	//
	$(".shoppBtn").click(function(){
		if(userId == undefined){
			var suggest = confirm("请登录");
			if(suggest==true){
				location.href = "../../html/login/login_system.html"
			}
		}else{
			location.href = "../../html/shopping_cart/shopping_cart_main.html"
		}
	})
	
	
    /*封装部分*/

    //1. 排名部分
    function goodsList(categoryId,storeId,temID,dom,totalNum) {
        $.ajax({
            url:urL + goodsUrl,
            data:{
                categoryId:categoryId,
                total:totalNum
            },
            success:function(info){

                console.log(info)
                if(info.status !== 200){
                    alert(info.msg);
                    return;
                };
                console.log(info)
                var html = template(temID,{list:info.data});
                dom.html(html);
            },
            error: function() {
                alert('系统繁忙，请稍后再试');
            }
        })
    }

    //2. 分类
    function categoryList(parentId,temId,dom){
        $.ajax({
            url:urL + urlList,
            data:{
                parentId:parentId,
                total:4
            },
            success:function(info){
                console.log(info);
                if(info.status !== 200){
                    alert(info.msg);
                    return;
                };
                var html = template(temId,{list:info.data});
                dom.html(html);
            },
            error: function() {
                alert('系统繁忙，请稍后再试');
            }
        })
    }

    //商品图片轮播图
    $.ajax({
        url: urL + bannerUrl,
        data: {
            clientType: 3
        },
        success: function (info) {

            console.log(info);
            var html = template('bannerPlay', {list: info.data});

            $('.jf_autoplay_images').html(html);

            jfAutoPlay.jfCarouselInit();//轮播

        },
        error: function (info) {
            console.log(info)
            //alert('系统繁忙，请稍后再试');
        }
    })


    //广告--推广软文
    $.ajax({
        url: urL + adBanner,
        data: {
            clientType: 3,
            sit:12,
        },
        success: function (info) {
            console.log(info);

            var html = template('adInfo', {list: info.data});
            $('.banner_active').html(html);

        },
        error: function (info) {
            console.log(info)
           // alert('系统繁忙，请稍后再试');
        }
    })




})