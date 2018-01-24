/**
 * 广州第一现场-评论页
 */
(function($) {
	H.comments = {
		$main : $('#main'),
		$top_back : $(".top-back"),
		actUid : null,
		page : 0,
		beforePage : 0,
		pageSize:5,
		item_index : 0,
		commActUid:null,
		loadmore : true,
		isCount : true,
		expires: {expires: 7},
		currentQuestion: null,
		resultMap: {},
		sumCount: 0,
		isError:false,
		wxCheck:false,
		init : function(){
			var me = this;
			me.wxConfig();
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
		getList:function(page){
			if(page - 1  == this.beforePage){
				$('#mallSpinner').removeClass('none');
				getResult('comments/list', {page:page,ps:this.pageSize,anys:H.comments.commActUid,op:openid,zd:0,kind:0}, 'callbackCommentsList');
			}
		},
		bindClick: function(){
			var me = this;
			$("#sup").find('.support').click(function(){
				var attrUuid = $(this).attr("data-uuid");
				getResult('api/question/answer', {
					auid:attrUuid,
					suid:me.currentQuestion.quid,
					yoi:openid
				}, 'callbackQuestionAnswerHandler',true);
				$.fn.cookie(me.currentQuestion.quid+openid,"true",{expires: 1});
				me.fill_masking("vote");
			});
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
						._('<label class="zan '+isZan+'" data-collect="true" data-collect-flag="gz-live-comments-zan" data-collect-desc="点赞" >'+ item[i].pc +'</label>')
						._('<p>'+ (item[i].na || '匿名用户') +'</p>')
						._('<p class="all-con" id="all-con'+ me.item_index +'">')
							._('<span>'+ item[i].co +'</span>')
						._('</p>')
						._('<a class="show-all none" id="show-all'+ me.item_index +'" data-collect="true" data-collect-flag="gz-live-comments-show" data-collect-desc="评论收缩显示" >^显示全部</a>')
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
		
		currentCommentsAct : function() {
			getResult('api/question/round', {}, 'callbackQuestionRoundHandler',true);
		},
		currentComments : function(commActUid) {
			getResult('comments/count', {anys:commActUid}, 'callbackCommentsCount',true);
			getResult('comments/list', {page:1,ps:this.pageSize,anys:commActUid,op:openid,dt:1,zd:1,kind:1}, 'callbackCommentsList',true);
			getResult('comments/list', {page:1,ps:this.pageSize,anys:H.comments.commActUid,op:openid,zd:0,kind:0}, 'callbackCommentsList');
		},
		to2: function(){
			if($('.giftBoxDiv').hasClass("step-1")){
                $('.giftBoxDiv').removeClass('step-1').addClass('step-2');
                $('.wer').addClass('page-a');
            }
			else{
                $('.giftBoxDiv').removeClass('step-2').addClass('step-1');
            }

		},
		fill_masking : function(type){
			var t = simpleTpl();

			t._('<div class="masking-box">')
				._('<div class="gift '+type+'">')
					._('<div class="giftBoxDiv step-1">')
						._('<div class="giftbox">')
							._('<div class="cover">')
								._('<div></div>')
							._('</div>')
							._('<div class="box"></div>')
						._('</div>')
						._('<div class="wer">')
                            ._('<span></span>')
                            ._('<span></span>')
                            ._('<span></span>')
                            ._('<span></span>')
                            ._('<span></span>')
                            ._('<span></span>')
						._('</div>')
					._('</div>')
				._('</div>');
				if(type == "vote"){
					t._('<span class="click-txt">恭喜您投票成功<br>请点击礼盒抽奖</span>')
				}else{
					t._('<span class="click-txt">感谢您积极评论<br>请点击礼盒抽奖</span>');
				}
				t._('</div>');

			$('body').append(t.toString());

			
			$(".vote").click(function(){
				H.comments.to2();
				setTimeout(function() {
					if(!H.comments.wxCheck){
						$('.masking-box').addClass('none').remove();
						H.dialog.lottery.open(null);
						return;
					}
					var sn = new Date().getTime()+'';
					$.ajax({
						type: 'GET',
						async: false,
						url: domain_url + 'api/lottery/exec/luck4Vote' + dev,
						data: { matk: matk , sn: sn},
						dataType: "jsonp",
						jsonpCallback: 'callbackLotteryLuck4VoteHandler',
						timeout: 10000,
						complete: function() {
							$('.masking-box').addClass('none').remove();
						},
						success: function(data) {
							if(data.flow && data.flow == 1){
								sn = new Date().getTime()+'';
								H.dialog.lottery.open(null);
								return;
							}
							if(data.result){
								if(data.sn == sn){
									sn = new Date().getTime()+'';
									if(data.pt == 7){
										H.dialog.wxcardLottery.open(data);
									}else{
										H.dialog.lottery.open(data);
									}
								}
							}else{
								sn = new Date().getTime()+'';
								H.dialog.lottery.open(null);
							}
						},
						error: function() {
							sn = new Date().getTime()+'';
							H.dialog.lottery.open(null);
						}
					});
					$('.giftBoxDiv').removeClass('step-1');
				}, 1700);
				recordUserOperate(openid, "调用抽奖接口", "doLottery");
			});

			$(".talk").click(function(){
				H.comments.to2();
				setTimeout(function() {
					if(!H.comments.wxCheck){
						$('.masking-box').addClass('none').remove();
						H.dialog.lottery.open(null);
						return;
					}
					var sn = new Date().getTime()+'';
					$.ajax({
						type: 'GET',
						async: false,
						url: domain_url + 'api/lottery/exec/luck' + dev,
						data: { matk: matk , sn: sn},
						dataType: "jsonp",
						jsonpCallback: 'callbackLotteryLuckHandler',
						timeout: 10000,
						complete: function() {
							$('.masking-box').addClass('none').remove();
						},
						success: function(data) {
							if(data.flow && data.flow == 1){
								sn = new Date().getTime()+'';
								H.dialog.lottery.open(null);
								return;
							}
							if(data.result){
								if(data.sn == sn){
									sn = new Date().getTime()+'';
									if(data.pt == 7){
										H.dialog.wxcardLottery.open(data);
									}else{
										H.dialog.lottery.open(data);
									}
								}
							}else{
								sn = new Date().getTime()+'';
								H.dialog.lottery.open(null);
							}
						},
						error: function() {
							sn = new Date().getTime()+'';
							H.dialog.lottery.open(null);
						}
					});
					$('.giftBoxDiv').removeClass('step-1');
				}, 1700);
				recordUserOperate(openid, "调用抽奖接口", "doLottery");
			});
		},
		ddtj: function() {
			$('#ddtj').addClass('none');
			getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
		},
		wxConfig: function() {
			$.ajax({
				type: 'GET',
				async: true,
				url: domain_url + 'mp/jsapiticket' + dev,
				data: {appId: shaketv_appid},
				dataType: "jsonp",
				jsonpCallback: 'callbackJsapiTicketHandler',
				timeout: 15000,
				complete: function() {
				},
				success: function(data) {
					if(data.code == 0){
						var url = window.location.href.split('#')[0];
						var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
						var timestamp = Math.round(new Date().getTime()/1000);
						var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
						//权限校验
						wx.config({
							debug: false,
							appId: shaketv_appid,
							timestamp: timestamp,
							nonceStr:nonceStr,
							signature:signature,
							jsApiList: [
								"addCard",
								"checkJsApi"
							]
						});
					}
				},
				error: function(xmlHttpRequest, error) {
				}
			});
		},
		isAnswer: function(quid){
			var me = this;
			// 判断cookie
			var answerCookie = $.fn.cookie(quid+openid);
			if(answerCookie && answerCookie == "true"){
				// 答过题
				me.answerResult(quid);
			}else{
				// 判断接口
				getResult('api/question/record', {quid: quid,yoi: openid}, 'callbackQuestionRecordHandler');
			}
		},
		answerResult: function(quid){
			//获取每个选项的数据
			getResult('api/question/eachsupport', {quid: quid}, 'callbackQuestionSupportHandler');
		},
		tplQuestion: function(){
			var me = this, t = simpleTpl(), $sx_ul = $('#sup'), attrs = me.currentQuestion.aitems;
			for (var i = 0, len = attrs.length; i < len; i++) {
				t._('<a class="btn support" style="background:'+colors[i]+'" data-uuid = "'+ attrs[i].auid +'"><label>'+attrs[i].at+'</label></a>');
			}
			$('#progress').addClass("none");
			$sx_ul.html(t.toString());
			$sx_ul.removeClass("none");
			H.comments.bindClick();
		},
		tplResult: function(){
			var me = this;
			var sumCount = me.sumCount;
			var sumPercent = 0;
			var result = me.currentQuestion.aitems;
			var t = simpleTpl(), $sx_ul = $('#progress');
			for (var i = 0, len = result.length; i < len; i++) {
				var percent = (me.resultMap[result[i].auid]/sumCount * 100).toFixed(0);
				if(i == result.length-1){
					percent = (100.00 - sumPercent).toFixed(0);
				}
				t._('<p>')
					._('<label>'+ result[i].at +'</label>')
					._('<i class="support-pro"><span style="width:'+(percent-2)+'%;background:'+colors[i]+'"></span></i>')
					._('<span class="lv" >'+percent+'%</span>')
					._('</p>');
				sumPercent += percent * 1;
			}
			$('#sup').addClass("none");
			$sx_ul.html(t.toString());
			$sx_ul.removeClass("none");
		}
	};
	W.callbackQuestionSupportHandler = function(data){
		if(data.code == 0 && data.aitems){
			var aitems = data.aitems;
			var sumCount = 0;
			for(var i = 0; i < aitems.length; i++){
				H.comments.resultMap[aitems[i].auid] = aitems[i].supc;
				sumCount += parseInt(aitems[i].supc);
			}
			H.comments.sumCount = sumCount;
			H.comments.tplResult();
		}else{
			// 拼接题目
			H.comments.tplQuestion();
		}
	};
	W.callbackQuestionRecordHandler = function(data){
		if(data.code == 0 && data.anws){
			// 答过题
			H.comments.answerResult(H.comments.currentQuestion.quid);
		}else{
			// 没答过题
			// 拼接题目
			H.comments.tplQuestion();
		}
	};
	W.callbackQuestionRoundHandler = function(data){
		hidenewLoading();
		if(data.code == 0){
			var question = data.qitems[0];
			if(!question){
				return;
			}
			H.comments.commActUid = question.quid;
			H.comments.currentQuestion = question;
			$("#comm-title").text(question.qt);
			H.comments.currentComments(question.quid);
			// 判断是否答过题
			H.comments.isAnswer(question.quid);
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
			H.comments.tpl(data);
		}else {
		}
	}
	
	W.supportHandler = function(data){
		if(data.code != 1){
			if(data.code != 3){
				H.dialog.lottery.open();
				H.dialog.lottery.update(data);
			}
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
				sumPercent += percent * 1;
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
				._('<label class="zan-'+data.uid+'" class="zan" data-collect="true" data-collect-flag="gz-live-comments-zan" data-collect-desc="点赞" >'+ 0 +'</label>')
				._('<p>'+ (nickname || '匿名用户') +'</p>')
				._('<p class="all-con" id="all-con'+ data.uid +'">')
					._('<span>'+ $("#comments-info").val() +'</span>')
				._('</p>')
				._('<a class="show-all none" id="show-all'+ data.uid +'" data-collect="true" data-collect-flag="gz-live-comments-show" data-collect-desc="评论收缩显示">^显示全部</a>')
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
			var localActUid = localStorage.getItem("commActUid");
			if(localActUid != H.comments.commActUid){
				H.comments.fill_masking("talk");
				localStorage.setItem("commActUid", H.comments.commActUid);
			}
		}else{
			alert(data.message);
			$("#comments-info").val("");
			$("#send").removeAttr("disabled");
			$("#comments-info").removeAttr("disabled");
		}
	};
	W.callbackQuestionAnswerHandler = function(){
		H.comments.answerResult(H.comments.currentQuestion.quid);
	};
	
	W.callbackCommentsPraise = function(data){
		if(data.code == 0){
			$(".curZan").text($(".curZan").text()*1 + 1);
			$(".curZan").removeClass("curZan");
		}
	};

	W.commonApiPromotionHandler = function(data){
		if (data.code == 0 && data.desc && data.url) {
			$('#ddtj').text(data.desc || '').attr('href', (data.url || '')).removeClass('none');
		} else {
			$('#ddtj').remove();
		}
	};
})(Zepto);
$(function(){
	H.comments.init();
	wx.ready(function () {
		wx.checkJsApi({
			jsApiList: [
				'addCard'
			],
			success: function (res) {
				var t = res.checkResult.addCard;
				//判断checkJsApi 是否成功 以及 wx.config是否error
				if(t && !H.comments.isError){
					H.comments.wxCheck = true;
				}
			}
		});
		//wx.config成功
	});

	wx.error(function(res){
		H.comments.isError = true;
		//wx.config失败，重新执行一遍wx.config操作
		//H.record.wxConfig();
	});
});