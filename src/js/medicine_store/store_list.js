$(function(){

    var urL = url();
    var storeLiUrl = '/store/list';
    var storeId;
    //请求页面
    $.ajax({
        url:urL + storeLiUrl ,
        data:{
          total:'0'
        },
        success:function(res){
            console.log(res);
            if(res.status !== 200){
                jfShowTips.toastShow(res.msg);
                return;
            };
            var html = template('storeList',{list:res.data});
            $('.address_list').html(html);
            $('.address_select').click(function(){
            	storeId = $(this).attr("data_id");
            	location.href = "store.html?storeId="+storeId;
            })
            
        },
        error:function(res){
        	console.log(res);
        	jfShowTips.toastShow("系统繁忙，请稍后再试");
        }
    })

                
                
})