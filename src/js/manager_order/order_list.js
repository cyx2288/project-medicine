
$(function() {

    var urL = url();

    var orderList = '/backOrder/list';//订单列表

    var userId = $.cookie("bUserId");

    var storeId = $.cookie("bStoreId");

    var buType = $.cookie("bType");

    //订单列表
    $.ajax({
        url: urL + orderList,
        type: 'get',
        data: {
            userId: userId,
            buType: buType,
            storeId: storeId,
            pageNum: 1

        },
        success: function (res) {

            console.log(res);

            if (res.status !== 200) {
                jfShowTips.toastShow({'text': '暂无订单'});
                return;
            }
            var html = template('orderList', {list: res.data});
            $('#orderListMain').html(html);

        },
        error: function (res) {
            console.log(res);
            jfShowTips.toastShow({'text': "系统繁忙，请稍后再试"})
        }
    })


})