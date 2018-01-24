(function($) {
	H.talk = {
		$input : $("#input_text"),
        uid: null,
        maxid: 0,
        pageSize: 40,
        meArray: new Array(),
        isBottom:false,
        $tip:$("#mesg-tip"),
        isFirst:true,
        nowTime :null,
        dec: 0,
        yaoBg :[],
        pra:null,
        repeat_load : true,
        istrue : false,
        flag : true,
        st:"",
        et:"",
        name :"",
        headImg:"",
        state:"",
		init: function() {
            var me = this;
            me.question();
            me.event();
            me.canBottom();
            me.prereserve();
            me.ddtj();
		},
		question:function(){
            getResult("api/comments/topic/round",{},"callbackCommentsTopicInfo",true);
        },
        event: function(){
            var me = this;
            $("#btn-rule").click(function(e) {
				e.preventDefault();
				if($(this).hasClass("requesting")){
					return;
				}
				$(this).addClass("requesting");
				H.dialog.rule.open();
			});
			$("#btn-join").click(function(e) {
				e.preventDefault();
				if($(this).hasClass("requesting")){
					return;
				}
				$(this).addClass("requesting");
				shownewLoading();
				H.talk.talking();
			});
			$("#btn-reserve").click(function(e) {
				e.preventDefault();
				var reserveId = $(this).attr('data-reserveid');
				var date = $(this).attr('data-date');
				if (!reserveId || !date) {
					return;
				}
                window['shaketv'] && shaketv.reserve_v2({
                        tvid:yao_tv_id,
                        reserveid:reserveId,
                        date:date},
                    function(d){
                        if(d.errorCode == 0){
                            $("#btn-reserve").addClass('none');
                        }
                    });
			});						
            $("#input_submit").click(function(){
            	if($(this).hasClass("requesting")){
					return;
				}
				$(this).addClass("requesting");
            	var comment = $.trim(H.talk.$input.val()) || '', comment = comment.replace(/<[^>]+>/g, ''), len = comment.length;
                if(len == 0){
                    showTips("什么都没有说呢");
                    $("#input_submit").removeClass("requesting");
                    return false;
                } 
                if (H.talk.uid != '') {
                    getResult('api/comments/save',{
                        'co' : encodeURIComponent(comment),
                        'op' : openid,
                        'nickname':  nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "匿名用户",
                        'headimgurl': H.talk.headImg,
                        'tid': H.talk.uid,
                        'ty': 1
                    }, 'callbackCommentsSave', true, null);
                };
            });
            me.$tip.click(function(){
                $('#body').scrollToTop($('#comment_list').height());
            });
            $("#input_text").focus(function(){
            	if(!is_android()){
					$('body').scrollToTop($("body").height());
				}
            })
        },
        init_size : function(){
        	var bodyH =$(window).height()-$(".preme").height();
        	$(".talk").width($(window).width());
        	$(".talk").height($(window).height())
            $("#body").height(bodyH - 50)
            if(professOpenId == openid){
			    $(".input_head").find("img").attr("src","images/professor.jpg");
			}else{
				$(".input_head").find("img").attr("src",headimgurl||"images/head.jpg");  
			}
			H.talk.name = '我'; 
			H.talk.headImg = headimgurl ? headimgurl + '/' + yao_avatar_size : "images/head.jpg";
			if($.inArray(openid,professOpenId)>=0){
				 H.talk.state = "self self-profess";
			}else{
				 H.talk.state = "self";
			}
            for(var i = 0,len = professOpenId.length;i<len;i++ ){
               professOpenId[i] = hex_md5(professOpenId[i]);
			   hex_professOpenId.push(professOpenId[i]);
			}
        },
        prereserve: function() {
			var me = this;
			$.ajax({
				type : 'GET',
				async : true,
				url : domain_url + 'api/program/reserve/get',
				data: {},
				dataType : "jsonp",
				jsonpCallback : 'callbackProgramReserveHandler',
				success : function(data) {
					if (!data.reserveId) {
						return;
					}
                    window['shaketv'] && shaketv.preReserve_v2({
                            tvid:yao_tv_id,
                            reserveid:data.reserveId,
                            date:data.date},
                        function(resp){
                            if (resp.errorCode == 0) {
                                $("#btn-reserve").removeClass('none').attr('data-reserveid', data.reserveId).attr('data-date', data.date);
                            }
                        });
				}
			});
		},
          //查询当前参与人数
        account_num: function(){
		    getResult('api/comments/count', {anys:H.talk.uid}, 'callbackCommentsCount');
		},
        ddtj: function() {
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        },
        current_time: function(){
            shownewLoading();
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
                    	H.talk.nowTime = timeTransform(parseInt(data.t));
                        var now = new Date().getTime();
                        H.talk.dec = (now - data.t);
               			H.talk.currentPrizeAct();
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        currentPrizeAct:function(){
        	var nowTimeStr = H.talk.nowTime;
        	var beginTimeStr =  H.talk.st;
            var endTimeStr = H.talk.et;
             //如果最后一轮结束
            if(comptime(endTimeStr,nowTimeStr) >= 0){
               H.talk.type = 3;
	           H.talk.end();
	           return;
            }
            if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
	            H.talk.room();
	            setInterval(function(){
	                H.talk.room();
	            },5000);
               H.talk.nowCountdown(endTimeStr);
               hidenewLoading();
               return;
            }
            // 据下次摇奖开始
            if(comptime(nowTimeStr,beginTimeStr) > 0){
               H.talk.beforeShowCountdown(beginTimeStr);
               hidenewLoading();
               return;
            }  
        },
           // 距下次摇奖开启倒计时
        beforeShowCountdown: function(beginTimeStr) {
            H.talk.type = 1;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += H.talk.dec;
            $(".text-tip").html('距摇奖开启还有 ');
            $('.downContTime').attr('etime',beginTimeLong);
			H.talk.before();
            H.talk.count_down();
 //           $('.time-text').removeClass('hidden');
            H.talk.istrue = true;
           hidenewLoading();
        },
        // 距本轮摇奖结束倒计时
        nowCountdown: function(endTimeStr){
            H.talk.type = 2;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += H.talk.dec;
            $('.downContTime').attr('etime',beginTimeLong);
            $(".text-tip").html("距摇奖结束还有");
            H.talk.before();
            H.talk.count_down();
//           $(".time-text").removeClass("hidden");
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
                                H.talk.nowCountdown(H.talk.st);
                            }else if(H.talk.type == 2){
                                //距本轮摇奖结束倒计时结束后显示距离下次摇奖开始倒计时
                                    H.talk.type = 3;
                                    H.talk.end();
                                    return;
                            }
                        }
                    },
                    sdCallback :function(){
                    }
                });
            });
        },
        end: function(){
            toUrl("end.html");
        },
        before: function(){
        	imgReady("images/logo.png",H.talk.ready);  
        },
        talking: function(){
            $('.index').addClass('hide');
            $(".talk").removeClass("hidden");
			setTimeout(function(){
				$('.index').removeClass('hide');
				$(".index").addClass("none");
				hidenewLoading();
            }, 1000);
        },
        ready : function(){
        	$(".index").removeClass("none");
            $(".talk").addClass("hidden");
            $(".logo").addClass("bounceInUp");
			$(".btn-join").addClass("showme")
        },
        fillAfterSubmit: function(){
            var me = this;
            var comments = "";
            comments += '<li class="'+H.talk.state+'">'
                + '<p class="tar">'+H.talk.name+'</p>'
                + '<div class="ron">'
                + '<div class="head"><img src="' + H.talk.headImg +'"></div>'
                + '<div class="article">'+$("#input_text").val().replace(/<[^>]+>/g, '')+'</div>'
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
                //nScrollTop + nDivHight 当前位置在最底部
                if(nScrollTop + nDivHight >= nScrollHight-5){
                    H.talk.isBottom = true;
                    H.talk.$tip.animate({
                            opacity: 0
                        }, 500,
                        'ease-out');
                }else{
                	//不在最底部
                	H.talk.isBottom = false;
                }
            });
        }
    };

    W.callbackCommentsTopicInfo = function(data){
        if(data.code == 0){
            var item = data.items[0];
            H.talk.uid = item.uid;
            H.talk.st = item.st;
            H.talk.et = item.et;
            professOpenId = item.c.split(",");
            setInterval(function(){
                H.talk.account_num();
            },Math.ceil(3000*Math.random() + 500));
            $(".topic").html(item.t);
            H.talk.init_size();
            H.talk.current_time();

        }else{
        	H.talk.end();
        }
    };
    W.callbackCommentsCount = function(data){
		if(data.code == 0){
			$(".count").html("当前参与讨论人数："+parseInt(data.tc)+"人").removeClass("hidden");
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
            H.talk.$input.blur().val('');
            H.talk.meArray.push(data.uid);
            $("#input_submit").removeClass("requesting");
        }else{
            showTips("评论提交失败");
            $("#input_submit").removeClass("requesting");
        };
    };
    W.callbackCommentsRoom = function(data){
        if(data.code == 0){
            var items = data.items;
            var show_mesg = false;
            if(items.length > 0){
                H.talk.maxid = data.maxid;
                var t = simpleTpl();
                for(var i = items.length-1;i >= 0;i--){
                    if(H.talk.isin(items[i].uid)){
                        continue;
                    }
                    var h= '';
                    var n = '';
                    var state = "";
                    //自己
                    if(items[i].op == hex_md5(openid)){
                      state = H.talk.state;
                      n = H.talk.name;
                      h = H.talk.headImg;
                    }else{
                    	if($.inArray(items[i].op,hex_professOpenId)>=0){
                    		state = "profess";
                    	}else{
                    		 state = "other";
                    	}
                       show_mesg = true;
                       n = items[i].na ? items[i].na:'匿名用户';
                       h = items[i].hu ? items[i].hu  : "images/head.jpg";
                    }
                    t._('<li class="'+ state +'">')
                    	._('<p class="tar">'+n+'</p>')
                        ._('<div class="ron">')
                         	._('<div class="head"><img src="'+h+'"></div>')
                            ._('<div class="article">'+items[i].co+'</div>')
                         ._('</div>')
                     ._("</li>");
                }
                $('#comment_list').append(t.toString());
				//第一次进入聊天室
                if(H.talk.isFirst){
                    $('#body').scrollTop($('#comment_list').height());
                    H.talk.isFirst = false;
                    return;
                }
				//如果不在最底部
                if(!H.talk.isBottom){
                	//不是第一次进入聊天室
                    if(!H.talk.isFirst){
                    	if(show_mesg){
                    		H.talk.$tip.animate({
                                opacity: 1
                            }, 500,
                            'ease-in');
                    	}
                    }else{
                        H.talk.isFirst = false;
                    }
                }else{
                    $('#body').scrollToTop($('#comment_list').height());
                }
            }
        }
    }
	W.commonApiPromotionHandler = function(data){
    	if(data.code == 0){
			var jumpUrl = data.url;
			$(".ddtj-text").html(data.desc);
			$(".ddtj-box").attr("data-href",jumpUrl);
			$(".ddtj-before").addClass("whole");
			$(".ddtj").removeClass("none");
			$(".ddtj-box").click(function(e){
				e.preventDefault();
				shownewLoading();
				window.location.href = $(this).attr("data-href");
			})
		}else{
			$(".ddtj").addClass("none");
		}
    }
})(Zepto);

$(function(){
	H.talk.init();
});