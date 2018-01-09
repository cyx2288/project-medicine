$(function(){

    var urL = url();
    var addAdr = '/userAddr/';
   	var userId = $.cookie('userId');

	var cneeArea
	var	cneeMobile
	var cneeName
	var detailAddr
	var isDefault = false
	var id
	
	if($.cookie("cneeArea") != null){
		$("#address_info").text($.cookie("cneeArea"));
		id = $.cookie("adrId");
		$("#inPh").val($.cookie("cneeMobile"));
		$("#inNa").val($.cookie("cneeName"));
		$("#addrDe").val($.cookie("detailAddr"));
		if($.cookie("isDefault") == 0){
			isDefault = false;
			$("#incheck").prop("checked",false);
		}else if($.cookie("isDefault") == 1){
			isDefault = true;
			isDefault = $.cookie("isDefault");
			$("#incheck").prop("checked",true);
			
		}

		
		//获取地址是否默认状态	
		$("#inDef").click(function(){
			isDefault = !isDefault;
			console.log(isDefault)
		})
		//地址更改
	    $("#save").click(function(){
	    	cneeArea = $("#address_info").text();    
	    	cneeName = $("#inNa").val();
	  		detailAddr = $("#addrDe").val();
	  		cneeMobile = $("#inPh").val();
            var storeIdList = $.attr('data-storeid') || $.cookie('storeIdList');
	    	console.log(cneeArea,cneeMobile,cneeName,detailAddr,isDefault,userId,storeIdList,id);
	    	changeadr(cneeArea,cneeMobile,cneeName,detailAddr,isDefault,userId,storeIdList,id)
	    });
	}else{
		$("#inDef").click(function(){
			isDefault = !isDefault;
			console.log(isDefault)
		})
		//地址保存提交
	    $("#save").click(function(){

	    	//判断详细地址是否为空
			if($('#addrDe').val() == ''){
				jfShowTips.toastShow("请您填写详细地址");
				return;
			}
	    	cneeArea = $("#address_info").text();    
	    	cneeName = $("#inNa").val();
	  		detailAddr = $("#addrDe").val();
	  		cneeMobile = $("#inPh").val();
            var storeIdList = $('.store_id').attr('data-storeid') || $.cookie('storeIdList');
            var areaAllCode = $('.store_id').attr('data-AdressId').split(',').join('|');
            console.log($('.store_id').attr('data-storeid'));
            console.log(areaAllCode);
            console.log(cneeArea,cneeMobile,cneeName,detailAddr,isDefault,userId,storeIdList);
	    	saveadr(cneeArea,cneeMobile,cneeName,detailAddr,isDefault,userId,storeIdList,areaAllCode);
	    })
		
	}

	
    
   	//验证手机号码
    $("#inPh").blur(function(){
		cneeMobile = $("#inPh").val();
		// if(cneeMobile == ''){
		// 	return;
		// }
		checkTel(cneeMobile);
	});
    
    
    //更改地址
    function changeadr(cneeArea,cneeMobile,cneeName,detailAddr,isDefault,userId,storeId,id){
	    $.ajax({
	    	type:'PUT',
	        url: urL + addAdr + id,
	        data:{
	          cneeArea: cneeArea,
	          cneeMobile: cneeMobile,
	          cneeName: cneeName,
	          detailAddr: detailAddr,
	          isDefault: isDefault,
	          userId: userId,
	          storeId :storeId
	        },
	        success:function(res){
	    		console.log(res)
	        	$.cookie("cneeArea", '',{ expires: -1, path: '/' });
				$.cookie("cneeMobile", '',{ expires: -1 , path: '/'});
				$.cookie("cneeName", '',{ expires: -1, path: '/' });
				$.cookie("detailAddr", '',{ expires: -1 , path: '/'});
				$.cookie("isDefault", '',{ expires: -1, path: '/' });
				//$.cookie("userId", '',{ expires: -1, path: '/' });
				//$.cookie("storeIdList", '',{ expires: -1 , path: '/'});
				$.cookie("adrId", '',{ expires: -1 , path: '/'});
	            location.href = "./choose_address.html"
	        },
            error: function() {
                jfShowTips.toastShow('系统繁忙，请稍后再试');
            }
	    })

    }
    //添加地址
    function saveadr(cneeArea,cneeMobile,cneeName,detailAddr,isDefault,userId,storeId,areaAllCode){
	    $.ajax({
	    	type:'POST',
	        url: urL + addAdr,
	        data:{
	          cneeArea: cneeArea,
	          cneeMobile: cneeMobile,
	          cneeName: cneeName,
	          detailAddr: detailAddr,
	          isDefault: isDefault,
	          userId: userId,
	          storeId :storeId,
				areaAllCode:areaAllCode
	        },
	        success:function(res){
	            console.log(res);  
				location.href = "./choose_address.html"
	           
	        },
            error: function() {
                jfShowTips.toastShow('系统繁忙，请稍后再试');
            }
	    })

    }
    
    // 手机号正则表达式
	function checkTel(tel){
        var reg = /^1[3|4|5|7|8][0-9]{9}$/;
        if(!reg.test(tel)){
            jfShowTips.toastShow('手机号有误，请重新输入');
            return false;
        }
    }
                
})