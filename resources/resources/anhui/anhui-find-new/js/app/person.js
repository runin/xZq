/**
 * 我要找到你-本期人物
 */
(function($) {
	H.person = {
    	uid: null,
    	expires_in : {expires: 7},
        init: function () {
            var me = this;
            this.event_handler();
            if(openid != null){
				getResult('vote/index', {
					openid: openid
				}, 'voteIndexHandler',true);
			}
            
        },
        event_handler : function() {
            var me = this;
            //提供线索
            $("#xs-btn").click(function(e){
            	e.preventDefault();
            	toUrl("baoliao.html?type=1&uid="+H.person.uid);
            });
            //发布寻人
            $("#xr-btn").click(function(e){
            	e.preventDefault();
            	toUrl("baoliao.html?type=2&uid="+H.person.uid);
            });
           //详情页面返回按钮
            $(".back-btn").click(function(){
        		$(".info").removeClass("none");
        		$(".info-detail").addClass("none");
        	});
        	

        }
    };
	H.page = {
		$pages: $('#pages'),
		puid: 0,
		guid: null,
		index : 0,
		voteNum :0,
		init: function(data) {
			var me = this;
			this.tpl(data);
			this.parallax = me.$pages.parallax({
				direction: 'horizontal',	// vertical (垂直翻页)
				swipeAnim: 'default', 		// cover (切换效果)
				drag:      true,			// 是否允许拖拽 (若 false 则只有在 touchend 之后才会翻页)
				loading:   false,			// 有无加载页
				indicator: false,			// 有无指示点
				arrow:     true,			// 有无指示箭头
				onchange: function(index, element, direction) {
					
				}
			});
			H.person.uid = this.$pages.find(".current").attr("id");
			this.event_handler();
			$($(".parallax-arrow")[H.page.index]).addClass("none");
		},
		tpl: function(data) {
			var t = simpleTpl();
			var	items = data.attrs;
			//活动ID
			H.page.puid = data.actUid;
			for (var i = 0, len = items.length; i < len; i ++) {
				 var vote = items[i].uv > 0 ? 'able' : 'disabled';
					 t._('<div class="page none" id="'+ items[i].au +'">')
						._('<div class="page-inner">')
				        	._('<div class="ctrls" data-guid="'+ items[i].au +'" style="background:url('+items[i].ai+') no-repeat ;background-size : 100% auto">')
				        	    ._('<div class="infobox">')
									._('<h1 id="xun-name">'+items[i].an +'</h1>')
									._('<span class="title" id="title">'+items[i].at +'</span>')
								._('</div>')
							._('</div>')
							._('<div class="namebox">')
								._('<div class="givebox">')
									._('<span>给他加油</span>')
									._('<span>已有 <label id="sc-count">'+items[i].vn +'</label>人为他加油</span>')	
								._('</div>')
								._('<div class="votebox">')
									._('<span class="vote" enable="'+vote+'"></span>')
//									._('<span>抽取爱心奖品</span>')   
								._('</div>')
							._('</div>')
						._('</div>')
					._('</div>')	
				}
				H.page.$pages.html(t.toString());
				H.page.info(items);
				H.page.display(data);
			},
		info: function(items){
			//点击图片进入显示详情
        	 $(".ctrls").click(function(){
        	 	var guid = $(this).attr("data-guid");
        		for (var i = 0, len = items.length; i < len; i ++) {
        			if(guid == items[i].au)
        			$(".info-box").html(items[i].ad);
        		}
        		$(".info").addClass("none");
        		$(".info-detail").removeClass("none");
        	});
		},
		display : function(data){
			$(".vote").each(function(){
				if($(this).attr("enable")=="disabled"){
					$(this).addClass("voted");
				}
			});
			this.checkDisplay(data);

		
		},
		checkDisplay : function(data){
			var items = data.attrs,
				itemsLength = items.length,
				nowTimeStr = data.tm,
				pageArr = this.$pages.find(".page"),
				me = this;
				
			for ( var i = 0; i < itemsLength; i++) {
				var bTime = items[i].ab,
					eTime = items[i].ae;	
				if(comptime(bTime,nowTimeStr) > 0){

					H.page.index = i;
					window.curPage = H.page.index;
					$("#"+items[i].au).removeClass("none");
				}
			}
			if(items[H.page.index+1]){
				var nextBtime = timestamp(items[H.page.index+1].ab);
				var serverTime = timestamp(nowTimeStr);
				var nowTime = Date.parse(new Date())/1000;
				var timeDistance = nowTime - serverTime;
				setInterval(function(){
					var nowT = Date.parse(new Date())/1000 - timeDistance;
					if(nowT >= nextBtime){
						$(pageArr[H.page.index+1]).removeClass("none");

					}
				},3000);
			}
			$("#"+items[H.page.index].au).find(".parallax-arrow").addClass("none");
		},
		event_handler : function(){
			
			var me = this;
			
			//没投过票可以投票
			$(".vote").click(function(e){
					e.preventDefault();
				if($(this).attr("enable")!="disabled"){
					H.page.guid = $(this).parents(".page").attr("id");
					getResult('vote/vote', {
						openid: openid,
						actUuid: H.page.puid,
						attrUuid:H.page.guid
					}, 'voteHandler', true);
			    }else{
			    	return;
			    }
					
			});
		}	
};

	W.voteIndexHandler =function(data) {
		if(data.code == 0){
			H.page.init(data);
		}else if(data.code == 3){//活动结束
			H.page.init(data);
		}else if(data.code == 4){//当天投票次数结束
			H.page.init(data);
		}
	};
	W.voteHandler =function(data) {
		if(data.code == 0){
			$("#"+H.page.guid ).find(".vote").attr("enable","disabled");	
			$("#"+H.page.guid ).find(".vote").addClass("voted");
			H.page.voteNum = parseInt($("#"+H.page.guid ).find("#sc-count").text());
			$("#"+H.page.guid ).find("#sc-count").text(H.page.voteNum+1);
		}
	};

})(Zepto);

$(function(){
    H.person.init();
});


