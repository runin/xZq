/**
 * 靓妆母亲节-抽奖
 */
(function($) {
    H.lottery = {
        ruuid : 0,
        $main : $('#main'),
        $rule_close: $('.rule-close'),
        page : 1,
		beforePage : 0,
		item_index : 0,
		pageSize:4,
        $top_back : $(".top-back"),
        loadmore : true,
        $card : $(".card"),
        $cardBox :$(".card-box"),
        actUid :null,
        istrue: true,
        lottery_count: 0,
        $lottery_time_tips :$(".lottery-tip"),
        paint : "images/paint.png",
        init : function(){
        	var me = this;
        	//评论
            me.currentComments();
            me.event();
            //查活动
            me.current_time();
            setInterval(function(){
            	 H.lottery.account_num();
            },5000);
        },
        event: function() {
            var me = this,
                width = this.$cardBox .width();
	        this.$cardBox.height(width*265/440).removeClass("hidden");
            $('#btn-pocket').click(function(e) {
				e.preventDefault();
				toUrl("gift.html");
				return;
			});
			$('#btn-rule').click(function(e) {
				e.preventDefault();
				H.dialog.rule.open();
			});
			$("#lottery-btn").click(function(e) {
				e.preventDefault();
				$(this).addClass("none");
				H.lottery.prize();
				
			});
   			this.$top_back.click(function(e){
				e.preventDefault();
				$(window).scrollTop(0);
				$(this).addClass('none');
			});
			$(window).scroll(function(){
				var scroH = $(this).scrollTop(),
					$fix = $('.fix');
				if(scroH > 0){
					$fix.removeClass('none');
					me.$top_back.removeClass('none');
				}else if(scroH == 0){
					$fix.addClass('none');
					me.$top_back.addClass('none');
				}
			});
			
			var range = 55, //距下边界长度/单位px
			maxpage = 100, //设置加载最多次数
			totalheight = 0;
			$(window).scroll(function(){
			    var srollPos = $(window).scrollTop();
			    totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
				if (($(document).height() - range) <= totalheight  && H.lottery.page < maxpage && H.lottery.loadmore) {
					if (!$('#mallSpinner').hasClass('none')) {
						return;
					}
					H.lottery.getList(H.lottery.page);
			    }
			});
			
			$("#send").click(function(){
				if(!$.trim($("#comments-info").val())){
					alert('请填写评论');
					$("#comments-info").focus();
					return;
				}
				if(openid != null){
					$("#send").attr("disabled","disabled");
					$("#comments-info").attr("disabled","disabled");
					if(headimgurl != null && headimgurl.indexOf("./images/avatar.jpg") > 0){
						headimgurl='';
					}
					getResult('comments/save', {
						co:encodeURIComponent($("#comments-info").val()),
						op:openid,
						ty:2,
						pa:null,
						nickname: encodeURIComponent(nickname || ''),
						headimgurl: headimgurl || ''
						}, 'callbackCommentsSave',true);
				}
			});
        },
          //查询当前参与人数
        account_num: function(){
		       getResult('log/serpv ', {}, 'callbackCountServicePvHander');
		},
       //查抽奖活动接口
        current_time: function(){
        	getResult('jsexpress/lotteryactivity', {openid:openid}, 'expressLotteryActivityHandler',true);
		},
        prize :function(){
        	getResult('jsexpress/lottery', {openid:openid,actUid:H.lottery.actUid}, 'expressLotteryHandler',false);
        },   	
        card : function(data){
        	var lottery = new Lottery(H.lottery.$card.get(0), 'images/paint.png', 'image', H.lottery.$card.width(),H.lottery.$card.height(), function() {
					hideLoading(H.lottery.$card);
					H.dialog.lottery.open();
					H.dialog.lottery.update(data);
			    });
			    showLoading(H.lottery.$card);
			  	imgReady(H.lottery.paint,function(){
			  		if(data&&data.code == 0){
			  			lottery.init(data.pi,"image");
			  		}else{
			  			lottery.init("images/thank.png","image");
			  		}
					setTimeout(function(){
						$("#lottery-mask").css("display","block");
					},500);	
				}); 
				setTimeout(function(){
					if($("#lottery-mask").css("display") == "block"){
						hideLoading(H.lottery.$card);
					}		
				},600);	
        },
		currentComments : function() {
			//查评论
			getResult('comments/list', {
						 page:H.lottery.page,
						 ps:H.lottery.pageSize ,
						 op:openid
					}, 'callbackCommentsList',true);
		
		},
      	currentPrizeAct:function(data){
			//获取抽奖活动
			var prizeActListAll = data.activity,
				nowTimeStr = data.tm,
				prizeActList = [],
				prizeLength =0,
				me = this;
			var day = nowTimeStr.split(" ")[0];
			if(prizeActListAll&&prizeActListAll.length>0){
				for ( var i = 0; i < prizeActListAll.length; i++) {
					if(prizeActListAll[i].ap == day){
						prizeActList.push(prizeActListAll[i]);
					}
			    }
			}
			prizeLength = prizeActList.length;
			if(prizeLength >0){
				if(comptime(prizeActList[prizeLength-1].ap+" "+prizeActList[prizeLength-1].ae,nowTimeStr) >= 0 ||prizeActList[prizeLength-1].an==0){
					$(".lottery").addClass("none");
					$(".lottery-end").removeClass("none");
					H.lottery.$lottery_time_tips.html('今日抽奖已结束');
					return;
				}
				for ( var i = 0; i < prizeActList.length; i++) {
					var beginTimeStr = prizeActList[i].ap+" "+prizeActList[i].ab;
					var endTimeStr = prizeActList[i].ap+" "+prizeActList[i].ae;
					H.lottery.actUid = prizeActList[i].au;
					H.lottery.lottery_count = prizeActList[i].an;
					//未在抽奖时间段内
					if(comptime(nowTimeStr, beginTimeStr) > 0){
						H.lottery.$lottery_time_tips.html('距离下次抽奖开始还有：');
						var beginTimeLong = timestamp(beginTimeStr);
						var nowTime = Date.parse(new Date())/1000;
						var serverTime = timestamp(nowTimeStr);
						if(nowTime > serverTime){
							beginTimeLong += (nowTime - serverTime);
						}else if(nowTime < serverTime){
							beginTimeLong -= (serverTime - nowTime);
						}
						$('.detail-countdown').removeClass("none").attr('etime',beginTimeLong);
						H.lottery.$card.addClass("none");
						$("#lottery-btn").addClass("none");
						H.lottery.count_down();
						return;
					}
					//在抽奖时间段内，且还可以抽奖
					if( comptime(nowTimeStr, endTimeStr) > 0&&comptime(nowTimeStr, beginTimeStr) < 0&&H.lottery.lottery_count >0){
						H.lottery.$card.addClass("hidden");
						$("#lottery-btn").removeClass("none");
						H.lottery.$lottery_time_tips.html('本轮还有<label>'+H.lottery.lottery_count+'</label>次刮奖机会');
						return;
					}
				}
			}else{
				$(".lottery").addClass("none");
				$(".lottery-end").removeClass("none");
				H.lottery.$lottery_time_tips.html('今日抽奖已结束');
				return;
			}
		},
		// 倒计时
		count_down : function() {
			$('.detail-countdown').each(function() {
				var $me = $(this);
				$(this).countDown({
					etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...结束
					stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function() {
						if(H.lottery.istrue){
							H.lottery.istrue = false;
							$("#lottery-btn").removeClass("none");
					        H.lottery.$lottery_time_tips.html('本轮还有<label>'+H.lottery.lottery_count+'</label>次刮奖机会');
					        return;
						}
						
					},
					sdCallback :function(){
					}
				});
			});
		},
        getList:function(page){
        	var me = this;
			if(page - 1  == this.beforePage){
				$('#mallSpinner').removeClass('none');
				getResult('comments/list', {
					     page:this.page,
						 ps:this.pageSize,
						 op:openid,
					}, 'callbackCommentsList',true);
			}
		},
   		bindZanClick: function(cls){
			$("."+cls).click(function(){
				if($(this).hasClass('z-ed')){ return; }
				$(this).addClass("curZan").addClass('z-ed');
				getResult('comments/praise', {
					uid:$(this).parent("li").attr("data-uuid"),
					op:openid
					}, 'callbackCommentsPraise',true);
			});
		},
//
//      is_show: function(i){
//			var $all_con = $('#all-con' + i);
//			var height = $all_con.height(),
//				inner_height = $all_con.find('span').height();
//			if(inner_height > height){
//				$all_con.find('span').addClass('all');
//				$('#show-all' + i).removeClass('none');
//			}
//		},
		tpl: function(data) {
			var me = this, t = simpleTpl(), item = data.items || [], $top_comment = $('#top-comment'),$nor_comment = $('#nor-comment');
			for (var i = 0, len = item.length; i < len; i++) {
				var isZan = item[i].isp ? "z-ed":"";
				t._('<li data-uuid = "'+ item[i].uid +'">')
					    ._('<label class="headImg"><img src="'+ (item[i].im ? (item[i].im + '/' + yao_avatar_size) : './images/avatar.jpg')+'"/></label>')
					    ._('<div class="cont">')
					        ._('<p>'+ (item[i].na || '匿名用户') +'</p>')
						    ._('<p class="all-con" id="all-con'+ me.item_index +'">')
							    ._('<span>'+ item[i].co +'</span>')
						    ._('</p>')
					    ._('</div>')
					    ._('<label class="zan '+isZan+'" data-collect="true" data-collect-flag="js-mother-day-comments-zan" data-collect-desc="点赞" >'+ item[i].pc +'</label>')				
					._('</li>');
				++ me.item_index;
			}
			if(data.kind == 1){
				$top_comment.append(t.toString());
			}else{
				$nor_comment.append(t.toString());
			}
			//for (var i = 0, len = me.item_index; i < len; i++) { me.is_show(i); }
			$("ul li label.headImg").height($("ul li label.headImg").width());
			$("ul li label.headImg img").height($("ul li label.headImg").width());
			H.lottery.bindZanClick("zan");
		},
   
    };
	W.callbackCommentsList = function(data){
		$('#mallSpinner').addClass('none');
		if(data.code == 0){
			if (data.items.length < H.lottery.pageSize) {
				H.lottery.loadmore = false;
			}
			if(data.items.length == H.lottery.pageSize){
				if(H.lottery.page == 0){
					H.lottery.beforePage = 1;
					H.lottery.page = 2;
				}else{
					H.lottery.beforePage = H.lottery.page;
					H.lottery.page++ ;
				}
			}
			H.lottery.tpl(data);
		}else {
		}
	}
	W.callbackCommentsSave = function(data){
		if(data.code == 0 ){
			var headImg = null;
			var width = $("ul li label.headImg").width();
			if(headimgurl == null || headimgurl == ''){
				headImg = './images/avatar.jpg';
			}else{
				headImg = headimgurl + '/' + yao_avatar_size;
			}
			var t = simpleTpl(),$nor_comment = $('#nor-comment');
			t._('<li id="'+ data.uid +'" data-uuid = "'+ data.uid +'">')
			    ._('<label class="headImg"><img src="'+ headImg +'"/></label>')
				._('<div>')
					._('<p>'+ (nickname || '匿名用户') +'</p>')
					._('<p class="all-con" id="all-con'+ data.uid +'">')
						._('<span>'+ $("#comments-info").val() +'</span>')
					._('</p>')
				._('</div>')
				._('<label class="zan zan-'+data.uid+'" data-collect="true" data-collect-flag="js-mother-day-comments-zan" data-collect-desc="点赞" >'+ 0 +'</label>')
			._('</li>');

			if($nor_comment.children().length==0){
				$nor_comment.append(t.toString());
			}else{
				$nor_comment.children().first().before(t.toString());
			}
			//评论收缩显示全部
//			H.lottery.is_show(data.uid);
            $("ul li label.headImg").height(width);
            $("ul li label.headImg img").height(width);
			$("#comments-info").val("");
			H.lottery.bindZanClick("zan-"+data.uid);
			$('.com-head').find("label").html($('.com-head').find("label").html()*1+1);
//			var navH = $("#"+data.uid).offset().top;
//			$(window).scrollTop(navH);		
			$("#send").removeAttr("disabled");
			$("#comments-info").removeAttr("disabled");
		}else{
			alert(data.message);
			$("#comments-info").val("");
			$("#send").removeAttr("disabled");
			$("#comments-info").removeAttr("disabled");
		}
	};
  
    W.expressLotteryActivityHandler = function(data){
		if(data.code == 0){
			H.lottery.currentPrizeAct(data);
		}else{
			$(".lottery-tip").html("敬请期待");
		}
	};
	W.expressLotteryHandler = function(data) {
		    H.lottery.$card.html("").removeClass("hidden");
			H.lottery.card(data);  
			
    };
	W.callbackCountServicePvHander = function(data){
		if(data.code == 0){
			$(".count label").html(data.c);
			$(".count").removeClass("hidden");
		}
	};
	W.callbackCommentsPraise = function(data){
		if(data.code == 0){
			$(".curZan").text($(".curZan").text()*1 + 1);
			$(".curZan").removeClass("curZan");
		}
	};
})(Zepto);

$(function() {
    H.lottery.init();
});
