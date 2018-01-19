function url(){
    var urL = 'http://testweb.zbkjyy.com';
    return urL;
}

var commonFn={

    //缓存地址
    cookieAddress:function () {

        var userId=$.cookie('userId');//获取用户id

        var urlMain=url();//获取生产地址

        if(userId){//判断登录

            console.log($.cookie('addressHtml'))

            if(!$.cookie('addressHtml')){//没有地址cookie

                $.ajax({

                    type:'get',

                    url:urlMain+'/userAddr/default/'+userId,//ajax默认地址

                    data:{

                        userId: userId

                    },

                    success:function(res){

                        console.log('默认地址：'+res.data)

                        if(res.data) {//如果为空。说明没有默认地址

                            console.log(res.data)

                            $.cookie('addressHtml', res.data.cneeArea, {path: '/', expires: 30})

                            $.cookie('storeId',res.data.storeId,{path:'/'});

                            console.log($.cookie('storeId'))

                        }

                        else {

                            //如果没有默认地址，取地址列表
                            $.ajax({

                                type:'get',

                                url:urlMain+'/userAddr/list/'+userId,

                                data:{

                                    userId: userId

                                },

                                success:function (res) {

                                    if(res.data) {

                                        console.log(res.data)

                                        $.cookie('addressHtml', res.data[0].cneeArea, {path: '/', expires: 30});

                                        $.cookie('storeId',res.data[0].storeId,{path:'/'});

                                        console.log($.cookie('storeId'))

                                    }

                                },

                                error:function(res){

                                    console.log(res);

                                    jfShowTips.toastShow({'text':"读取地址失败"})

                                }


                            })

                        }

                    },

                    error:function(res){

                        console.log(res);

                        jfShowTips.toastShow({'text':"读取地址失败"})

                    }

                })

            }

        }

    },

    logOn:function () {

        if(!$.cookie('userId')){

            event.preventDefault();

            window.location.href='../login/login_system.html'

        }

    }
    
}

