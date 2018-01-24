(function($) {
    H.comments = {
        $inputCmt: $('#input-comment'),
        $btnCmt: $('#btn-comment'),
        REQUEST_CLS: 'requesting',
        init: function() {
            this.resize();
            this.event();
            this.updatepv();
            H.comment.init();
        },
        event: function() {
            var me = this;
            $('#btn-go2vote').click(function(e) {
                e.preventDefault();
                toUrl("vote.html");
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
                } else if (len > 20) {
                    showTips('观点字数超出了20字');
                    me.$inputCmt.removeClass('error').addClass('error');
                    return;
                }
                $(this).addClass(me.REQUEST_CLS);
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/comments/save',
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
                        ty: 2,
                        nickname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                        headimgurl: headimgurl ? headimgurl : ""
                    },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackCommentsSave',
                    complete: function() {
                        showTips('发射成功!');
                    },
                    success : function(data) {
                        me.$btnCmt.removeClass(me.REQUEST_CLS);
                        if (data.code == 0) {
                            barrage.appendMsg("<img class='isme' src='./images/icon-glove.png'>" + comment);
                            $('.isme').parent('div').addClass('me');
                            me.$inputCmt.removeClass('error').val('');
                            return;
                        }
                        showTips(data.message);
                    }
                });
            });
        },
        updatepv: function() {
            getResult('log/serpv', {}, 'callbackCountServicePvHander', false, null, true);
            setInterval(function() {
                getResult('log/serpv', {}, 'callbackCountServicePvHander', false, null, true);
            }, 5000);
        },
        resize: function() {
            var height = $(window).height();
            $('header').css('height', Math.round(height*0.08));
            $('article').css('height', Math.round(height*0.92));
            $('#comments').css('height', Math.round(height*0.92 - 55));
            $('body').css('height', height);
        }
    };

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
                        barrage.pushMsg("<img src='./images/icon-glove.png'>"+items[i].co);
                    }
                }
            });
        }
    };

    H.utils = {
    };

    W.callbackCountServicePvHander = function(data) {
        if (data.code == 0) {
            $('.nowpv').removeClass('none').find('label').text(data.c);
        }
    };
})(Zepto);

$(function() {
    H.comments.init();
});