(function($) {
    H.vote = {
        $ul: $('ul'),
        pid: '',
        init: function(){
            this.event();
            this.query_info();
        },
        //查询投票信息
        query_info: function(){
            getResult('api/voteguess/inforoud', {}, 'callbackVoteguessInfoHandler', true);
        },
        isVote: function(){
            getResult('api/voteguess/isvoteall', {yoi: openid }, 'callbackVoteguessIsvoteAllHandler', true);
        },
        //获取该期所有选手累积的票数
        allplayertickets: function(){
            getResult('api/voteguess/allplayertickets', {
                periodUuid: H.vote.pid }, 'callbackVoteguessAllplayerticketsHandler', true);
        },
        event: function(){
            var me = this;
            me.$ul.delegate('li div.left', 'click',function(e) {
                e.preventDefault();
                if($(this).find("span a").hasClass("tped")){
                    showTips("已经投过票了");
                    return;
                }
                toUrl("details.html?guid="+$(this).attr("data-guid")+"&pid="+$(this).attr("data-pid"));
            });
            me.$ul.delegate('li div.right', 'click',function(e) {
                e.preventDefault();
                if($(this).find("span a").hasClass("tped")){
                    showTips("已经投过票了");
                    return;
                }
                toUrl("details.html?guid="+$(this).attr("data-guid")+"&pid="+$(this).attr("data-pid"));
            });
            $(".back-btn").click(function(e){
                e.preventDefault();
                toUrl("index.html");
            });
        },
        tpl: function(data){
            var me = this, t = simpleTpl(),
                attrs = data || [];

                for(var i = 0,length = attrs.length; i < length; i++){

                t._('<li>')
                    ._('<div class="left" data-guid="'+ attrs[i].guid +'" data-pid="'+ attrs[i].pitems[0].pid +'" data-na="'+ attrs[i].pitems[0].na +'">')
                        ._('<label class="label-img" data-collect="true" data-collect-flag="vote-tp' +attrs[i].pitems[0].pid+ '" data-collect-desc="进入投票页面"><img class="lazy" data-original="'+ attrs[i].pitems[0].im +'" src="images/loading.png"></label>')
                        ._('<span>')
                            ._('<a class="tp"></a>')
                            ._('<label>-</label>')
                        ._('</span>')
                    ._('</div>')
                    ._('<div class="center">')
                        ._('<img src="images/vote1.png">')
                    ._('</div>')
                    ._('<div class="right" data-guid="'+ attrs[i].guid +'" data-pid="'+ attrs[i].pitems[1].pid +'" data-na="'+ attrs[i].pitems[1].na +'>')
                        ._('<label class="label-img" data-collect="true" data-collect-flag="vote-tp' +attrs[i].pitems[1].pid+ '" data-collect-desc="进入投票页面"><img class="lazy" data-original="'+ attrs[i].pitems[1].im +'" src="images/loading.png"></label>')
                        ._('<span>')
                            ._('<a class="tp"></a>')
                            ._('<label>-</label>')
                        ._('</span>')
                    ._('</div>')
                ._('</li>')
            }
            me.$ul.html(t.toString());
            $("img.lazy").picLazyLoad({effect: "fadeIn"});
            me.isVote();
        }
    };

    W.callbackVoteguessInfoHandler = function(data){
        var me = H.vote;
        if(data.code == 0){
            me.pid = data.pid;
            me.tpl(data.items);
            me.allplayertickets();
        }else if(data.code == 1){
            return;
        }
    };
    W.callbackVoteguessIsvoteAllHandler = function(data){
        if(data.code == 0){
            $.each(data.items, function(i,item){
                var soPid =[];
                if(item.so){
                    soPid = item.so.split(",");
                }
                $.each($('li div'), function(j,jtem){
                    if(soPid[0] == $('li div').eq(j).attr("data-pid") || soPid[1] == $('li div').eq(j).attr("data-pid")){
                        $('li div').eq(j).find("span a").attr("class", "tped");
                    }
                });
            });

        }
    };
    W.callbackVoteguessAllplayerticketsHandler = function(data){
        if(data.code == 0){
            $.each(data.items, function(i,item){
                $.each($('li div'), function(j,jtem){
                    if(item.puid == $('li div').eq(j).attr("data-pid")){
                        $('li div').eq(j).find("span label").text(item.cunt);
                    }
                });
            });
        }
    }
})(Zepto);
$(function(){
    H.vote.init();
});