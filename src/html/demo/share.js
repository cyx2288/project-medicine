$(function(){
    var Share={}; 
    Share.info = { 
        id: 'H592CDC09', 
        name: 'YAO-APP', 
        head_image: "../../images/icon_search.png", 
        introduce: 'hello word' 
    }; 
    /** 
     * 更新分享服务 
     */ 
    var shares = null; 
 
    function getSerivces() {         
        plus.share.getServices(function(s) { 
             
            shares = {}; 
            for (var i in s) { 
                var t = s[i]; 
                shares[t.id] = t; 
            } 
        }, function(e) { 
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
            //TODO 授权无法回调，有bug 
            s.authorize(function() {     
                console.log('授权成功...')               
                shareMessage(s, ex); 
            }, function(e) {         
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
        msg.href = "http://2.mchch.applinzi.com" + "share?hid=" + Share.info.id; 
        msg.title = "我在xxxx等你——" + Share.info._name; 
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
        s.send(msg, function() { 
            plus.nativeUI.closeWaiting(); 
            var strtmp = "分享到\"" + s.description + "\"成功！ "; 
            console.log(strtmp); 
            plus.nativeUI.toast(strtmp, { 
                verticalAlign: 'center' 
            }); 
            sharecount = 0; 
        }, function(e) { 
            plus.nativeUI.closeWaiting();            
            if (e.code == -2) { 
                plus.nativeUI.toast('已取消分享', { 
                    verticalAlign: 'center' 
                }); 
                sharecount = 0; 
            } else if (e.code == -3 || e.code == -8) { 
                console.log(e.code); 
                if (++sharecount < 2) { 
                    //TODO 分享失败可能是图片过大的问题，递归取默认图片重新分享 
                    shareMessage(s, ex); 
                } else { 
                    sharecount = 0; 
                    plus.nativeUI.toast('分享失败', { 
                        verticalAlign: 'center' 
                    }); 
                } 
            }else{ 
                console.error('分享失败:'+JSON.stringify(e)) 
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
            function(e) { 
                var i = e.index; 
                if (i > 0) { 
                    shareAction(ids[i - 1].id, ids[i - 1].ex); 
                } 
            } 
        ); 
    }; 
    Share.share=share; 
    window.Share = Share; 
    
    function plusReady(){
    	$("#test").on('click',function(){
    		 getSerivces(); 
    		 //alert("1");
    		 shareAction();
//  		 alert("2");
    		 share();
//  		 alert("3");
    	})
    }
    
    document.addEventListener("plusready",plusReady,false);
    
    
    
});