(function($) {
    H.comments = {
        tid: '',
        $inputCmt: $('#input-comment'),
        $btnCmt: $('#btn-comment'),
        REQUEST_CLS: 'requesting',
        init: function() {
            H.utils.resize();
            this.event();
            this.updatepv();
            H.comment.init();
        },

        event: function() {
            var me = this;

            this.$btnCmt.click(function(e) {
                e.preventDefault();

                if ($(this).hasClass(me.REQUEST_CLS)) {
                    return;
                }
                var comment = $.trim(me.$inputCmt.val()) || '',
                    comment = comment.replace(/<[^>]+>/g, ''),
                    len = comment.length;

                if (len < 1) {
                    alert('请先说点什么吧');
                    me.$inputCmt.removeClass('error').addClass('error').focus();
                    return;
                } else if (len > 20) {
                    alert('观点字数超出了20字');
                    me.$inputCmt.removeClass('error').addClass('error').focus();
                    return;
                }

                $(this).addClass(me.REQUEST_CLS);

                showLoading();
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/comments/save',
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
                        hideLoading();
                    },
                    success : function(data) {
                        me.$btnCmt.removeClass(me.REQUEST_CLS);
                        if (data.code == 0) {
                            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/avatar.jpg';
                            barrage.appendMsg('<img src="' + h + '" />'+comment);
                            me.$inputCmt.removeClass('error').val('');
                            return;
                        }
                        alert(data.message);
                    }
                });

            });
        },
        updatepv: function() {
            getResult('log/serpv', {}, 'callbackCountServicePvHander', false, null, true);
            setInterval(function() {
                getResult('log/serpv', {}, 'callbackCountServicePvHander', false, null, true);
            }, 5000);
        }
    };

    // 弹幕_S
    H.comment = {
        timer: 5000,
        maxid: 0,
        pageSize: 10,
        $comments: $('#comments'),
        $btnRank: $('.ranking'),
        init: function() {
            var me = this;
            me.event();
            W['barrage'] = this.$comments.barrage();
            setTimeout(function(){
                W['barrage'].start(1);
                setInterval(function() {
                    me.flash();
                }, me.timer);
            }, 1000);
        },
        event: function(){
            this.$btnRank.click(function(e) {
                e.preventDefault();

                H.dialog.rank.open();
            });
        },
        flash: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + "api/comments/room?temp=" + new Date().getTime(),
                data: {
                    ps: me.pageSize,
                    maxid: me.maxid
                },
                dataType : "jsonp",
                dataType : "jsonp",
                jsonpCallback : 'callbackCommentsRoom',
                success : function(data) {
                    if (data.code != 0) {
                        return;
                    }
                    me.maxid = data.maxid;
                    var items = data.items || [];
                    for (var i = 0, len = items.length; i < len; i ++) {
                        barrage.pushMsg("<img src='" + (items[i].hu ? (items[i].hu + '/' + yao_avatar_size) : './images/avatar.jpg') + " '/>"+items[i].co);
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
            var height = $(window).height();
            this.$header.css('height', Math.round(height*0.1));
            this.$wrapper.css('height', Math.round(height*0.9));
            this.$comments.css('height', Math.round(height*0.9 - 55));
            $('body').css('height', height);
        }
    };

    W.callbackCountServicePvHander = function(data) {
        if (data.code == 0) {
            $('header label').text("目前"+ data.c +"人正在聊天");
        }
    };
})(Zepto);

$(function() {
    H.comments.init();
});