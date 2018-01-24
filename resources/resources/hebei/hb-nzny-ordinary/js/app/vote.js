(function($) {
   	// 弹幕_S
	H.comment = {
		timer: 5000,
		maxid: 0,
		pageSize: 50,
		$comments: $('#comments'),	
		init: function() {
			var me = this;
			W['barrage'] = this.$comments.barrage();
			W['barrage'].start(1);
			$(".head_img").attr("src",headimgurl ? headimgurl : "images/danmu-head.jpg")
			setInterval(function() {
				me.flash();
			}, me.timer);
		},
		flash: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + "api/comments/room?temp=" + new Date().getTime()+dev,
                data: {
                    ps: me.pageSize,
                    maxid: me.maxid,
                    anys : H.vote.cor_uuid
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
	// 弹幕_E
	
	H.utils = {
		$wrapper: $('article'),
		$comments: $('#comments'),
		resize: function() {
			var height = $(window).height();
			this.$wrapper.css('height', Math.round(height));
			this.$comments.css('height', Math.round(height-150));
			//$('body').css('height', height);
		}	
	};
   H.vote = {
     	guid :'',
        dec: 0,
        index:0,
        isCanVote :false,
        istrue: true,
        voteWheel:"",
        voteTimeList : [],
        nextTime :"",
        endTime:"",
        $current : null,
        audio_url:null,
        cor_uuid:null,
        REQUEST_CLS: "requesting",
        $inputCmt :$("#input-comment"),
		init: function () {
            this.getVoteinfo();
            H.utils.resize();
			H.vote.topic();
            H.comment.init();
            this.event();
           //this.refreshDec();
		},
		topic :function(){
			getResult('api/comments/topic/round', {
				yoi: openid,
			}, 'callbackCommentsTopicInfo', true, null, true);
		},
		swiper: function() {
	         var swiper = new Swiper('.show', {
		        nextButton: '.swiper-button-next',
		        prevButton: '.swiper-button-prev',
		        slidesPerView: "auto",
		        paginationClickable: true,
		        spaceBetween: 10,
		        freeMode: true
		    });
			//swiper.slideTo(4, 1000, false);
		    $(".show").animate({'opacity':'1'},800);
		},
		event: function() {
			var me = this; 
			$("#btn-comment").click(function(e) {
				e.preventDefault();

				if ($(this).hasClass(me.REQUEST_CLS)) {
					return;
				}
				var comment = $.trim(me.$inputCmt.val()) || '',
					comment = comment.replace(/<[^>]+>/g, ''),
					len = comment.length;
			
				if (len < 1) {
					showTips('请先说点什么吧',4);
					me.$inputCmt.removeClass('error').addClass('error').focus();
					return;
				} else if (len > 20) {
					showTips('观点字数超出了20字',4);
					me.$inputCmt.removeClass('error').addClass('error').focus();
					return;
				}
				
				$(this).addClass(me.REQUEST_CLS);

				shownewLoading();
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/comments/save'+dev,
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
                        tid: me.cor_uuid,
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
                      $("#btn-comment").removeClass(me.REQUEST_CLS);
                    	
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
			$('.join-btn').click(function(e) {
                e.preventDefault();
                var me = this;
                if ($(this).hasClass('join')) {
                    return;
                }
                 if ($(this).hasClass('notVote')) {
                 	showTips("点赞尚未开始");
                    return;
                }
                 //在投票开始倒计时不在投票时间段内
                if(H.vote.type == 1){
            		H.vote.isCanVote = false;
            		return;
            	}
                //已经投过票
                if ($(this).hasClass('voteOk')) {
                    return;
                }
                
                if (!H.vote.isCanVote) {
                    return;
                }
                $(this).addClass('join');
	            setTimeout(function(){
	               $('.join-btn').removeClass('join');
	               $('.join-btn').addClass("none")
	               $(".vote-"+votePuid).html((num*1+1)+"<span>票</span>");
	            },1000)
                var votePuid =$(".showBox").attr("data-pid");
                var groupGuid = $(".show").attr("data-guid");
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/voteguess/guessplayer'+dev,
                    data: { yoi: openid, guid: groupGuid, pluids: votePuid},
                    dataType : "jsonp",
                    jsonpCallback : 'callbackVoteguessGuessHandler',
                    complete: function() {
		                $('.join-btn').removeClass('requesting');
                    },
                    success : function(data) {
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
                $(".zan-people").addClass("voted");
                $(".pitems-"+votePuid).addClass("voted");
                var num =parseInt($(".vote-"+votePuid).text());
                
            });
            $('.btn-hide').click(function(e) {
                e.preventDefault();
                if(!$(this).hasClass("hided")){
                	$(this).addClass("hided")
                	$(this).html('显示弹幕')
                	$("#input-comment").attr("placeholder","显示弹幕才能看到评论哦");
                	$("#comments").addClass("hide");
                	return;
                }else{
                	$(this).removeClass("hided");
                	$(this).html('隐藏弹幕')
                	$("#input-comment").attr("placeholder","说说你的看法吧~");
                	$("#comments").removeClass("hide");
                	return;
                }
            })
             $('.btn-cor').click(function(e) {
                e.preventDefault();
                $(".scroll").scrollTop(130);
            })
            $('#vote-back').click(function(){
				if($(this).hasClass("requesting")){
					return;
				}
				$(this).addClass("requesting");
				setTimeout(function(){
					$('#vote-back').removeClass("requesting")
				},1000);
   			    toUrl("index.html");
			});
			$('.btn-friend').click(function(){
				if($(this).hasClass("requesting")){
					return;
				}
				$(this).addClass("requesting");
				setTimeout(function(){
					$('#vote-back').removeClass("requesting")
				},1000);
   			    toUrl("friend.html");
			});
		}, 
        refreshDec:function(){
            //隔一段时间调用服务器时间接口刷新 服务器时间和本地时间的 差值
            var dely = Math.ceil(60000*5*Math.random() + 60000*3);
            setInterval(function(){
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/common/time'+dev,
                    data: {},
                    dataType : "jsonp",
                    jsonpCallback : 'commonApiTimeHandler',
                    timeout: 11000,
                    complete: function() {
                    },
                    success : function(data) {
                        if(data.t){
                            var nowTime = new Date().getTime();
                            H.vote.dec = nowTime - data.t;
                        }
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
            },dely);
        },

        getVoteinfo: function() {
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/voteguess/inforoud'+dev,
                data: { yoi: openid},
                dataType : "jsonp",
                jsonpCallback : 'callbackVoteguessInfoHandler',
                timeout: 11000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
                        if (data.items) {
                           H.vote.voteWheel= data
                           H.vote.fillVoteinfo(data);
                        } else {
                           $(".join-btn").addClass("none");
                        }
                    } else {
                        $(".join-btn").addClass("none");
                    }
                },
                error : function(xmlHttpRequest, error) {
                   
                }
            });
        },
        fillVoteinfo: function(data) {	
            var me = this, t = simpleTpl(), items = data.items,voteSupportDelay = Math.ceil(700*Math.random() + 300);
            me.nextTime = data.nex;
            if (items.length > 0) {
                for(var i = 0, len = items.length; i < len; i++) {
                	me.guid = items[i].guid;
                	t._('<div class="swiper-box">')
	                	._('<div class="swiper-container none items-'+items[i].guid+'" data-guid="'+items[i].guid+ '">')
							._('<div class="swiper-wrapper">')
		                    if (items[i].pitems) {
		                    	var pitems = items[i].pitems;
		                        for(var h = 0, hLen = pitems.length; h < hLen; h++) {
		                            t._('<div class="swiper-slide pitems-'+pitems[h].pid+'" data-pid='+pitems[h].pid+' data-num="-" data-audio='+pitems[h].in+'>')
			                            ._('<div class="vote-box" >')
						                	._('<img src="images/load-swiper.jpg" data-src='+pitems[h].im+' onload="$(this).attr(\'src\',\''+pitems[h].im2+'\')" />')
						                ._('</div>')
					                ._('</div>')
		                        };
		                    }
		                	t._('</div>')
					    ._('</div>')
				     	._(' <div class="swiper-button-next"></div>')
					    ._('<div class="swiper-button-prev"></div>')
				    ._('</div>')
				    
                };
                $('.main').append(t.toString()).removeClass("none");
                $('.showBox').removeClass("hidden");
                me.countdownInfo(data);
                H.vote.swiper();
                me.isBindClick();
                me.getVote();
                me.$current = $(".show .swiper-slide:nth-child(1)");
                me.fillShowBox(H.vote.$current);
                setTimeout(function() { me.voteSupport(); }, voteSupportDelay);
            } else {
                //H.vote.cookie4toUrl('lottery.html');
            }
        },
        isBindClick :function(){
        	$(".swiper-slide").click(function(e){
        		e.preventDefault();
        		$(".zan-people img").removeClass("zoomIn").css("opacity","0")
        		$(".zan-people img").attr("src","");
        		H.vote.$current = $(this);
        		H.vote.fillShowBox(H.vote.$current);
        		H.vote.showBoxChange();
        		
        	})
        },
        fillShowBox :function($current){
        	var me = this,$showBox = $(".showBox");
        	$(".load-bg").removeClass("none");
        	$(".swiper-slide").find(".vote-box").removeClass("selected")
        	$current.find(".vote-box").addClass("selected");
        	$showBox.find(".zan-num").removeClass().addClass("zan-num vote-"+$current.attr("data-pid")).html($current.attr("data-num")+"<span>票</span>");
        	$showBox.find(".zan-people img").attr("src",$current.find(".vote-box img").attr("data-src"));
        	$showBox.removeClass().addClass("showBox votePer-"+$current.attr("data-pid"))
        	$showBox.attr("data-pid",$current.attr("data-pid"));
        	H.vote.playAudio($current.attr("data-audio"));
        	$(".zan-people img").get(0).onload = function(){
      		    $(".load-bg").addClass("none");
        		$(".zan-people img").css("opacity","1")
        		$(".zan-people img").addClass("zoomIn");
        		setTimeout(function(){
	        		$(".zan-people img").removeClass("zoomIn");
	        	},900)
        	}	
        },	
        playAudio: function(url) {
			var $audio = $('#ui-audio').audio({
				auto: false,			// 是否自动播放，默认是true
				stopMode: 'stop',	// 停止模式是stop还是pause，默认stop
				audioUrl: url,
				steams: [],
				steamHeight: 150,
				steamWidth: 44
			});
			
			setTimeout(function() {
				$audio.pause();
				//$audio.stop();
			}, 2000);
		},
        voteSupport: function() {
            var me = this;
            getResult('api/voteguess/groupplayertickets', { groupUuid: me.guid }, 'callbackVoteguessGroupplayerticketsHandler');
        },
        getVote: function() {
        	var me = this;
            getResult('api/voteguess/isvote', { yoi: openid,guid: me.guid}, 'callbackVoteguessIsvoteHandler ');
        },
   
        countdownInfo: function(data) {
            var me = this, voteTimeListLength = 0, nowTimeStr = timeTransform(parseInt(data.cud));
            me.voteTimeList = data.items;
            H.vote.dec = new Date().getTime() - data.cud;
			voteTimeListLength =  me.voteTimeList.length;
			me.endTime =  me.voteTimeList[voteTimeListLength-1].get;
			//最后一轮投票结束	
        	if (comptime(me.voteTimeList[voteTimeListLength-1].get,nowTimeStr) >=0) { 
        		H.vote.guid = me.voteTimeList[voteTimeListLength-1].guid;
        		H.vote.change();
                return
        	};
        	for (var i = 0; i < voteTimeListLength; i++) {
                var beginTimeStr =  me.voteTimeList[i].gst, endTimeStr = me.voteTimeList[i].get;
                 //活动正在进行
                if(comptime(nowTimeStr,beginTimeStr) < 0 && comptime(nowTimeStr,endTimeStr) >= 0){   
                	H.vote.index = i;
                	H.vote.nowCountdown(me.voteTimeList[i]);
                    return;
                }
                if(comptime(nowTimeStr,beginTimeStr) > 0){    //活动还未开始
                 	H.vote.index = i;
                 	H.vote.beforeShowCountdown(me.voteTimeList[i]);
                    return;
                }
        	};
        },
             // 投票开启倒计时
        beforeShowCountdown: function(pra) {
            H.vote.isCanVote = false;
            var beginTimeStr = pra.gst;
            var beginTimeLong = timestamp(beginTimeStr);
 			beginTimeLong += H.vote.dec;
            $('.detail-countdown').attr('etime',beginTimeLong);
            H.vote.count_down();
            H.vote.istrue = true;
            H.vote.type = 1;
            H.vote.guid = pra.guid;
            $(".swiper-container").removeClass("show").addClass("none")
            $('.items-'+ H.vote.guid).removeClass("none").addClass("show");	
            $(".join-btn").removeClass("none");
            $(".join-btn").addClass("notVote");
            H.vote.swiper();
            hidenewLoading();
        },
        // 投票结束倒计时
        nowCountdown: function(pra){
            var endTimeStr = pra.get;
            var beginTimeLong = timestamp(endTimeStr);
      		beginTimeLong += H.vote.dec;
            $('.detail-countdown').attr('etime',beginTimeLong);
       		H.vote.isCanVote = true;
            $('.join-btn').removeClass("notVote");
            H.vote.count_down();
            H.vote.istrue = true;
            $(".time-box").removeClass("hidden");
            H.vote.type = 2;
            H.vote.guid = pra.guid;
            $(".swiper-container").removeClass("show").addClass("none")
            $('.items-'+ H.vote.guid).removeClass("none").addClass("show");	
            H.vote.index ++;
            hidenewLoading();
        },
        count_down : function() {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%H%'+'时'+'%M%' + '分' + '%S%'+'秒', // 还有...结束
                    stpl : '%H%'+'时'+'%M%' + '分' + '%S%'+'秒', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(H.vote.istrue){
                        	H.vote.istrue = false;
                        	if (H.vote.type == 1) {   
                        		$(".countdown-tip").html("请稍后");
                                H.vote.nowCountdown(H.vote.voteTimeList[H.vote.index]);
                            } else if (H.vote.type == 2) {
                                   //距本轮摇奖结束倒计时结束后显示距离下次摇奖开始倒计时
	                            if(H.vote.index >= H.vote.voteTimeList.length){
	                                // 如果已经是最后一轮摇奖倒计时结束 则显示 今日所有投票结束
	                                H.vote.type = 3;
	                                H.vote.change();
	                                return;
	                            }
	                            H.vote.beforeShowCountdown(H.vote.voteTimeList[H.vote.index]);
	                           
                            } 
                        }
                            
                    },
                    sdCallback :function(){
                    }
                });
            });
        },
        change: function(){
            $(".main").addClass("ended");
            $(".swiper-container").removeClass("show").addClass("none")
            $('.items-'+ H.vote.guid).removeClass("none").addClass("show");	
            $(".showBox").find(".join-btn").addClass("none");
        },
        showBoxChange :function(){
        	if($(".main").hasClass("ended")){
	        	$(".showBox").find(".join-btn").addClass("none");
	        	return;
	        }
    		if(H.vote.$current.hasClass("voted")){
	        	$(".showBox").find(".join-btn").addClass("none");
	        
	        	return;
	        }else{
	        	$(".showBox").find(".join-btn").removeClass("none");
	        	return;
	        }	
        }
	};
	W.callbackCommentsTopicInfo = function(data) {
		if (data.code == 0) {
			H.vote.cor_uuid = data.items[0].uid;
		}
	};
    W.callbackVoteguessGroupplayerticketsHandler = function(data) {
        if (data.code == 0 && data.items) {
            var items = data.items, length = data.items.length;
            for (var i = 0; i < length; i++) {
                $('.pitems-' + data.items[i].puid).attr("data-num",data.items[i].cunt);
                $('.vote-' + data.items[i].puid).html(data.items[i].cunt+"<span>票</span>").removeClass("none");
            };
           
        } else {
            
        }
    };

    W.callbackVoteguessIsvoteHandler = function(data) {
        if (data.code == 0) {
        	//有投票记录
            if (data.so) {
    			var selectedArr = data.so.split(",");
    			for(var i = 0,len = selectedArr.length;i<len;i++){
    				$(".votePer-"+selectedArr[i]).addClass("voted");
    				$(".pitems-"+selectedArr[i]).addClass("voted");
    			}
    			H.vote.showBoxChange();
    		
    		//没有投票记录	
            } else {
            	//可以投票
            	if(H.vote.type ==2 ){
            		$(".join-btn").removeClass("none");
	    		//不可以投票
            	}else{
            		$(".join-btn").removeClass("none");
            		$(".join-btn").addClass("notVote");
            	}
            	
            }
        } else {
        	//可以投票
            	if(H.vote.type ==2 ){
            		$(".join-btn").removeClass("none");
	    		//不可以投票
            	}else{
            		$(".join-btn").removeClass("none");
            		$(".join-btn").addClass("notVote");
            	}
            	
        }
    };
})(Zepto);

$(function(){
	
    H.vote.init();
});