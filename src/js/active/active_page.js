$(function(){
    var urL = url();
    //排名接口
    var rankGoods = '/rank/goods';

    //广告(头部)
    var adBanner='/ad/info';


    //用户门店信息
    var storeId = $.cookie('storeId') || 1001;
	var userId = $.cookie('userId') ;
    //特价药品
    rankList(22,4,'active_page_html',$('#active_page_list'));
    rankList(25,4,'active_page_html2',$('#active_page_list2'));



    /*封装部分*/

    //1. 特价部分
    function rankList(categoryId,total,htmlId,dom){
        $.ajax({
            url:urL + rankGoods,
            data:{
                categoryId:categoryId,
                storeId:storeId,
                total:total
            },
            success:function(info){
                console.log(info);
                if(info.status !== 200){
                    jfShowTips.toastShow(info.msg);
                    return;
                };
                var html = template(htmlId,{list:info.data});
                dom.html(html);
            },
            error: function() {
                jfShowTips.toastShow('系统繁忙，请稍后再试');
            }
        })
    }
	
	//跳转购物车，判断是否登录
	$(".shoppBtn").click(function(){
		if(userId == undefined){
			var suggest = confirm("请登录");
			if(suggest==true){
				location.href = "../../html/login/login_system.html"
			}
		}else{
			location.href = "../../html/shopping_cart/shopping_cart_main.html"
		}
	})

    //广告头部一
    adInitLoad(3,21,'ad_banner1','.active_banner1');

    //广告头部二
    adInitLoad(3,22,'ad_banner2','.active_banner2');

    //广告尾部部一
    adInitLoad(3,23,'ad_banner3','.active_banner3');

    //广告--
    function adInitLoad(clientNum,sitNum,templateId,adClass) {
        $.ajax({
            url: urL + adBanner,
            data: {
                clientType: clientNum,
                sit:sitNum,
            },
            success: function (info) {

                console.log(info);
                var html = template(templateId, {list: info.data});
                $(adClass).html(html);

            },
            error: function () {
                 jfShowTips.toastShow('系统繁忙，请稍后再试');
            }
        })
    }




    // 拦截Webview窗口的URL请求
    //(function () {


        // H5 plus事件处理
        var ws=null,as='pop-in';

        /*增加plus ready后监听*/
        if(window.plus){
            plusReady();
        }else{
            document.addEventListener('plusready', plusReady, false);
        }

        // 监听事件(url拦截）
        function plusReady(){

            ws=plus.webview.currentWebview();

            overrideUrl(ws);

        }


        //初始化拦截器配置


        // url拦截器
        function overrideUrl(ws) {
            // 拦截所有页面跳转，可使用参数拦截weibo.com域名之外的跳转（{mode:'allow',match:'.*weibo\.com/.*'}）

            var thisMode='reject';

            ws.overrideUrlLoading({mode:thisMode}, function(e){

                console.log('reject url: '+e.url);

                console.log('return url: '+urlString(e.url));

                console.log(window.location.href);

                toUrl(e.url)

            });
        }

        /*跳转方法*/
        function toUrl(url) {


            if(url.indexOf('thiswebview')==-1) {//打开新页面

                if(url.indexOf('tel')<-1){

                    clicked(urlString(url), 0, 0, {
                        'titleNView': {
                            'backgroundColor': '#49c999',
                            'titleColor': '#fff',
                            autoBackButton: true
                        }
                    });
                }

            }

            /*如果有需要单页，则放开拦截*/

            else{

                var thisMode='allow';

                ws.overrideUrlLoading({mode:thisMode});

                /*plus.webview.currentWebview().loadURL(url)*/

                var timer=null;

                if('iOS'==plus.os.name){

                    timer=0;

                }

                else {

                    timer=500

                }

                setTimeout(function () {

                    window.location.href=url

                },timer)



            }

        }


        /*url字符串截取*/
        function urlString(url) {

            var thisUrl=url;

            var _num=thisUrl.indexOf('#');

            if(_num!=-1 && _num+1==thisUrl.length) {//如果有# 且 #号是最后一个

                return thisUrl.substring(0, _num); //返回截取#后的url

            }

            return thisUrl;

        }


        var w=window;

        /*回退键拦截器*/
        function plusReadyBack(){
            ws=plus.webview.currentWebview();
            // Android处理返回键
            plus.key.addEventListener('backbutton',function(){
                back();
            },false);

        }



        //加监听
        if(w.plus){
            plusReadyBack();
        }else{
            document.addEventListener('plusready',plusReadyBack,false);
        }


    // DOMContentLoaded事件处理

        var domready=false;

        document.addEventListener('DOMContentLoaded',function(){

            domready=true;

            document.body.onselectstart=shield;

        },false);


        function shield(){
            return false;
        }

    // 处理返回事件
        function back(hide){


            /*本页面跳转*/
            if(w.plus&&history.length>1){

                var thisUrl=window.location.href;

                console.log('thisUrl'+thisUrl)

                history.back();

                setTimeout(function () {

                    var lastUrl=window.location.href;

                    console.log('lastUrl'+lastUrl)

                    if(thisUrl==lastUrl){

                        webViewBack()

                    }

                },200)

            }

            else if(w.plus){

                webViewBack()

            }

            else{
                w.close();
            }

            function webViewBack() {

                ws||(ws=plus.webview.currentWebview());
                if(hide||ws.preate){
                    ws.hide('auto');
                }else{
                    ws.close('auto');
                }

            }

        };
    // 处理点击事件
        var openw=null,waiting=null;
        /**
         * 打开新窗口
         * @param {URIString} id : 要打开页面url
         * @param {boolean} wa : 是否显示等待框
         * @param {boolean} ns : 是否不自动显示
         * @param {JSON} ws : Webview窗口属性
         */
        function clicked(id,wa,ns,ws){
            if(openw){//避免多次打开同一个页面
                //return null;
            }
            if(w.plus){
                wa&&(waiting=plus.nativeUI.showWaiting());
                ws=ws||{};
                ws.scrollIndicator||(ws.scrollIndicator='none');
                ws.scalable||(ws.scalable=false);
                var pre='';//'http://192.168.1.178:8080/h5/';


                /*如果存在该id的webview，则打开该webview*/
                if(plus.webview.getWebviewById(id)){

                    openw=plus.webview.getWebviewById(id);

                    openw.show(as);

                    openw.reload();

                    return openw;
                }

                /*如果不存在该webview，新打开一个*/
                else{

                    openw=plus.webview.create(pre+id,id,ws);
                    ns||openw.addEventListener('loaded',function(){//页面加载完成后才显示
    //		setTimeout(function(){//延后显示可避免低端机上动画时白屏
                        openw.show(as);
                        closeWaiting();
    //		},200);
                    },false);
                    openw.addEventListener('close',function(){//页面关闭后可再次打开
                        openw=null;
                    },false);
                    return openw;

                }


            }else{
                w.open(id);
            }
            return null;
        };

        /**
         * 关闭等待框
         */
        function closeWaiting(){
            waiting&&waiting.close();
            waiting=null;
        }

    //})()
})