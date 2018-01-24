(function($){
    H.detail={
        current: getQueryString("current"),
        sign: getQueryString("sign"),
        guid: getQueryString("guid"),
        pid: getQueryString("pid"),
        init: function(){
            var me = H.detail;
            me.event();
            me.showOrHide();
            if(me.sign){
                me.getDetailInfo();
            }else{
                me.getCurrentInfo();
            }
        },
        showOrHide: function(){
            var storage = W.localStorage, me = H.detail;
            if(storage.getItem("vs-"+ me.sign +"-"+ openid)){
                $(".btn-con div:last-child").addClass("none");
            }else{
                $(".btn-con div:last-child").removeClass("none");
            }
        },
        //获取竞猜信息（最新）
        getCurrentInfo: function(){
            getResult('api/voteguess/inforoud', {}, 'callbackVoteguessInfoHandler', true);
        },
        //查询竞猜活动期详情接口
        getDetailInfo: function(){
            getResult('api/voteguess/detail', {periodUuid: H.detail.sign}, 'callbackVoteguessDetailHandler');
        },
        //获取某个组选手的票数
        groupplayertickets: function(){
            getResult('api/voteguess/groupplayertickets', {groupUuid: H.detail.guid}, 'callbackVoteguessGroupplayerticketsHandler', true);
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },150);
        },
        event: function(){
            var me = H.detail;
            $(".btn-rank").tap(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("index.html");
            });
            $("#btn-pre").click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("collect.html?sign="+ me.sign +"&name="+encodeURIComponent($("#name").text()));
            });
            $(".cat").tap(function(e) {
                e.preventDefault();
                var $this = $(this), storage = W.localStorage;

                if(!me.current){
                    return;
                }
                if(storage.getItem("vote-"+ me.pid +"-"+ openid)){
                    showTips("亲，您已经点过赞啦~~");
                    return;
                }

                $.ajax({
                    type: 'GET',
                    async: false,
                    url: domain_url + 'api/voteguess/guessplayer' + dev,
                    data: {
                        yoi: openid,
                        guid: me.guid,
                        pluids: me.pid
                    },
                    dataType: "jsonp",
                    jsonpCallback: 'callbackVoteguessGuessHandler',
                    complete: function() {
                    },
                    success: function(data) {
                        if(data.code == 0){

                            if(!storage.getItem("vote-"+ me.pid +"-"+ openid)){
                                storage.setItem("vote-"+ me.pid +"-"+ openid, 1);
                            }
                            var $num = $this.siblings(".num").find('span');
                            $this.addClass("zan");
                            $num.text($num.text()*1+1);

                            setTimeout(function(){
                                $this.removeClass("zan");
                            },2000)
                        }
                    },
                    error: function(xmlHttpRequest, error) {}
                });
            });
        },
        spellHtml: function(data){
            var me = H.detail;
            $("#headImg img").attr("src",data.im2 || "images/avatar.png");
            $("#name").text(data.na || "匿名用户");
            $("#food-name").text(data.ni);
            $("#center").html(data.in);
            $(".num").attr("id", data.pid);
            me.groupplayertickets();
        }
    };
    W.callbackVoteguessInfoHandler = function(data){
        var me = H.detail;
        if(data.code == 0){
            $.each(data.items, function(i,item){
                if(item.guid == me.guid){
                    $.each(item.pitems, function(j,jtem){
                        if(jtem.pid == me.pid){
                            /*console.log(j);
                            console.log(jtem);*/
                            me.spellHtml(jtem);
                        }
                    });
                }
            });
        }
    };
    W.callbackVoteguessDetailHandler = function(data){
        var me = H.detail;
        if(data.code == 0){
            $.each(data.items, function(i,item){
                if(item.guid == me.guid){
                    $.each(item.pitems, function(j,jtem){
                        if(jtem.pid == me.pid){
                            /*console.log(j);
                             console.log(jtem);*/
                            me.spellHtml(jtem);
                        }
                    });
                }
            });
        }
    };
    W.callbackVoteguessGroupplayerticketsHandler = function(data){
        var me = H.detail;
        if(data.code == 0){
            $.each(data.items, function(i,item){
                if(item.puid == me.pid){
                    $("#"+me.pid).find("span").text(item.cunt || 0);
                }
            });
        }
    };
})(Zepto);
$(function(){
    H.detail.init();
});
