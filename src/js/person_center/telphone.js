$(function(){
	
	var urL = url();
	var urlph ='/user/updateMobile';
	var sendUrl = '/user/sendMsg';
//	var userId = "1001";
	var userId = $.cookie("userId");
	var oPheNum;
	var nPheNum;
	var hash;
	var validNum;
	var tamp;
	var str = location.search;
	var phNum = getUserNa(str);
	$("#oPhe").text(phNum);

	$("#nPhe").blur(function(){
		nPheNum = $("#nPhe").val();
		checkTel(nPheNum);
	});
	
	//获取验证码
	$("#msgInfo").click(function(){	
		oPheNum = $("#oPhe").text();
		$.ajax({
			type:'get',
	        url:urL + sendUrl,
	        data:{
	            mobileNum: oPheNum,
	        },
	        success:function(res){
	        	console.log(res);
	        	if(res.status !== 200){
	                alert(res.msg);
	                return;
	           	};
	    		hash = res.data.hash;
	    		tamp = res.data.tamp;
	    		alert(hash);
	        },
	         error:function(res) {
		    	console.log(res);
		    }
    	});
	})
	//点击提交
	$("#sub").click(function(){
		validNum = $("#valid").val();
		oPheNum = $("#oPhe").text();
		nPheNum = $("#nPhe").val();
		$.ajax({
			type:'post',
	//		async:false,
		    url:urL + urlph,
		    data:{
		    	id: userId,
		    	mobileNum: nPheNum,
		    	oldMobileNum: oPheNum,	    	
		    	requestHash: hash,
		    	tamp: tamp,
		    	msgNum: validNum
		    },
		    success:function(res){	    	
		    	console.log(res)
		    	if(res.status !== 200){
	                alert(res.msg);
	                return;
	            };
		    },
		    error:function(){
		    	console.log(res)
		    } 
		})
	})
	
	//手机号正则表达式
    function checkTel(tel){
        var reg = /^1[3|4|5|7|8][0-9]{9}$/;
        if(!reg.test(tel)){
            alert('手机号有误，请重新输入');
            return false;
        }
    }  
		   
	// 获取url上的参数值
    function getUserNa(str){
        var str1 = str.slice(1);
        var arr = str1.split("=");
        var obj = {};
        obj[arr[0]] = arr[1];
        return obj[arr[0]];
    }	   
		   
		   
		   
})
