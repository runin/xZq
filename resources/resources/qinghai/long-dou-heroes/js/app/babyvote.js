(function($) {
    H.babyvote = {
        $ul: $('ul'),
        uuid: null,
        nowTime: null,
        init: function(){
            this.event();
            this.query_info();
            //this.ddtj();
        },
        event: function() {
            var me = this;
            me.$ul.delegate('.baby-vote', 'click',function(e) {
                e.preventDefault();
                var me = $(this);
                if(me.hasClass('requesting')){
                    return;
                }
                shownewLoading();
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/voteguess/guessplayer?dev=yz',
                    data: {
                        yoi : openid,
                        guid: $(this).attr('data-guid'),
                        pluids: $(this).attr('data-pid')
                    },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackVoteguessGuessHandler',
                    complete: function() {
                        hidenewLoading();
                    },
                    success : function(data) {
                        if(data.code == 0){
                            me.addClass('voted requesting').parent('.intro-box').parent('li').find('img').addClass('zan rotate');
                            me.parent('.intro-box').find('.vote label').text(parseInt(me.parent('.intro-box').find('.vote label').text()) + 1);
                        }else{
                            return;
                        }
                    },
                    error : function() {
                        return;
                    }
                });


            });
            me.$ul.delegate('li img', 'click',function(e) {
                e.preventDefault();
                $(this).parent('li').find('.baby-vote').trigger('click');
            });
        },
        query_info: function() {
            getResult('api/voteguess/info', {yoi: openid}, 'callbackVoteguessInfoHandler', true);
        },
        filter_info: function(data) {
            var me = this, t = simpleTpl(),
                attrs = data.items || [], newAttrs = [];
            for(var i = 0,length = attrs.length; i < length; i++){
                if (attrs[i].ty == 2) {
                    newAttrs.push(attrs[i]);
                }
            }
            me.tpl(newAttrs);
        },
        vote_info: function(data) {
            var me = this, items = data.items;
            for(var i = 0, len = items.length; i < len; i++) {
                $('#zan' + items[i].puid).text(items[i].cunt);
            }
        },
        voteSupport: function() {
            var me = this;
            getResult('api/voteguess/getplayersp/' + me.uuid, {}, 'callbackVoteguessAllSupportPlayerHandler');
        },
        tpl: function(data){
            var me = this, t = simpleTpl(), attrs = data || [];
            for(var i = 0,length = attrs.length; i < length; i++) {
                if(typeof(attrs[i].so) == 'undefined'){
                    var voteStatus = '';
                }else{
                    var voteStatus = ' voted requesting';
                }
                for(var j = 0,jLength = attrs[i].pitems.length; j < jLength; j++) {
                    t._('<li>')
                        ._('<img src="' + attrs[i].pitems[j].im + '">')
                        ._('<div class="intro-box">')
                            ._('<div class="info">')
                                ._('<p class="name">' + attrs[i].pitems[j].na + '</p>')
                                ._('<p class="vote">票数:<label id="zan' + attrs[i].pitems[j].pid + '">0</label></p>')
                            ._('</div>')
                            ._('<div class="content">' + attrs[i].pitems[j].in + '</div>')
                            ._('<a href="#" class="baby-vote' + voteStatus + '" id="baby-vote" data-guid="' + attrs[i].guid + '" data-pid="' + attrs[i].pitems[j].pid + '"  data-collect="true" data-collect-flag="ldzyxcs-babyvote-tp-btn" data-collect-desc="兔女郎投票">投票</a>')
                        ._('</div>')
                    ._('</li>')
                }
            }
            me.$ul.html(t.toString());
            me.voteSupport();
        },
        ddtj: function() {
            $('#ddtj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        }
    };

    W.callbackVoteguessInfoHandler = function(data){
        var me = H.babyvote;
        if(data.code == 0){
            me.uuid = data.pid;
            me.nowTime = timeTransform(data.cud);
            $.fn.cookie("pid-"+openid,data.pid,7);
            me.filter_info(data);
        }else if(data.code == 1){
            return;
        }
    };

    W.callbackVoteguessAllSupportPlayerHandler = function(data) {
        var me = H.babyvote;
        if (data.code == 0) {
            me.vote_info(data);
        }
    };

    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.desc && data.url) {
            $('#ddtj').attr('href', (data.url || '')).removeClass('none');
        } else {
            $('#ddtj').remove();
        };
    };
})(Zepto);

$(function(){
    H.babyvote.init();
});