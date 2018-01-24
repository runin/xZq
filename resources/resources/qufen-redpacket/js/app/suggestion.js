+(function() {
    var su = {
        init: function() { 
      
            $(".submitBtn").click(function() {  

            	var c =  $("#contain").val();
            	 if(!c){
            	 	alert("请填写内容哦");
            	 	return;
            	 }
                loadData({
                    url: domain_url + "api/redpack/feedback",
                    callbackRedpackFeedbackHandler: function(data) {
                        if (data.code == 0) {
                            alert("提交成功");
                            $("#contain").val("");
                        } else {
                            alert("抱歉请稍后再试code=9");
                        }
                    },
                    data: {
                        op: window.openid, // 用户openid，必填
                        cop: window.codeOpenid, //  用户codeopenid，必填
                        c: c, //  红包id，必填
                        ou:window.businessId
                    }
                });
            });
        }
    };
    su.init();
})();
