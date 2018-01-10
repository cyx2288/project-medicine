$(function(){
	
	var urL = url();
	//订单商品信息
	var goodsUrl ='/order/goods';
	//订单基本信息
	var oInfoUrl ='/order/info';
	//取消订单
	var ordCanUrl = '/order/cancel'
	//卡卷包
	var couponUrL = '/coupon/'
	var userId = $.cookie('userId');
	var str = location.search;
	var ordId = getOrderId(str);
	$(".cancle_order").hide();
	ordInfo(ordId);
	ordGoods(ordId);
	
	
	
	//取消订单
    document.getElementsByClassName('cancle_order')[0].addEventListener("click",function(){
        jfShowTips.dialogShow({
            'mainText':"您确认取消订单？",
            'minText':' ',
            checkFn:function(){
                jfShowTips.dialogRemove()
               	$.ajax({
					type:'POST',
				    url:urL + ordCanUrl,
				    //async:false,
				    data:{
				        orderId: ordId
				    },
				    success:function(res){
				        console.log(res);
				        if(res.status !== 200){
				            jfShowTips.toastShow({'text':res.msg});
				            return;
				        };
				        location.href = "my_order.html"

				    },
				    error:function(res){
				       	console.log(res);
				       	jfShowTips.toastShow("系统繁忙，请稍后再试")
				    }
				})
            }
        })
    },false)

	
	// 获取url上的参数值
    function getOrderId(str){
        var str1 = str.slice(1);
        var arr = str1.split("=");
        var obj = {};
        obj[arr[0]] = arr[1];
        return obj[arr[0]];

	}
    //订单基本信息
    function ordInfo(orderId){
    	$.ajax({
			type:'get',
		    url:urL + oInfoUrl,
		    //async:false,
		    data:{
		        orderId: orderId
		    },
		    success:function(res){
		        console.log(res);
		        if(res.status !== 200){
		            jfShowTips.toastShow({'text':res.msg});
		            return;
		        };
		        //地址拼接
		        var addr = res.data.cneeInfo;
				var consign = addr.split(",");
				$(".consigneeNa").text(consign[0]);
				$(".consigneePh").text(consign[1]);
				$(".consigneeaddr").text(consign[2])

				var htm = template('goodMoney',{list:res.data});
		        $('.total_price').html(htm);
		        if(res.data.status ==1){
		        	$(".orderStaCod").text("待付款")
		        }
				if(res.data.payMode == 1){
		      		$(".payMode").text("微信支付");
		      	}else if(res.data.payMode ==2){
		      		$(".payMode").text("支付宝支付");
		      	}else{
		      		$(".payMode").text("货到付款");
		      	}
		        if(res.data.couponsId == 0){
		        	$(".ordCoupon").text("未使用优惠券")
		        }else{
		        	ordCoupon(res.data.couponsId);	
		        }
				$(".invoice").text(res.data.invoiceTitle);
				$(".remark").text(res.data.orderRemarks);
				if(res.data.status==1){
					$(".orderSta").text("待付款");
				}else if(res.data.status==7){
					$(".orderSta").text("已支付");
				}else if(res.data.status==21){
					$(".orderSta").text("送达");
				}else if(res.data.status==11){
					$(".orderSta").text("分拣完成");
				}else if(res.data.status==31){
					$(".orderSta").text("已完成(无退货)");
				}else if(res.data.status==4){
					$(".orderSta").text("已取消");
				}else if(res.data.status==0){
					$(".orderSta").text("失败单");
				}else if(res.data.status==27){
					$(".orderSta").text("全退");
				}else if(res.data.status==24){
					$(".orderSta").text("部分退");
				}
				
				if(res.data.status==1 || res.data.status==7 ){
					$(".cancle_order").show();
				}
		      	
		    },
            error: function () {
                jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
            }
		})
    }
    //订单商品信息
	function ordGoods(orderId){
		$.ajax({
			type:'get',
		    url:urL + goodsUrl,
		    //async:false,
		    data:{
		        orderId: orderId
		    },
		    success:function(res){
		        console.log(res);
		        if(res.status !== 200){
		            jfShowTips.toastShow({'text':res.msg});
		            return;
		        };
		        
		       	$(".stat").each(function(){
		        	if($(this).attr("data_statu") ==1 ){
		        		$(this).text("代付款")
		        	}
		        })
		       	var html = template('goodList',{list:res.data});
		        $('.goodDet').html(html);
		      
		    },
            error: function () {
                jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
            }
		})
	}
	//优惠券信息
	function ordCoupon(couponId){
		$.ajax({
			type:'get',
		    url:urL + couponUrL + couponId,
		    //async:false,
		    data:{},
		    success:function(res){
		        console.log(res);
		        if(res.status !== 200){
		            jfShowTips.toastShow({'text':res.msg});
		            return;
		        };
		     	$(".yuan").text(res.data.condition + '元');
		      	$(".ya").text(res.data.deduction + '元');	     		      
		    },
            error: function () {
                jfShowTips.toastShow({'text':'系统繁忙，请稍后再试'});
            }
		})
	}
	
	//订单分享
	var Share = {};
    Share.info = {
        id: 'H592CDC09',
        name: 'YAO-APP',
        head_image: "../../images/icon_search.png",
        introduce: '推荐感冒灵999冲剂给你，手机买药还送到家。'
    };
    /**
     * 更新分享服务
     */
    var shares = null;

    function getSerivces() {
        plus.share.getServices(function (s) {

            shares = {};
            for (var i in s) {
                var t = s[i];
                shares[t.id] = t;
            }
        }, function (e) {
            console.log("获取分享服务列表失败：" + e.message);
        });
    };

    function shareAction(id, ex) {
        var s = null;

        if (!id || !(s = shares[id])) {
            console.log("无效的分享服务！");
            return;
        }
        if (s.authenticated) {
            console.log("---已授权---");
            shareMessage(s, ex);
        } else {
            console.log("---未授权---");
            //授权无法回调，有bug
            s.authorize(function () {
                console.log('授权成功...')
                shareMessage(s, ex);
            }, function (e) {
                console.log("认证授权失败：" + e.code + " - " + e.message);
            });
        }
    };
    var sharecount = 0;

    /**
     * 发送分享消息
     * @param
     */
    function shareMessage(s, ex) {
        plus.nativeUI.showWaiting();
        var msg = {
            extra: {
                scene: ex
            }
        };
        msg.href = "http://2.mchch.applinzi.com" + "?id=" + goodId;
        msg.title = "平价实体药店，24H送药到家";
        msg.content = Share.info.introduce;
        //取本地图片
        var img = plus.io.convertAbsoluteFileSystem(Share.info.head_image.replace('file://', ''));
        console.log(img);
        msg.thumbs = [img];
        if (sharecount > 0) {
            //如果本地图片过大，导致分享失败，递归时重新分享获取默认图片
            msg.thumbs = ["../../images/icon_search.png"];
        }
        console.log(JSON.stringify(msg));
        s.send(msg, function () {
            plus.nativeUI.closeWaiting();
            var strtmp = "分享到\"" + s.description + "\"成功！ ";
            console.log(strtmp);
            plus.nativeUI.toast(strtmp, {
                verticalAlign: 'center'
            });

            if(strtmp != undefined){
                if(ex == "WXSceneSession"){
                    shareTypes = 1
                }else{
                    shareTypes = 2
                }
                $.ajax({
                    type:"POST",
                    url: urL + '/shareHistory',
                    data:{
                        userId: userId,
                        businessType: '2',
                        businessId: ordId,
                        shareType: shareTypes
                    },
                    success:function(){
                    },
                    error:function(){
                    }
                });
            }
            sharecount = 0;
        }, function (e) {
            plus.nativeUI.closeWaiting();
            if (e.code == -2) {
                plus.nativeUI.toast('已取消分享', {
                    verticalAlign: 'center'
                });
                sharecount = 0;
            } else if (e.code == -3 || e.code == -8) {
                console.log(e.code);
                if (++sharecount < 2) {
                    // 分享失败可能是图片过大的问题，递归取默认图片重新分享
                    shareMessage(s, ex);
                } else {
                    sharecount = 0;
                    plus.nativeUI.toast('分享失败', {
                        verticalAlign: 'center'
                    });
                }
            } else {
                console.error('分享失败:' + JSON.stringify(e))
            }
            console.log("分享到\"" + s.description + "\"失败: " + e.code + " - " + e.message);
        });
    };

    function share() {
        bhref = true;
        var ids = [{
                id: "weixin",
                ex: "WXSceneSession"
            }, {
                id: "weixin",
                ex: "WXSceneTimeline"
            }],
            bts = [{
                title: "发送给微信好友"
            }, {
                title: "分享到微信朋友圈"
            }];
        plus.nativeUI.actionSheet({
                cancel: "取消",
                buttons: bts
            },
            function (e) {
                var i = e.index;
                if (i > 0) {
                    shareAction(ids[i - 1].id, ids[i - 1].ex);
                }
            }
        );
    };
    Share.share = share;
    window.Share = Share;

    function plusReady() {
        $("#share_order").on('click', function () {
            getSerivces();
//          shareAction();
            share();
        })
    }

    document.addEventListener("plusready", plusReady, false);
	
	
})
