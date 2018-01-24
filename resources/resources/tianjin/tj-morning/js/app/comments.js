/**
 * 天津新闻早动员-评论页
 */
(function($) {
	H.comments = {
		$main : $('#main'),
		$top_back : $(".top-back"),
        $new_msg: $(".new-msg"),
		actUid : null,
		page : 0,
		beforePage : 0,
		pageSize:5,
		item_index : 0,
		commActUid:null,
		loadmore : true,
		isCount : true,
		expires: {expires: 7},
        attrUuid: null,
        nowTime: null,
        maxid:0,
        isTop:true,
        repeatCheck:true,//倒计时回调重复判断
        index:0, // 当前抽奖活动在 list 中的下标
        pal:[],// 抽奖活动list
        dec:0,//服务器时间与本地时间的差值
        type:3,//倒计时类型，1 距摇奖开始倒数计时 2，距摇奖结束倒计时  3， 摇奖结束
        meArray: new Array(),
		init : function(){
			var me = this;
			me.currentCommentsAct();
			me.event_handler();
            me.current_time();
            me.refreshDec();
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
                            H.comments.dec = nowTime - data.t;
                        }
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
            },dely);
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
			this.$new_msg.click(function(e){
				e.preventDefault();
				$(window).scrollTop(0);
				$(this).addClass('none');
			});

			$(window).scroll(function(){
				var scroH = $(this).scrollTop();
				if(scroH > 0){
                    me.isTop = false;
					me.$top_back.removeClass('none');
                    me.$new_msg.addClass('none');
				}else if(scroH <= 0){
                    me.isTop = true;
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
						ty:2,
						pa:null,
						nickname: encodeURIComponent(nickname || ''),
						headimgurl: headimgurl || ''
						}, 'callbackCommentsSave',true);
				}
			});

            $("#yao").click(function(){
                if(H.comments.type == 2){
                    toUrl("lottery.html");
                }
            });
			
		},
		getList:function(page){
			if(page - 1  == this.beforePage){
				$('#mallSpinner').removeClass('none');
				getResult('api/comments/list', {page:page,ps:this.pageSize,anys:H.comments.commActUid,op:openid,zd:0,kind:0}, 'callbackCommentsList');
			}
		},
		bindClick: function(){
			$("#sup").find('.support').click(function(){
				var attrUuid = $(this).attr("data-uuid");
                H.comments.attrUuid = attrUuid;
                getResult('fashion/support', {openid:openid,activityUuid:H.comments.commActUid,attrUuid:attrUuid}, 'supportHandler',true);
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
		currentCommentsAct : function() {
			getResult('fashion/index', {openid:openid}, 'fashionIndexHandler',true);
		},
		currentComments : function(commActUid) {
            var me = this;
			getResult('api/comments/count', {anys:commActUid}, 'callbackCommentsCount',true);
			getResult('api/comments/list', {page:1,ps:me.pageSize,anys:commActUid,op:openid,dt:1,zd:1,kind:1}, 'callbackCommentsList',true);
			getResult('api/comments/list', {page:1,ps:me.pageSize,anys:H.comments.commActUid,op:openid,zd:0,kind:0}, 'callbackCommentsList');
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
        },
        //查抽奖活动接口
        current_time: function(){
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/round',
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryRoundHandler',
                timeout: 15000,
                complete: function() {
                },
                success : function(data) {
                    if(data.result == true){
                        H.comments.nowTime = timeTransform(data.sctm);
                        var nowTime = new Date().getTime();
                        var serverTime = timestamp(H.comments.nowTime);
                        // 计算服务器时间和本地时间的差值，并存储
                        H.comments.dec = (nowTime - serverTime);
                        H.comments.currentPrizeAct(data);
                    }else{
                        H.comments.change();
                    }
                },
                error : function(xmlHttpRequest, error) {
                    recordUserOperate(openid, error, "comments-round-error");
                    H.comments.change();
                }
            });
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var prizeActListAll = data.la,
                prizeLength = 0,
                nowTimeStr = H.comments.nowTime,
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
            H.comments.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeActList.length >0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    H.comments.type = 3;
                    H.comments.change();
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        H.comments.index = i;
                        H.comments.nowCountdown(prizeActList[i]);
                        hidenewLoading();
                        return;
                    }
                    // 据下次摇奖开始
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        H.comments.index = i;
                        H.comments.beforeShowCountdown(prizeActList[i]);
                        hidenewLoading();
                        return;
                    }

                }
            }else{
                H.comments.change();
                return;
            }
        },
        // 距下次摇奖开启倒计时
        beforeShowCountdown: function(pra) {
            H.comments.type = 1;
            var beginTimeStr = pra.pd+" "+pra.st;
            var beginTimeLong = timestamp(beginTimeStr);
            beginTimeLong += H.comments.dec;
            $(".countdown-tip").html('距摇奖开启还有 ');
            $('.detail-countdown').attr('etime',beginTimeLong);
            H.comments.count_down();
            $('.countdown').removeClass('none');
            $("#yao").attr("data-collect-flag","comments-lottery-btn-no");
        },
        // 距本轮摇奖结束倒计时
        nowCountdown: function(pra){
            H.comments.type = 2;
            var endTimeStr = pra.pd+" "+pra.et;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += H.comments.dec;
            $('.detail-countdown').attr('etime',beginTimeLong);
            $(".countdown-tip").html("距摇奖结束还有");
            H.comments.count_down();
            $(".countdown").removeClass("none");
            H.comments.index ++;
            $("#yao").attr("data-collect-flag","comments-lottery-btn");
        },
        count_down : function() {
            $('.detail-countdown').each(function() {
                var $me = $(this);
                $(this).countDown({
                    etpl : '%H%' + ':' + '%M%' + ':' + '%S%', // 还有...结束
                    stpl : '%H%' + ':' + '%M%' + ':' + '%S%', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(H.comments.repeatCheck){
                            H.comments.repeatCheck = false;
                            if(H.comments.type == 1){
                                //距下次摇奖开始倒计时结束后显示距离本轮摇奖结束倒计时
                                H.comments.nowCountdown(H.comments.pal[H.comments.index]);
                            }else if(H.comments.type == 2){
                                //距本轮摇奖结束倒计时结束后显示距离下次摇奖开始倒计时
                                if(H.comments.index >= H.comments.pal.length){
                                    // 如果已经是最后一轮摇奖倒计时结束 则显示 今日摇奖结束
                                    H.comments.change();
                                    H.comments.type = 3;
                                    return;
                                }
                                H.comments.beforeShowCountdown(H.comments.pal[H.comments.index]);
                            }
                        }
                    },
                    sdCallback :function(){
                    }
                });
            });
        },
        change: function(){
            $(".countdown").html("今日摇奖结束");
            $(".countdown").removeClass("none");
            $("#yao").attr("data-collect-flag","comments-lottery-btn-no");
        }
	};

	W.fashionIndexHandler = function(data){
		if(data.code == 0){
            var com = data.tl[0];
			H.comments.commActUid = com.actUid;
			$("#comm-title").text(com.actTle);
			H.comments.currentComments(com.actUid);
			if(com.attrs != null && com.attrs.length != 0){
                var result = com.attrs;
				var sumCount = com.count;
				var sumPercent = 0;
				var t = simpleTpl(), $sx_ul = null;
				for (var i = 0, len = result.length; i < len; i++) {
                    $sx_ul = $('#sup');
                    t._('<a class="support" data-uuid = "'+ result[i].au +'"><input type="radio" name="sel-r" class="sel-r"><span class="letter">'+letter[i]+'.&nbsp;&nbsp;</span><label>'+result[i].av+'</label></a>');
				}
				$sx_ul.html(t.toString());
				$sx_ul.removeClass("none");
                H.comments.bindClick();
				return;
			}else if(com.result != null && com.result.length != 0){
                var result = com.result;
                var sumCount = com.count;
                var sumPercent = 0;
                var t = simpleTpl(),
                    $sx_ul = $('#progress');
                for (var i = 0, len = result.length; i < len; i++) {
                    var percent = (result[i].ac/sumCount * 100).toFixed(0);
                    if(i == result.length-1){
                        percent = (100.00 - sumPercent).toFixed(0);
                    }
                    var select = result[i].au == com.flag ? 'gray' : '';
                    t._('<p>')
                        ._('<label><span class="letter">'+letter[i]+'.&nbsp;&nbsp;</span>'+ result[i].av +'</label>')
                        ._('<span class="lv" >'+percent+'%</span>')
                        ._('<i class="support-pro"><span class="'+select+'" style="width:'+(percent-2)+'%;"></span></i>')
                        ._('</p>');
                    sumPercent += percent * 1;
                }

                $sx_ul.html(t.toString());
                $sx_ul.removeClass("none");
                $(".tilt").addClass("none");
                $(".yao-tilt").removeClass("none");
                return;
            }
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
			H.comments.tpl(data);
		}else {
		}
	}
	
	W.supportHandler = function(data){
        if(data.code == 0){
            $('.giftBoxDiv').removeClass('step-1');
            var sumCount = data.count;
            var sumPercent = 0;
            var result = data.result;
            var t = simpleTpl(), $sx_ul = $('#progress');
            for (var i = 0, len = result.length; i < len; i++) {
                var percent = (result[i].ac/sumCount * 100).toFixed(0);
                if(i == result.length-1){
                    percent = (100.00 - sumPercent).toFixed(0);
                }
                var select = result[i].au == H.comments.attrUuid ? 'gray' : '';
                t._('<p>')
                    ._('<label><span class="letter">'+letter[i]+'.&nbsp;&nbsp;</span>'+ result[i].av +'</label>')
                    ._('<span class="lv">'+percent+'%</span>')
                    ._('<i class="support-pro"><span class="'+select+'" style="width:'+(percent-2)+'%;"></span></i>')
                    ._('</p>');
                sumPercent += percent * 1;
            }

            $sx_ul.html(t.toString());
            $('#sup').addClass("none");
            $sx_ul.removeClass("none");
            $(".tilt").addClass("none");
            $(".yao-tilt").removeClass("none");
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
				._('<label class="zan-'+data.uid+'" class="zan" data-collect="true" data-collect-flag="comments-zan" data-collect-desc="点赞" >'+ 0 +'</label>')
				._('<p>'+ (nickname || '匿名用户') +'</p>')
				._('<p class="all-con" id="all-con'+ data.uid +'">')
					._('<span>'+ $("#comments-info").val() +'</span>')
				._('</p>')
				._('<a class="show-all none" id="show-all'+ data.uid +'" data-collect="true" data-collect-flag="comments-show" data-collect-desc="评论收缩显示">^显示全部</a>')
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
            $(".tilt").addClass("none");
            $(".yao-tilt").removeClass("none");
		}else{
			showTips("您输入的信息包含敏感内容，请重新输入。",4);
			$("#comments-info").val("");
			$("#send").removeAttr("disabled");
			$("#comments-info").removeAttr("disabled");
		}
	}
	
	W.callbackCommentsPraise = function(data){
		if(data.code == 0){
			$(".curZan").text($(".curZan").text()*1 + 1);
			$(".curZan").removeClass("curZan");
		}
	};

    W.callbackCommentsRoom = function(data){
        if(data.code == 0){
            if(data.maxid > H.comments.maxid){
                H.comments.maxid = data.maxid;
                H.comments.roomtpl(data);
            }
        }
    }
})(Zepto);
$(function(){
	H.comments.init();
});