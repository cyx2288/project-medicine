$(function(){
	var urL = url();
	var loginUrl ='/user/login/message'
	var sendUrl = '/user/sendMsg';
	var mobileNum
	var hash
	var tamp
	var msgNum
	var userIds



    if (window.plus) {
        plusReady();
    } else {
        document.addEventListener('plusready', plusReady, false);
    }

    // H5 plus事件处理
    function plusReady() {
        // 设置cookie
    }


	//验证手机号码
	$("#phNum").blur(function(){
		mobileNum = $("#phNum").val();
		if(mobileNum == ''){
			return;
		};
		checkTel(mobileNum);
		return;
	});

	//获取验证码
	$("#sendmsg").on('click',function(){
		mobileNum = $("#phNum").val();
        if(mobileNum == ''){
            alert('请输入验证码');
            return;
        };
		$.ajax({
			type:'get',
	        url:urL + sendUrl,
	        data:{
	            mobileNum: mobileNum,
	        },
	        success:function(res){
	        	//alert(JSON.stringify(res));
	    		hash = res.data.hash;
	    		tamp = res.data.tamp;
	    		//alert(tamp);
	    		//alert(hash);

	        },
            error: function() {
                alert('系统繁忙，请稍后再试');
            }
    	});
	});



    //验证并登陆
    $("#verifyLogin").on('click',function(){
        mobileNum = $("#phNum").val();
        msgNum = $("#sendMsgNum").val();
        if(mobileNum == ''){
            alert('账号不能为空');
            return;
        };
        if(msgNum == ''){
            alert('验证码不能为空');
            return;
        };
        $.ajax({
            type:'post',
            url:urL + loginUrl,
            data:{
                mobileNum: mobileNum,
                requestHash: hash,
                tamp: tamp,
                msgNum: msgNum
            },
            success:function(res){
                //alert(JSON.stringify(res));

                userIds = JSON.stringify(res.data.id);
                plus.storage.setItem("userId",userIds);
                var foo = plus.storage.getItem("userId");
                console.log(foo)
                //alert(foo);
                window.location.href = "../homepage/main.html";
            },
            error: function() {
                alert('系统繁忙，请稍后再试');
            }
        });
    });


	// 手机号正则表达式
	function checkTel(tel){
        var reg = /^1[3|4|5|7|8][0-9]{9}$/;
        if(!reg.test(tel)){
            alert('手机号有误，请重新输入');
            return false;
        }
    }
	

	
});
