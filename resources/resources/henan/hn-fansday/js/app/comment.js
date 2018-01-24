(function(){
	// 弹幕_S
	H.send = 
	{   
		pra : null,
    	istrue: false,
        nowTime : null,
        repeat_load : true,//用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        istrue:true,
        type : null,
        dec : 0,
		$comments: $('#comments'),
		$inputCmt: $('#input-comment'),
		$btnCmt: $('#btn-comment'),
		REQUEST_CLS: 'requesting',
		init: function() {
			var me = this;
			var width = $(window).width();
			var height = $(window).height();
			
			$(".spon ul li").width(width/3)
			$(".spon ul").height(width/3*117/212) 
			$("header").height(height*0.2);
			$(".container").removeClass("none");
			var sponH = $(".spon").height();
			me.$comments.css('height', Math.round(height*0.8 -60));
			H.comment.init();
			me.event();
			me.current_time();
		},
		 current_time: function(){
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/round'+dev,
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
                        var nowTime = Date.parse(new Date());
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
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                	$(".text-tip").html("活动尚未开始");
                    $(".downContTime").addClass("none");
                    $(".time-text").removeClass("hidden");
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
                   	H.send.change();
                    return;
                }
                //第一轮摇奖开始之前，显示倒计时
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                    	toUrl("yaoyiyao.html")
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
            $(".text-tip").html('距摇奖开启还有   ');
            $('.downContTime').attr('etime',beginTimeLong);
            $(".time-text").removeClass("hidden");
            H.send.count_down();
            H.send.istrue = true;
            hidenewLoading();
        },
        count_down : function() {
            $('.downContTime').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '<label>%H%</label>'+'时'+'<label>%M%</label>' + '分' + '<label>%S%</label>秒', // 还有...结束
                    stpl : '<label>%H%</label>'+'时'+'<label>%M%</label>' + '分' + '<label>%S%</label>秒', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(H.send.istrue){
                        	$(".text-tip").html('请稍后 ');
                        	H.send.istrue = false; 
                            toUrl("yaoyiyao.html")
                        }      
                    },
                    sdCallback :function(){              
                    }
                });
            });
        },
        change: function(){
			$(".text-tip").html('本期结束').removeClass("hidden");
			toUrl("end.html");
        },
		event: function() {
			var me = this;
			$(".ad-spon li").click(function(e){
				if(!$(this).hasClass("jump")){
					if($(this).hasClass("spe")){
						$(".ad-detail").find(".detail-box").addClass("specLi");
					}else{
						$(".ad-detail").find(".detail-box").removeClass("specLi");
					}
					$(".ad-detail").find("img").attr("src",$(this).attr("data-src"))
					$(".ad-detail").removeClass("none").addClass("dispshow");
					setTimeout(function(){
						$(".ad-detail").removeClass("none").removeClass("dispshow");
					},1000)
				}else{
					shownewLoading();
					window.location.href = $(this).attr("data-href");
				}
			});
			$("#btn-detail-close").click(function(e){
				$(".ad-detail").find("img").get(0).removeAttribute("src");
				$(".ad-detail").addClass("disphide");
				setTimeout(function(){
						$(".ad-detail").removeClass("disphide");
						$(".ad-detail").addClass("none");
				},1000)
				

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
                    url : domain_url + 'api/comments/save'+dev,
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
                        tid:null,
                        ty: 2,
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
                        	showTips('发射成功');
                            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : 'images/danmu-head.jpg';
                            barrage.appendMsg('<div><div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div><div class="comment me-cor">'+comment+'</div></div>');
                            $('.isme').parent('div').addClass('me');
                            me.$inputCmt.removeClass('error').val('');
                            return;
                        }
                        showTips("评论失败");
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
                url : domain_url + "api/comments/room"+dev,
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
	                    	var hmode = "<div class='c_head_img'><img src='./images/danmu-head.jpg' class='c_head_img_img' /></div>";
		                    if (items[i].hu) {
		                        hmode = "<div class='c_head_img'><img src='" + items[i].hu + "/64' class='c_head_img_img' /></div>";
		                    }
		                    barrage.pushMsg(hmode + items[i].co); 
	                    }
	                } else {
	                	return;
	                }
                }
            });
        }
	};
})(Zepto);

$(function()
{
	H.send.init();
});