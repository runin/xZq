(function($){
	// 弹幕_S
	H.send = {   
		$comments: $('.cor-assist'),
		$inputCmt: $('#input-comment'),
		$btnCmt: $('#btn-comment'),
		REQUEST_CLS: 'requesting',
		allRecordTime: Math.ceil(4000*Math.random() + 10000),
		nowTime :null,
        type:2, //判断倒计时形式 1为抽奖开始之前，2为抽奖正在进行 默认为2 ,3为今日抽奖已结束,0未查到抽奖活动轮次信息
        dec:0,
        index:0,
        repeatCheck:true,//倒计时重复回调开关
        pal:null,
        crossLotteryCanCallback:false,
        crossLotteryFlag:false,
        on :false,//霸屏开启为true,
        baNum:3,
        baItems :[],
		init: function() {
			var me = this;
			me.current_time();
			me.resize();
			H.comment.init();
			me.event();
		},
		resize :function(){
			var me = this;
			var width = $(window).width();
			var height = $(window).height();
			me.$comments.css('width', width);
			me.$comments.css('height',height - $("header").height()-$("#article").height());
			$(".container").width(width);
			$(".container").height(height);
		},
		refreshDec:function(){
            //隔一段时间调用服务器时间接口刷新 服务器时间和本地时间的 差值
            var dely = Math.ceil(60000*5*Math.random() + 60000*3);
            setInterval(function(){
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/common/time',
                    data: {},
                    dataType : "jsonp",
                    jsonpCallback : 'commonApiTimeHandler',
                    timeout: 11000,
                    complete: function() {
                    },
                    success : function(data) {
                        if(data.t){
                            var nowTime = new Date().getTime();
                            H.se.dec = (nowTime - data.t);
                        }
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
            },dely);
        },
        current_time: function(){
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/round' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryRoundHandler',
                timeout: 15000,
                complete: function() {
                },
                success : function(data) {
                    if(data.result == true){
                        H.send.nowTime = timeTransform(data.sctm);
                        var nowTime = Date.parse(new Date());
                        H.send.dec = (nowTime - data.sctm);
                        H.send.currentPrizeAct(data);
                    }else{
                        H.send.change();
                    }
                },
                error : function(xmlHttpRequest, error) {
                      H.send.change();
                }
            });
        },
        //活动结束
        end: function(){
        	H.send.isCanShake = false;
            H.send.type = 3;
//          $(".countdown-tip").html("本期摇奖已结束");
            $(".detail-countdown").addClass("hidden");
            $(".countdown").addClass("hidden");
             $(".hand").removeClass("wobble");
            hidenewLoading();
        },
        //接口返回false，没有查到抽奖活动
        change: function(){
            H.send.isCanShake = false;
            H.send.type = 0;
//          $(".countdown-tip").html("更多精彩，敬请期待");
            $(".detail-countdown").addClass("hidden");
            $(".countdown").addClass("hidden");
            $(".hand").removeClass("wobble");
            hidenewLoading();
        },
  		currentPrizeAct:function(data){
            //获取抽奖活动
            var prizeActListAll = data.la,
                prizeLength = 0,
                nowTimeStr = H.send.nowTime,
                prizeActList = [],
                me = this,
                day = nowTimeStr.split(" ")[0];
            if(prizeActListAll&&prizeActListAll.length>0){
                for ( var i = 0; i < prizeActListAll.length; i++) {
                    if(prizeActListAll[i].pd == day){
                        prizeActList.push(prizeActListAll[i]);
                    }
                }
            }
        
            if(prizeActList.length >0){
            	H.send.pal = prizeActList;
	            prizeLength = prizeActList.length;
	              // 判断是否为跨天摇奖 配置文件中crossdayLimit跨天摇奖阀值，默认2h
	            var lastLotteryEtime = prizeActList[prizeLength - 1].pd + ' ' + prizeActList[prizeLength - 1].et;
	            var lastLotteryNtime = prizeActList[prizeLength - 1].nst;
	            var crossDay = timeTransform(new Date().setDate(new Date(lastLotteryEtime).getDate() + 1)).split(" ")[0];
	            var minCrossDay = crossDay + ' 00:00:00';
	            var maxCrossDay = timeTransform(new Date(minCrossDay).getTime() + crossdayLimit);
	            if(comptime(lastLotteryNtime, minCrossDay) <= 0 && comptime(lastLotteryNtime, maxCrossDay) >= 0) {
	                me.crossLotteryFlag = true;
	            } else {
	                me.crossLotteryFlag = false;
	            }
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    if (me.crossLotteryFlag) {
                        me.crossCountdown(prizeActList[prizeLength - 1].nst);
                    } else {
                        H.send.type = 3;
	                    H.send.end();
                    }
                    return; 
                }
                //config微信jssdk
                
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        H.send.index = i;
                        H.send.nowCountdown(prizeActList[i]);
                        hidenewLoading();
                        return;
                    }
                    // 据下次摇奖开始
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        H.send.index = i;
                        H.send.beforeShowCountdown(prizeActList[i]);
                        hidenewLoading();
                        return;
                    }
                }
            }else{
                H.send.change();
            }
        },
		beforeShowCountdown: function(pra) {
        	var me = this;
            me.type = 1;
            me.isCanShake = false;
            var beginTimeStr = pra.pd+" "+pra.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += me.dec;
//          $(".countdown-tip").html('距摇奖开启还有 ');
            $('.detail-countdown').attr('etime',beginTimeLong).removeClass("hidden");
            me.count_down();
            $('.countdown').removeClass('hidden');
            $(".hand").removeClass("wobble");
            me.repeatCheck = true;
            hidenewLoading();
        },
        // 距本轮摇奖结束倒计时
        nowCountdown: function(pra){
        	var me = this;
            me.type = 2;
            var endTimeStr = pra.pd+" "+pra.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).removeClass("hidden");
