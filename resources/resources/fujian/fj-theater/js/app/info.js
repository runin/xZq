(function($){
    H.record = {
        page: 1,
        pageSize: 20,
        beforePage: 0,
        loadmore: true,
        firstLoad: true,
        rankOpen: false,
        request_cls: 'requesting',
        isAni:false,
        isShow:false,
        isChg:false,
        uid:null,
        tk:null,
        init: function(){
            this.event();
            this.scrollEvent();
            this.getUuid();
        },
        event: function(){
            var me = this;
            $('#btn-go2index').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass(me.request_cls)) {
                    return;
                }
                $(this).addClass(me.request_cls);
                toUrl('jfbk.html');
            });
            $('#btn-record').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass('active')) {
                    return;
                }
                $('.tab-box a').removeClass('active');
                $(this).addClass('active');
                me.rankOpen = false;
                $('.content-record').removeClass('none');
                $('.content-rank').addClass('none');
            });
            $('#btn-rank').click(function(e) {
                e.preventDefault();
                if ($(this).hasClass('active')) {
                    return;
                }
                $('.tab-box a').removeClass('active');
                $(this).addClass('active');
                me.rankOpen = true;
                $('.content-record').addClass('none');
                $('.content-rank').removeClass('none');
            });
            $(".info-btn").on("click",function (e) {
                e.preventDefault();
                console.log("1");
                if(H.record.isAni == false){
                    H.record.isAni = true;
                    console.log("2");
                    if(H.record.isShow == false){
                        //$(".info").css({"height":"220px","-webkit-animation":"show 0.3s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
                        //    $(".info").css({"-webkit-animation":""});
                        //    H.record.isAni = false;
                        //    H.record.isShow = true;
                        //});
                        $(".info").css({"height":"220px"});
                        $(".info-btn>img").attr("src","images/btn-arrow-up.png");
                        H.record.isAni = false;
                        H.record.isShow = true;
                        console.log("3");
                    }else{
                        //$(".info").css({"height":"0","-webkit-animation":"hide 0.3s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
                        //    $(".info").css({"-webkit-animation":""});
                        //    H.record.isAni = false;
                        //    H.record.isShow = false;
                        //});
                        $(".info").css({"height":"0"});
                        $(".info-btn>img").attr("src","images/btn-arrow-down.png");
                        H.record.isAni = false;
                        H.record.isShow = false;
                        console.log("4");
                    }
                }
            });
            $(".info-sure").on("click", function () {
                H.record.chgInfo();
            });
        },
        scrollEvent: function() {
            var me = this, range = 10, maxpage = 100, totalheight = 0, fixedStep = 100;
            $(window).scroll(function(){
                var srollPos = $(window).scrollTop();
                totalheight = parseFloat($(window).height()) + parseFloat(srollPos) - fixedStep;
                if (me.rankOpen && ($(document).height() - range - fixedStep) <= totalheight && me.page < maxpage && me.loadmore) {
                    if ($('#spinner').length > 0) {
                        return;
                    };
                    //me.getRank(me.page);
                }
            });
        },
        getRecord: function() {
            getResult('api/lottery/record', {oi: openid}, 'callbackUserPrizeHandler', true);
        },
        //getRank: function(page) {
        //    if(page - 1 == this.beforePage) {
        //        getResult('api/lottery/allrecord', {pn: this.page, ps: this.pageSize}, 'callbackLotteryAllRecordHandler', true);
        //    }
        //},
        getUserinfo: function () {
            getResult('api/user/info', {oi: openid}, 'callbackUserInfoHandler', true);
        },
        getUuid: function () {
            getResult("api/linesdiy/info",{},"callbackLinesDiyInfoHandler",true);
        },
        getMygold: function () {
            getResult('api/lottery/integral/rank/self', {
                oi: openid,
                pu: H.record.uid
            }, 'callbackIntegralRankSelfRoundHandler', true, this.$dialog);
        },
        getRank: function () {
            getResult('api/lottery/integral/rank/top10', {pu:H.record.uid}, 'callbackIntegralRankTop10RoundHandler', true, this.$dialog);
        },
        userInfo: function (data) {
            if(data.hi){
                $("header").append('<img class="avatar" src="' + data.hi + '">');
            }else{
                $("header").append('<img class="avatar" src="./images/avatar.png">');
            }
            if(data.nn){
                $(".nickname").text(data.nn);
            }else{
                $(".nickname").text("匿名");
            }
            var rn = data.rn;
            var ph = data.ph;
            var ad = data.ad;
            if(rn == undefined){rn = ""}
            if(ph == undefined){ph = ""}
            if(ad == undefined){ad = ""}
            if(rn == "" || (ph == "") || (ad == "")){
                $(".infoName").val(rn);
                $(".infoTel").val(ph);
                $(".infoAdds").val(ad);
                H.record.isChg = true;
            }else{
                $(".infoName").val(rn).attr("disabled","disabled");
                $(".infoTel").val(ph).attr("disabled","disabled");
                $(".infoAdds").val(ad).attr("disabled","disabled");
                $(".info-sure").html("修&nbsp改");
                H.record.isChg = false;
            }
        },
        chgInfo: function () {
            if(H.record.isChg == true){
                H.record.chkinfo();
            }else{
                $(".infoName").removeAttr("disabled");
                $(".infoTel").removeAttr("disabled");
                $(".infoAdds").removeAttr("disabled");
                $(".info-sure").html("确&nbsp定");
                H.record.isChg = true;
            }
        },
        fillRecord: function(data) {
            var t = simpleTpl(), items = data.rl || [], len = items.length;
            for (var i = 0; i < len; i ++) {
                t._('<li>')
                    ._('<div class="gift-icon"></div>')
                    ._('<div class="gift-info">')
                    ._('<p class="gift-name">' + items[i].pn + '</p>')
                    //._('<div class="gift-content">')
                if (items[i].cc) {
                    if (items[i].cc.split(',')[0]) {
                        t._('<div class="gift-numb">' + items[i].cc.split(',')[0] + '<div class="gift-time">' + items[i].lt.split(" ")[0] + '</div></div>')
                    }
                }else{
                    t._('<div class="gift-time">' + items[i].lt.split(" ")[0] + '</div>')
                }
                    //t._('<div class="gift-numb">' + "" + '</div>')
                    //t._('<div class="gift-time">' + items[i].lt.split(" ")[0] + '</div>')
                    t._('</div>');
                //if(items[i].rl){
                //        t._('<p class="gift-check"><a href="'+ items[i].rl +'">查看</a></p>')
                //        }
                //        if (items[i].aw) {
                //            t._('<p class="gift-type">领奖方式: ' + items[i].aw + '</p>')
                //        }
                //        if (items[i].aa) {
                //            t._('<p class="gift-addr">领奖地址: ' + items[i].aa + '</p>')
                //        }
                //        if (items[i].al) {
                //            t._('<p class="gift-phone">咨询电话: ' + items[i].al + '</p>')
                //        }
                    t._('</div>')
                ._('</li>')
            };
            $('.content-record ul').append(t.toString());
        },
        fillRank: function(data) {
            var me = this, t = simpleTpl(), items = data.top10 || [], len = items.length;
            for (var i = 0; i < len; i ++) {
                t._('<li>')
                  ._('<section>')
                    //._('<img src="' + (items[i].hi || './images/avatar.png') + '">')
                    ._('<img src="' + (items[i].hi || './images/avatar.png') + '">')
                    ._('<p>' + (items[i].nn || '匿名用户') + '</p>')
                  ._('</section>')
                  ._('<section><img src="images/icon-coin.png"><p>' + (items[i].in || '') + '</p><span>第' + items[i].rk + '名</span></section>')
                ._('</li>')
            };
            $('.content-rank ul').append(t.toString());
            if(me.firstLoad) {
                me.firstLoad = false;
            }
        },
        chkinfo: function () {
            var name = $(".infoName").val();
            var tel = $(".infoTel").val();
            var adds = $(".infoAdds").val();
            if (name.length > 20 || name.length == 0) {
                showTips('请输入您的姓名，不要超过20字哦!');
                return false;
            }else if (!/^\d{11}$/.test(tel)) {
                showTips('这手机号，可打不通...');
                return false;
            }else if(adds.length < 3 || adds.length > 30){
                showTips('请填写正确的地址');
                return false;
            }else{
                shownewLoading();
                getResult('api/user/edit',
                    {
                        oi:openid,
                        tk: H.record.tk,
                        rn:name,
                        ph:tel,
                        ad:adds
                    },'callbackUserEditHandler');

            }
        },
        getNextPn: function(page) {
            var me = this;
            if((page - 1)  == me.nowPn){
                if (me.nextTrue) {
                    me.nextTrue = false;
                    getResult('api/lottery/allrecord', {pn: me.pn, ps: me.ps}, 'callbackLotteryAllRecordHandler', true);
                };
            };
        }
    };

    W.callbackLotteryRecordHandler = function(data) {
        if (data.result) {
            H.record.fillRecord(data);
        } else {
            $(".content-record").empty().append('<p class="empty">亲，您还没有中奖哦~<br>继续加油</p>');
            return;
        }
    };
    W.callbackUserInfoHandler = function(data) {
        if (data.result) {
            H.record.tk = data.tk;
            H.record.userInfo(data);
        } else {
            H.record.userInfo(data);
        }
    };
    W.callbackLinesDiyInfoHandler = function(data) {
        if (data.code == 0) {
            H.record.uid = data.tid;
            H.record.getRecord();
            H.record.getRank(0);
            H.record.getUserinfo();
            H.record.getMygold();
        } else {

        }
    };
    W.callbackIntegralRankSelfRoundHandler = function(data) {
        if (data.result == true) {
            $(".gold-numb").html(data.in);
            if(data.rk){
                $(".gold-rank").text("第"+data.rk+"名");
            }else{
                $(".gold-rank").text("");
            }
        } else {

        }
    };
    W.callbackUserEditHandler = function(data) {
        hidenewLoading();
        if (data.result == true) {
            //$(".info").css({"height":"0","-webkit-animation":"hide 0.3s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
            //    $(".info").css({"-webkit-animation":""});
            //    H.record.isAni = false;
            //    H.record.isShow = false;
            //});
            $(".info").css({"height":"0"});
            $(".infoName").attr("disabled","disabled");
            $(".infoTel").attr("disabled","disabled");
            $(".infoAdds").attr("disabled","disabled");
            $(".info-sure").html("修&nbsp改");
            H.record.isChg = false;
            H.record.isAni = false;
            H.record.isShow = false;
            $(".info-btn>img").attr("src","images/btn-arrow-down.png");
            showTips("修改成功");
        } else {

        }
    };
    W.callbackIntegralRankTop10RoundHandler = function(data) {
        if (data.result) {
            H.record.fillRank(data);
        }
    };
    W.callbackLotteryAllRecordHandler = function(data) {
        if (data.result) {
            if (data.rl.length < H.record.pageSize) {
                H.record.loadmore = false;
            } else if (data.rl.length == H.record.pageSize) {
                if(H.record.page == 1){
                    H.record.beforePage = 1;
                    H.record.page = 2;
                }else{
                    H.record.beforePage = H.record.page;
                    H.record.page++;
                }
                H.record.loadmore = true;
            }
            H.record.fillRank(data);
        } else {
            if (H.record.page == 1) {
                $(".content-rank").empty().append('<p class="empty">加油赢金币<br>金币榜就会有您的大名哦~</p>');
            }
            H.record.loadmore = false;
        }
    };
})(Zepto);

$(function(){
    H.record.init();
});