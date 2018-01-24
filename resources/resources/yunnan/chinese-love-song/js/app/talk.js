(function($) {
	H.answer = {
        $inputCmt: $('#input-comment'),
        $btnCmt: $('#btn-comment'),
        $btnRule: $('#btn-rule'),
        $total: $('#count'),
        STARTING_CLS: 'starting',
        STARTED_CLS: 'started',
        ENDED_CLS: 'ended',
        REQUEST_CLS: 'requesting',
        REPEAT_CLS: 'repeat',
        TIMETRUE_CLS: true,
        QUEdata:"",
        chktime:0,
        isshow:false,
        LIMITTIMEFALSE_CLS: false,
        tque:"",
        aid:"",
        isJump:false,
        $btnFunny: $('.funny-box img'),
        currTime: new Date().getTime(),
        headMix: Math.ceil(8*Math.random()),
		tid: '',
		wxCheck:false, //判断微信jsapi检查以及wxconfig，如果检查失败不能调抽奖接口，默认为false,congfig成功之后置为true

		init: function() {
            getResult('api/article/list', {}, 'callbackArticledetailListHandler');
           /* getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);*/
            this.event();
		},
        event: function(){
            var me = H.answer;
            $(".totalk").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("switch.html");
            });
            $(".inp").tap(function (e) {
                e.stopPropagation();
            });
            $("#submit").tap(function(e) {
                e.stopPropagation();
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
                } else if (len > 30) {
                    showTips('字数不能超过30哦');
                    me.$inputCmt.removeClass('error').addClass('error');
                    return;
                }
                $(this).addClass(me.REQUEST_CLS);
                shownewLoading(null,'发送中...');

                var meComment = H.comment;
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/comments/save'+dev,
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
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
                        $("#submit").removeClass(me.REQUEST_CLS);
                        if(data.code == 0) {
                            showTips('发送成功');
                            var cls = getRandomArbitrary(0,5);
                            var na = nickname ? nickname : "匿名";
                            var t = new simpleTpl();
                            t._('<li><div class="'+meComment.clsList[cls]+'"><span class="ni">' + filterXSS(na) + '：</span><span class="con">' + filterXSS(comment) + '</span></div></li>');
                            $("#comments_content").append(t.toString());
                            var n = $("#comments_content").find("li").length;
                            if(n >= 6){
                                $("#comments_content").find("li").first().remove();
                            }
                            me.$inputCmt.removeClass('error').val('');
                            meComment.selfCommentsList.push(data.uid);
                            return;
                        }
                        showTips("发送失败");
                    }
                });
            });
        },
        outlink: function (self) {
            shownewLoading();
            setTimeout(function () {
                window.location.href = $(self).attr("data-link");
            },500);
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        }
    };

	// 弹幕_S
	H.comment = {
		timer: 5000,
		maxid: 0,
		pageSize: 50,
		$comments: $('#comments'),
        commentsList: new Array(),
        ZDcommentsList: new Array(),
        selfCommentsList: new Array(),
        clsList: ["pink","red","blue","green","brown"],
		init: function() {
			var me = this;
            me.getComments();
            setInterval(function(){
                me.getComments();
            },10000);
            setTimeout(function () {
                me.showComments();
            },1000);
            setTimeout(function () {
                me.getZDComments();
            },8000);
		},
        getComments: function () {
            var me = this;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/comments/room' + dev,
                data: {
                    ps: 50,
                    maxid: me.maxid
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackCommentsRoom',
                timeout: 15000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
                        var items = data.items;
                        if(items && items.length > 0){
                            me.maxid = data.maxid;
                            for(var i = items.length-1; i >= 0; i--){
                                if($.inArray(items[i].uid, me.selfCommentsList) < 0){
                                    me.commentsList.push(items[i]);
                                }
                            }
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        getZDComments: function () {
            var me = this;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/comments/list' + dev,
                data: {
                    page: 1,
                    ps: 50,
                    zd: 1
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackCommentsList',
                timeout: 15000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
                        var items = data.items;
                        if(items && items.length > 0){
                            for(var i = 0; i < items.length; i++){
                                me.ZDcommentsList.push(items[i]);
                            }
                            setInterval(function(){
                                if(me.commentsList.length > 0){
                                    var i = getRandomArbitrary(0,items.length);
                                    me.commentsList.push(me.ZDcommentsList[i]);
                                }
                            },8000);
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                }
            });
        },
        showComments: function () {
            var me = this;
            setInterval(function () {
                if(me.commentsList.length > 0){
                    var t = new simpleTpl();
                    var cls = getRandomArbitrary(0,5);
                    var cmt = me.commentsList.shift();
                    t._('<li><div class="'+me.clsList[cls]+'"><span class="ni">' + filterXSS(cmt.na) + '：</span><span class="con">' + filterXSS(cmt.co) + '</span></div></li>');
                    $("#comments_content").append(t.toString());
                    var n = $("#comments_content").find("li").length;
                    if(n >= 6){
                        $("#comments_content").find("li").first().remove();
                    }
                }
            },500);
        }
	};
	// 弹幕_E

	H.utils = {
		$header: $('header'),
		$wrapper: $('article'),
		$comments: $('#comments'),
		resize: function() {
			var me = this, height = $(window).height(),width = $(window).width();
            var headerH = me.$header.height(),
                outLinkH = $(".out-link").height();
			this.$wrapper.css({'height': height - headerH - outLinkH - 50});
			$('body').css('height', height);
            H.comment.init();
		}
	};

	W.callbackArticledetailListHandler = function(data) {
		if (data.code == 0) {
            $(".out-link").append('<img onclick="H.answer.outlink(this)" data-link="' + data.arts[0].gu + '" src="' + (data.arts[0].img).toString() + '" data-collect="true" data-collect-flag="answer-AD" data-collect-desc="弹幕页广告" /><img onclick="H.answer.outlink(this)" data-link="' + data.arts[1].gu + '" src="' + (data.arts[1].img).toString() + '" data-collect="true" data-collect-flag="answer-AD2" data-collect-desc="弹幕页广告2" />');
            setTimeout(function(){
                H.utils.resize();
            }, 1000);

		}
	};

    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.desc && data.url) {
            //var link = data.url.split(';');
            //var de = data.desc.split(';');
            var link = data.url;
            var de = data.desc;
            //$('.ddtj').text(de[1] || '');
            $('.ddtj').text(de || '');
            $("#ddtj").click(function(){
                showLoading();
                //location.href = link[1];
                location.href = link;
            });
            $('#ddtj').removeClass("hidden");
        } else {
            $('#ddtj').remove();
        }
    };

})(Zepto);

$(function() {
	H.answer.init();
});
