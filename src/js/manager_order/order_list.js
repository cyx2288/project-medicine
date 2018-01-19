

window.addEventListener('load',function () {

    var swtichA=1;

    orderList(swtichA);

    var switchN=1;

    console.log('switchN='+switchN);

    document.addEventListener('scroll',function () {

        var thisScrollTop=document.body.scrollTop||document.documentElement.scrollTop;//滚动条位置

        var thisClientHeight=document.body.clientHeight;

        var thisBodyScroll=document.body.scrollHeight;

        if(thisBodyScroll-thisScrollTop-thisClientHeight<10){

            if(switchN){

                switchN=0;

                swtichA++;

                orderList(swtichA);

                console.log('switchN='+switchN);

            }

        }

    },false)


    function orderList(num) {

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
                pageNum: num

            },
            success: function (res) {

                console.log(res);

                if (res.status !== 200) {
                    jfShowTips.toastShow({'text': '暂无订单'});
                    return;
                }
                var html = template('orderList', {list: res.data});

                if(res.data.length==20){

                    switchN=1;

                }

                else{

                    setTimeout(function () {

                        document.getElementsByClassName('weui-loadmore')[0].style.display='none';

                        document.getElementsByClassName('weui-loadmore')[1].style.display='block';

                    },500)

                }

                $('#orderListMain').html($('#orderListMain').html()+html);

            },
            error: function (res) {
                console.log(res);
                jfShowTips.toastShow({'text': "系统繁忙，请稍后再试"})
            }
        })


    }


},false)