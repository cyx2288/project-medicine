/*
$(function(){
    var urL = url();

    //小分类获取
    var categoryList = '/category/list';

    //小分类对应数据
    var goodList = '/good/list';

    //获取url传过来的值
    var cateId = getParam('cateId');
    var categoryId = getParam('categoryId');

    var page = 1;

    //获取小分类
    $.ajax({
        url:urL + categoryList,
        anysc:false,
        data:{
            parentId:categoryId,
            total:0
        },
        success:function(info){
            if(info.status !== 200){
                alert(info.msg);
                return;
            };
            var html = template('yao_shadow_html',{list:info.data});
            $('.yao_shadow').html(html);
            var dom =$("span[data-shadow='"+cateId+"']");
            dom.addClass('choosed').siblings().removeClass('choosed')
            //获取对应小分类商品数据
            goodsList(cateId);
        }
    })

    //获取小分类对应商品
    $('.category_tab').on('click',function(e){
        //获取当前按钮对应的id
        var cateId = parseInt($(e.target).attr('data-shadow'));
        console.log(cateId)
        goodsList(cateId);
    })


    /!*封装部分*!/

    /!*获取url上的参数值的方法*!/
    function getParam(name) {
        var search = document.location.search;
        //alert(search);
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

    // 2. 商品列表
    function goodsList(cateId1){
        $.ajax({
            url:urL + goodList,
            data:{
                cateId:cateId1
            },
            success:function(info){
                if(info.status !== 200){
                    alert(info.msg);
                    return;
                };
                console.log(info)
                var html = template('search_result_list_html',{list:info.data})
                $('.search_result_list').html(html);
                //加懒加载
                var ajax_getting = false;
                $(window).scroll(function() {
                    clearTimeout(timer2);
                    timer2 = setTimeout(function() {
                        var scrollTop = $(document.body).scrollTop();
                        var scrollHeight = $('body').height();
                        var windowHeight = innerHeight;
                        var scrollWhole = Math.max(scrollHeight - scrollTop - windowHeight);
                        if (scrollWhole < 100) {
                            if (ajax_getting) {
                                return false;
                            } else {
                                ajax_getting = true;
                            }
                            $('.search_result_list').append('<div class="load"><img src="../../images/load.gif" width="6%" /></div>');
                            $('html,body').scrollTop($(window).height() + $(document).height());
                            page++;

                            $.ajax({
                                url:urL + goodList,
                                data:{
                                    searchParam:categoryId,
                                    pageNum:page
                                },
                                success:function(info){
                                    console.log(info);
                                    if(info.data == null ){
                                        $(".load").remove();
                                        $('.search_result_list').append('<div class="no-data">没有更多数据</div>');
                                        $('.no-data').css('text-align','center')
                                        $(window).unbind('scroll');
                                        return;
                                    };
                                    $(".load").remove();
                                    var html = template('goodlistSearch_html',{list:info.data});
                                    $('.search_result_list').append(html);
                                    ajax_getting = false;
                                }
                            })
                        };
                        $(".load").remove();
                    }, 200);
                });
            },
            error: function() {
                alert('系统繁忙，请稍后再试');
            }
        })
    }
})*/




$(function(){
    var urL = url();

    //小分类获取
    var categoryList = '/category/list';

    //小分类对应数据
    var goodList = '/good/list';

    //获取url传过来的值
    var cateId = getParam('cateId');


    var categoryId = getParam('categoryId');

    var page = 1;

    //获取小分类
    $.ajax({
        url:urL + categoryList,
        anysc:false,
        data:{
            parentId:categoryId,
            total:0
        },
        success:function(info){
            if(info.status !== 200){
                alert(info.msg);
                return;
            };
            var html = template('yao_shadow_html',{list:info.data});
            $('.category_tab').html(html);

            var dom =$("span[data-shadow='"+cateId+"']");

            dom.addClass('choosed').siblings().removeClass('choosed')
            //获取对应小分类商品数据
            goodsList(cateId);
        }
    })

    //获取小分类对应商品
    $('.category_tab').on('click',function(e){
        //获取当前按钮对应的id
        var cateId = parseInt($(e.target).attr('data-shadow'));

        goodsList(cateId);
    })


    /*封装部分*/

    /*获取url上的参数值的方法*/
    function getParam(name) {
        var search = document.location.search;
        //alert(search);
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

    // 2. 商品列表
    function goodsList(cateId1){
        $.ajax({
            url:urL + goodList,
            data:{
                cateId:cateId1
            },
            success:function(info){
                if(info.status !== 200){
                    alert(info.msg);
                    console.log(info)
                    return;
                };

                var html = template('search_result_list_html',{list:info.data})
                $('.search_result_list').html(html);
                //加懒加载
                var ajax_getting = false;
                $(window).scroll(function() {

                    var timer2;

                    clearTimeout(timer2);
                    timer2 = setTimeout(function() {
                        var scrollTop = $(document.body).scrollTop();
                        var scrollHeight = $('body').height();
                        var windowHeight = innerHeight;
                        var scrollWhole = Math.max(scrollHeight - scrollTop - windowHeight);
                        if (scrollWhole < 100) {
                            if (ajax_getting) {
                                return false;
                            } else {
                                ajax_getting = true;
                            }
                            $('.search_result_list').append('<div class="load"><img src="../../images/load.gif" width="6%" /></div>');
                            $('html,body').scrollTop($(window).height() + $(document).height());
                            page++;

                            $.ajax({
                                url:urL + goodList,
                                data:{
                                    searchParam:cateId,
                                    pageNum:page
                                },
                                success:function(info){
                                    console.log(info);
                                    if(info.data == null ){
                                        $(".load").remove();
                                        $('.search_result_list').append('<div class="no-data">没有更多数据</div>');
                                        $('.no-data').css('text-align','center')
                                        $(window).unbind('scroll');
                                        return;
                                    };
                                    $(".load").remove();
                                    var html = template('goodlistSearch_html',{list:info.data});
                                    $('.search_result_list').append(html);
                                    ajax_getting = false;
                                }
                            })
                        };
                        $(".load").remove();
                    }, 200);
                });
            },
            error: function() {
                alert('系统繁忙，请稍后再试');
            }
        })
    }
})
