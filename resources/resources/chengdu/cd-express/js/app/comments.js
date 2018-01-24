/**
 * 成都深夜快递-评论抽奖页
 */
(function($) {
	H.comments = {
		$main : $('#main'),
		$lottery_time : $(".lottery-time"),
		$nav : $(".nav"),
		$top_back : $(".top-back"),
		actUid : null,
		page : 0,
		beforePage : 0,
		item_index : 0,
		pageSize:5,
		commActUid:null,
		loadmore : true,
        prize_act: null,
		now_time : null,
		expires: {expires: 7},
		init : function(){
			var me = this;
//			me.current_time();
			me.currentCommentsAct();
			me.event_handler();
            me.ddtj();
		},
		event_handler: function() {
			var me = this;
			this.$main.delegate('.show-all', 'click', function(e) {
				e.preventDefault();
				var $class_all = $(this).parent('div').find('.all-con');

				$class_all.find('span').toggleClass('all');
				if( $class_all.find('span').hasClass('all')){
					$(this).text('^显示全部');
				}else{
					$class_all.css('height','auto');
					$(this).text('^收起');
				}
			});
			this.$lottery_time.click(function(e){
				e.preventDefault();
				if(H.comments.$lottery_time.attr("disabled") != 'disabled' && openid != null){
					H.lottery.lottery(H.comments.actUid,2);
					
				}
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
				if (($(document).height() - range) <= totalheight  && H.comments.page < maxpage && H.comments.loadmore) {
					if (!$('#mallSpinner').hasClass('none')) {
						return;
					}
					H.comments.getList(H.comments.page);
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
						tid:H.comments.commActUid,
						ty:2,
						pa:null,
						nickname: encodeURIComponent(nickname || ''),
						headimgurl: headimgurl || ''
						}, 'callbackCommentsSave',true);
				}
			});
			
		},
        ddtj: function() {
            $('#ddtj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        },
		getList:function(page){
			if(page - 1  == this.beforePage){
				$('#mallSpinner').removeClass('none');
				getResultAsync('comments/list', {page:page,ps:this.pageSize,anys:H.comments.commActUid,op:openid,zd:0,kind:0}, 'callbackCommentsList');
			}
		},
		bindClick: function(){
			$("#sup").find('.support').click(function(){
				var attrUuid = $(this).attr("data-uuid");
				getResult('express/themecomment/support', {openid:openid,activityUuid:H.comments.commActUid,attrUuid:attrUuid}, 'supportHandler',true);
			});
		},
		current_time: function(){
			getResult('express/lotteryactivity', {}, 'expressLotteryActivityHandler');
		},
		bindZanClick: function(cls){
			$("."+cls).click(function(){
				if($(this).hasClass('z-ed')){ return; }
				$(this).addClass("curZan").addClass('z-ed');
				getResult('comments/praise', {
					uid:$(this).parent().parent().attr("data-uuid"),
					op:openid
					}, 'callbackCommentsPraise',true);
			});
		},
		is_show: function(i){
			var $all_con = $('#all-con' + i);
			var height = $all_con.height(),
				inner_height = $all_con.find('span').height();
			if(inner_height > height){
				$all_con.find('span').addClass('all');
				$('#show-all' + i).removeClass('none');
			}
		},
		tpl: function(data) {
			var me = this, t = simpleTpl(), item = data.items || [], $top_comment = $('#top-comment'),$nor_comment = $('#nor-comment');
			for (var i = 0, len = item.length; i < len; i++) {
				var isZan = item[i].isp ? "z-ed":"";
				t._('<li data-uuid = "'+ item[i].uid +'">')
					._('<img src="'+ (item[i].im ? (item[i].im + '/' + yao_avatar_size) : './images/avatar.jpg')+'"/>')
					._('<div>')
						._('<label class="zan '+isZan+'" data-collect="true" data-collect-flag="cd-express-comments-zan" data-collect-desc="点赞" >'+ item[i].pc +'</label>')
						._('<p>'+ (item[i].na || '匿名用户') +'</p>')
						._('<p class="all-con" id="all-con'+ me.item_index +'">')
							._('<span>'+ item[i].co +'</span>')
						._('</p>')
						._('<a class="show-all none" id="show-all'+ me.item_index +'" data-collect="true" data-collect-flag="cd-express-comments-show" data-collect-desc="评论收缩显示" >^显示全部</a>')
					._('</div>')
					._('</li>');
				++ me.item_index;
			}
			if(data.kind == 1){
				$top_comment.append(t.toString());
			}else{
				$nor_comment.append(t.toString());
			}
			for (var i = 0, len = me.item_index; i < len; i++) { me.is_show(i); }
			H.comments.bindZanClick("zan");
		},
		currentPrizeAct: function (data) {
            //获取抽奖活动
            var prizeActList = data.activity,
				prizeLength = data.activity.length,
				nowTimeStr = H.comments.now_time,
				me = this,
				$lottery_time_h1 = me.$lottery_time.find("a");
            H.comments.prize_act = data;

			if(comptime(nowTimeStr,prizeActList[0].ap+" "+prizeActList[0].ab) > 0){
				$lottery_time_h1.html('距离下次摇奖开启还剩：');
				H.comments.$lottery_time.find('i').removeClass('swing');
				H.comments.$lottery_time.find('i').addClass('lottery-timed');
				H.comments.$lottery_time.attr("disabled","disabled");
				var beginTimeStr = prizeActList[0].ap + " " + prizeActList[0].ab;
                var beginTimeLong = timestamp(beginTimeStr);
    			var nowTime = Date.parse(new Date())/1000;
            	var serverTime = timestamp(nowTimeStr);
    			if(nowTime > serverTime){
    				beginTimeLong += (nowTime - serverTime);
    			}else if(nowTime < serverTime){
    				beginTimeLong -= (serverTime - nowTime);
    			}
				$('.detail-countdown').removeClass("none").attr('etime',beginTimeLong);
				H.comments.count_down();
				this.actUid = prizeActList[0].au;
				return;
			}
			if(comptime(prizeActList[prizeLength-1].ap+" "+prizeActList[prizeLength-1].ae,nowTimeStr) > 0){
				$lottery_time_h1.html('今日摇奖已结束，明天再来吧');
				H.comments.$lottery_time.find('i').removeClass('swing');
				H.comments.$lottery_time.find('i').addClass('lottery-timed');
				H.comments.$lottery_time.attr("disabled","disabled");
				$('.detail-countdown').addClass('none');
				return;
			}

			for ( var i = 0; i < prizeActList.length; i++) {
				var beginTimeStr = prizeActList[i].ap+" "+prizeActList[i].ab;
				var endTimeStr = prizeActList[i].ap+" "+prizeActList[i].ae;
				if(comptime(nowTimeStr,beginTimeStr) < 0 && comptime(nowTimeStr,endTimeStr) >=0){
					this.actUid = prizeActList[i].au;
					getResult('express/haslottery', {openid:openid,actUid:prizeActList[i].au}, 'expressHasLotteryHandler');
					return;
				}else if(comptime(nowTimeStr,beginTimeStr) >= 0){
					$lottery_time_h1.html('距离下次摇奖开启还剩：');
					H.comments.$lottery_time.find('i').addClass('lottery-timed');
					H.comments.$lottery_time.find('i').removeClass('swing');
					H.comments.$lottery_time.attr("disabled","disabled");
					var beginTimeLong = timestamp(beginTimeStr);
	    			var nowTime = Date.parse(new Date())/1000;
	            	var serverTime = timestamp(nowTimeStr);
	    			if(nowTime > serverTime){
	    				beginTimeLong += (nowTime - serverTime);
	    			}else if(nowTime < serverTime){
	    				beginTimeLong -= (serverTime - nowTime);
	    			}
					$('.detail-countdown').removeClass("none").attr('etime',beginTimeLong);
					H.comments.count_down();
					if(i< prizeActList.length -1){
						this.actUid = prizeActList[i+1].au;
					}
					return;
				}
			}
		},
     // 倒计时
        count_down: function () {
        	$('.detail-countdown').each(function() {
				var $me = $(this);
				$(this).countDown({
					etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...结束
					stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function(state) {
						if(state === 3){
							showLoading();
							setTimeout(function(){
								hideLoading();
								location.reload(true);
							},1500);
						}
					}
				});
			});
        },
		currentCommentsAct : function() {
			getResult('express/themecomment/index/'+openid, {}, 'expressIndexHandler',true);
		},
		currentComments : function(commActUid) {
			getResultAsync('comments/count', {anys:commActUid}, 'callbackCommentsCount',true);
			getResultAsync('comments/list', {page:1,ps:this.pageSize,anys:commActUid,op:openid,dt:1,zd:1,kind:1}, 'callbackCommentsList',true);
			getResultAsync('comments/list', {page:1,ps:this.pageSize,anys:H.comments.commActUid,op:openid,zd:0,kind:0}, 'callbackCommentsList');
		}
	};

	W.expressHasLotteryHandler = function(data){
		if(data.code == 0){
			var prizeActList = H.comments.prize_act.activity,
				index = null,
				nowTimeStr = H.comments.now_time,
				$lottery_time_h1 = H.comments.$lottery_time.find("a");

			for ( var i = 0; i < prizeActList.length; i++) {
				if(H.comments.actUid == prizeActList[i].au){
					index = i;
					break;
				}
			}
			if(data.result){
				if(index >= (prizeActList.length-1)){
					$lottery_time_h1.html('今日摇奖已结束，明天再来吧');
					H.comments.$lottery_time.find('i').removeClass('swing');
					H.comments.$lottery_time.find('i').addClass('lottery-timed');
					H.comments.$lottery_time.attr("disabled","disabled");
					$('.detail-countdown').addClass('none');
				}else{
					$lottery_time_h1.html('距离下次摇奖开启还剩：');
					H.comments.$lottery_time.find('i').removeClass('swing');
					H.comments.$lottery_time.find('i').addClass('lottery-timed');
					H.comments.$lottery_time.attr("disabled","disabled");
					var beginTimeStr = prizeActList[index + 1].ap + " " + prizeActList[index + 1].ab;
                    var beginTimeLong = timestamp(beginTimeStr);
	    			var nowTime = Date.parse(new Date())/1000;
	            	var serverTime = timestamp(nowTimeStr);
	    			if(nowTime > serverTime){
	    				beginTimeLong += (nowTime - serverTime);
	    			}else if(nowTime < serverTime){
	    				beginTimeLong -= (serverTime - nowTime);
	    			}
					$('.detail-countdown').removeClass("none").attr('etime',beginTimeLong);
					H.comments.count_down();
					H.comments.actUid = prizeActList[index+1].au;
				}
			}else{
				$lottery_time_h1.html('距离此次摇奖结束：');
				H.comments.$lottery_time.find('i').addClass('swing').removeClass('lottery-timed');
				H.comments.$lottery_time.removeAttr("disabled");
				$('#lottery').removeClass('none');
				var beginTimeStr = prizeActList[index].ap + " " + prizeActList[index].ae;
                var beginTimeLong = timestamp(beginTimeStr);
    			var nowTime = Date.parse(new Date())/1000;
            	var serverTime = timestamp(nowTimeStr);
    			if(nowTime > serverTime){
    				beginTimeLong += (nowTime - serverTime);
    			}else if(nowTime < serverTime){
    				beginTimeLong -= (serverTime - nowTime);
    			}
				$('.detail-countdown').removeClass("none").attr('etime',beginTimeLong);
				H.comments.count_down();
				H.comments.actUid = prizeActList[index].au;
			}
		}
	}
	
	W.expressIndexHandler = function(data){
		if(data.code == 0){
			H.comments.commActUid = data.actUid;
			$("#comm-title").text(data.actTle);
			H.comments.currentComments(data.actUid);
			var result = data.result;
			if(result != null && result.length != 0){
				var sumCount = data.count;
				var sumPercent = 0;
				var t = simpleTpl(), $sx_ul = $('#progress');
				for (var i = 0, len = result.length; i < len; i++) {
					var percent = (result[i].ac/sumCount * 100).toFixed(0);
					if(i == result.length-1){
						percent = (100.00 - sumPercent).toFixed(0);
					}
					t._('<p>')
						._('<label>'+ result[i].av +'</label>')
						._('<i class="support-pro"><span style="width:'+(percent-2)+'%;background:'+result[i].acl+'"></span></i>')
						._('<span class="lv" >'+percent+'%</span>')
					._('</p>');
					sumPercent += percent * 1;
				}
				
				$sx_ul.html(t.toString());
				$sx_ul.removeClass("none");
				return;
			}
			var attrs = data.attrs;
			if(attrs != null && attrs.length != 0){
				var me = this, t = simpleTpl(), $sx_ul = $('#sup');
				for (var i = 0, len = attrs.length; i < len; i++) {
					if(attrs[i].ai != ""){
						t._('<a class="btn support" style="background:'+attrs[i].acl+'" data-uuid = "'+ attrs[i].au +'"><i class="hand" style="background: url('+attrs[i].ai+') no-repeat right center;background-size:17px auto"></i><label>'+attrs[i].av+'</label></a>');
					}else{
						t._('<a class="btn support" style="background:'+attrs[i].acl+'" data-uuid = "'+ attrs[i].au +'"><i></i><label class="chan-width">'+attrs[i].av+'</label></a>');
					}
				}
				$sx_ul.html(t.toString());
				$sx_ul.removeClass("none");
				H.comments.bindClick();
				return;
			}
		}
	}

	W.callbackCommentsCount = function(data){
		if(data.code == 0){
			$('.com-head').find("label").html(data.tc);
		}
	}
	
	W.callbackCommentsList = function(data){
		$('#mallSpinner').addClass('none');
		if(data.code == 0){
			H.comments.tpl(data);
			if (data.items.length < H.comments.pageSize && data.kind == 0) {
				H.comments.loadmore = false;
			}
			if(data.items.length == H.comments.pageSize){
				if(H.comments.page == 0){
					H.comments.beforePage = 1;
					H.comments.page = 2;
				}else{
					H.comments.beforePage = H.comments.page;
					H.comments.page++ ;
				}
			}
		}else {
		}
	}
	
	W.supportHandler = function(data){
		if(data.code == 0){
			var sumCount = data.count;
			var sumPercent = 0;
			var result = data.result;
			var t = simpleTpl(), $sx_ul = $('#progress');
			for (var i = 0, len = result.length; i < len; i++) {
				var percent = (result[i].ac/sumCount * 100).toFixed(0);
				if(i == result.length-1){
					percent = (100.00 - sumPercent).toFixed(0);
				}
				t._('<p>')
					._('<label>'+ result[i].av +'</label>')
					._('<i class="support-pro"><span style="width:'+(percent-2)+'%;background:'+result[i].acl+'"></span></i>')
					._('<span class="lv">'+percent+'%</span>')
				._('</p>');
				sumPercent += percent *1;
			}
			
			$sx_ul.html(t.toString());
			$('#sup').addClass("none");
			$sx_ul.removeClass("none");
		}
	}
	
	W.callbackCommentsSave = function(data){
		if(data.code == 0 ){
			var headImg = null;
			if(headimgurl == null || headimgurl == ''){
				headImg = './images/avatar.jpg';
			}else{
				headImg = headimgurl + '/' + yao_avatar_size;
			}
			var t = simpleTpl(),$nor_comment = $('#nor-comment');
			t._('<li id="'+ data.uid +'" data-uuid = "'+ data.uid +'">')
			._('<img src="'+ headImg +'"/>')
			._('<div>')
				._('<label class="zan-'+data.uid+'" class="zan" data-collect="true" data-collect-flag="cd-express-comments-zan" data-collect-desc="点赞" >'+ 0 +'</label>')
				._('<p>'+ (nickname || '匿名用户') +'</p>')
				._('<p class="all-con" id="all-con'+ data.uid +'">')
					._('<span>'+ $("#comments-info").val() +'</span>')
				._('</p>')
				._('<a class="show-all none" id="show-all'+ data.uid +'" data-collect="true" data-collect-flag="cd-express-comments-show" data-collect-desc="评论收缩显示">^显示全部</a>')
			._('</div>')
			._('</li>');

			if($nor_comment.children().length==0){
				$nor_comment.append(t.toString());
			}else{
				$nor_comment.children().first().before(t.toString());
			}
			H.comments.is_show(data.uid);
			$("#comments-info").val("");
			H.comments.bindZanClick("zan-"+data.uid);
			$('.com-head').find("label").html($('.com-head').find("label").html()*1+1);

			var navH = $("#"+data.uid).offset().top;
			$(window).scrollTop(navH);
			
			$("#send").removeAttr("disabled");
			$("#comments-info").removeAttr("disabled");
		}else{
			alert(data.message);
			$("#comments-info").val("");
			$("#send").removeAttr("disabled");
			$("#comments-info").removeAttr("disabled");
		}
	}
	
	W.callbackCommentsPraise = function(data){
		if(data.code == 0){
			$(".curZan").text($(".curZan").text()*1 + 1);
			$(".curZan").removeClass("curZan");
		}
	}
	
	W.expressLotteryActivityHandler = function (data) {
    	if(data.code == 0){
    		H.comments.now_time = data.tm;
            H.comments.currentPrizeAct(data);
    	}else{
            H.comments.$lottery_time.find("a").html('今日摇奖还未开始，敬请期待');
			H.comments.$lottery_time.find('i').removeClass('swing');
			H.comments.$lottery_time.find('i').addClass('lottery-timed');
			H.comments.$lottery_time.attr("disabled","disabled");
			$('.detail-countdown').addClass('none');
    	}
    }
    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.desc && data.url) {
            $('#ddtj').text(data.desc || '').attr('href', (data.url || '')).removeClass('none');
        } else {
            $('#ddtj').remove();
        };
    }
})(Zepto);
$(function(){
	H.comments.init();
});