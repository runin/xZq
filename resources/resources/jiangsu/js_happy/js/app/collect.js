(function($) {
    H.collect = {
        realName: '',
        init: function() {
            this.event();
        },
        event: function() {
            var me = this;
            $('#collect').click(function(e) {
                e.preventDefault();
                if (me.check()) {
                    me.updateOpenid();
                }
            });
        },
        updateOpenid: function() {
            var me = this;
            shownewLoading(null, '正在提交');
            $.ajax({
                type: 'GET',
                async: false,
                url: domain_url + 'api/comments/save' + dev,
                data: {
                    co: encodeURIComponent(me.realName),
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
                    if (data && data.code == 0) {
                        hidenewLoading();
                        $('.realName').val('');
                        showTips('提交成功，请不要外泄该链接地址', 5e3);
                    } else {
                        hidenewLoading();
                        showTips('提交失败，请重试或咨询接口人', 5e3);
                    }
                }
            });
        },
        check: function() { 
            var me = this, $realName = $('.realName');
            me.realName = $.trim($realName.val().toLowerCase().replace(/undefined/g, '').replace(/null/g, ''));
            $realName.val(me.realName);

            if (me.realName.length > 50 || me.realName.length == 0) {
                showTips('请填写您的真实姓名!');
                $realName.focus();
                return false;
            }
            return true;
        }
    };
})(Zepto);

$(function() {
    H.collect.init();
});