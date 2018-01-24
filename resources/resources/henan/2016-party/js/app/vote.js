(function($){
    H.vote = {
        guid: '',
        cuntAttrs: null,//投票后降序数组
        inforoudAttrs: null,//选手信息数组
        spellRankData: [],//选手信息降序数组
        init: function(){
            this.event();
            this.getVoteinfo();
        },
        getVoteinfo: function(){
            getResult('api/voteguess/inforoud', {}, 'callbackVoteguessInfoHandler', true);
        },
        getVote: function() {
            var me = H.vote;
            getResult('api/voteguess/isvote', { yoi: openid, guid: me.guid}, 'callbackVoteguessIsvoteHandler ');
        },
        voteSupport: function() {
            var me =  H.vote;
            getResult('api/voteguess/groupplayertickets', { groupUuid: me.guid }, 'callbackVoteguessGroupplayerticketsHandler');
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        event: function(){
            var me = H.vote;
            $('.back-btn').tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("comment.html");
            });
            $('ul').delegate('a', 'click', function(e) {
                e.preventDefault();
                var $this = $(this);
                me.btn_animate($(this));
                if ($(this).hasClass('requesting')) {
                    showTips("您已经投过票啦~~");
                    return;
                }
                $.ajax({
                    type: 'GET',
                    async: false,
                    url: domain_url + 'api/voteguess/guessplayer' + dev,
                    data: {
                        yoi: openid,
                        guid: me.guid,
                        pluids: $this.attr("id").slice(5)
                    },
                    dataType: "jsonp",
                    jsonpCallback: 'callbackVoteguessGuessHandler',
                    complete: function() {
                    },
                    success: function(data) {
                        if(data.code == 0){
                            var $num = $this.siblings("div").find('p:last-child');
                            $num.text($num.text()*1+1);
                            $this.addClass('requesting zan').find('img').attr('src',"images/xhed.png");
                            setTimeout(function(){
                                $this.removeClass('zan');
                            },1500)
                        }
                    },
                    error: function(xmlHttpRequest, error) {}
                });
            });
        },
        swap: function(i, j,itema)
        {
            var temp = itema[i];
            itema[i] = itema[j];
            itema[j] = temp;
        },
        bubbleSort: function(itema)
        {
            var me = H.vote;
            for (var i = itema.length - 1; i > 0; --i)
            {
                for (var j = 0; j < i; ++j)
                {
                    if (itema[j].cunt < itema[j + 1].cunt) {
                        me.swap(j, j + 1,itema);
                    }
                }
            }
        },
        spellDom: function(data){
            var me = H.vote, t = simpleTpl();
            $.each(data, function(i, item){
                t._('<li>')
                    ._('<label><img src="'+ item.im +'" /></label>')
                    ._('<div>')
                        ._('<p>'+ item.na +'</p>')
                        ._('<p id="num-'+ item.pid +'">0</p>')
                    ._('</div>')
                    ._('<a class="dz" id="vote-'+ item.pid +'" data-collect="true" data-collect-flag="hn-party-vote-back-'+ item.pid +'" data-collect-desc="进入主互动页"><img src="images/xh.png"></a>')
                ._('</li>');
            });
            $("ul").append(t.toString());
            if(me.cuntAttrs){
                $.each(me.cuntAttrs, function(i,item){
                    $('#num-'+item.puid).text(item.cunt);
                });
            }

            me.getVote();
            $(".main").removeClass("none").addClass("ss");
            setTimeout(function(e){
                $(".main").removeClass("ss");
            },1000);
        }
    };
    W.callbackVoteguessInfoHandler = function(data){
        var me = H.vote;
        if(data.code == 0){
            me.guid = data.items[0].guid;
            me.inforoudData = data.items[0].pitems;
            me.voteSupport();
        }
    };
    W.callbackVoteguessIsvoteHandler = function(data) {
        var me = H.vote,
            $items_btn = $('.ul li .dz');
        if (data.code == 0) {
            if (data.so) {
                var soList = data.so.split(',');
                $.each(soList, function(i,item){
                    $('#vote-'+item).addClass("requesting").find('img').attr('src',"images/xhed.png");
                });
            }
        } else {
            $items_btn.addClass("none");
        }
    };
    W.callbackVoteguessGroupplayerticketsHandler = function(data) {
        var me = H.vote;
        if (data.code == 0 && data.items) {
            me.cuntAttrs = data.items;
            me.bubbleSort(me.cuntAttrs);
            $.each(me.cuntAttrs, function(i,item){
                $.each(me.inforoudData, function(j,jtem){
                    if(item.puid == jtem.pid){
                        me.spellRankData.push(jtem);
                    }
                });
            });
            me.spellDom(me.spellRankData);
        }
    };
})(Zepto);
$(function(){
    H.vote.init();
});