$(function(){
	
	var urL = url();
	var urlIn ='/user/info';
//	var userId = "1001";
	var userId = $.cookie("userId");
	var version;

	$.ajax({
	        url:urL + urlIn,
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
	            var html = template('uesInfo',{list:res.data});
	            $('.system_page').html(html);
	            $(".verNum").html('v'+ version);
	            
	        },
	        error:function(res){
	        	console.log(res);
	        	jfShowTips.toastShow("系统繁忙，请稍后再试")
	        }
	    })
	
	
	function plusReady(){		
		version = plus.runtime.version;
		$.ajax({
	        url:urL + urlIn,
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
	            var html = template('uesInfo',{list:res.data});
	            $('.system_page').html(html);
	            $(".verNum").html('v'+ version);
	            
	        },
	        error:function(res){
	        	console.log(res); 
	        	jfShowTips.toastShow("系统繁忙，请稍后再试")
	        }
	    })
		$(".verNum").html('v'+ version);
	}
	document.addEventListener("plusready",plusReady,false);
	   
})
