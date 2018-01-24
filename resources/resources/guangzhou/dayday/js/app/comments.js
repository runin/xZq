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
		commActUid:"",
		loadmore : true,
		isCount : true,
		expires: {expires: 7},
        attrUuid: null,
        wxCheck:false,
        isError:false,
		init : function(){
			var me = this;
			me.event_handler();
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
					showTips('请填写评论',4);
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
						ty:1,
						pa:null,
						nickname: encodeURIComponent(nickname || ''),
						headimgurl: headimgurl || ''
						}, 'callbackCommentsSave',true);
				}
			});
			$("#back-index").click(function(e){
				e.preventDefault();
				toUrl("index.html");
			});
		},
		wxConfig: function(){
            //后台获取jsapi_ticket并wx.config
            getResult("mp/jsapiticket", {
                appId: shaketv_appid
            }, 'callbackJsapiTicketHandler', false);
        },
		getList:function(page){
			if(page - 1  == this.beforePage){
				$('#mallSpinner').removeClass('none');
				getResult('comments/list', {page:page,ps:this.pageSize,anys:H.comments.commActUid,op:openid,zd:0,kind:0}, 'callbackCommentsList');
			}
		},
		bindZanClick: function(cls){
			$("."+cls).click(function(){
				if($(this).hasClass('z-ed')){ return; }
				$(this).addClass("curZan").addClass('z-ed');
				getResult('api/comments/praise', {
					uid:$(this).parent().parent().attr("data-uuid"),
					op:openid
					}, 'callbackCommentsPraise');
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
						._('<label class="zan '+isZan+'" data-collect="true" data-collect-flag="tv-gznews-dayday-comments-zan" data-collect-desc="点赞" >'+ item[i].pc +'</label>')
						._('<p>'+ (item[i].na || '匿名用户') +'</p>')
						._('<p class="all-con" id="all-con'+ me.item_index +'">')
							._('<span>'+ item[i].co +'</span>')
						._('</p>')
						._('<a class="show-all none" id="show-all'+ me.item_index +'" data-collect="true" data-collect-flag="tv-gznews-dayday-comments-show" data-collect-desc="评论收缩显示" >^显示全部</a>')
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
		currentComments : function(commActUid) {
			getResult('api/comments/count', {anys:commActUid}, 'callbackCommentsCount',true);
			getResult('api/comments/list', {page:1,ps:this.pageSize,anys:commActUid,op:openid,dt:1,zd:1,kind:1}, 'callbackCommentsList',true);
			getResult('api/comments/list', {page:1,ps:this.pageSize,anys:H.comments.commActUid,op:openid,zd:0,kind:0}, 'callbackCommentsList');
		}
	};
	H.answer = {
		actUuid: '',
		collectAnswer: '',
		rightAnswer:'',
		currTime: new Date().getTime(),
		$question: $('.answer-box .item ul'),
		$timebox: $('.time-box'),
		$timer: $('.timer'),
		STARTING_CLS: 'starting',
		STARTED_CLS: 'started',
		ENDED_CLS: 'ended',
		REPEAT_CLS: 'repeat',
		TIMETRUE_CLS: true,
		isEnd : false,
		LIMITTIMEFALSE_CLS: false,
		flag:false,
		subUuid : null,
		init: function() {
			var me = this;
			if (!openid) {
				me.loadError('活动还未开始，敬请期待~');
				return false;
			};
			me.updateQuestion();
			me.event();;
		},
		event: function() {
			var me = this;
		
		},
		updateQuestion: function() {
			getResult('api/question/info', {yoi: openid}, 'callbackQuestionInfoHandler', true, null, true);
		},
		updatePrecent : function(subUuid){
			getResult('api/question/support/'+subUuid, {},'callbackQuestionSupportHandler', true);
		},
		fillContent: function(data) {
			var me = this, t = simpleTpl(),
				qitems = data.qitems || [],
				length = qitems.length;
			me.currTime = timeTransform(data.cut);
			me.actUuid = data.tid;
			for (var i = 0; i < length; i ++) {
				//前端如果有值，表示答题过，并且是答题的选项值uuid，多个用英文逗号隔开
				if (qitems[i].anws != null) {
					var ruid = qitems[i].anws;
				} else {
					var ruid = 0;
				};
				t._('<li data-ruid="'+ ruid +'" data-stime="'+ timestamp(qitems[i].qst) +'" data-etime="'+ timestamp(qitems[i].qet) +'" id="question-'+ qitems[i].quid +'" data-quid="'+ qitems[i].quid +'" >')
					._('<p  class="arrow-box">'+ qitems[i].qt +'</p>')
					._('<div class="dorA">')
						var aitems = qitems[i].aitems || [];
						for (var j = 0, jlen = aitems.length; j < jlen; j ++) {
							t._('<a class="q-item" href="#" id="answer-'+ aitems[j].auid +'" data-auid="'+ aitems[j].auid +'" data-collect="true" data-collect-flag="tv-jiangsu-week-luck-answer-item" data-collect-desc="答题页-答案按钮">'+ aitems[j].at +'</a>')
						}
					t._('</div>')
					t._('<div class="dorB progress none">')
						var aitems = qitems[i].aitems || [];
						for (var l = 0, llen = aitems.length; l < llen; l ++) {
							t._('<p id="'+aitems[l].auid+'">')
				                ._('<label>'+aitems[l].at+'<span class="lv" ></span></label>')
				                ._('<i class="support-pro"><span></span></i>')
			                 ._('</p>');
						}
					t._('</div>')
				._('</li>')
			}
			me.$question.html(t.toString());
			me.progress(data.cut);
			me.itemBtnclick();
			me.$question.find("li").each(function(){
				if($(this).attr("data-ruid")!=0){
					H.answer.subUuid = $(this).attr("data-quid");
					me.updatePrecent(H.answer.subUuid);
				}
			})
		},
		fillResult: function(data) {
			var me = this, t = simpleTpl(),sumCount = 0,result = data.aitems,$thisQ = this.getQuestion(H.answer.subUuid);
			var countResult = 0,checkedResult = 0,sum = 0;
                $.each(result,function(i,item){
                    sum += item.supc;
                });
                $.each(result,function(j,jtem){
                    if(j == (result.length - 1)){
                        checkedResult = (100 - countResult)+"%";
                    }else{
                    	//当前百分比
                        checkedResult = (jtem.supc/sum * 100).toFixed(0) + '%';
                        //除了最后一个的百分比和
                        countResult += (jtem.supc/sum * 100).toFixed(0)*1;
                    }
                    $("#"+jtem.auid).find(".lv").html(checkedResult);
                    $("#"+jtem.auid).find(".support-pro span").animate({
                        'width': checkedResult
                    }, 350);
               });
		},
		getQuestion: function(quid) {
			return $('#question-' + quid);
		},
		getAnswer: function(quid) {
			return $('#answer-' + quid);
		},
		itemBtnclick: function() {
			var me = this;
			$('.q-item').click(function(e) {
				e.preventDefault();
				if ($(this).parent('.dorA').parent('li').find(".arrow-box").hasClass(me.REPEAT_CLS)) {
					return;
				};
				me.collectAnswer = $(this).attr('data-auid');
				$(this).parent('.dorA').parent('li').attr("data-ruid",me.collectAnswer);
				H.answer.subUuid = $(this).parent('.dorA').parent('li').attr('data-quid');
				getResult('api/question/answer', {
					yoi: openid,
					suid: H.answer.subUuid,
					auid: me.collectAnswer
				}, 'callbackQuestionAnswerHandler', true);
//				me.TIMETRUE_CLS = false;
			});
		},
		fixLocaltime: function(serverTime){
			var time, nowTime = Date.parse(new Date());
            if(nowTime > serverTime){
                time += (nowTime - serverTime);
            }else if(nowTime < serverTime){
                time -= (serverTime - nowTime);
            };
            return time;
        },
		progress: function(data) {
			var me = this, server_time = new Date(data).getTime(), itemLength = this.$question.find('li').length;
			//每道题
			
			this.$question.find('li').each(function() {
				var $me = $(this), result = $me.attr('data-ruid');
				$me.progress({
					cTime: data,
					stpl : '<span>%H%</span><span>:</span><span>%M%</span><span>:</span><span>%S%</span>',
					callback: function(state) {
						if(me.TIMETRUE_CLS) {
							var cls = '';
							switch(state) {
								case 1: 
									cls = me.STARTING_CLS + ' none';	//未开始
									break;
								case 2:
									cls = me.STARTED_CLS;	//正在进行
									break;
								default:
									cls = me.ENDED_CLS + ' none';	//已结束
							};
							$me.removeClass().addClass(cls);
							//答题开始且没有答题
							var $started = me.$question.find('li.' + me.STARTED_CLS).not(function() {
									return $(this).attr('data-ruid') != 0;
								});
							//还未开始
							var $starting = me.$question.find('li.' + me.STARTING_CLS);
							//已经结束
							var $ended = me.$question.find('li.' + me.ENDED_CLS);
						
							//所有答题未开始
							if (itemLength == $starting.length) {
								$('.answer-box .show-box').addClass('hidden');
								me.$timebox.html("距离答题开始还有"+$starting.eq(0).attr('data-timestr')).removeClass('none');
								return;
							//所有答题结束
							} else if(itemLength == $ended.length){
								me.$timebox.html("本期活动已结束，请等待下期!").removeClass("none");
								$('.answer-box .show-box').addClass('hidden');
								 clearInterval(window.progressTimeInterval);
								return;
							}else {
								$('.answer-box .show-box').removeClass('hidden');
								$('.answer-box .item').removeClass('none');
							}
							//已经开始并且尚未答题
							if ($started.length > 0) {
								$started.eq(0).removeClass('none');
								me.$timebox.html("赶快答题抽大奖哦").removeClass("none");
							} else {
								//未开
								if ($starting.length > 0) {
									var $prev = $starting.eq(0).prev('li');
									//用户选择的选项
									if($prev.attr("data-ruid")!=0 ||H.answer.collectAnswer){
										console.log($prev.attr("data-ruid")!=0 );
										$prev.find('.dorA').addClass('none');
							    		$prev.find('.dorB').removeClass('none');
							    		$prev.find(".arrow-box").addClass(H.answer.REPEAT_CLS);
							    		me.$timebox.html("距离下次答题抽奖还有"+$starting.eq(0).attr('data-timestr')).removeClass('none');
									}
								} else if ($me.next('li').length == 0) {
									$me.find(".dorB span").removeClass("selected");
									if($me.attr("data-ruid")!=0 ||H.answer.collectAnswer){
										$me.find('.dorA').addClass('none');
							    		$me.find('.dorB').removeClass('none');
							    		$me.find(".arrow-box").addClass(H.answer.REPEAT_CLS);
							    		me.$timebox.html("本期活动已结束，请等待下期!").removeClass("none");
									}
									$me.removeClass("none");
									H.answer.isEnd = true;
								}
							}
						}
					}
				});
			});
		},
		loadError: function(tips) {
			var tips = tips || '活动还未开始，敬请期待~';
			$('.time-box').html(tips).removeClass("none");
			$(".show-box").addClass("hidden");
		}
	};
	W.callbackQuestionInfoHandler = function(data) {
		if (data.code == 0) {
			
			var aitems = data.qitems;
			if (aitems) {
				H.comments.commActUid = aitems[0].quid;
				H.comments.currentComments(H.comments.commActUid);
				H.answer.fillContent(data);
			} else {
				H.answer.loadError();
			};
		} else {
			H.answer.loadError();
		};
	};
	
	W.callbackQuestionAnswerHandler = function(data) {
			H.answer.subUuid = data.suid;
			$(this).parent('.dorA').parent('li').find(".arrow-box").addClass(H.answer.REPEAT_CLS);
			H.answer.updatePrecent(H.answer.subUuid);
			H.dialog.fudai.open(); 
	};
	W.callbackQuestionSupportHandler = function(data){
		if(data.code == 0){
			H.answer.fillResult(data);
		}
	};
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
				._('<label class="zan-'+data.uid+'" class="zan" data-collect="true" data-collect-flag="tv-gznews-dayday-comments-zan" data-collect-desc="点赞" >'+ 0 +'</label>')
				._('<p>'+ (nickname || '匿名用户') +'</p>')
				._('<p class="all-con" id="all-con'+ data.uid +'">')
					._('<span>'+ $("#comments-info").val() +'</span>')
				._('</p>')
				._('<a class="show-all none" id="show-all'+ data.uid +'" data-collect="true" data-collect-flag="tv-gznews-dayday-comments-show" data-collect-desc="评论收缩显示">^显示全部</a>')
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
			showTips('评论失败',4);
			$("#comments-info").val("");
			$("#send").removeAttr("disabled");
			$("#comments-info").removeAttr("disabled");
		}
	};
	W.callbackJsapiTicketHandler = function(data) {
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
    };
	
	W.callbackCommentsPraise = function(data){
		if(data.code == 0){
			$(".curZan").text($(".curZan").text()*1 + 1);
			$(".curZan").removeClass("curZan");
		}
	};
})(Zepto);
$(function(){
	    //config微信jssdk
    H.comments.wxConfig();
    wx.ready(function () {
        hidenewLoading();
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
        //执行业务代码
        H.answer.init();
		H.comments.init();
    });

    wx.error(function(res){
        H.comments.isError = true;
        //wx.config失败，重新执行一遍wx.config操作
        //H.record.wxConfig();
    });
});