(function($) {
	H.talk = {
        uid: null,
        input: $("#input_text"),
        maxid: 0,
        pageSize: 20,
        meArray: new Array(),
        isBottom:false,
        $tip:$("#mesg-tip"),
        isFirst:true,
        nowTime :null,
        dec: 0,
        yaoBg :[],
        pra:null,
        index:0,
        repeat_load : true,
        istrue : false,
        flag : true,
		init: function() {
            var me = this;
            me.init_size();
            me.event();
            me.current_time();
            me.question();
            me.canBottom();
            me.ddtj();
            setInterval(function(){
                H.talk.account_num();
            },Math.ceil(3000*Math.random() + 500));

		},
        event: function(){
            var me = this;
            $("#input_submit").click(function(){
                if($.trim(H.talk.input.val()).length == 0){
                    showTips("什么都没有说呢");
                    return false;
                } else if ($.trim(H.talk.input.val()).length < 3){
                    showTips("多说一点吧！至少3个字哦");
                    return false;
                } else if ($.trim(H.talk.input.val()).length > 100){
                    showTips("评论字数不能超过100个字哦");
                    return false;
                };
                if (H.talk.uid != '') {
                    getResult('api/comments/save',{
                        'co' : encodeURIComponent(H.talk.input.val()),
                        'op' : openid,
                        'nickname': nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "匿名用户",
                        'headimgurl': headimgurl ? headimgurl : "",
                        'tid': H.talk.uid,
                        'ty': 1
                    }, 'callbackCommentsSave', true, null);
                };
            });
            $("#btn-cor").click(function(e){
               	e.preventDefault();
               	return;
            });
            $("#btn-yao").click(function(e){
               	e.preventDefault();
               	if($(this).hasClass("requesting")){
					return;
				}
				$(this).addClass("requesting");
               	$(".nav-bottom").css({
               		'background-image': 'url(../images/nav-bottom.png) no-repeat center',
					'background-size': '100%',
               		'background-position':'0% 0%'
               	});
               	toUrl("yao.html");
            });
            me.$tip.click(function(){
//                var body = document.getElementById('body');
//                body.scrollTop = $('#comment_list').height();
                $('#body').scrollToTop($('#comment_list').height());
            });
        },
        init_size : function(){
        	var bodyH =$(window).height()-200;
            $("#body").height(bodyH)
            $(".nav-bottom").height($(window).width()*100/640-2).removeClass("hidden");
            $(".input_head").find("img").attr("src",headimgurl||"images/head.jpg")
        },
          //查询当前参与人数
        account_num: function(){
		       getResult('api/common/servicedaypv', {}, 'commonApiSDPVHander');
		},
        ddtj: function() {
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
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
                        H.talk.nowTime = timeTransform(data.sctm);
                        var nowTime = Date.parse(new Date());
                        var serverTime = timestamp(H.talk.nowTime);
                        // 计算服务器时间和本地时间的差值，并存储
                        H.talk.dec = (nowTime - serverTime);
                        H.talk.currentPrizeAct(data);
                        $(".downContTime").removeClass("none");
                    }else{
                        if(H.talk.repeat_load){
                            H.talk.repeat_load = false;
                            setTimeout(function(){
                                H.talk.current_time();
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
            var prizeActListAll = data.la,
                prizeLength = 0,
                nowTimeStr = H.talk.nowTime,
                prizeActList = [],
                me = this;
            var day = nowTimeStr.split(" ")[0];
            if(prizeActListAll&&prizeActListAll.length>0){
                for ( var i = 0; i < prizeActListAll.length; i++) {
                    if(prizeActListAll[i].pd == day){
                        prizeActList.push(prizeActListAll[i]);
                    }
                }
            }
            H.talk.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeActList.length >0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    H.talk.type = 3;
                    H.talk.change();
                    return;
                }
                //config微信jssdk
                //H.talk.wxConfig();
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        H.talk.index = i;
                        H.talk.nowCountdown(prizeActList[i]);
                        hidenewLoading();
                        return;
                    }
                    // 据下次摇奖开始
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        H.talk.index = i;
                        H.talk.beforeShowCountdown(prizeActList[i]);
                        hidenewLoading();
                        return;
                    }
                }
            }else{
                H.talk.change();
            }
        },
           // 距下次摇奖开启倒计时
        beforeShowCountdown: function(pra) {
            H.talk.type = 1;
            var beginTimeStr = pra.pd+" "+pra.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += H.talk.dec;
            $(".text-tip").html('距摇奖开启还有 ');
            $('.downContTime').attr('etime',beginTimeLong);
            $(".yao-icon").removeClass("wobble");
            H.talk.count_down();
            $('.time-text').removeClass('hidden');
            H.talk.istrue = true;
           hidenewLoading();
        },
        // 距本轮摇奖结束倒计时
        nowCountdown: function(pra){
            H.talk.type = 2;
            var endTimeStr = pra.pd+" "+pra.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += H.talk.dec;
            $('.downContTime').attr('etime',beginTimeLong);
            $(".text-tip").html("距摇奖结束还有");
            H.talk.count_down();
            $(".time-text").removeClass("hidden");
            H.talk.index ++;
            H.talk.istrue = true;
            hidenewLoading();
        },
        count_down : function() {
            $('.downContTime').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%H%' + '时'+'%M%' + '分' + '%S%' + '秒', // 还有...结束
                    stpl : '%H%' + '时'+'%M%' + '分' + '%S%' + '秒', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(H.talk.istrue){
                            H.talk.istrue = false;
                            shownewLoading();
                            if(H.talk.type == 1){
                                //距下次摇奖开始倒计时结束后显示距离本轮摇奖结束倒计时
                                H.talk.nowCountdown(H.talk.pal[H.talk.index]);
                            }else if(H.talk.type == 2){
                                //距本轮摇奖结束倒计时结束后显示距离下次摇奖开始倒计时
                                if(H.talk.index >= H.talk.pal.length){
                                    // 如果已经是最后一轮摇奖倒计时结束 则显示 今日摇奖结束
                                    H.talk.change();
                                    H.talk.type = 3;
                                    return;
                                }
                                H.talk.beforeShowCountdown(H.talk.pal[H.talk.index]);
                            }
                        }
                    },
                    sdCallback :function(){
                    }
                });
            });
        },
         change: function(){
            hidenewLoading();
            H.talk.type = 3;
            $(".text-tip").html("今日摇奖结束");
            $(".time-text").removeClass("hidden");
        },
        question:function(){
            getResult("api/comments/topic/round",{},"callbackCommentsTopicInfo",true);
        },
        fillAfterSubmit: function(){
            var me = this;
            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : "images/head.jpg";
            var comments = "";
            comments += '<li>'
                + '<img class="fr" src="' + h +'">'
                + '<div class="ron fr mr">'
                + '<p class="tar">我</p>'
                + '<span class="triangle-right"></span>'
                + '<div class="article-right fr">'+me.input.val()+'</div>'
                + '</div>'
                + '</li>';
            $('#comment_list').append(comments);

            $('#body').scrollToTop($('#comment_list').height());
        },
        room: function(){
        	getResult('api/comments/room', {
	            'anys' : H.talk.uid,
	            'maxid' : H.talk.maxid,
	            'ps' : H.talk.pageSize
	        }, 'callbackCommentsRoom'); 
        },
        isin: function(uid){
            for(var i = 0;i < H.talk.meArray.length;i++){
                if(H.talk.meArray[i] == uid){
                    return true;
                }
            }
            return false;
        },
        canBottom: function() {
            var nScrollHight = 0; //滚动距离总长(注意不是滚动条的长度)
            var nScrollTop = 0;   //滚动到的当前位置
            var nDivHight = $("#body").height();
            $('#body').scroll(function(){
                nScrollHight = $(this)[0].scrollHeight;
                nScrollTop = $(this)[0].scrollTop;
                if(nScrollTop + nDivHight >= nScrollHight-5){
                    H.talk.isBottom = true;
                    H.talk.$tip.animate({
                            opacity: 0
                        }, 500,
                        'ease-out');
                }else{
                	H.talk.isBottom = false;
                }
            });
        }
    };

    W.callbackCommentsTopicInfo = function(data){
        if(data.code == 0){
            var item = data.items[0];
            H.talk.uid = item.uid;
            H.talk.room();
            setInterval(function(){
                H.talk.room();
            },5000);
        }
    };
    W.commonApiSDPVHander = function(data){
		if(data.code == 0){
			$(".count").html("目前在线人数："+parseInt(2000+data.c)).removeClass("hidden");
		}
	};
    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.desc && data.url) {
            $('.ddtj').text(data.desc || '');
			$("#ddtj").click(function(){
				 shownewLoading();
				location.href = data.url;
			});
			$('#ddtj').removeClass("none");
        } else {
          $('#ddtj').remove();
        }
    };
    W.callbackCommentsSave = function(data) {
        if(data.code == 0){
            H.talk.fillAfterSubmit();
            H.talk.input.blur().val('');
            H.talk.meArray.push(data.uid);
        }else{
            showTips("活动未开始");
        };
    };
    W.callbackCommentsRoom = function(data){
        if(data.code == 0){
            var items = data.items;
            if(items.length > 0){
                H.talk.maxid = data.maxid;
                var t = simpleTpl();
                for(var i = items.length-1;i >= 0;i--){
                    if(H.talk.isin(items[i].uid)){
                        continue;
                    }
                    var h= items[i].hu ? items[i].hu + '/' + yao_avatar_size : "images/head.jpg";
                    var n = items[i].na ? items[i].na:'匿名用户';
                    if(items[i].op == hex_md5(openid)){
                        t._('<li>')
                            ._('<img class="fr" src="'+h+'">')
                            ._('<div class="ron fr mr">')
                                ._('<p class="tar">我</p>')
                                ._('<span class="triangle-right"></span>')
                                ._('<div class="article-right fr">'+items[i].co+'</div>')
                            ._('</div>')
                         ._("</li>");
                    }else{
                        t._('<li>')
                            ._('<img class="fl" src="'+h+'">')
                            ._('<div class="ron">')
                                ._('<p>'+n+'</p>')
                                ._('<span class="triangle"></span>')
                                ._('<div class="article fl">'+items[i].co+'</div>')
                            ._('</div>')
                        ._("</li>");
                    }
                }
                $('#comment_list').append(t.toString());

                if(H.talk.isFirst){
                    $('#body').scrollToTop($('#comment_list').height());
                    H.talk.isFirst = false;
                    return;
                }

                if(!H.talk.isBottom){
                    if(!H.talk.isFirst){
                        H.talk.$tip.animate({
                                opacity: 1
                            }, 500,
                            'ease-in');
                    }else{
                        H.talk.isFirst = false;
                    }
                }else{
                    $('#body').scrollToTop($('#comment_list').height());
                }
            }
        }
    }

})(Zepto);

$(function(){
	H.talk.init();
});