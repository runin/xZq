(function($) {
    H.index = {
        init: function() {
            this.listPort();
            this.friendPort();
            this.event();

            if($.fn.cookie(openid + '_guide')){
                $('body').removeClass('gui');
            } else {
                $('body').addClass('gui');
            }
        },
        event: function() {
            var me = this;
            $('body').delegate('.ma', 'click', function(e) {
                e.preventDefault();
                if ($(this).hasClass('error')) {
                    showTips('暂未开放，敬请期待');
                    return;
                } else {
                    me.fillInfo($(this));
                }
            });
            $('.btn-back').click(function(e) {
                e.preventDefault();
                toUrl('hero.html');
            });
            $('.btn-vclose').click(function(e) {
                e.preventDefault();
                $('.pop').addClass('none').find('#tvb').remove();
            });
            $('.guide').click(function(e) {
                e.preventDefault();
                $('body').removeClass('gui');
                $(this).addClass('none');
                $.fn.cookie(openid + '_guide', true, {expires: 7});
            });
            $('.lotips').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass('on')) {
                    toUrl('lottery.html?kfrom=talk');
                } else {
                    showTips('福袋亮起时点我摇奖');
                }
            });
        },
        listPort: function() {
            showLoading(null, '请稍等...');
            getResult('api/article/list', {}, 'callbackArticledetailListHandler');
        },
        sectionPort: function(id) {
            getResult('api/article/section', {uuid: id}, 'callbackArticledetailDetailSectionHandler');
        },
        friendPort: function() {
            getResult('api/user/friends', {matk: matk}, 'callbackUserFriendsHandler');
        },
        fillSection: function(data) {
            var item = data, tpl = '', dd = '', gs = '', st = '', img = '';
            for (var i = 0; i < item.length; i++) {
                if (item[i].tt.split(',').length == 2) {
                    dd = item[i].tt.split(',')[0];
                    gs = item[i].tt.split(',')[1];
                } else {
                    dj = '敬请期待';
                    gs = '敬请期待';
                }
                if (comptime(timeTransform(new Date().getTime()), item[i].n) < 0) {
                    st = 'ok';
                    img = item[i].img.split(',')[1];
                } else {
                    st = 'error';
                    img = item[i].img.split(',')[0];
                }
                tpl += '<a id="s' + (i + 1) + '" class="ma ' + st + '" href="javascript:void(0);" data-dd="' + dd + '" data-gs="' + gs + '" data-vrl="' + item[i].gu + '"><img src="' + img + '"></a>';
            };
            $('.lands').empty().html(tpl);
            $('.dd p').html($('.ok:last').attr('data-dd'));
            $('.gs p').html($('.ok:last').attr('data-gs'));
            // location.href = '#' + $('.ok:last').attr('id');
        },
        fillInfo: function($dom) {
            // $('.dd p').html($dom.attr('data-dd'));
            // $('.gs p').html($dom.attr('data-gs'));
            $('.pop .wrapper').append('<iframe id="tvb" frameborder="0" width="280" height="220" src="' + $dom.attr('data-vrl') + '&tiny=0&auto=0" allowfullscreen></iframe>')
            $('.pop').removeClass('none');
        },
        broadEffect: function() {
            setTimeout(function(){
                $('#article a').each(function(index) {
                    var $this = $(this);
                    setTimeout(function(){
                        $this.addClass('animatedSelf infinite flipX');
                    }, 500*(index + 1));
                });
            }, 3000);
        }
    };

    W.callbackArticledetailListHandler = function(data) {
        if (data.code == 0 && data.arts) {
            H.index.sectionPort(data.arts[0].uid);
        }
    };

    W.callbackArticledetailDetailSectionHandler = function(data) {
        if (data.code == 0 && data.items) H.index.fillSection(data.items);
        hideLoading();
    };

    W.callbackUserFriendsHandler = function(data) {
        if (data.result && data.fl) {
            var t = '', num = (data.fl.length >= 3) ? 3 : data.fl.length;
            for (var i = 0; i < num; i++) {
                t += '<section class="flimg"><img src="' + data.fl[i].hi + '"></section>'
            };
            $('.fl').empty().html(t);
        }
    };
})(Zepto);

$(function() {
    H.index.init();
});