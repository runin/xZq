$(function() {
   
    loadData({ url: business_url + "mpAccount/mobile/winnerRecord/query", callbackRedPackListHandler: function (data) {
                if (data.code == 0) {
                    that.appendData(data.activities);
                }
            }
     });

	/*数据展示栏花边变化*/
	setInterval(function(){
		if($("#glitterborder").hasClass("glitter-border"))
		{
			$("#glitterborder").removeClass("glitter-border").addClass("glitter-borderafter");
		}
		else
		{
			$("#glitterborder").removeClass("glitter-borderafter").addClass("glitter-border");
		}

	},800);

	 /*数据滚动区*/
	    var _wrap=$('ul.mulitline');//定义滚动区域
	    setInterval(function(){
		     var _h=$('ul.mulitline > li:first').height();//取得每次滚动高度
		     $('ul.mulitline > li:first').animate({marginTop:-(_h)},600,function(){//通过取负margin值，隐藏第一行
			 $('ul.mulitline').append("<li>"+$('ul.mulitline > li:first').html()+"</li>");
		     $('ul.mulitline > li:first').remove();
		   })
	 },1000)//滚动间隔时间取决于_interval

	  /*
	  返回首页
	   */
	  $(".particle-active").on("click",function(){
	  		window.location.href="./index.html"
	  })

});
/*
	取得后台数据
*/
 function loadData(param) {
            var p = $.extend({ url: "", type: "get", async: false, dataType: "jsonp", showload: true }, param);
            if (p.showload) {
                W.showLoading();
            }
            var connt = 0;
            var cbName = "";
            var cbFn = null;
            for (var i in param) {
                connt++;
                if (connt == 2) {
                    cbName = i;
                    cbFn = param[i];
                    break;
                }
            }
            $.ajax({ type: p.type, data: param.data, async: p.async, url: p.url, dataType: p.dataType, jsonpCallback: cbName,
                success: function (data) {
                    W.hideLoading();
                    cbFn(data);
                },
                error: function () {
                    if (param.error) { param.error() };
                    W.hideLoading();
                    // H.dialog.showWin.open("抱歉网络延迟，请稍后再试！");
                }
            });
        }

function callBackQueryWinnerRecord(data)
{
	if(data.code == 0)
	{
		/**
		 * 实体类一揽
		 * @type {[type]}
		 */
		var objlength=data.result.objPrizes.length;
		var objPrizes = data.result.objPrizes;
		var html = "<li><ul>";
		var imgurl;
		for(var i=0;i<objlength;++i)
		{	
			var idname = "imageprice"+i;
			html += '<li><div><div class="image-price" id='+idname+'></div><div class="botoomset"></div></div><span class="price-name">'+objPrizes[i].prize+'</span>'+'<span class="user-name">'+objPrizes[i].nickName+"<span>领走了</span>";
		
			if((i+1)%2 == 0 && i!=0)
			{
				html += "</ul><li><ul>"
			}
			else
			{
				html += "</li>"
			}
		}
		$("#contentimages").find(".image-list").append(html);
		/*
			获取中奖实体图
		 */
		for(var i=0;i<objlength;++i)
		{	
			var idname = "imageprice"+i;
			imgurl = objPrizes[i].prizeImg;
			if(imgurl)
			{
				$("#"+idname).css({"background":"url("+imgurl+")","background-size":"100% 100%;"});
			}
			else
			{
				$("#"+idname).css({"background":"url(./images/rockpacket/prizeimg.png)","background-size":"100% 100%;"});
			}
			
		}
	}
	if(data.code == 0)
	{

		/**
		 * 小奖一揽
		 * @type {[type]}
		 */
		var objlength=data.result.redPrizes.length;
				var redPrizes = data.result.redPrizes;
				var html = '<ul class="mulitline">';
				var imgurl;
		for(var i=0;i<objlength;++i)
		{   
			html += "<li>";
			//电话加密
			var phoneNum = redPrizes[i].phone.slice(0,3)+"****"+redPrizes[i].phone.slice(7,11);
			html += '<ul class="inline-li"><li>'+redPrizes[i].nickName+'</li>'+'<li>'+phoneNum+'</li>'+'<li>'+redPrizes[i].serviceName+'</li>'+'<li>'+redPrizes[i].prize+'</li></ul>';
			html += "</li>";
		}
		html +="</ul>"
	    $("#contentresult").find(".inner-border").append(html); 
	}

	/*
		活动说明的弹出层
	 */
	$('.pagetitle').on('click',function(){
			H.dialog.rule.open();	
			$('.rule-con span').html(data.result.actDesc);
	    });
	
}