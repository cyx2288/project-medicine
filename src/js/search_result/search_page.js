$(function(){
    var urL = url();
    var searchParam = '';
    //商品搜索
    var goodlistSearch = '/good/list/search';
    //搜索记录
    var searchHistory = '/searchHistory';

    var page = 1;

    var userId = $.cookie('userId') || '';

    $('#goodlistSearch').click(function(){
        //获取文本框信息
        searchParam = $('.search input').val();
        console.log(searchParam)
        var innerHeight = window.innerHeight;
        var timer2 = null;
        $.ajax({
            url: urL + goodlistSearch,
            type: 'GET',
            dataType: 'json',
            timeout: '1000',
            cache: 'false',
            data:{
                searchParam:searchParam,
                pageNum:1
            },
            success: function (info) {
                console.log(info);
                if(info.status !== 200 ){
                    return;
                };
                var html = template('goodlistSearch_html',{list:info.data});
                $('.search_result_list').html(html);
                //懒加载
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
                                url:urL + goodlistSearch,
                                data:{
                                    searchParam:searchParam,
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
                                },
                                error: function() {
                                    jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
                                }
                            })
                        };
                        $(".load").remove();
                    }, 200);
                });
            },
            error: function() {
            jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
        }
        })

        //搜索记录
        $.ajax({
            url:urL + searchHistory,
            type:'post',
            data:{
                userId:userId,
                searchInfo:searchParam
            },
            success:function(){

            },
            error: function() {
                jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
            }
        })
    })












})