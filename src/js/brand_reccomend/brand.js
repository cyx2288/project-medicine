$(function(){
	
	var urL = url();
	var goodList = '/good/brand/goodsList';
	//var goodList='/good/list'
	var	brandIds = getBrandid(window.location.search);
	
//	初始化
	$.ajax({
		type:"get",
		url: urL + goodList,
		//async:true,
		data:{
			brandId:brandIds
		},
		success:function(res){
	        console.log(res);
	        var html = template('all_brands',{list:res.data});
	        //console.log(html)
            $('.brand').html(html);
            var htmlList = template('all_brandList',{list:res.data});
	        //console.log(htmlList)
            $('.search_result_list').html(htmlList);
	        	
	    },
        error: function() {
            jfShowTips.toastShow('系统繁忙，请稍后再试');
        }
		
	});
		
	function getBrandid(str){
	    var str1 = str.slice(1);
	    var arr = str1.split("=");
	    var obj = {};
	    obj[arr[0]] = arr[1];
	    return obj[arr[0]];
	}

})
