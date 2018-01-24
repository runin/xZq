;(function($){
    H.home = {
        page: 1,
        pageSize: 6,
        loadmore: true,
        init: function(){
            this.event();
            this.userInfo();
            this.hotlist();
            this.itemList();
            this.round();
            H.sign.init();
        },
        swiper: function(data){
            var item = data.items || [],
                len = item.length,
                t = simpleTpl();

            for (var i = 0; i < len; i ++) {
                var url = 'detail.html?uid='+ item[i].uid;
                t._('<div class="swiper-slide">')
                    ._('<a href="'+ url +'" data-collect="true" data-collect-flag="henan-dada-shopping-mall'+ i +'" data-collect-desc="积分商城 '+ item[i].n +'">')
                    ._('<img src="'+ item[i].ib +'" />')
                    ._('</a>')
                ._('</div>');
            }
            $('.swiper-wrapper').append(t.toString());

            var mySwiper = new Swiper('.swiper-container', {
                pagination : '.swiper-pagination',
                autoplay: 5000//可选选项，自动滑动
            })
        },
        spellDom: function(data){
            var me = H.home,
                item = data.items || [],
                len = item.length,
                t = simpleTpl();

            if(item[0].sn == "show"){
                $(".prize").append('<a href="detail.html?uid='+ item[0].uid+ "&" + item[0].bd +'" data-collect="true" data-collect-flag="henan-dada-list1" data-collect-desc="推荐商品1">' +
                                '<img src="'+ item[0].is +'"></a>' +
                                '<a href="detail.html?uid='+ item[1].uid + "&" + item[1].bd +'" data-collect="true" data-collect-flag="henan-dada-list2" data-collect-desc="推荐商品2">' +
                                '<img src="'+ item[1].is +'"></a>').removeClass("none");
            }

            var newItems = [],screenNum = 0;
            if(me.page == 2){
                for(var i=2, len=item.length; i < len; i+=2){
                    newItems.push(item.slice(i,i+2));
                }
            }else{
                for(var i=0, len=item.length; i < len; i+=2){
                    newItems.push(item.slice(i,i+2));
                }
            }

            screenNum = newItems.length;
            if(screenNum){
                $.each(newItems, function(i, item){
                    t._('<li>');
                    $.each(item, function(j, jtem){
                        var url = 'detail.html?uid='+ item[j].uid + "&" + item[j].bd;
                        t._('<a href="'+ url +'" data-collect="true" data-collect-flag="henan-dada-list-mall'+ i +'" data-collect-desc="限量兑换 '+ item[j].n +'">')
                            ._('<img src="'+ item[j].is +'">')
                            ._('<h1 class="trade-name">'+ item[j].n +'</h1>')
                            ._('<h2><label>'+ item[j].ip +'</label>积分</h2>')
                        ._('</a>');
                    });
                    t._('</li>');
                });
                $('.limit').append(t.toString());
            }

        },
        userInfo: function(){
            $("#headimgurl").attr("src", W.headimgurl);
            $("#nickname").text(W.nickname);
        },
        //分页获取热门商品列表
        hotlist: function(){
            var me = H.home;
            getResult('api/mall/item/hotlist', {
                /*page: me.page,
                pageSize : me.pageSize*/
            }, 'callbackStationMallHotList', true);
        },
        //分页获取商品列表
        itemList: function(){
            var me = H.home;
            getResult('api/mall/item/list', {
                page: me.page,
                pageSize : me.pageSize
            }, 'callbackStationCommMall', true);
            me.page ++;
        },
        //查询业务的抽奖活动 at=3 --积分抽奖
        round: function(){
            getResult('api/lottery/round', { at: 3 }, 'callbackLotteryRoundHandler', true);
        },
        event: function(){
            var me = H.home,
                range = 180, //距下边界长度/单位px
                maxpage = 100, //设置加载最多次数
                totalheight = 0;
            $(window).scroll(function(){
                var srollPos = $(window).scrollTop();
                totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
                if (($(document).height() - range) <= totalheight  && me.page < maxpage && me.loadmore) {
                    if(!$('#jb').hasClass('none')){
                        me.itemList();
                        //me.page ++;
                    }
                }
            });

            $(".jf-value").tap(function(e){
                e.preventDefault();
                toUrl("rule-how.html?type=rule");
            });
            $(".zq-jf").tap(function(e){
                e.preventDefault();
                toUrl("rule-how.html");
            });
            $(".dh-record").tap(function(e){
                e.preventDefault();
                toUrl("record.html");
            });
            $(".lottery").tap(function(e){
                e.preventDefault();
                toUrl("turntable.html");
            });
        }
    };
    W.callbackStationMallHotList = function(data) {
        var me = H.home;
        if (data.code == 0) {
            me.swiper(data);
        }
    };
    W.callbackStationCommMall = function(data) {
        var me = H.home;
        if (data.code == 0) {
            var items = data.items || [],
                len = items.length,
                t = simpleTpl();

            if (len < me.pageSize) {
                me.loadmore = false;
            }
            me.spellDom(data);
        } else {
            me.loadmore = false;
            return;
        }
    };
    W.callbackLotteryRoundHandler = function(data){
        if(data.result == true){
            var imgArray = data.la[0].bi.split(",");
            $(".lottery").attr("src", imgArray[0]);
            $(".lottery").removeClass("none");
        }
    };

    //签到
    H.sign = {
        REQUEST_CLS: 'requesting',
        puid: '',
        in: '',//用户自身总积分
        init: function(){
            this.event();
            this.selfTvintegral();
            this.signRound();
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        },
        event: function(){
            var me = H.sign;
           $("#sign").click(function(e){
                e.preventDefault();
                if($(this).hasClass(me.REQUEST_CLS) || $(this).hasClass("signed") ){
                    return;
                }
                me.btn_animate($(this));
                $(this).addClass(me.REQUEST_CLS);
                me.signed_sign();

            });
        },
        //查询用户积分排行
        selfTvintegral: function(){
            getResult('api/lottery/integral/rank/self', {oi: openid}, 'callbackIntegralRankSelfRoundHandler', true);
        },
        //获取签到活动
        signRound: function(){
            getResult("api/sign/round", {}, 'callbackSignRoundHandler', true);
        },
        //判断是否已经签到过某个活动
        issign_sign: function(){
            getResult("api/sign/issign",{yoi:openid, auid: H.sign.puid}, "callbackSignIsHandler", true);
        },
        //保存签到记录
        signed_sign: function(){
            getResult("api/sign/signed",{yoi:openid, auid: H.sign.puid, wxnn:nickname, wxurl:headimgurl}, "callbackSignSignedHandler", true);
        }
    };
    //查询用户积分排行
    W.callbackIntegralRankSelfRoundHandler = function(data){
        var me = H.sign;
            me.in = data.in || 0;
        $("#jf-value").text("我的积分：" + me.in);
    };
    //获取签到活动
    W.callbackSignRoundHandler = function(data){
        var me = H.sign;
        if(data.code == 0){
            var now = new Date(),
                currentYMD = '';
            currentYMD = now.getFullYear()+"-"+((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1)+"-"+(now.getDate()<10?"0":"")+now.getDate();

            $.each(data.items, function(i,item){
                var serverST = item.st;
                if(new Date(currentYMD).getTime() === new Date(serverST.split(" ")[0]).getTime()){
                    me.puid = item.uid;
                }
            });
            me.issign_sign();
        }
    };
    //判断是否已经签到过某个活动
    W.callbackSignIsHandler = function(data){
        if(data.result){
            $("#sign").text("已签到").addClass("signed").removeClass("none");
        }else{
            $("#sign").text("签到").removeClass("signed").removeClass("none");
        }
    };
    //保存签到记录
    W.callbackSignSignedHandler = function(data){
        var me = H.sign;
        if(data.code == 0){
            $("#sign").text("已签到").addClass("signed");
            console.log("data.signVal="+data.signVal);
            $("#jf-value").text("我的积分：" + (data.signVal*1 + me.in*1));
        }
    }
})(Zepto);

$(function(){
    H.home.init()
});

