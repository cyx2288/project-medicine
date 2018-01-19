$(function(){

    var urL = url();
    var redUrl ='/userDetail/redPackageList';
    var userId = $.cookie("userId");


    $.ajax({
        type:'get',
        url:urL + redUrl,

        data:{
            userId: userId
        },
        success:function(res){
            console.log(res);
            if(res.status !== 200){
                jfShowTips.toastShow({'text':res.msg});
                return;
            };
            var html = template('redPackList',{list:res.data.redPackageUseList});

            $('.details_list').html(html);



        },
        error:function(res){
            console.log(res);
            jfShowTips.toastShow({'text':"系统繁忙，请稍后再试"})
        }
    })



})
