$(function(){
	
	var urL = url();
	var detailUrl = '/store/detail';
	var imgList= '/img/list';
	var str = location.search;
	var storeId1 = getProductid(str);
	
	$.ajax({
		type:'get',
	    url:urL + detailUrl,
	    data:{
	        id: storeId1,
	    },
	    success:function(res){
	       	console.log(res);
	       	if(res.status !== 200){
	            alert(res.msg);
	            return;
	        };
	      	var html = template('detailTop',{list:res.data});
            $('.store_title').html(html);
	    },
	    error:function(res) {
		   	console.log(res);
		   	alert("系统繁忙，请稍后再试")
		}
    });
	//资质图
    imgFun(3,'store_qualification_html',$('.store_qualification'));
    //门店场景
    imgFun(4,'store_scene_html',$('.store_scene'));
    //二维码
    imgFun(6,'store_code_html',$('.store_code'));
    //配送范围
    $.ajax({
        type:'get',
        url:urL + imgList,
        data:{
            imgType: 5,
            businessId: storeId1
        },
        success:function(res){
            console.log(res);
            if(res.status !== 200){
                alert(res.msg);
                return;
            };
            //配送范围
            $(".distribution img").attr("src",res.data[0].imgUrl);
        },
        error:function(res) {
            alert("系统繁忙，请稍后再试");
        }
    });

    var widt = document.body.clientWidth -100
	var heit = document.body.clientHeight -200
    $(".addrArea").click(function(){
		$(".AK_store").hide();
		$(".distribution").show();
		$(".distribution").css("width",document.body.clientWidth);
		$(".distribution").css("height",document.body.clientHeight);
		$(".distribution img").css("width",widt);
		$(".distribution img").css("height",heit);
		$(".distribution img").css("padding-top",100);
		$(".distribution").click(function(){
			$(".AK_store").show();
			$("this").hide();
		})
	});
    
	
	// 1. 获取url上的参数值的方法
    function getProductid(str){
        var str1 = str.slice(1);
        var arr = str1.split("=");
        var obj = {};
        obj[arr[0]] = arr[1];
        return obj[arr[0]];
    }
	
	
	
	/*图片*/
	function imgFun(imgType,tem,dom) {
        $.ajax({
            type:'get',
            url:urL + imgList,
            data:{
                imgType: imgType,
                businessId: storeId1
            },
            success:function(res){
                console.log(res);
                if(res.status !== 200){
                    alert(res.msg);
                    return;
                };
                var html = template(tem,{list:res.data});
                dom.html(html);

            },
            error:function(res) {
                alert("系统繁忙，请稍后再试");
            }
        });
    }
	
	
	
	
	
})
