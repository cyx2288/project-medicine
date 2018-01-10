$(function(){
    var urL = url();
    //活动详情接口
    var goodsUrl = '/rank/goods';

    //获取用户名下店铺信息(默认为总店)
    //var storeId = plus.storage.getItem('storeId');
    var storeId = $.cookie('storeId') || 1001;
    var totalNum = 0;
    var categoryId = getParam('categoryId');




	//1. 排名部分
    $.ajax({
        url:urL + goodsUrl,
        data:{
            categoryId:categoryId,
            storeId:storeId,
            total:totalNum
        },
        success:function(info){
            if(info.status !== 200){
                jfShowTips.toastShow(info.msg);
                return;
            };
            var html = template('active_details',{list:info.data});
            $("#items_details").html(html);
        },
        error: function(info) {
            console.log(info)
            jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'})
        }
    })

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
})