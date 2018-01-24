/**
 *评论抽奖页
 */
(function($) {
	H.comments = {
		$main : $('#main'),
		$lottery_time : $(".lottery-time"),
		commActUid:null,
		now_time : null,
		istrue :true,
		expires: {expires: 7},
		check: null,
		$inputCmt: $('#input-comment'),
		$btnCmt: $('#btn-comment'),
		init : function(){
			var me = this;
			me.current_time();
			me.currentCommentsAct();
			me.event_handler();
			H.utils.resize();
			H.comment.init();
			
		},
		event_handler: function() {
			var me = this,
			send_count = 0, //用户当前发送数
			send_time = []; //保存用户发送时间

			this.$lottery_time.click(function(e){
				e.preventDefault();
				if(H.comments.$lottery_time.attr("disabled") != 'disabled' && openid != null){
					toUrl("yaoyiyao.html");
				}
			});
		    this.$btnCmt.click(function(e) {
                e.preventDefault();

                if ($(this).hasClass(me.REQUEST_CLS)) {
                    return;
                }
                var comment = $.trim(me.$inputCmt.val()) || '',
                    comment = comment.replace(/<[^>]+>/g, ''),
                    len = comment.length;

                if (len < 1) {
                    alert('请先说点什么吧');
                    me.$inputCmt.removeClass('error').addClass('error').focus();
                    return;
                } else if (len > 20) {
                    alert('观点字数超出了20字');
                    me.$inputCmt.removeClass('error').addClass('error').focus();
                    return;
                }

                $(this).addClass(me.REQUEST_CLS);            
                showLoading();
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'comments/save',
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
                        tid: me.tid,
                        ty: 1,
                        nickname: nickname ? encodeURIComponent($.fn.cookie(shaketv_appid + '_nickname')) : "",
                        headimgurl: headimgurl ? headimgurl : ""
                    },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackCommentsSave',
                    complete: function() {
                        hideLoading();
                    },
                    success : function(data) {
                        me.$btnCmt.removeClass(me.REQUEST_CLS);
                        if (data.code == 0) {
                            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/avatar.jpg';
                            barrage.appendMsg("<label><img src="+ h +"/></label>"+comment);
                           // barrage.appendMsg("<img src='./images/danmu_head.png' />"+comment);
                            me.$inputCmt.removeClass('error').val('');
                            return;
                        }
                        alert(data.message);
                    }
                });

            });
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
		currentPrizeAct:function(data){
			//获取抽奖活动
			var prizeActList = data.activity,
				prizeLength = data.activity.length,
				nowTimeStr = H.comments.now_time,
				me = this,
				$lottery_time_h1 = me.$lottery_time.find("a");



	        if(comptime(prizeActList[prizeLength-1].ap+" "+prizeActList[prizeLength-1].ae,nowTimeStr) >= 0){
	        	$lottery_time_h1.html('今日抽奖已结束，明天再来吧');
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
					toUrl("yaoyiyao.html");
					return;
				}
				if(comptime(nowTimeStr,beginTimeStr) > 0){
					$lottery_time_h1.html('抽奖开启');
					H.comments.$lottery_time.find('i').removeClass('swing');
					H.comments.$lottery_time.find('i').addClass('lottery-timed');
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
					return;
				}
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
						if(H.comments.istrue){
							H.comments.istrue = false;
							var $lottery_time_h1 = H.comments.$lottery_time.find("a");
							$lottery_time_h1.html('抽奖开启');
							H.comments.$lottery_time.find('i').addClass('swing').removeClass('lottery-timed');
							H.comments.$lottery_time.removeAttr("disabled");
							$('#lottery').removeClass('none');
							$('.detail-countdown').addClass("none");
							setTimeout(toUrl("yaoyiyao.html"), 1600);
						}
						
					},
					sdCallback :function(){
					}
				});
			});
		},
		currentCommentsAct : function() {
			if(openid){
				getResult('express/themecomment/index/'+openid, {}, 'expressIndexHandler',true);
			}
		}
	};
    H.comment = {
        timer: 5000,
        maxid: 0,
        pageSize: 10,
        $comments: $('#comments'),
        init: function() {
            var me = this;
            W['barrage'] = this.$comments.barrage();
            setTimeout(function(){
                W['barrage'].start(1);

                setInterval(function() {
                    me.flash();
                }, me.timer);

            }, 1000);
        },

        flash: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + 'comments/room',
                data: {
                    ps: me.pageSize,
                    maxid: me.maxid
                },
                dataType : "jsonp",
                dataType : "jsonp",
                jsonpCallback : 'callbackCommentsRoom',
                success : function(data) {
                    if (data.code != 0) {
                        return;
                    }
                    me.maxid = data.maxid;
                    var items = data.items || [];
                    for (var i = 0, len = items.length; i < len; i ++) {
                        barrage.pushMsg("<label><img src='"+ (items[i].hu ? (items[i].hu + '/' + yao_avatar_size) : './images/avatar.jpg') +"'/></label>"+items[i].co);
                        // barrage.pushMsg("<img src='./images/danmu_head.png'/>"+items[i].co);
                    }
                }
            });
        }
    };
	// 弹幕_E
	
	H.utils = {
		$header: $('.nav'),
		$wrapper: $('article'),
		$comments: $('#comments'),
		$nav: $('.nav'),
		resize: function() {
			var height = $(window).height();
			this.$header.css('height', Math.round(height * 0.52));
			this.$wrapper.css('height', Math.round(height * 0.48));
			this.$comments.css('height', Math.round(height * 0.48-50));
			$('body').css('height', height);
		}	
	};
	W.expressIndexHandler = function(data){
		if(data.code == 0){
			H.comments.commActUid = data.actUid;
			$("#comm-title").text(data.actTle);
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
						._('<i class="support-pro"><span style="width:'+(percent)+'%;background:'+result[i].acl+'"></span></i>')
						._('<span class="lv" >'+percent+'%</span>')
					._('</p>');
					sumPercent += percent*1;
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
						t._('<a class="btn zc-btn support" style="background:'+attrs[i].acl+'" data-uuid = "'+ attrs[i].au +'"><i class="hand" style="background: url('+attrs[i].ai+') no-repeat right center;background-size:20px auto"></i><label>'+attrs[i].av+'</label></a>');
					}else{
						t._('<a class="btn zc-btn support" style="background:'+attrs[i].acl+'" data-uuid = "'+ attrs[i].au +'"><i></i><label class="chan-width">'+attrs[i].av+'</label></a>');
					}
				}
				$sx_ul.html(t.toString());
				$sx_ul.removeClass("none");
				H.comments.bindClick();
				return;
			}
		}else{
			H.comments.check = false;
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
					._('<i class="support-pro"><span style="width:'+(percent)+'%;background:'+result[i].acl+'"></span></i>')
					._('<span class="lv">'+percent+'%</span>')
				._('</p>');
				sumPercent += percent*1;
			}
			
			$sx_ul.html(t.toString());
			$('#sup').addClass("none");
			$sx_ul.removeClass("none");
		}
	}
	
	W.expressLotteryActivityHandler = function(data){
		if(data.code == 0){
			H.comments.now_time = data.tm;
			H.comments.currentPrizeAct(data);
		}
	}
})(Zepto);
$(function(){
	H.comments.init();
});