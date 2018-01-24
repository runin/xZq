(function($) {
	H.talk = {
        uuid: null,
		init: function() {
			this.event();
			this.initResize();
            getResult('api/comments/topic/round', {}, 'callbackCommentsTopicInfo');
		},
		initResize: function() {
            $('body').css({'width': $(window).width(),'height': $(window).height()});
            $('#article, #comments').css('height', Math.ceil($(window).height() / 2));
            $('.avatar-comment').attr('src', headimgurl ? headimgurl + '/' + yao_avatar_size : './images/avatar/default-avatar.jpg');
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
                        tid: H.talk.uuid,
                        co: encodeURIComponent(comment),
                        op: openid,
                        ty: 1,
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
            }).delegate('#btn-go2vote', 'click', function(e) {
                e.preventDefault();
                toUrl('vote.html');
            }).delegate('#btn-go2lottery', 'click', function(e) {
                e.preventDefault();
                toUrl('lottery.html');
            }).delegate('#btn-tuiguang', 'click', function(e) {
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
        pageSize: 10,
        init: function() {
            var me = this;
            W['barrage'] = $('#comments').barrage();
            W['barrage'].start(1);
            setInterval(function() {
                me.flash();
            }, me.timer);
        },
        flash: function() {
            var me = this;
            getResult('api/comments/room', {
                anys: H.talk.uuid,
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

    W.callbackCommentsTopicInfo = function(data) {
        if (data.code == 0) {
            if (data.items) {
                H.talk.uuid = data.items[0].uid;
                if (data.items[0].av) {
                    $('body').css('background-image', 'url(' + data.items[0].av + ')');
                }
                if (data.items[0].im) {
                    $('.TM').attr('src', data.items[0].im);
                    $('footer').animate({'opacity':'1'}, 600);
                    H.comment.init();
                } else {
                    $('.TM').attr('src', './images/TM.png');
                }
            } else {
                $('.TM').attr('src', './images/TM.png');
            }
        } else {
            $('.TM').attr('src', './images/TM.png');
        }
    };
})(Zepto);

$(function() {
	H.talk.init();
});