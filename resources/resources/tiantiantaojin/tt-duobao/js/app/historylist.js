/**
 * Created by E on 2015/11/10.
 */
$(document).ready(function () {
    S.his.init();
});

S.his = {
    init: function () {
        var me = S.his;
        me.el.swiper_pag = $(".swiper-pagination");
        me.swinit();
        //me.el.swiper_pag.css("line-height",($(window).height()*0.08)+"px");
        me.el.section = $(".section");
        me.el.outsec = $(".outsec");
        me.el.black = $(".black");
        me.el.hisLabel = $(".his-label");
        me.el.hisLbimg = $(".his-label>img");
        me.el.hisLbp = $(".his-label>.his-label-r>div");
        me.el.winW = $(window).width();
        me.el.winH = $(window).height();
        me.el.secHead = $(".sec-head");
        me.el.btnCls = $(".btn-cls");
        me.el.swiperSlide = $(".swiper-slide");
        me.el.noMore = $(".nomore");
        me.el.hisBody = $(".his-body");
        me.el.btnBacktohome = $(".btn-backtohome");
        me.el.swiperWrapper = $(".swiper-wrapper");
        me.applydata();
        me.el.btnBacktohome.on("click", function () {
            toUrl("personcenter.html");
        });
        me.el.swiperWrapper.css("height",(me.el.winH-36)+"px");
    },
    el:{
        swiper_pag:null,
        section:null,
        outsec:null,
        black:null,
        chkmyNumb:null,
        hisWhole:null,
        hisContinue:null,
        hisIsover:null,
        allInfo:null,
        isStart:false,
        hisLabel:null,
        hisLbimg:null,
        hisLbp:null,
        hisImg:null,
        hisBody:null,
        secHead:null,
        winW:null,
        winH:null,
        btnCls:null,
        isOpen:false,
        lastId:null,
        swiperSlide:null,
        page:1,
        isAsk:false,
        btnBacktohome:null,
        noMore:null,
        isInscl:false,
        isAllrev:false,
        chkH:null,
        swiperWrapper:null
    },
    applydata: function () {
        showLoading();
        getResult('indianaPeriod/myjoinperiod', {
            appId:busiAppId,
            openid:openid,
            page: 1,
            pageSize:10
        },'indianaPeriodMyJoinPeriodCallBackHandler');
    },
    even: function () {
        S.his.shownumbdialog();
        S.his.el.black.on("click", function () {
            S.his.chooseover();
        });
        S.his.el.hisImg.on("click", function () {
            var me = this;
            toUrl("../goods/goodsview.html?goods_id="+$(me).attr("idflag"));
        });
        S.his.el.btnCls.on("click", function () {
            S.his.chooseover();
        });
        if(S.his.el.hisWhole.find(".his-body").height()>($(window).height()*0.91)){
            S.his.el.hisWhole.scroll(function () {
                if(S.his.el.isAllrev == false){
                    S.his.loadmore(S.his.el.swiperSlide);
                }
            });
        }
    },
    swinit: function () {
        var swiper = new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true,
            //effect : 'coverflow',
            paginationBulletRender: function (index, className) {
                var pname = null;
                if(index == 0){
                    pname = "全部";
                }else if(index == 1){
                    pname = "进行中";
                }else{
                    pname = "已揭晓";
                }
                return '<span class="' + className + '">' + pname + '</span>';
            }
        });
    },
    loadmore: function (page) {
        var swiperH = page.find(".his-body").height()-($(window).height()*0.91);
        if(page.scrollTop() > swiperH){
            if(S.his.el.isAsk == false){
                showLoading();
                S.his.el.isAsk = true;
                getResult('indianaPeriod/myjoinperiod', {
                    appId:busiAppId,
                    openid:openid,
                    page: S.his.el.page,
                    pageSize:10
                },'indianaPeriodMyJoinPeriodCallBackHandler');
            }
        }
    },
    shownumbdialog: function () {
        S.his.el.chkmyNumb.one("click", function (e) {
            e.preventDefault();
            var me = this;
            S.his.el.black.css({"display":"block","-webkit-animation":"secup 0.3s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
                S.his.el.black.css({"opacity":"0.5","-webkit-animation":""});
                if(S.his.el.lastId == me.id){

                }else{
                    S.his.showmynumb(me);
                    S.his.el.lastId = me.id;
                }
            });
            S.his.el.outsec.css({"display":"block","-webkit-animation":"popup 0.3s","animation-timing-function":"ease-out","-webkit-animation-timing-function":"ease-out"}).one("webkitAnimationEnd", function () {
                S.his.el.outsec.css({"-webkit-animation":""})
            });
        });
    },
    chooseover: function () {
        S.his.el.chkmyNumb.off();
        S.his.el.black.css({"-webkit-animation":"secdown 0.3s","animation-timing-function":"ease-in","-webkit-animation-timing-function":"ease-in"}).one("webkitAnimationEnd", function () {
            S.his.el.black.css({"display":"none","-webkit-animation":""});
            S.his.shownumbdialog();
        });
        S.his.el.outsec.css({"display":"block","-webkit-animation":"popdown 0.3s","animation-timing-function":"ease-in","-webkit-animation-timing-function":"ease-in"}).one("webkitAnimationEnd", function () {
            S.his.el.outsec.css({"display":"none","-webkit-animation":""})
        });
    },
    addone: function (data) {
        toUrl("../goods/goodsbuy.html?goods_id="+data.id);
    },
    showmynumb: function (me) {
        //S.his.el.outsec.text("");
        //S.his.info(S.his.el.allInfo,me);
        var that = $(me).parent().parent().find("h5");
        var secInfo = "";
        secInfo += '<div class="out-name">' + $(me).attr("nm") + '</div>';
        secInfo += '<span>参与<span class="out-red">' + $(me).attr("tm") + '</span>人次，夺宝号码：</span>';
        secInfo += '<div class="out-numb"><span>' + $(me).attr("id").replace(/,/g, "</span><span>") + '</span></div>';
        S.his.el.secHead.html(secInfo);
        var secHeight = S.his.el.secHead.height();
        if((secHeight + $(".btn-cls").height()) > (S.his.el.winH * 0.8)){
            S.his.el.outsec.css({
                "height":((S.his.el.winH * 0.8)+20)+"px",
                "top":(S.his.el.winH - ((S.his.el.winH * 0.8)+20)) * 0.5,
                "overflow":"hidden"
            });
            S.his.el.section.css("overflow","hidden");
            $(".out-numb").css({"height":((S.his.el.winH * 0.8) - $(".out-name").height() - 70)+"px","overflow-y":"scroll"});
        }else{
            S.his.el.outsec.css({
                "height":($(".sec-head").height()+60)+"px",
                "top":(S.his.el.winH - ($(".sec-head").height()+60)) * 0.5,
                "overflow":"hidden"
            });
            S.his.el.section.css("overflow","hidden");
            //$(".out-numb").css("overflow-y","scroll");
        }
    },
    info: function (data,chkinfo) {
        for(var i = 0 ; i < data.item.length ; i++) {
            var infoData = "";
            var infoLabel = data.item[i].pn;
            var infoImg = data.item[i].pi;
            var infoWhitch = "(第" + data.item[i].pt + "期)";
            var infoNumberall = data.item[i].pc;
            var infoJoinnumb = data.item[i].rn;
            var infoWjoinnumb = data.item[i].wjc;
            if(infoWjoinnumb==undefined){infoWjoinnumb="0"}
            var infoAdd = data.item[i].puuid;
            var infoClass = data.item[i].n;
            var Rid = data.item[i].rid;
            var infoStats = data.item[i].stats;
            if(chkinfo == undefined){
                if(infoStats == 1 || (infoStats == 3)){
                    var infoNumbernow = data.item[i].jc;
                    if(infoNumberall == infoNumbernow){infoStats=3}
                    infoData += '<div class="his-label">';
                    infoData += '<img class="hisImg" src="' + infoImg + '" onerror="$(this).attr(\'src\',\'../../images/goods-snone.png\')" idflag="' + infoAdd + '" />';
                    infoData += '<div class="his-label-r">';
                    infoData += '<div><h2 class="red">' + infoWhitch + '</h2>' + infoLabel + '</div>';
                    infoData += '<p>' + "总需："+infoNumberall + '</p>';
                    infoData += '<span><span class=' + infoAdd + '></span></span>';
                    if(infoStats == 1){
                        infoData += '<a href="#" id="' + infoAdd + '" class="addone" onclick="S.his.addone(this)" data-collect="true" data-collect-flag="index-add" data-collect-desc="夺宝纪录-追加">追加</a>';
                    }else{
                        infoData += '<a href="#" id="' + infoAdd + '" style="background-color: #aaaaaa" class="addone">抢完</a>';
                    }
                    infoData += '<p>' + "已参与："+infoNumbernow + '</p>';
                    infoData += '<h5>本期参与：' + infoJoinnumb + '人次<a href="#" id="' + infoClass + '" nm="' + infoLabel + '" tm="' + infoJoinnumb + '" class="chkmynumb" data-collect="true" data-collect-flag="index-chkphone" data-collect-desc="夺宝纪录-查看我的号码">查看我的号码</a></h5>';
                    infoData += '</div>';
                    infoData += '</div>';
                    S.his.el.hisWhole = $(".his-whole");
                    S.his.el.hisContinue = $(".his-continue");
                    //if(S.his.el.hisWhole.children().length==0){
                    //    S.his.el.hisWhole.append(infoData.toString());
                    //}else{
                    //    S.his.el.hisWhole.children().first().before(infoData.toString());
                    //}
                    S.his.el.hisWhole.find(".his-body").append(infoData.toString());

                    if(infoStats == 1){
                        //if(S.his.el.hisContinue.children().length==0){
                        //    S.his.el.hisContinue.append(infoData.toString());
                        //}else{
                        //    S.his.el.hisContinue.children().first().before(infoData.toString());
                        //}
                        S.his.el.hisContinue.find(".his-body").append(infoData.toString());
                    }
                    var per = infoNumbernow / infoNumberall;
                    if(per<0){per=0}
                    $("."+infoAdd).css("width",(per*100) +"%");
                    var thisLabel = $("."+infoAdd).parent().parent();
                    //console.log(thisLabel.find("div").html());
                    thisLabel.css("height",(thisLabel.find("div").height() + 70) + "px");
                    thisLabel.parent().css("height",(thisLabel.find("div").height() + 70) + "px");
                    thisLabel.parent().find("img").css("top",((thisLabel.find("div").height() -12)* 0.5 )  + "px");
                    if(S.his.el.hisContinue.find(".his-body").height()>($(window).height()*0.91)){
                        if(S.his.el.isInscl == false){
                            S.his.el.isInscl = true;
                            S.his.el.noMore.html("上拉加载更多");
                        }
                        S.his.el.hisContinue.scroll(function () {
                            if(S.his.el.isAllrev == false){
                                S.his.loadmore(S.his.el.hisContinue);
                            }
                        });
                    }
                }else{
                    var infoWinner = data.item[i].nk;
                    if(infoWinner==undefined){infoWinner="匿名"}
                    var infoLucknumb = data.item[i].pw;
                    var infoLuckdate = data.item[i].ltime;
                    infoData += '<div class="his-label isover">';
                    infoData += '<img class="hisImg" src="' + infoImg + '" onload="S.his.resize(this)" onerror="$(this).attr(\'src\',\'../../images/goods-snone.png\')" idflag="' + infoAdd + '" />';
                    infoData += '<div class="his-label-r">';
                    infoData += '<div><h2 class="red">' + infoWhitch + '</h2>' + infoLabel + '</div>';
                    infoData += '<p>' + "总需："+infoNumberall + '</p>';
                    if(infoLucknumb == undefined){
                        infoData += '<p style="text-align: center">商品未开奖,您参与所消费的元宝</p>';
                        infoData += '<p style="text-align: center">已退回余额,请到个人中心查询</p>';
                    }else{
                        infoData += '<p class="tt"><span style="display: none" class="' + infoAdd + '"></span><span class="tt-out">获奖者：</span><span class="tt-in">' + infoWinner + '(本期共参与' + infoWjoinnumb + '人次)</span></p>';
                        infoData += '<p>幸运号码：' + infoLucknumb + '</p>';
                        infoData += '<p>揭晓时间：' + infoLuckdate + '</p>';
                    }
                    infoData += '<h5>本期参与：' + infoJoinnumb + '人次<a href="#" id="' + infoClass + '" class="chkmynumb ' + infoAdd + '" nm="' + infoLabel + '" tm="' + infoJoinnumb + '" data-collect="true" data-collect-flag="index-chkphone" data-collect-desc="夺宝纪录-查看我的号码">查看我的号码</a></h5>';
                    infoData += '</div>';
                    infoData += '</div>';
                    S.his.el.hisWhole = $(".his-whole");
                    S.his.el.hisIsover = $(".his-isover");
                    //if(S.his.el.hisWhole.children().length==0){
                    //    S.his.el.hisWhole.append(infoData.toString());
                    //}else{
                    //    S.his.el.hisWhole.children().first().before(infoData.toString());
                    //}
                    S.his.el.hisWhole.find(".his-body").append(infoData.toString());
                    //if(S.his.el.hisIsover.children().length==0){
                    //    S.his.el.hisIsover.append(infoData.toString());
                    //}else{
                    //    S.his.el.hisIsover.children().first().before(infoData.toString());
                    //}
                    S.his.el.hisIsover.find(".his-body").append(infoData.toString());
                    var thisLabel = $("."+infoAdd).parent().parent();
                    //console.log(thisLabel.find("div").html());
                    thisLabel.css("height",(thisLabel.find("div").height()+thisLabel.find(".tt-in").height() + 70) + "px");
                    thisLabel.parent().css("height",(thisLabel.find("div").height()+thisLabel.find(".tt-in").height() + 70) + "px");
                    thisLabel.parent().find("img").css("top",((thisLabel.find("div").height()+thisLabel.find(".tt-in").height() -12)* 0.5 )  + "px");
                    if(S.his.el.hisIsover.find(".his-body").height()>($(window).height()*0.91)){
                        S.his.el.hisIsover.scroll(function () {
                            if(S.his.el.isAllrev == false){
                                S.his.loadmore(S.his.el.hisIsover);
                            }
                        });
                    }
                }
            }else{
                if(chkinfo == Rid){
                    var secInfo = "";
                    secInfo += '<div class="out-name">' + infoLabel + '</div>';
                    secInfo += '<span>参与<span class="out-red">' + infoJoinnumb + '</span>人次，夺宝号码：</span>';
                    secInfo += '<div class="out-numb"><span>' + infoClass.replace(/,/g, "</span><span>") + '</span></div>';
                    S.his.el.secHead.html(secInfo);
                    var secHeight = S.his.el.secHead.height();
                    if((secHeight + $(".btn-cls").height()) > (S.his.el.winH * 0.8)){
                        $(".out-numb").css("height",((S.his.el.winH * 0.8) - $(".out-name").height() - 70)+"px");
                        S.his.el.outsec.css({
                            "height":((S.his.el.winH * 0.8)+20)+"px",
                            "top":(S.his.el.winH - ((S.his.el.winH * 0.8)+20)) * 0.5,
                            "overflow":"hidden"
                        });
                        S.his.el.section.css("overflow","hidden");
                    }else{
                        //$(".out-numb").css("height",((S.his.el.winH * 0.8) - $(".out-name").height() - 70)+"px");
                        S.his.el.outsec.css({
                            "height":($(".sec-head").height()+60)+"px",
                            "top":(S.his.el.winH - ($(".sec-head").height()+60)) * 0.5,
                            "overflow":"hidden"
                        });
                        S.his.el.section.css("overflow","hidden");
                    }
                }
            }
        }
        S.his.el.chkmyNumb = $(".chkmynumb");
        S.his.el.hisImg = $(".hisImg");
        $(".his-label-r").css("width", (S.his.el.winW - 102) + "px");
        S.his.even();
    },
    resize: function (self) {
        var thisLabel = $(self).parent().find('.his-label-r');
        thisLabel.css("height",(thisLabel.find("div").height()+thisLabel.find(".tt-in").height() + 70) + "px");
        thisLabel.parent().css("height",(thisLabel.find("div").height()+thisLabel.find(".tt-in").height() + 70) + "px");
        thisLabel.parent().find("img").css("top",((thisLabel.find("div").height()+thisLabel.find(".tt-in").height() -12)* 0.5 )  + "px");
    }
};

function indianaPeriodMyJoinPeriodCallBackHandler(data){
    hideLoading();
    if(data.result == true){
        S.his.el.page++;
        //S.his.el.allInfo = data;
        S.his.info(data);
        if(data.item.length<10){
            S.his.el.noMore.html("已经没有更多");
            S.his.el.isAsk = true;
        }else{
            S.his.el.isAsk = false;
        }
    }else{
        S.his.el.isAllrev = true;
        if(S.his.el.page > 1){
            S.his.el.noMore.html("已经没有更多");
        }else{
            S.his.el.noMore.css({"height":"80px","line-height":"30px","margin-top":"20px"}).html("你还没有参与过夺宝哦，<br/>只需一元即有机会获得大奖哦，赶紧参与吧");
            S.his.el.swiperSlide.append('<a href="#" class="toindex click-btn" data-collect="true" data-collect-flag="his-toindex" data-collect-desc="夺宝纪录-去首页">立即夺宝</a>');
            $(".toindex").one("click", function () {
                toUrl("../../index.html");
            })
        }
    }
}