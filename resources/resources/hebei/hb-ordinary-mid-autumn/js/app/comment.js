(function(){
	// 弹幕_S
	H.send = 
	{   
        yaoEnterFlag:false,
		pra : null,
    	istrue: false,
        isTimeOver:false,//是否抽奖结束
        nowTime : null,
        repeat_load : true,//用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        istrue:true,
        times : 0,
		yaoBg:null,
        isError :false,
        isAllEnd : false,
        type : null,
        dec : 0,
        index : 0,
        istrue : true,
		$btnCmt: $('#btn-comment'),
		$comments: $('#comments'),
		$wrapper: $('article'),
		$inputCmt: $('#input-comment'),
		$btnCmt: $('#btn-comment'),
		REQUEST_CLS: 'requesting',
		init: function() {
			var me = this;
			var height = $(window).height();
			if (!openid) {
				return false;
			};
			getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
			me.$wrapper.css('height', Math.round(height - 135));
			me.$comments.css('height', Math.round(height - 235));
			H.comment.init();
			me.event();
			me.account_num();
			me.current_time();
		},
		account_num: function(){
		       getResult('log/serpv ', {}, 'callbackCountServicePvHander');
		},
		  current_time: function(){
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/round?dev=reid',
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryRoundHandler',
                timeout: 11000,
                complete: function() {
                },
                success : function(data) {
                	hidenewLoading();
                    if(data.result == true){
                        H.send.nowTime = timeTransform(data.sctm);
                        var nowTime = Date.parse(new Date())/1000;
                        var serverTime = timestamp(H.send.nowTime);
                        // 计算服务器时间和本地时间的差值，并存储
                        H.send.dec = (nowTime - serverTime);
                        H.send.currentPrizeAct(data);
                        $(".downContTime").removeClass("none");
                    }else{
                        if(H.send.repeat_load){
                            H.send.repeat_load = false;
                            setTimeout(function(){
                                H.send.current_time();
                            },500);
                        }else{
                        	$(".text-tip").html("活动尚未开始");
                        	$(".downContTime").addClass("none");
                        	$(".time-text").removeClass("hidden");
                        	$('.time-text').css({"width":"50%"});
                            H.send.yaoEnterFlag = false;
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                	$(".text-tip").html("活动尚未开始");
                    $(".downContTime").addClass("none");
                    $(".time-text").removeClass("hidden");
                    $('.time-text').css({"width":"50%"});
                    H.send.yaoEnterFlag = false;
                }
            });
        },
        currentPrizeAct:function(data){
           //获取抽奖活动
            var prizeActList = data.la,
                prizeLength = prizeActList.length,
                nowTimeStr = H.send.nowTime
                me = this;
                H.send.yaoBg = prizeActList[0].bi;
                H.send.pra = prizeActList;
      
            if(prizeActList.length >0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                	H.send.type = 3;
                   	H.send.change();
                    return;
                }
  
                //第一轮摇奖开始之前，显示倒计时
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                    	H.send.index = i;
                        H.send.nowCountdown(prizeActList[i]);
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                    	H.send.index = i;
 						H.send.beforeShowCountdown(prizeActList[i]);
                        return;
                    }

                }
            }else{
               $(".time-text").html('敬请期待!')
                return;
            }
        },
              // 摇奖开启倒计时
        beforeShowCountdown: function(pra) {
            var beginTimeStr = pra.pd+" "+pra.st;
            var beginTimeLong = timestamp(beginTimeStr);
 			beginTimeLong += H.send.dec;

            H.send.yaoEnterFlag = false;
            $(".text-tip").html('距摇奖开启还有   ');
            $('.downContTime').attr('etime',beginTimeLong);
            $(".time-text").removeClass("hidden");
            $('.time-text').css({"width":"68%"});
            H.send.count_down();
            H.send.istrue = true;
            H.send.type = 1;
            hidenewLoading();
        },
        // 摇奖结束倒计时
        nowCountdown: function(pra){
            var endTimeStr = pra.pd+" "+pra.et;
            var beginTimeLong = timestamp(endTimeStr);
      		beginTimeLong += H.send.dec;
            $('.downContTime').attr('etime',beginTimeLong);
            $('.downContTime').addClass("hidden");
            
            H.send.yaoEnterFlag = true;
            $(".text-tip").html("立即摇奖");
            H.send.count_down();
            H.send.istrue = true;
            $(".time-text").removeClass("hidden");
            H.send.type = 2;
            H.send.index ++;
            hidenewLoading();
            $('.time-text').css({"width":"36%"});
        },
        count_down : function() {
            $('.downContTime').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%H%'+':'+'%M%' + ':' + '%S%', // 还有...结束
                    stpl : '%H%'+':'+'%M%' + ':' + '%S%', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        // canJump 用来判断倒计时结束后是否可以自动跳转 默认 为 true;
                        // 当前有中奖弹层弹出时 canJump = false; 不能跳转
                        // 同时增加重复判断，进入判断后 canJump = false; 不能重复进入
                        // isTimeOver 用来进行重复判断默认为false，第一次进入之后变为true
                       
                        if(H.send.istrue){

                        	H.send.istrue = false;

                        	if (H.send.type == 1) {              
                                    H.send.nowCountdown(H.send.pra[H.send.index]);
                            } else if (H.send.type == 2) {
                                   //距本轮摇奖结束倒计时结束后显示距离下次摇奖开始倒计时
	                            if(H.send.index >= H.send.pra.length){
	                                // 如果已经是最后一轮摇奖倒计时结束 则显示 今日摇奖结束
	                      
	                                H.send.change();
	                                H.send.type = 3;
	                                return;
	                            }
	                           
	                            H.send.beforeShowCountdown(H.send.pra[H.send.index]);
                            } 
                        }
                            
                    },
                    sdCallback :function(){
//                  	H.lottery.istrue = true;
                    }
                });
            });
        },
        change: function(){
            H.send.yaoEnterFlag = false;
			$(".text-tip").html('本期结束!').removeClass("hidden");
            $('.time-text').css({"width":"36%"});
        },
		event: function() {
			var me = this;
            $('.time-text').click(function(e)
            { 
                if(H.send.yaoEnterFlag)
                {
                    toUrl('yaoyiyao.html'); 
                }
                else if(H.send.type == 1)
                {
                    showTips("摇奖未开始");
                }
                else
                {
                    showTips($('.text-tip').text());
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
					showTips('请先说点什么吧');
					me.$inputCmt.removeClass('error').addClass('error');
					return;
				} else if (len > 20) {
					showTips('观点字数超出了20字');
					me.$inputCmt.removeClass('error').addClass('error');
					return;
				}
				
				$(this).addClass(me.REQUEST_CLS);

				shownewLoading(null,'发射中...');
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/comments/save',
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
                        tid: me.tid,
                        ty: 1,
                        nickname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                        headimgurl: headimgurl ? headimgurl : ""
                    },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackCommentsSave',
                    complete: function() {
                        hidenewLoading();
                    },
                    success : function(data) {
                        me.$btnCmt.removeClass(me.REQUEST_CLS);
                        if (data.code == 0) {
                        	showTips('发射成功', null, 800);
                            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/danmu-head.jpg';
                            barrage.appendMsg('<div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div>'+comment);
                            $('.isme').parent('div').addClass('me');
                            me.$inputCmt.removeClass('error').val('');
                            return;
                        }
                    }
                });
				
			});
	     }
	};
	H.comment = {
		timer: 5000,
		maxid: 0,
		pageSize: 50,
		$comments: $('#comments'),	
		init: function() {
			var me = this;
			W['barrage'] = this.$comments.barrage();
			W['barrage'].start(1);
			setInterval(function() {
				me.flash();
			}, me.timer);
		},
		flash: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + "api/comments/room?temp=" + new Date().getTime(),
                data: {
                    ps: me.pageSize,
                    maxid: me.maxid
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackCommentsRoom',
                success : function(data) {
	                if (data.code == 0) {
	                    me.maxid = data.maxid;
	                     var items = data.items || [], umoReg = '/:';
	                    for (var i = 0, len = items.length; i < len; i++) {
	                    	if ((items[i].co).indexOf(umoReg) >= 0) {
	                    		var funny = items[i].co;
	                    		var nfunny = funny.replace('/:','');
				                barrage.appendMsg('<div class="c_head_img"><img src="' + (items[i].hu ? (items[i].hu + "/" + yao_avatar_size) : "./images/danmu-head.jpg") + '" /></div>'+'<img class="funnyimg" src="./images/funny/' + nfunny + '.png" border="0" />');
	                    	}else{
	                    		var hmode = "<div class='c_head_img'><img src='./images/danmu-head.jpg' class='c_head_img_img' /></div>";
		                        if (items[i].hu) {
		                            hmode = "<div class='c_head_img'><img src='" + items[i].hu + "/64' class='c_head_img_img' /></div>";
		                        }
		                        if (i < 5) {
		                            $.fn.cookie('default_comment' + i, hmode + items[i].co, expires_in);
		                        }
		                        barrage.pushMsg(hmode + items[i].co);
	                    	}
	                       
	                    }
	                } else {
	                	return;
	                }
                }
            });
        }
	};
	W.callbackCountServicePvHander = function(data){
		if(data.code == 0){
			$(".num").html(data.c).removeClass("hidden");
			$(".spon").removeClass("none");
		}
	}
	W.commonApiPromotionHandler = function(data){
	  if(data.code == 0){
			jumpUrl = data.url;
			$(".outer").attr("href",jumpUrl).html(data.desc).removeClass("none");
		}else{
			$(".outer").addClass("none");
			$('.ctrls p').css("margin","30px 70px 6px 10px"); 
		}
	};
})(Zepto);

$(function()
{
	H.send.init();
});