$(function(){

    var aliChannel = null; // 支付宝支付  
    var wxchannel = null;  //微信支付 
	var channel= null; //支付通道 
	// 1. 获取支付通道
	function plusReady(){
	    // 获取支付通道
	    plus.payment.getChannels(function(channels){
	        aliChannel=channels[0]; 
            wxChannel=channels[1]; 
          
	    },function(e){
	        alert("获取支付通道失败："+e.message);
	    });
	    
	    $("#alipay").on('click',function(){
	    	pay('alipay'); 
	    })
	    $("#wxpay").on('click',function(){
	    	pay('wxpay'); 
	    })
	}
	document.addEventListener('plusready',plusReady,false);

	var ALIPAYSERVER='http://demo.dcloud.net.cn/helloh5/payment/alipay.php?total=';
	var WXPAYSERVER='http://demo.dcloud.net.cn/payment/wxpayv3.HBuilder/?total=';
	// 2. 发起支付请求
	function pay(id){
	    // 从服务器请求支付订单
	    var PAYSERVER='';
	    if(id=='alipay'){
	        PAYSERVER=ALIPAYSERVER;
	        channel = aliChannel;
	    }else if(id=='wxpay'){
	        PAYSERVER=WXPAYSERVER;
	        channel = wxChannel;
	    }else{
	        plus.nativeUI.alert("不支持此支付通道！",null,"捐赠");
	        return;
	    }
	    var xhr=new XMLHttpRequest();
	    xhr.onreadystatechange=function(){
	        switch(xhr.readyState){
	            case 4:
	            if(xhr.status==200){
	                plus.payment.request(channel,xhr.responseText,function(result){
	                    plus.nativeUI.alert("支付成功！",function(){
	                        back();
	                    });
	                },function(error){
	                    plus.nativeUI.alert("支付失败：" + error.code);
	                });
	            }else{
	                alert("获取订单信息失败！");
	            }
	            break;
	            default:
	            break;
	        }
	    }
	    xhr.open('GET',PAYSERVER);
	    xhr.send();
	}
	

	

})
