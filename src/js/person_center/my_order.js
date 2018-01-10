$(function(){
	
	var urL = url();
	var orderUrl ='/order/list';
	var userId = $.cookie("userId");
//	var userId = "1001";
	var str = location.search;

	var stat = getStaOrder(str);

	
	//判断是全部订单还是代付款订单//初始查询
	if(stat == 1){
		orderFn.tabChange(1)
		payList(userId,stat); 
	}else{

		allList(userId);

        //payList(userId,1);
	}

	//代付款
	$(".PaymentPend").click(function(){
        orderFn.tabChange(1)
			stat = 1;
			payList(userId,stat);
	})
	//全部
	$(".allOrder").click(function(){
        orderFn.tabChange(0);
        str=""
		allList(userId)
	})
	// 获取url上的参数值
    function getStaOrder(str){
        var str1 = str.slice(1);
        var arr = str1.split("=");
        var obj = {};
        obj[arr[0]] = arr[1];
        return obj[arr[0]];
    }
    //待付款订单
    function payList(userId,stat){
    	$.ajax({
			type:'get',
		    url:urL + orderUrl,
		    async:false,
		    data:{
		        userId: userId,
		        status: stat
		    },
		    success:function(res){
		        console.log(res);
		        if(res.status !== 200){
		        	jfShowTips.toastShow('暂无订单');
		           // jfShowTips.toastShow({'text':res.msg});
		            return;
		        };
		       	
		        var html = template('payList',{list:res.data});
		        $('.paying').html(html);
				$("#paySpan").text('('+ res.data.length + ')');

		    },
		    error:function(res){
		       	console.log(res); 
		       	jfShowTips.toastShow("系统繁忙，请稍后再试")
		    }
		})
    }
    //全部订单
    function allList(userId){
    	$.ajax({
			type:'get',
		    url:urL + orderUrl,
		    async:false,
		    data:{
		        userId: userId,
		    },
		    success:function(res){
		        console.log(res);
		        if(res.status !== 200){
		            jfShowTips.toastShow({'text':res.msg});
		            return;
		        };
		       	
		        var html = template('allList',{list:res.data});
		        $('.all').html(html);
		        $(".stata").each(function(){
		        	if($(this).attr("data_statu") ==1 ){
		        		$(this).text("待付款")
		        	}else if($(this).attr("data_statu") ==4){
		        		$(this).text("已取消")
		        	}else if($(this).attr("data_statu") ==7){
		        		$(this).text("已取消")
		        	}else if($(this).attr("data_statu") ==27){
		        		$(this).text("全退")
		        	}else if($(this).attr("data_statu") ==11){
		        		$(this).text("分拣完成")
		        	}else if($(this).attr("data_statu") ==21){
		        		$(this).text("送达")
		        	}else if($(this).attr("data_statu") ==24){
		        		$(this).text("部分退")
		        	}else if($(this).attr("data_statu") ==31){
		        		$(this).text("已完成(无退货)")
		        	}else if($(this).attr("data_statu") ==0){
		        		$(this).text("失败单")
		        	}
		        })
				var nums='0'
				for(var i=0; i<res.data.length; i++){
					if(res.data[i].status ==1){
						nums++
					}
				}
				//$("#paySpan").text('('+ nums + ')')


		    },
		    error:function(res){
		       	console.log(res);
		       	jfShowTips.toastShow("系统繁忙，请稍后再试")
		    }
		})
    }
	   
})
