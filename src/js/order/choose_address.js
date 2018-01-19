$(function(){
	
	var urL = url();
	var addrList ='/userAddr/list/';
	var delAddr ='/userAddr/';
	var userId = $.cookie('userId');


	$.ajax({
		type:'get',
//		async:false,
	    url:urL + addrList + userId,
	    data:{
	    	userId: userId,
	    },
	    success:function(res){
	       	console.log(res);
	      	var html = template('adrList',{list:res.data});
            $('.order_page').html(html);
            //选中状态
            chooseAddress();

            //删除事件
		    var deleteAddressBtn= document.getElementsByClassName('delete_address');
		
		    for(var i=0;i<deleteAddressBtn.length;i++){
		
		        deleteAddressBtn[i].addEventListener("click",function(){
		
		            var thisClickEle=this;
					
		            //对话框
		            jfShowTips.dialogShow({
		                'mainText':'友情提示',
		                'minText':'确认要删除这条地址信息吗？',
		                'checkFn':function(){
		                    jfShowTips.dialogRemove();
		                    var id = thisClickEle.getAttribute("data_id");
		                    var isD = thisClickEle.getAttribute("data_isD");
		                    deleteFn();//删除地址DOM元素
							//删除地址数据
							$.ajax({
								type:'POST',
//								async:false,
								url:urL + delAddr + id,
								data:{
									_method: "delete",
									id: id,
									userId: userId,
									isDefault: isD
								},
								success:function(res){
									jfShowTips.toastShow({'text':res.msg})
								},
                                error: function() {
                                    jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
                                }
							});
		                    function deleteFn(){
		
		                        for(var m=0;m<50;m++){//循环找到真正的父元素
		
		                            var thisParentEle=thisClickEle.parentNode;
		
		                            if(thisParentEle.className.indexOf('address_list')>-1){
		
		                                thisParentEle.style.transform="translate3d(-100%,0,0)";
		
		                                thisParentEle.style.webkitTransform="translate3d(-100%,0,0)";
		
		                                setTimeout(function(){
		
		                                    if(thisParentEle.parentNode){
		
		                                        thisParentEle.parentNode.removeChild(thisParentEle);//删除当前元素
		                                    }
		
		                                },300)
		
		                                break
		
		                            }else {
		
		                                thisClickEle=thisClickEle.parentNode;
		
		                            }
		
		                        }
		                    }
		                }
		            })
		
		        },false)
		    }
                   
            //判断是否默认地址
            $(".address_select").each(function(){
            	if($(this).attr("data_def") == true){
            		$(this).addClass('choosed');
            	}
    	
           })            
            
            //修改地址
            $(".changeAd").each(function(){
				$(this).click(function(){
					var cneeArea = $(this).attr("data_cne");
					var cneeMobile = $(this).attr("data_phe");
					var cneeName = $(this).attr("data_na");
					var detailAddr = $(this).attr("data_detail");
					var isDefault = $(this).attr("data_isD");
					var storeIdList = $(this).attr("data_store");
					var adrId = $(this).attr("data_id");
					console.log(cneeArea,cneeMobile,cneeName,detailAddr,isDefault,userId,storeIdList );
					$.cookie("cneeArea",cneeArea,{ path: '/' });
					$.cookie("cneeMobile",cneeMobile,{ path: '/' });
					$.cookie("cneeName",cneeName,{ path: '/' });
					$.cookie("detailAddr",detailAddr,{ path: '/' });
					$.cookie("isDefault",isDefault,{ path: '/' });
					//$.cookie("userId",detailAddr,{ path: '/' });
					$.cookie("storeIdList",storeIdList,{ path: '/' });
					$.cookie("adrId",adrId,{ path: '/' });
					location.href = "edit_adress.html"
				})
			});
            //跳转结算页
           	$(".address_select").each(function(){
           		$(this).click(function(){
                    var addressId = $(this).attr("data_id");
           			$.cookie('addressId','',{expires: -1} );

           			$.cookie('addressId',addressId, {path:'/'});

                    var packageId =$.cookie('packageId') || '';//套餐ID

                    var goodId =$.cookie('goodId') || '';//商品ID

                    var buyGoodNum = $.cookie('buyGoodNum') || '';//单个商品购买的数量

                    var cartGoodIdList =$.cookie('cartGoodIdList') || '';//购物车商品ID数组

					if(packageId){

                        location.href= "submit_order_page.html?packageId=" + packageId;//套餐购买

					}else if(goodId){

                        location.href= "submit_order_page.html?goodId=" + goodId+"&buyGoodNum="+buyGoodNum;//单个商品购买

					}else {
                        location.href= "submit_order_page.html?cartGoodIdList="+cartGoodIdList;//购物车购买
					}

                    $.cookie('packageId', '', {expires: -1});
                    $.cookie('goodId', '', {expires: -1});
                    $.cookie('buyGoodNum', '', {expires: -1});
                    $.cookie('cartGoodIdList','',{expires: -1});//清空




           		})
           	})
            
            
	    },
        error: function() {
            jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
        }
    });
	
	$("#addAdr").click(function(){//新增地址时，清空所有地址Cookie

        $.cookie("cneeArea",'',{ path: '/' });
        $.cookie("cneeMobile",'',{ path: '/' });
        $.cookie("cneeName",'',{ path: '/' });
        $.cookie("detailAddr",'',{ path: '/' });
        $.cookie("isDefault",'',{ path: '/' });
        //$.cookie("userId",detailAddr,{ path: '/' });
        $.cookie("storeIdList",'',{ path: '/' });
        $.cookie("adrId",'',{ path: '/' });

		location.href="edit_adress.html"
	});
	
	
	
	function plusReady(){

	}
	document.addEventListener("plusready",plusReady,false);
	

})
