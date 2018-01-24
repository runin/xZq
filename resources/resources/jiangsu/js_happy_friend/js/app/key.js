(function($) {
    H.key = {
        init: function () {
            this.event();
            this.servicecountGetcount();
        },
        event: function() {
            var me = this;
            $('.btn-key').click(function(e) {
                e.preventDefault();
                me.servicecountIncrcount();
            });
        },
        servicecountIncrcount: function() {
            getResult('api/servicecount/incrcount', {
                key: tongjiKey
            }, 'callbackServiceCountIncrHandler');
        },
        servicecountGetcount: function() {
            getResult('api/servicecount/getcount', {
                key: tongjiKey
            }, 'callbackServiceCountGetHandler');
        }
    };

    W.callbackServiceCountIncrHandler = function(data) {
        var me = H.key;
        if (data.result) {
            $('.key-wrapper p label').text($('.key-wrapper p label').html()*1 + 1);
        } else {
            showTips('系统出错，请联系管理员！');
        }
    };

    W.callbackServiceCountGetHandler = function(data) {
        if (data.result && data.c) {
            $('.key-wrapper p label').text(data.c);
        } else {
            showTips('系统出错，请联系管理员！');
        }
    };
})(Zepto);                             

$(function(){
    H.key.init();
});