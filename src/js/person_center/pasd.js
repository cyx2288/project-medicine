$(function(){
	
    var urL = url();
    //更改密码
    var uUpdatePsw = '/user/updatePswByPsw';
   	var userId = $.cookie("userId");
    //获取文本框数据
    var oldPswWord = '';
    var newPswWord = '';
    var newPswWords = '';
    

    //验证原始密码
    $('#oldPsw').blur(function(){
        oldPswWord = $('#oldPsw').val();
        if(oldPswWord == ''){
            return;
        }
        checkPsw(oldPswWord);
        return;
    });

    //验证新密码
    $('#newPsw').blur(function(){
        newPswWord = $('#newPsw').val();
        if(newPswWord == ''){
            return;
        }
        checkPsw(newPswWord);
        return;
    })
	//验证新密码重复密码
    $('#newPsws').blur(function(){
        newPswWords = $('#newPsws').val();
        if(newPswWords == ''){
            return;
        }
        checkPsw(newPswWord);
        return;
        if(newPswWords!=newPswWord){
        	jfShowTips.toastShow({'text':"两次密码输入不一致,请重新输入"})
        };
        return;
    })

    $('#sub').click(function(){
		oldPswWord = $.md5($('#oldPsw').val() + 'zbkj');
        newPswWord = $.md5($('#newPsw').val() + 'zbkj');
		if(oldPswWord == undefined || newPswWord == undefined || newPswWords == undefined){
			jfShowTips.toastShow({'text':"请输入密码"});
		}
	
        $.ajax({
            url:urL + uUpdatePsw,
            type:'post',
            data:{
                id: userId,
                psw: oldPswWord,
                newPsw: newPswWord
            },
            success:function(info){
                console.log(info)
                if(info.status !==200){
                    jfShowTips.toastShow({'text':info.msg});
                    return;
                }
                location.href = 'system.html';
            },
            error:function(){
            jfShowTips.toastShow({'text':"系统繁忙，请稍后再试"})
            }
        })
    })



    //3. 验证密码
    function checkPsw(psw){
        var reg = /^[\w]{6,12}$/;
        if(!reg.test(psw)){
            jfShowTips.toastShow({'text':"密码为6-16位"});
            return false;
        }
    }
})