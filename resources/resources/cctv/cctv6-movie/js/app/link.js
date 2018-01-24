(function($) {
    H.index = {
        init: function() {
            this.infoPort();
            this.event();
        },
        event: function() {
            $('body').delegate('#article a', 'click', function(e) {
                e.preventDefault();
                var that = this;
                if ($(that).attr('data-url')) setTimeout(function(){toUrl($(that).attr('data-url'));}, 100);
            });
        },
        infoPort: function() {
            getResult('api/linesdiy/info', {}, 'callbackLinesDiyInfoHandler');
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

    W.callbackLinesDiyInfoHandler = function(data) {
        if (data.code == 0 && data.gitems) {
            var a = data.gitems, b = '';
            for(var i = 0; i < data.gitems.length; i++) {
                b += '<a href="javascript:void(0);" data-url="' + a[i].t + '" data-collect="true" data-collect-flag="vipad' + (i + 1) + '" data-collect-desc="广告' + (i + 1) + '"><img src="' + a[i].ib + '"></a>'
            };
            $('#article').html(b);
            H.index.broadEffect();
        }
    };
})(Zepto);

$(function() {
    H.index.init();
});