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
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
            H.utils.resize();
			H.comment.init();
            this.event();
		},
        event: function(){
            var me = H.answer;
            $(".btn-back").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("switch.html");
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
                } else if (len > 25) {
                    showTips('观点字数超出了25字');
                    me.$inputCmt.removeClass('error').addClass('error');
                    return;
                }
                $(this).addClass(me.REQUEST_CLS);
                shownewLoading(null,'发射中...');
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/comments/save?'+dev,
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


            this.$btnFunny.click(function(e) {
                e.preventDefault();

                if ($(this).hasClass(me.REQUEST_CLS)) {
                    return;
                }
                var time = new Date().getTime();
                if(H.answer.sendFunnyTime != null && time - H.answer.sendFunnyTime < sendTime){
                    showTips('点的太快啦~ 休息下吧!');
                    return;
                }else{
                    H.answer.sendFunnyTime = time;
                    $('.funny-box img').css('-webkit-filter', 'grayscale(100%)');
                    setTimeout(function(){
                        $('.funny-box img').css('-webkit-filter', 'grayscale(0%)');
                    }, sendTime);
                }
                $(this).addClass(me.REQUEST_CLS);
                var funny = $(this).attr('data-item') || '/:funny1';
                shownewLoading(null,'发射中...');
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/comments/save'+dev,
                    data: {
                        co: encodeURIComponent(funny),
                        op: openid,
                        tid: me.tid,
                        ty: 1,
                        nickname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                        headimgurl: headimgurl ? $.fn.cookie(mpappid + '_headimgurl') : ""
                    },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackCommentsSave',
                    complete: function() {
                        hidenewLoading();
                    },
                    success : function(data) {
                        me.$btnFunny.removeClass(me.REQUEST_CLS);
                        if (data.code == 0) {
                            showTips('发射成功', null, 800);
                            var nfunny = funny.replace('/:','');
                            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/danmu-head.jpg';
                            barrage.appendMsg('<div class="c_head_img menow"><img class="c_head_img_img" src="' + h + '" /></div>'+'<img class="funnyimg" src="./images/funny/' + nfunny + '.png" border="0" />');
                            $('.menow').parent('div').addClass('me').css({'height': '41px'});
                            me.$inputCmt.removeClass('error').val('');
                            return;
                        }
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
                url : domain_url + "api/comments/room?temp=" + new Date().getTime()+dev,
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
	// 弹幕_E

	H.utils = {
		$header: $('header'),
		$wrapper: $('article'),
		$comments: $('#comments'),
		resize: function() {
			var height = $(window).height(),width = $(window).width();
            var outboxh = width / 3;
			this.$wrapper.css({'height': Math.round(height - 70)});
			this.$comments.css({'height': Math.round(height - 130 - outboxh),"bottom": Math.round(60 + outboxh)});
			$('body').css('height', height);
		}
	};

	W.callbackArticledetailListHandler = function(data) {
		if (data.code == 0) {
            $(".out-link").append('<img onclick="H.answer.outlink(this)" data-link="' + data.arts[0].gu + '" src="' + (data.arts[0].img).toString() + '" data-collect="true" data-collect-flag="answer-AD" data-collect-desc="弹幕页广告" /><img onclick="H.answer.outlink(this)" data-link="' + data.arts[1].gu + '" src="' + (data.arts[1].img).toString() + '" data-collect="true" data-collect-flag="answer-AD2" data-collect-desc="弹幕页广告2" />');
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
