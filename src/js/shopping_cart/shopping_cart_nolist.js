$(function(){
    var urL = url();
 	var goodsUrl = "/rank/goods";

    //地址初始化
    if($.cookie('addressHtml')){
        console.log($.cookie('addressHtml'));
        $('#address_info').text($.cookie('addressHtml'));
    };
 
        $.ajax({
        	type:"GET",
            url: urL + goodsUrl,
            data:{
                categoryId: "22",
                total: "5"
            },
            success:function(info){
                console.log(info);
                var html = template('hotList',{list:info.data});
                $(".hot_list").html(html);
           	},
            error: function() {
                jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
            }
           
        })



})