$(function(){
	
	var urL = url();
	var brandUrl = '/rank/brand';
	var categoryIds = "31";
	var totals = "0";
	
//	初始化
	$.ajax({
		type:"get",
		url: urL + brandUrl,
		//async:true,
		data:{
			categoryId: categoryIds,
			total: totals
		},
		success:function(res){
	        console.log(res);
	        var html = template('all_brands',{list:res.data});
	        console.log(html)
            $('.all_brand').html(html);
	        	
	    },
        error: function() {
            jfShowTips.toastShow('系统繁忙，请稍后再试');
        }
		
	});
	
	
})
