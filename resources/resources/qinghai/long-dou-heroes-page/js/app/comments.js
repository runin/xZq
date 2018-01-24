(function($) {
    H.comments = {
        tid: '',
        anys: '',
        $inputCmt: $('#input-comment'),
        $btnCmt: $('#btn-comment'),
        $outer: $(".outer"),
        REQUEST_CLS: 'requesting',
        init: function() {
            H.utils.resize();
            this.event();
            this.get_ht();
            this.jump();
            H.comment.init();
        },
        get_ht: function(){
            getResult('api/comments/topic/round', {}, 'callbackCommentsTopicInfo', true);
        },
        jump: function(){
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
        },
        event: function() {
            var me = this;
            $('.btn-back').click(function(e){
                e.preventDefault();
                toUrl('index.html');
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
                    alert('请先说点什么吧');
                    me.$inputCmt.removeClass('error').addClass('error').focus();
                    return;
                } else if (len > 20) {
                    alert('观点字数超出了20字');
                    me.$inputCmt.removeClass('error').addClass('error').focus();
                    return;
                }

                $(this).addClass(me.REQUEST_CLS);

                shownewLoading();
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/comments/save',
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
                        ty: 1,
                        tid: H.comments.anys,
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
                            var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/avatar.jpg';
                            barrage.appendMsg('<img src="' + h + '" />'+comment);
                            me.$inputCmt.removeClass('error').val('');
                            return;
                        }
                        alert(data.message);
                    }
                });

            });
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
                    maxid: me.maxid,
                    anys: H.comments.anys
                },
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
            this.$header.css('height', Math.round(height*0.10));
            this.$wrapper.css('height', Math.round(height*0.90));
            this.$comments.css('height', Math.round(height*0.90 - 55));
            $('body').css('height', height);
        }
    };

    W.callbackCommentsTopicInfo = function(data){
        if(data.code == 0){
            H.comments.anys = data.items[0].uid;
            $('body').css({
                'background-image': 'url('+ data.items[0].im +')'
            });
        }
    };
    W.commonApiPromotionHandler = function(data){
        var me = H.comments;
        if(data.code == 0){
            if(data.url && data.desc){
                me.$outer.attr('href', (data.url || '')).removeClass('none');
            }
        }
    };
})(Zepto);

$(function() {
    H.comments.init();
});