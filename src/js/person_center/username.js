$(function(){
	
	var urL = url();
	var urlNam ='/user/updateInfo';
	var userId = $.cookie("userId");
	var loginName;
	var str = location.search;
	var na = getUserNa(str);
	
	
	$("#oldName").text(na);
	//判断输入内容4-25个字符:数字、字母、下划线
	$("#inNa").blur(function(){
		loginName = $("#inNa").val();
		if(loginName == ''){
			return;
		};
		userNa(loginName);
		return;
	})
	
	//点击提交
	$("#sub").click(function(){
		loginName = $("#inNa").val();
		if(loginName == ''){
			alert('请输入用户名');
			return;
		}
		var reg = /^[0-9a-zA-Z_]{4,25}$/;
        if(!reg.test(loginName)){
            alert('用户名有误,请重新填写');
            return false;
        };
		$.ajax({
			type:'post',
	//		async:false,
		    url:urL + urlNam,
		    data:{
		    	id: userId,
		    	loginName:loginName
		    },
		    success:function(res){
		    	console.log(res)
		    	if(res.status !== 200){
	                alert(res.msg);
	                return;
	            };
		    },
		    error:function(){
		    	alert("系统繁忙，请稍后再试")
		    } 
		})
	})
	//电话正则
	function userNa(na){
        var reg = /^[0-9a-zA-Z_]{4,25}$/;
        if(!reg.test(na)){
            alert('用户名有误,请重新填写');
            return false;
        }
    }	   
	
	// 获取url上的参数值
    function getUserNa(str){
        var str1 = str.slice(1);
        var arr = str1.split("=");
        var obj = {};
        obj[arr[0]] = arr[1];
        return obj[arr[0]];
    }

})
