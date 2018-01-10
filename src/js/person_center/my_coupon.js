$(function(){
	
	var urL = url();
	var couUrl ='/coupon/list';
	var userId = $.cookie("userId");


	$.ajax({
		type:'get',
	    url:urL + couUrl,
	    //async:false,
	    data:{
	        userId: userId
	    },
	    success:function(res){
	        console.log(res);
	        if(res.status !== 200){
	            jfShowTips.toastShow({'text':res.msg});
	            return;
	        };
	       	var html = template('couList',{list:res.data});
	        $('.all_coupon').html(html);
	        $(".coupon_plate").each(function(){
	        	if($(this).attr("data_isUsed") == true){
	        		$(this).removeClass("orange");
	        		$(this).removeClass("dated");
	        		$(this).addClass("used");
	        		
	        	}
	      
	        })
	    },
	    error:function(res){
	       	console.log(res); 
	       	jfShowTips.toastShow("系统繁忙，请稍后再试")
	    }
	})
	
	
	   
})
