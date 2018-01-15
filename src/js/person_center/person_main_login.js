$(function(){
	var urL = url();
	var urlIn ='/user/info';
	var ordCoUrl ='/order/count';
	//默认没登录状态
	$(".logged_pic").hide();
	$(".login_name").hide();
	$(".out").hide();
	var userId = $.cookie("userId");
	$("#ordNumAll").hide();
	$("#ordNumPend").hide();
//	var userId = '1001'

	if(userId != undefined){
		$(".login_statu").hide();
		$(".show_pic").hide();
		$(".logged_pic").show();
		$(".login_name").show();
		$(".out").show();
		$.ajax({
			type:'get',
	        url:urL +  urlIn,
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
	            $(".login_name").html(res.data.loginName);
	            
	        },
	        error:function(res){
	        	console.log(res);
	        	jfShowTips.toastShow({'text':"系统繁忙，请稍后再试"})
	        }
	    })
		//订单数量
		$.ajax({
			type:'get',
	        url:urL + ordCoUrl,
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
	            $("#ordNumAll").show();
				$("#ordNumPend").show();

				if(res.data.allOrderCount>99){
                    res.data.allOrderCount='99+'
				}
                $("#ordNumAll").text(res.data.allOrderCount);

	            $("#ordNumPend").text(res.data.unpaidOrderCount);
	            
	        },
	        error:function(res){
	        	console.log(res);
	        	jfShowTips.toastShow({'text':"系统繁忙，请稍后再试"})
	        }
	    })
		 
	}
	
	//用户登录
	$("#loguser").click(function(){
		location.href = '../../html/login/login_system.html' 
	})
	//用户注册
	$("#registration").click(function(){
		location.href = '../../html/login/userLogin.html' 
	})	
	//用户退出
	$(".out").click(function(){
		$(".logged_pic").hide();
		$(".login_name").hide();
		$(".login_statu").show();
		$(".show_pic").show();
		$("#ordNumAll").hide();
	    $("#ordNumPend").hide();
	    $.cookie('userId', '' , { expires: -1 ,path: '/'});
	})
	//判断是否登录，如果没有请登录
	$(".oncl").each(function(){
		$(this).click(function(){
			if(userId == undefined){
				var suggest = confirm("请登录");
				if(suggest==true){
					location.href = "../../html/login/login_system.html"
				}
			}else{

				//location.href = $(this).attr("data_src")
			}
		})
	})
	
	//点击查看配送区域
	var widt = document.body.clientWidth -100
	var heit = document.body.clientHeight -200
	$(".addrArea").click(function(){
		$(".personal_center_page").hide();
		$(".bottom_tabbar").hide();
		$(".distribution").show();
		$(".distribution").css("width",document.body.clientWidth);
		$(".distribution").css("height",document.body.clientHeight);
		$(".distribution img").css("width",'100%');
		//$(".distribution img").css("height",heit);
		$(".distribution img").css("padding-top",100);
		$(".distribution").click(function(){
			$(".personal_center_page").show();
			$(".bottom_tabbar").show();
			$("this").hide();
		})
	});

	
})
