/**
 * 奖品一栏
 */
var yy = $(".yy"),
	yycls = $(".yy>img"),
	yyindex = $(".yy-index"),
	jj = $(".jj"),
	jjdiv = $(".jj>div"),
	jjimg = $(".jj>a"),
	jjh4 =$(".jj>h4"),
	black = $(".black"),
	isani = false,
	iscls = false,
	yyinpage,infodata,winW,winH ;
(function($) {
	H.showPrize = {
		init:function() {
			var me = this;
			me.event();
			me.getlinesdiy();
		},
		getlinesdiy:function() {
			getResult('api/linesdiy/info',{},'callbackLinesDiyInfoHandler',true,$('body'));
		},
		event:function() {
			winW = $(window).width();
			winH = $(window).height();
			$("#btn-back").click(function(e) {
				e.preventDefault();
				$('#btn-back').css({"-webkit-animation":"ft 0.6s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).on("webkitAnimationEnd", function () {
					toUrl('yiyao.html');
				});
			});
			jjimg.on("click", function () {
				if(isani == false){
					iscls = true;
					black.css({"-webkit-animation":"behide 0.3s","animation-timing-function":"ease-in","-webkit-animation-timing-function":"ease-in"});
					jj.css({"-webkit-animation":"disphide 0.3s","animation-timing-function":"ease-in","-webkit-animation-timing-function":"ease-in"});
				}
			});
			jj.on("webkitAnimationEnd", function () {
				if(iscls == true){
					black.css({"display":"none","-webkit-animation":""});
					jj.css({"display":"none","-webkit-animation":""});
					iscls = false;
				}else{
					jj.css({"-webkit-animation":""});
					black.css({"-webkit-animation":""});
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
				inr += "<div class='yy-in-page' id="+index+" ind="+el.uid+" onclick = 'show("+index+")'><img src="+ im +"></div>";
			});
			yyindex.html(inr);
			yyinpage = $(".yy-in-page");
			yyinpage.css({"width":(winW * 0.28)+"px","height":(winW * 0.28)+"px"});
			yyindex.scrollTop(10000);
			hidenewLoading();
		}else if(data.code == 1){
			//alert("获取剧集数据失败，请刷新页面");
		}
	}
})(Zepto);

$(function(){
    H.showPrize.init();
	$("body").css("height",$(window).height());
});
function show(t){
	//alert($('#'+t).attr("ind"));
	black.css({"display":"block","-webkit-animation":"beshow 0.3s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"});
	jj.css({"display":"block","-webkit-animation":"dispshow 0.3s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"});
	isani = true;
	var uid = $('#'+t).attr("ind");
	//playid = $('#'+t).attr("t");
	shownewLoading();
	for(var a=0;a<infodata.gitems.length;a++){
		if(infodata.gitems[a].uid == uid){
			jjh4.html(infodata.gitems[a].t);
			jjdiv.html(infodata.gitems[a].info);
			jjdivspan = $(".jj>div>span");
			jjdivspan.css("background","transparent !important");
			hidenewLoading();
		}
	}
}
