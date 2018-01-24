(function($) {
	H.talk = {
		init: function() {
			this.event();
			this.initResize();
            H.comment.init();
		},
		initResize: function() {
			var me = this, winW = $(window).width(), winH = $(window).height();
            var talkH = winH - (winW*210/640 + $('footer').height());
			$('body, .cover-box').css({'width': winW, 'height': winH});
            $('#article, #comments').css('height', Math.ceil(talkH));
            $('.avatar-comment').attr('src', headimgurl ? headimgurl + '/' + yao_avatar_size : './images/avatar/default-avatar.jpg');
            $('.ctrls .input-box input').css('width', winW - 125);
		},
		event: function() {
			var me = this;
            $('body').delegate('#btn-comment', 'click', function(e) {
                e.preventDefault();
                if ($(this).hasClass('requesting')) {
                    return;
                }
                var comment = $.trim($("#input-comment").val()) || '', comment = comment.replace(/<[^>]+>/g, ''), len = comment.length;
                if (len < 1) {
                    showTips('说说你的看法吧~');
                    $("#input-comment").focus();
                    return;
                } else if (len > 21) {
                    showTips('评论不能超过20字哦~');
                    $("#input-comment").focus();
                    return;
                }
                $(this).addClass('requesting');
                shownewLoading(null, '发送中...');
                setTimeout(function(){
                    $("#btn-comment").removeClass('requesting');
                    showTips('发送成功');
                    var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/avatar/default-avatar.jpg';
                    barrage.appendMsg('<div><div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div><div class="comment me-content">' + comment + '</div></div>');
                    $('.isme').parent('div').addClass('me').parent('div').addClass('dream');
                    $("#input-comment").removeClass('error').val('');
                    hidenewLoading();
                }, 300);
                $.ajax({
                    type: 'GET',
                    async: false,
                    url: domain_url + 'api/comments/save' + dev,
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
                        ty: 2,
                        nickname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : '',
                        headimgurl: headimgurl ? headimgurl : ''
                    },
                    dataType: "jsonp",
                    jsonpCallback: 'callbackCommentsSave',
                    complete: function() {
                    },
                    success : function(data) {
                    }
                });
            }).delegate('.btn-go2vote', 'click', function(e) {
                e.preventDefault();
                toUrl('vote.html');
            }).delegate('.btn-go2lottery', 'click', function(e) {
                e.preventDefault();
                toUrl('lottery.html');
            }).delegate('.btn-tuiguang', 'click', function(e) {
                e.preventDefault();
                shownewLoading(null, '请稍后...');
                setTimeout(function(){
                    location.href = 'http://sujiu.jd.com/';
                }, 100);
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
            getResult('api/comments/room?temp=' + new Date().getTime(), {
                ps: me.pageSize,
                maxid: me.maxid
            }, 'callbackCommentsRoom');
        }
    };

    W.callbackCommentsRoom = function(data) {
        if (data.code == 0) {
            H.comment.maxid = data.maxid;
            var items = data.items || [];
            for (var i = 0, len = items.length; i < len; i++) {
                var hmode = "<div class='c_head_img'><img src='./images/avatar/default-avatar.jpg' class='c_head_img_img'></div>";
                if (items[i].hu) {
                    if (items[i].hu.indexOf('.jpg') || items[i].hu.indexOf('.jepg') || items[i].hu.indexOf('.png')) {
                        hmode = "<div class='c_head_img'><img src='" + items[i].hu + "' class='c_head_img_img'></div>";
                    } else {
                        hmode = "<div class='c_head_img'><img src='" + items[i].hu + "/64' class='c_head_img_img'></div>";
                    }
                }
                barrage.pushMsg(hmode + items[i].co);
            };
        }
    };
})(Zepto);

$(function() {
	H.talk.init();
});