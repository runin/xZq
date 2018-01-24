/**
 * 奖品一栏
 */

(function($) {
	var yy = $(".prize-show"),
	    yycls = $(".prize-show>img"),
	    yyindex = $(".yy-index"),
	    pop = $(".infor-content"),
	    pop_div = $(".infor-content>div"),
	    pop_close = $(".btn-close > img"),
	    pop_h4 =$(".infor-content>h4"),
	    $popinfor = $(".pop-infor"),
	    isani = false,
	    iscls = false,
	    yyinpage,infodata,winW,winH ;
	H.showPrize = {
		init:function() {
			var me = this;
			me.event();
			me.getlinesdiy();
		},
		// 取得奖品信息
		getlinesdiy:function() {
			getResult('api/linesdiy/info',{},'callbackLinesDiyInfoHandler',true,$('body'));
		},
		// 奖品触发的事件
		event:function() {
			winW = $(window).width();
			winH = $(window).height();
			$("#btn-back").click(function(e) {
				e.preventDefault();
				$('#btn-back').addClass('tada');
				setTimeout(function()
				{
					$('#btn-back').removeClass('tada');
				},1000);
				toUrl('yiyao.html');
			});
			// 弹层关闭按钮
			pop_close.on("click", function () {
				if(isani == false){
					iscls = true;
					$popinfor.css({"-webkit-animation":"behide 0.4s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"});
					pop.css({"-webkit-animation":"disphide 0.4s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"});
				}
			});
			// 动画完成触发的事件
			pop.on("webkitAnimationEnd", function () {
				if(iscls == true){
					$popinfor.css({"display":"none","-webkit-animation":""});
					 pop.css({"display":"none","-webkit-animation":""});
					iscls = false;
				}else{
					pop.css({"-webkit-animation":""});
					$popinfor.css({"-webkit-animation":""});
				}
				isani = false;
			})
		}
	};
	W.callbackLinesDiyInfoHandler=function(data) {
		if(data.code == 0){
			infodata = data;
			var inr = "";
			$.each(data.gitems, function (index,el) {
				var im = el.is.toString();
				inr += "<div class='yy-in-page' id="+index+" ind="+el.uid+" onclick = 'popUp("+index+")'><img src="+ im +"></div>";
			});
			yyindex.html(inr);
			yyinpage = $(".yy-in-page");
			yyinpage.css({"width":(winW * 0.28)+"px","height":(winW * 0.28)+"px"});
			yyindex.scrollTop(0);
			hidenewLoading();
		}else if(data.code == 1){
			//alert("获取剧集数据失败，请刷新页面");
		}
	}

	//点击存放数据放入弹层
	W.popUp = function(index){
		$popinfor.css({"display":"block","-webkit-animation":"beshow 0.4s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"});
		 pop.css({"display":"block","-webkit-animation":"dispshow 0.4s","animation-timing-function":"linear","-webkit-animation-timing-function":"linear"});
		isani = true;
		pop_h4.html(infodata.gitems[index].t);
		pop_div.html(infodata.gitems[index].info);
		pop_divspan = $(".infor-content>div>span");
		pop_divspan.css("background","transparent !important");
		// var uid = $('#'+t).attr("ind");
		// shownewLoading();
		// for(var a=0;a<infodata.gitems.length;a++){
		// 	if(infodata.gitems[a].uid == uid){
			
		// 		hidenewLoading();
		// 	}
		//  }
    }
})(Zepto);

$(function(){
    H.showPrize.init();
	$("body").css("height",$(window).height());
});