//          $(".countdown-tip").html("距摇奖结束还有");
            me.count_down();
            $(".countdown").removeClass("hidden");
            $(".hand").addClass("wobble");
            me.index ++;
            me.repeatCheck = true;
            hidenewLoading();
        },
        // 跨天摇奖开启倒计时
        crossCountdown: function(nextTime) {
            var me = this;
            me.crossLotteryFlag = false;
            me.crossLotteryCanCallback = true;
            me.type = 1;
            var beginTimeLong = timestamp(nextTime);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime',beginTimeLong).removeClass("hidden");
//          $(".countdown-tip").html('距本轮摇奖开始还有');
            me.count_down();
            $('.countdown').removeClass('hidden');
            $(".hand").removeClass("wobble");
            me.repeatCheck = true;
            hidenewLoading();
        },
        count_down : function() {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%M%' + ':' + '%S%' + '', // 还有...结束
                    stpl : '%M%' + ':' + '%S%' + '', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                    	if(H.send.repeatCheck){
	                        H.send.repeatCheck = false;
	                        $(".countdown-tip").html("请稍后");
	                        $('.detail-countdown').addClass("hidden");
	                        if(H.send.type == 1){
	                        	if(H.send.crossLotteryCanCallback){
	                        		var delay = Math.ceil(1000*Math.random() + 500);
                                    H.send.crossLotteryCanCallback = false;                                 
                                    shownewLoading(null, '请稍后...');
                                    setTimeout(function(){
                                        H.send.current_time();
                                    }, delay);
                                    return;
	                        	}
	                            //距下次摇奖开始倒计时结束后显示距离本轮摇奖结束倒计时
	                            H.send.nowCountdown(H.send.pal[H.send.index]);
	                        }else if(H.send.type == 2){
	                        	
	                            //距本轮摇奖结束倒计时结束后显示距离下次摇奖开始倒计时
	                            if(H.send.index >= H.send.pal.length){
	                            	//跨天倒计时
	                            	if(H.send.crossLotteryFlag){
	                            		 H.send.crossCountdown(H.send.pal[H.send.pal.length - 1].nst);
	                            	}else{
	                            		// 如果已经是最后一轮摇奖倒计时结束 
		                                H.send.type = 3;
		      							H.send.end();
	                            	}
	                            	return;
	                             }
	                             H.send.beforeShowCountdown(H.send.pal[H.send.index]);
	                         }
	                    }
                    },
                    sdCallback :function(){
                    }
                });
            });
        },
		event: function() {
			var me = this;
			$(".tip-box").click(function(e){
				e.preventDefault();
				toUrl("yao.html")
			});
			$("#btn-view").click(function(e){
				e.preventDefault();
				toUrl("vote.html")
			})
			$("#btn-back").click(function(e){
				e.preventDefault();
				toUrl("index.html")
			})
		}
	
	};
	H.comment = {
		timer: 5000,
		pageSize: 10,
		answered : false,
		support_maxid : 0,
		down_maxid : 0,
		$comments: $('#input-comment'),	
		baMaxid : localStorage.baMaxid || 0,
		$btnCmt : $("#btn-comment"),
		meArray: new Array(),
		init: function() {
			var me = this;
			if(!localStorage.selection){
				$($(".ctrls").addClass("hidden"))
			}else{
				$($(".ctrls").removeClass("hidden"))
				$("#btn-comment").attr("data-uuid",localStorage.anys);
			}
			H.comment.get_count($(".support"));
	        setTimeout(function(){
				H.comment.get_count($(".down"));
			},500);
			setInterval(function(){
            	H.comment.get_count($(".support"));
	            setTimeout(function(){
					H.comment.get_count($(".down"));
				},4000);
			},8000)
			H.comment.show_room();
//			H.comment.topic();
			H.comment.event();
			setInterval(function(){
				var type = getRandomArbitrary(0,2);
				me.pushDefault(type);
			},5000);
		},
		get_count : function($div){
			$.ajax({
		       type : 'GET',
		       async : true,
		       url : domain_url + "api/servicecount/getcount"+dev,
		       data: {
		           key : $div.attr("data-count")
		        },
		        dataType : "jsonp",
		        jsonpCallback : 'callbackServiceCountGetHandler',
		        success : function(data) {
			        var $currentNum = $div.find(".num");
				    if (data.result) {
				       $currentNum.html(data.c);
				    }else{ 
				       $currentNum.html('-');
			        }
				}
		    });
		},
//		topic:function(){
//			shownewLoading();
//          $.ajax({
//              type : 'GET',
//              async : false,
//              url : domain_url + 'api/question/round' + dev,
//              data: {},
//              dataType : "jsonp",
//              jsonpCallback : 'callbackQuestionRoundHandler',
//              timeout: 15000,
//              complete: function() {
//              },
//              success : function(data) {
//                  if(data.code == 0){
//                      if(data.qitems.length > 0){
//                      	var quid = data.qitems[0].quid
//                      	var options = data.qitems[0].aitems;
//                      	$(".views").attr('data-quid',quid);
//                      	$(".support").attr('data-uuid',options[0].auid).addClass('option-'+options[0].auid);
//                      	$(".down").attr('data-uuid',options[1].auid).addClass('option-'+options[1].auid);
//                      	$(".support-cor").attr('data-uuid',options[0].auid).addClass('cor-'+options[0].auid);
//                      	$(".down-cor").attr('data-uuid',options[1].auid).addClass('cor-'+options[1].auid);
//                      	getResult('api/question/record', {quid:quid,yoi:openid}, 'callbackQuestionRecordHandler');
//                      	getResult('api/question/eachsupport', {quid:quid}, 'callbackQuestionSupportHandler');
//                      	H.comment.show_room();
//                      	$("#article").removeClass("hidden");
//                      }else{
//                      	$("#article").addClass("hidden");
//                      }
//                  }else{
//                   	$("#article").addClass("hidden");
//                  }
//              },
//              error : function(xmlHttpRequest, error) {
//                  
//              }
//          });
//		},
		event :function(){
			$(".option").click(function(e){
				e.preventDefault();
				if($(".option").hasClass("requesting")){
					return;
				}
				$(".option").addClass("requesting")
				var $this = $(this);
				localStorage.selection = $this.attr("data-count");
				localStorage.anys = $this.attr("data-anys");
				$(".ctrls").removeClass("hidden");
				$("#btn-comment").attr("data-uuid",$this.attr("data-anys"));
				if(parseInt($this.find(".num").html())>=0){
					$this.find(".num").html(parseInt($this.find(".num").html())+1)
				}
				$.ajax({
		            type : 'GET',
		            async : true,
		            url : domain_url + "api/servicecount/incrcount"+dev,
		            data: {
		                key : $this.attr("data-count")
		            },
		            dataType : "jsonp",
		            jsonpCallback : 'callbackServiceCountIncrHandler',
		            success : function(data) {
		            	$(".option").removeClass("requesting")
		            }
		        });
//				if(!H.comment.answered){
//					shownewLoading();
//					 $.ajax({
//		                type : 'GET',
//		                async : true,
//		                url : domain_url + "api/question/answer"+dev,
//		                data: {
//		                    yoi : openid,
//		                    suid : $(".views").attr("data-quid"),
//		                    auid : $(this).attr("data-uuid")
//		                },
//		                dataType : "jsonp",
//		                jsonpCallback : 'callbackQuestionAnswerHandler',
//		                success : function(data) {
//			                if (data.code == 0) {
//			                	hidenewLoading()
//			                	showTips("您的立场已明确");
//			                	$("#btn-comment").attr('data-uuid',$this.attr("data-uuid"));
//			                	H.comment.answered =true;
//			                	var $currentNum = $this.find(".num");
//			                	$currentNum.html(parseInt($currentNum.text())+1);
//			                }else{
//			                	showTips("活动已过期");
//			                	$('.ctrls').addClass("none");
//			                }
//		                }
//		            });
//				}
			});
			this.$btnCmt.click(function(e) {
				e.preventDefault();
				var me = H.comment;
				if ($(this).hasClass('requesting')) {
					return;
				}
				var tid = me.$btnCmt.attr("data-uuid");
				if(!tid){
					showTips("请选择顶还是踩！");
					return;
				}
				var comment = $.trim(me.$comments.val()) || '',
					comment = comment.replace(/<[^>]+>/g, ''),
					len = comment.length;
					
				if (len < 1) {
					showTips('请先说点什么吧');
					return;
				} 
				if (len > 20) {
					showTips('尽量简短哦，不能超过20字');
					return;
				} 
				$(this).addClass('requesting');
				shownewLoading(null,'发送中...');
				
				$.ajax({
	                type : 'GET',
	                async : false,
	                url : domain_url + 'api/comments/save'+dev,
	                data: {
	                    co: encodeURIComponent(comment),
	                    op: openid,
	                    tid:tid,
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
	                        me.$btnCmt.removeClass('requesting');
	                        if(data.code == 0){
					            H.comment.fillAfterSubmit(tid,comment);
					            H.comment.$comments.blur().val('');
					            H.comment.meArray.push(data.uid);
					        }else{
					            showTips("网络异常,稍后请重试");
					        };
	                    }
	               });
			});
	    },
	   	isin: function(uid){
            for(var i = 0;i < H.comment.meArray.length;i++){
                if(H.comment.meArray[i] == uid){
                    return true;
                }
            }
            return false;
        },	
	   fillAfterSubmit: function(tid,comment){
            var me = this;
            var comments = "";
            comments += '<li class="li'+Math.random(1,9)+'">'
                + '<div class="ron">'
                + '<div class="article">'+comment+'</div>'
                + '</div>'
                + '</li>';
            $('.cor-'+tid ).find('ul').append(comments);
       },
	   show_room : function(){
	    	var me = this;
            me.down_room($(".down").attr("data-anys"));
	        setTimeout(function(){
				me.support_room($(".support").attr("data-anys"));
			},100);
            setInterval(function(){
            	me.down_room($(".down").attr("data-anys"));
	            setTimeout(function(){
					me.support_room($(".support").attr("data-anys"));
				},4000);
			},8000)
	    },
	    support_room: function(uuid){
	    	$.ajax({
	            type : 'GET',
	            async : false,
	            url : domain_url + 'api/comments/room'+dev,
	            data: {
	                'anys' : uuid,
			        'maxid' : H.comment.support_maxid,
			        'ps' : H.comment.pageSize
	            },
	            dataType : "jsonp",
	            jsonpCallback : 'callbackCommentsRoom',
	            complete: function() {
	                hidenewLoading();
	            },
	            success : function(data) {
	                H.comment.support_cor(data);   
	            }
	        });
        },
       down_room: function(uuid){
	    	$.ajax({
	            type : 'GET',
	            async : false,
	            url : domain_url + 'api/comments/room'+dev,
	            data: {
	                'anys' : uuid,
			        'maxid' : H.comment.down_maxid,
			        'ps' : H.comment.pageSize
	            },
	            dataType : "jsonp",
	            jsonpCallback : 'callbackCommentsRoom',
	            complete: function() {
	                hidenewLoading();
	            },
	            success : function(data) {
	                H.comment.down_cor(data)   
	            }
	        });
       }, 
       support_cor : function(data){
       	   if(data.code == 0){
               var items = data.items;
               var show_mesg = false;
               H.comment.support_maxid =  data.maxid 
               if(items.length > 0){
                   var t = simpleTpl();
                   for(var i = items.length-1;i >= 0;i--){
                       if(H.comment.isin(items[i].uid)){
                           continue;
                       }
           			   show_mesg = true;
                       t._('<li class="li'+i+'">')
                           ._('<div class="ron">')
                               ._('<div class="article">'+items[i].co+'</div>')
                            ._('</div>')
                        ._("</li>");
                    }
                $('.support-cor ul').append(t.toString());
              }
           }
       },
       down_cor : function(data){
       	   if(data.code == 0){
               var items = data.items;
               var show_mesg = false;
                H.comment.down_maxid =  data.maxid 
               if(items.length > 0){
                   var t = simpleTpl();
                   for(var i = items.length-1;i >= 0;i--){
                       if(H.comment.isin(items[i].uid)){
                           continue;
                       }
           			   show_mesg = true;;
                       t._('<li class="li'+i+'">')
                           ._('<div class="ron">')
                               ._('<div class="article">'+items[i].co+'</div>')
                            ._('</div>')
                        ._("</li>");
                    }
                $('.down-cor ul').append(t.toString());
              }
           }
       },
		pushDefault: function (type) {
			var text = "";
			if(type == 1){
				//顶弹幕
				var rand = getRandomArbitrary(0,ding.length);
				text = ding[rand];
				var t = simpleTpl();
				t._('<li class="li'+rand+'">')
					._('<div class="ron">')
					._('<div class="article">'+text+'</div>')
					._('</div>')
					._("</li>");
				$('.support-cor ul').append(t.toString());
			}else{
				//踩弹幕
				var rand = getRandomArbitrary(0,ding.length);
				text = cai[rand];
				var t = simpleTpl();
				t._('<li class="li'+rand+'">')
					._('<div class="ron">')
					._('<div class="article">'+text+'</div>')
					._('</div>')
					._("</li>");
				$('.down-cor ul').append(t.toString());
			}
		},
	};
	
	W.commonApiSPVHander = function(data){
		if(data.code == 0){
			var num = String(data.c);
			var t = "";
			for(var i = 0;i< num.length;i++){
			   t = t + "<label>"+num[i]+"</label>";
			}
			$(".count span").html(t);
			$(".count").removeClass("hidden");
		}
	};
//	W.callbackQuestionRecordHandler = function(data){
//		if(data.code == 0){
//			if(data.anws){
//				$("#btn-comment").attr("data-uuid",data.anws);
//				H.comment.answered = true;
//			}else{
//				H.comment.answered = false;
//			}
//		}else{
//			H.comment.answered = false;
//		}
//	};
//	W.callbackQuestionSupportHandler = function(data){
//		if(data.code == 0){
//			var optionRes = data.aitems;
//			if(optionRes.length>0){
//				for(var i = 0;i<optionRes.length;i++){
//					$(".option-"+optionRes[i].auid).find(".num").text(optionRes[i].supc);
//				}
//			}else{
//				$(".num").html('-');
//			}
//		}else{
//			$(".num").html('-');
//		}
//	};
})(Zepto);

$(function(){
	H.send.init();
});