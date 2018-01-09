$(function () {

    //地址初始化
    if($.cookie('addressHtml')){
        console.log($.cookie('addressHtml'));
        $('#address_info').text($.cookie('addressHtml'));
    };

    //金额加减
    var shoppingBoxFn={


        //商品数量加减
        chooseProNum:function(){

            var chooseArea=document.getElementsByClassName('volume_btn');

            for(var i=0;i<chooseArea.length;i++){

                chooseArea[i].getElementsByClassName('reduce')[0].addEventListener("click",shoppingBoxFn.numChangeFn,false);

                chooseArea[i].getElementsByClassName('volume_input')[0].addEventListener("blur",shoppingBoxFn.numChangeFn,false);;

                chooseArea[i].getElementsByClassName('add')[0].addEventListener("click",shoppingBoxFn.numChangeFn,false);
            }

        },

        numChangeFn:function(e){

            var evt=e||window.event;

            evt.preventDefault();

            var thisShowInput=this.parentElement.getElementsByClassName('volume_input')[0];

            var thisValue=thisShowInput.value;

            if(this.className.indexOf('reduce')>-1){

                if(thisValue>1){

                    thisShowInput.value=parseFloat(thisValue)-1;

                }else {

                    thisShowInput.value=1;

                }

            }else if(this.className.indexOf('add')>-1){

                thisShowInput.value=parseFloat(thisValue)+1;

            } else {
                if(thisValue<1){

                    thisShowInput.value=1;

                }
            }




        },

        //单选全选
        CheckBoxFn:function(){

            var allcheckBtn=document.getElementsByClassName('allcheck');

            var allsingleBox=document.getElementsByClassName('singlecheck');

            var allBox=document.getElementsByClassName('aui-radio');

            for(var n=0;n<allcheckBtn.length;n++){

                allcheckBtn[n].addEventListener("click",function(){

                    if(this.checked==true){

                        for(var i=0;i<allBox.length;i++){

                            allBox[i].checked=true;
	
                        }

                    }else {

                        for(var i=0;i<allBox.length;i++){

                            allBox[i].checked=false;

                        }
                    }

                },false)

            }



            for(var j=0;j<allsingleBox.length;j++){

                allsingleBox[j].addEventListener("click",function(){

                    if(this.checked==false){

                        allcheckBtn[0].checked=false;

                        allcheckBtn[1].checked=false;
                    }else {

                        var allBoxStatue=judgeSingleBox();

                        if(allBoxStatue){

                            allcheckBtn[0].checked=true;

                            allcheckBtn[1].checked=true;

                        }else {
                            allcheckBtn[0].checked=false;

                            allcheckBtn[1].checked=false;
                        }

                    }

                },false)

            }

            function judgeSingleBox(){

                for(var m =0;m<allsingleBox.length;m++){

                    if(allsingleBox[m].checked==false){

                        return false;

                    }

                }

                return true;//有选中

            }

        },

        //编辑/完成
        editFn:function(){

            var goBuyBtn=document.getElementsByClassName('bottom_go_buy')[0];

            var deleteBtn=document.getElementsByClassName('bottom_delete')[0];

            var ShoppingEditBtn=document.getElementsByClassName('shopping_edit')[0];

            ShoppingEditBtn.addEventListener("click",function(){

                if(this.innerHTML.indexOf('编辑')>-1){

                    this.innerHTML='完成';
                    
					
                    goBuyBtn.style.transform='translate3d(0,100%,0)';

                    goBuyBtn.style.webkitTransform='translate3d(0,100%,0)';

                    deleteBtn.style.transform='translate3d(0,0,0)';

                    deleteBtn.style.webkitTransform='translate3d(0,0,0)'

                }else {
                    this.innerHTML="编辑";
					var allBoxss=document.getElementsByClassName('aui-radio');
                    for(var b=0; b<allBoxss.length; b++){
                        allBoxss[b].checked = false;
                        $("#allMoney").text(0);
                        sum = 0
                    }
                    
                    goBuyBtn.style.transform='translate3d(0,0,0)';

                    goBuyBtn.style.webkitTransform='translate3d(0,0,0)';

                    deleteBtn.style.transform='translate3d(0,100%,0)';

                    deleteBtn.style.webkitTransform='translate3d(0,100%,0)'
                }





            },false)





        },


        judegNocheck:function(){//判断当前是否一个都没有选择
            var allsingleBox=document.getElementsByClassName('singlecheck');

            for(var i=0;i<allsingleBox.length;i++){

                if(allsingleBox[i].checked){

                    return true;
                }
            }

            return false;
        },

    }


    addressSelect = new jfShowPop({

        'ele': 'delivery_address',

        'fatherId': 'delivery_address',

        'scrollClassname': 'address'
    })


    var urL = url();
    var cartList = '/cart/list';
    var cartUpdate = '/cart/update';
    var cartDelete='/cart/delete'
    var userId = $.cookie('userId');
    var sum = 0;
    var allSum = 0;
    var goodIdList = new Array();

    //初始化列表 获取
    $.ajax({
        type: 'get',
        //anysc:false,
        url: urL + cartList,
        data: {
            userId: userId
        },
        success: function (res) {
            console.log(res);
            if (res.data == null) {
                location.href = "shopping_cart_nolist.html"
            }
            ;
            var html = template('cartList', {list: res.data});
            $('.shopping_box').html(html);


            //点击加减按钮
            //shoppingBoxFn.chooseProNum()


            //单选/反选
            shoppingBoxFn.CheckBoxFn();

            //编辑、完成点击
            shoppingBoxFn.editFn();

            //删除事件
            document.getElementsByClassName('delete_btn')[0].addEventListener("click", function () {

                //对话框
                jfShowTips.dialogShow({
                    'mainText': '友情提示',
                    'minText': '确认要删除这个商品吗？',
                    'checkFn': function () {

                        jfShowTips.dialogRemove();

                        var allCheckedBox = document.getElementsByClassName('singlecheck');

                        for (var i = 0; i < allCheckedBox.length; i++) {

                            if (allCheckedBox[i].checked) {

                                var thisBoxParent = allCheckedBox[i].parentNode

                                for (var j = 0; j < 100; j++) {

                                    if (thisBoxParent.className.indexOf('shopping_list') > -1) {
                                        var goodId = thisBoxParent.getAttribute("goodId");
                                        thisBoxParent.style.display = "none";

//      							 删除商品
                                        $.ajax({
                                            type: 'POST',
                                            url: urL+cartDelete,
                                            data: {
                                                _method: "delete",
                                                userId: userId,
                                                goodId: goodId,
                                            },
                                            success: function (res) {
                                                console.log(res)
                                            },
                                            error: function (res) {
                                                console.log(res);
                                            }
                                        });

                                        break

                                    } else {
                                        thisBoxParent = thisBoxParent.parentNode;
                                    }

                                }

                            }

                        }

                    }

                })

            }, false)


//   		减少商品数量--
            $(".reduce").each(function () {
                var inNum = $(this);
                $(this).click(function () {
                    var val = parseInt($(this).next().val()) - 1
                    if (val < 0) {
                        $(this).next().val("0");
                        return false;
                    } else {
                        $(this).next().val(val)
                    }
                    $.ajax({
                        type: 'POST',
                        url: urL + cartUpdate,
                        data: {
                            userId: userId,
                            goodId: $(this).next().attr("data_id"),
                            buyCount: $(this).next().val()
                        },
                        success: function (res) {
                            inNum.parent().parent().parent().parent().prev().children().attr("data_num", inNum.next().val())
                            sum = 0
                            $(".singlecheck").each(function () {
                                if (this.checked == true) {
                                    sum = sum + $(this).attr("data_price") * 100 * $(this).attr("data_num");
                                    $("#allMoney").html(sum / 100);

                                } else {

                                }
                            });


                        },
                        error: function (res) {
                            //console.log(res);
                        }
                    });

                });
            })
//         	 添加商品数量++
            $(".add").each(function () {
                var inNum = $(this)
                $(this).click(function () {
                    var val = parseInt($(this).prev().val()) + 1
                    $(this).prev().val(val)
                    $.ajax({
                        type: 'POST',
                        url: urL + cartUpdate,
                        data: {
                            userId: userId,
                            goodId: $(this).prev().attr("data_id"),
                            buyCount: $(this).prev().val()
                        },
                        success: function (res) {
                            inNum.parent().parent().parent().parent().prev().children().attr("data_num", inNum.prev().val())
                            sum = 0
                            $(".singlecheck").each(function () {

                                if (this.checked == true) {
                                    sum = sum + $(this).attr("data_price") * 100 * $(this).attr("data_num");
                                    $("#allMoney").html(sum / 100);

                                } else {

                                }
                            });

                        },
                        error: function (res) {
                            //console.log(res);
                        }
                    });
                });
            });
//		  	手动输入商品数量
            $(".volume_btn input[type='number']").each(function () {
                $(this).blur(function () {
                    var inNum = $(this);
                    $.ajax({
                        type: 'POST',
                        url: urL + cartUpdate,
                        data: {
                            userId: userId,
                            goodId: $(this).attr("data_id"),
                            buyCount: $(this).val()
                        },
                        success: function (res) {
                            //	console.log(res);
                            inNum.parent().parent().parent().parent().prev().children().attr("data_num", inNum.val())
//					       	console.log(inNum.parent().parent().parent().parent().prev().children().attr("data_num"))
                            sum = 0
                            $(".singlecheck").each(function () {
                                if (this.checked == true) {
                                    sum = sum + $(this).attr("data_price") * 100 * $(this).attr("data_num");
                                    $("#allMoney").html(sum / 100);
                                    sum = 0
                                } else {

                                }
                            });

                        },
                        error: function (res) {
                            //	console.log(res);
                        }
                    });
                });

            });

            //选中的商品总金额
            sum = 0
            $(".singlecheck").each(function () {
                sum = 0
                $(this).click(function () {
                    console.log(1)
                    if (this.checked == true) {
                        sum = sum + $(this).attr("data_price") * 100 * $(this).attr("data_num");
                        $("#allMoney").html(sum / 100);

                    }
                    else {
                        sum = sum - $(this).attr("data_price") * 100 * $(this).attr("data_num");
                        $("#allMoney").html(sum / 100);
                    }

                })
                sum = 0;

                //点击全选时的总金额
                $("#checkAll").on('click', function () {
                    console.log(2)
                    if (this.checked == true) {
                        $(".volume_input").each(function () {
                            allSum = allSum + $(this).attr("data_price") * 100 * $(this).val()

                        })
                        $("#allMoney").html(allSum / 100);
                        sum = allSum
                        allSum = 0;
                    } else {
                        $("#allMoney").html("0");
                        sum = 0
                    }

                });

            })
            //商品id
            $("#goOrder").click(function () {
                $(".singlecheck").each(function () {
                    if (this.checked == true) {
                        goodIdList.push($(this).attr("data_id"));
                    }
                });
                if (goodIdList.length == 0) {
                    jfShowTips.toastShow('请选择商品');
                    return;
                }
                goodIdList = goodIdList.join(',');
                console.log(goodIdList);
                //$.cookie('goodList',goodList,{path:'/'});
                location.href = "../../html/order/submit_order_page.html?goodIdList=" + goodIdList;
            })
        },
        error: function () {
            jfShowTips.toastShow('系统繁忙，请稍后再试');
        }
    });


    //点穿问题
    jfProductDetails.clickThrough('delivery_address', 'address')


})