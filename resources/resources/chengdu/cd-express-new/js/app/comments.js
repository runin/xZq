/**
 * 成都深夜快递-评论抽奖页
 */
(function($) {
	H.comments = {
		$main : $('#main'),
		$lottery_time : $(".lottery-time"),
		$nav : $(".nav"),
		$top_back : $(".top-back"),
		$new_msg: $(".new-msg"),
		actUid : null,
		page : 0,
		beforePage : 0,
		item_index : 0,
		pageSize:5,
		commActUid:null,
		loadmore : true,
		expires: {expires: 7},
		dec: 0,
		repeatCheck : true,
		lotteryActList : [],
		actIndex : 0,
		$lottery_time_h1 : $(".lottery-time").find("a"),
		maxid:0,
		isTop:true,
		meArray : [],
		init : function(){
			var me = this;
			me.current_time();
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
					me.lottery();
					
				}
			});
			this.$top_back.click(function(e){
				e.preventDefault();
				$(window).scrollTop(0);
				$(this).addClass('none');
			});
			this.$new_msg.click(function(e){
				e.preventDefault();
				$(window).scrollTop(0);
				$(this).addClass('none');
			});

			$(window).scroll(function(){
				var scroH = $(this).scrollTop(),
					$fix = $('.fix');
				if(scroH > 0){
					me.isTop = false;
					$fix.removeClass('none');
					me.$top_back.removeClass('none');
					me.$new_msg.addClass('none');
				}else if(scroH == 0){
					me.isTop = true;
					$fix.addClass('none');
					me.$top_back.addClass('none');
					me.$new_msg.addClass('none');
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
					getResult('api/comments/save', {
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
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        },
		getList:function(page){
			if(page - 1  == this.beforePage){
				$('#mallSpinner').removeClass('none');
				getResultAsync('api/comments/list', {page:page,ps:this.pageSize,anys:H.comments.commActUid,op:openid,zd:0,kind:0}, 'callbackCommentsList');
			}
		},
		bindClick: function(){
			$("#sup").find('.support').click(function(){
				var attrUuid = $(this).attr("data-uuid");
				getResult('express/themecomment/support', {openid:openid,activityUuid:H.comments.commActUid,attrUuid:attrUuid}, 'supportHandler',true);
			});
		},
		bindZanClick: function(cls){
			$("."+cls).click(function(){
				if($(this).hasClass('z-ed')){ return; }
				$(this).addClass("curZan").addClass('z-ed');
				getResult('api/comments/praise', {
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
		isin: function(uid){
			for(var i = 0;i < H.comments.meArray.length;i++){
				if(H.comments.meArray[i] == uid){
					return true;
				}
			}
			return false;
		},
		roomtpl: function(data) {
			var me = this, t = simpleTpl(), item = data.items || [], $top_comment = $('#top-comment');
			for (var i = 0, len = item.length; i < len; i++) {
				if(H.comments.isin(item[i].uid)){
					continue;
				}
				var isZan = item[i].isp ? "z-ed":"";
				t._('<li data-uuid = "'+ item[i].uid +'">')
					._('<img src="'+ (item[i].im ? (item[i].im + '/' + yao_avatar_size) : './images/avatar.jpg')+'"/>')
					._('<div>')
					._('<label class="zan '+isZan+'" data-collect="true" data-collect-flag="comments-zan" data-collect-desc="点赞" >'+ item[i].pc +'</label>')
					._('<p>'+ (item[i].na || '匿名用户') +'</p>')
					._('<p class="all-con" id="all-con'+ me.item_index +'">')
					._('<span>'+ item[i].co +'</span>')
					._('</p>')
					._('<a class="show-all none" id="show-all'+ me.item_index +'" data-collect="true" data-collect-flag="comments-show" data-collect-desc="评论收缩显示" >^显示全部</a>')
					._('</div>')
					._('</li>');
				++ me.item_index;
			}
			if(t.toString().length > 0){
				$top_comment.before(t.toString());
				if(!me.isTop){
					me.$top_back.addClass("none");
					me.$new_msg.removeClass("none");
				}
			}
			for (var i = 0, len = me.item_index; i < len; i++) { me.is_show(i); }
			H.comments.bindZanClick("zan");

		},
		//查抽奖活动接口
		current_time: function(){
			getResult('api/lottery/round',{}, 'callbackLotteryRoundHandler');
		},
		currentPrizeAct:function(data){
			//获取抽奖活动
			var prizeActList = data.la,
				prizeLength = 0,
				nowTimeStr = timeTransform(data.sctm),
				me = this;
			me.lotteryActList = prizeActList;
			prizeLength = prizeActList.length;
			if(prizeActList.length >0){
				if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
					me.change();
					return;
				}
				for ( var i = 0; i < prizeActList.length; i++) {
					var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
					var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
					if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
						me.actIndex = i;
						me.leftChance();
						return;
					}
					if(comptime(nowTimeStr,beginTimeStr) > 0){
						me.do_count_down(beginTimeStr,false);
						return;
					}
				}
			}else{
				me.change();
			}
		},
		leftChance:function(){
			getResult("api/lottery/leftLotteryCount",{oi:openid},"callbackLotteryleftLotteryCountHandler");
		},
		change:function(){
			var me = this;
			me.$lottery_time_h1.html('今日抽奖已结束，明天再来吧');
			H.comments.$lottery_time.find('i').removeClass('swing');
			H.comments.$lottery_time.find('i').addClass('lottery-timed');
			H.comments.$lottery_time.attr("disabled","disabled");
			$('.detail-countdown').addClass('none');
			hideLoading();
		},
		do_count_down: function(endTimeStr,isStart){
			var me = this;
			if(isStart){
				H.comments.isLotteryTime = true;
				me.$lottery_time_h1.html('距离此次抽奖结束：');
				H.comments.$lottery_time.find('i').addClass('swing').removeClass('lottery-timed');
				H.comments.$lottery_time.removeAttr("disabled");
				$('#lottery').removeClass('none');
			}else{
				H.comments.isLotteryTime = false;
				me.$lottery_time_h1.html('距离下次抽奖开启还剩：');
				H.comments.$lottery_time.find('i').removeClass('swing');
				H.comments.$lottery_time.find('i').addClass('lottery-timed');
				H.comments.$lottery_time.attr("disabled","disabled");
			}
			var endTimeLong = timestamp(endTimeStr);
			endTimeLong += H.comments.dec;
			$('.detail-countdown').removeClass("none").attr('etime',endTimeLong);
			H.comments.count_down();
			$(".countdown").removeClass("none");
			hideLoading();
			H.comments.repeatCheck = true;
		},
		lottery : function(){
			var sn = new Date().getTime()+'';
			showLoading();
			$.ajax({
				type : 'GET',
				async : false,
				url : domain_url + 'api/lottery/luck',
				data: { oi: openid, sn: sn },
				dataType : "jsonp",
				jsonpCallback : 'callbackLotteryLuckHandler',
				complete: function() {
					hideLoading();
					H.comments.current_time();
				},
				success : function(data) {
					if(data.result){
						if(data.sn == sn){
							H.dialog.lottery.open(data);
							H.dialog.lottery.update(data);
						}
					}else{
						sn = new Date().getTime()+'';
						H.dialog.lottery.open(null);
					}
				},
				error : function() {
					sn = new Date().getTime()+'';
					H.dialog.lottery.open(null);
				}
			});
		},
		// 倒计时
		count_down: function () {
			var me = this;
			$('.detail-countdown').each(function() {
				$(this).countDown({
					etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...结束
					stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...开始
					sdtpl : '',
					otpl : '',
					otCallback : function() {
						if(H.comments.repeatCheck){
							showLoading();
							H.comments.repeatCheck = false;
							me.$lottery_time_h1.html('请稍等...');
							setTimeout(function(){
								H.comments.current_time();
							},2000);
						}
					}
				});
			});
		},
		currentCommentsAct : function() {
			getResult('express/themecomment/index/'+openid, {}, 'expressIndexHandler',true);
		},
		currentComments : function(commActUid) {
			var me = this;
			getResultAsync('api/comments/count', {anys:commActUid}, 'callbackCommentsCount',true);
			getResultAsync('api/comments/list', {page:1,ps:this.pageSize,anys:commActUid,op:openid,dt:1,zd:1,kind:1}, 'callbackCommentsList',true);
			getResultAsync('api/comments/list', {page:1,ps:this.pageSize,anys:H.comments.commActUid,op:openid,zd:0,kind:0}, 'callbackCommentsList');
			setInterval(function(){
				me.newComments(commActUid);
			},10000);
		},
		newComments : function(commActUid){
			var me = this;
			getResult('api/comments/room', {
				ps : me.pageSize,
				anys : commActUid,
				op:openid,
				maxid : me.maxid}, 'callbackCommentsRoom');
		}
	};

	W.callbackLotteryRoundHandler = function(data){
		if(data.result == true){
			var nowTimeStemp = new Date().getTime();
			H.comments.dec = nowTimeStemp - data.sctm;
			H.comments.currentPrizeAct(data);
		}else{
			H.comments.change();
		}
	};

	W.callbackLotteryleftLotteryCountHandler = function(data){
		if(data.result){
			if(data.lc > 0){
				var endTimeStr = H.comments.lotteryActList[H.comments.actIndex].pd+" "+H.comments.lotteryActList[H.comments.actIndex].et;
				H.comments.do_count_down(endTimeStr,true);
			}else{
				if(H.comments.actIndex < H.comments.lotteryActList.length - 1){
					var beginTimeStr = H.comments.lotteryActList[H.comments.actIndex + 1].pd+" "+H.comments.lotteryActList[H.comments.actIndex + 1].st;
					H.comments.do_count_down(beginTimeStr,false);
				}else{
					H.comments.change();
				}
			}
		}
	};
	
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
			}
		}
	};

	W.callbackCommentsCount = function(data){
		if(data.code == 0){
			$('.com-head').find("label").html(data.tc);
		}
	};
	
	W.callbackCommentsList = function(data){
		$('#mallSpinner').addClass('none');
		if(data.code == 0){
			H.comments.tpl(data);
			if(data.items[0].id >= H.comments.maxid){
				H.comments.maxid = data.items[0].id;
			}
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
	};
	
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
	};
	
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
			H.comments.meArray.push(data.uid);
			$("#send").removeAttr("disabled");
			$("#comments-info").removeAttr("disabled");
		}else{
			alert(data.message);
			$("#comments-info").val("");
			$("#send").removeAttr("disabled");
			$("#comments-info").removeAttr("disabled");
		}
	};
	
	W.callbackCommentsPraise = function(data){
		if(data.code == 0){
			$(".curZan").text($(".curZan").text()*1 + 1);
			$(".curZan").removeClass("curZan");
		}
	};

    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.desc && data.url) {
            $('.ddtj').text(data.desc || '');
			$("#ddtj").click(function(){
				showLoading();
				location.href = data.url;
			});
			$('#ddtj').removeClass("none");
        } else {
            $('#ddtj').remove();
        }
    };

	W.callbackCommentsRoom = function(data){
		if(data.code == 0){
			if(data.maxid > H.comments.maxid){
				H.comments.maxid = data.maxid;
				H.comments.roomtpl(data);
			}
		}
	};
})(Zepto);
$(function(){
	H.comments.init();
});