(function($){
    H.index = {
        index: 0,
        type: 2,
        isTimeOver: false,
        pal: null,
        $lotteryCountdown: $("#lottery-countdown"),
        init: function(){
            this.event();
            this.programlis();
        },
        event: function(){
            var me = this,$recommend = $("#recommend"),
                $programlist = $("#programlist");

            var flag = true;
            $("#tj").tap(function(e){
                e.preventDefault();
                $(this).parent().removeClass('program');
                $programlist.addClass("none");
                $recommend.removeClass("none");
                me.linesdiy();
            });

            $("#list").tap(function(e){
                e.preventDefault();
                $(this).parent().addClass('program');
                $recommend.addClass("none");
                $programlist.removeClass("none");


            });
        },
        swiperInit: function(){
            var swiper = new Swiper('.swiper-container', {
                paginationClickable: '.swiper-pagination',
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                spaceBetween: 30,
                loop : true,
                autoplay : 3000
            });
        },
        programlis: function () {
            getResult("api/programlist/whole",{},'callbackProgramListHandler',true);
        }
        ,
        linesdiy: function () {
            getResult("api/linesdiy/info",{},'callbackLinesDiyInfoHandler',true);
        },
        swiperTpl: function (data) {
            var t = simpleTpl();
            $.each(data, function(i, item){
                t._('<div class="swiper-slide">')
                    ._('<img src="'+ item.ib +'" />')
                    ._('<div class="desc none"><label>'+ item.t +'</label><div>'+ item.info +'</div></div>')
                ._('</div>');
            });
            $(".swiper-wrapper").append(t.toString());
            $(".outer").removeClass('none');
            this.swiperInit();
        },
        programlistTpl: function (data) {
            var t = simpleTpl();
            $.each(data, function(i, item){
                t._('<li id="'+ item.ud +'">')
                    ._('<div>'+ item.nm +'</div>')
                    ._('<div><label class="none">'+ item.bt.slice(0,5) +'</label><span class="current none">正在播出</span></div>')
                ._('</li>');
            });
            $("ul").append(t.toString());
            this.currentPrizeAct(data);
            this.scroller();
        },
        scroller: function(){
            var target = document.querySelector("#scroller");
            //给element注入transform属性
            Transform(target,true);

            var at = new AlloyTouch({
                touch: "#wrapper", //反馈触摸的dom
                vertical: true, //不必需，默认是true代表监听竖直方向touch
                target: target, //运动的对象
                property: "translateY", //被滚动的属性
                sensitivity: 1, //不必需,触摸区域的灵敏度，默认值为1，可以为负数
                factor: 1, //不必需,默认值是1代表touch区域的1px的对应target.y的1
                min: window.innerHeight - $("#scroller").height()-380, //不必需,滚动属性的最小值
                max: 0, //不必需,滚动属性的最大值
                step: 45, //不必需，用于校正到step的整数倍
                spring: true, //不必需,是否有回弹效果。默认是true
                inertia: true, //不必需,是否有惯性。默认是true
                topDis: '0',
                bottomDis: '0',
                bottomMax: '200',
                animationEnd: function (value) {
                    //console.log(value);
                    console.log(window.innerHeight);
                    console.log($("#scroller").height());
                },
                pressMove: function (evt,value) {
                    //console.log(evt.deltaX + "_" + evt.deltaY + "__" + value);
                }
            });

            document.addEventListener("touchmove", function (evt) {
                evt.preventDefault();
            }, false);
        },
        currentPrizeAct: function(data){
            var me = this,
                nowTimeStr = timeTransform(new Date().getTime()),
                // nowTimeStr = timeTransform(1452825000000),//2016-01-15 10:30:00
                prizeLength = data.length;
            me.pal = data;
            if(prizeLength> 0){
                //如果最后一轮结束
                if(comptime(data[prizeLength-1].pt + " " + data[prizeLength-1].et,nowTimeStr) >= 0){
                    me.type = 3;
                    me.endType = 3;
                    me.change();
                    return;
                }

                //如果第一轮未开始
                if(comptime(data[0].pt + " " + data[0].bt,nowTimeStr) < 0){
                    me.beforeCountdown(data[0]);
                    return;
                }

                for ( var i = 0; i < prizeLength; i++) {
                    var beginTimeStr = data[i].pt + " " + data[i].bt;
                    var endTimeStr = data[i].pt + " " + data[i].et;
                    me.index = i;
                    hidenewLoading();
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr, beginTimeStr) <= 0 && comptime(nowTimeStr, endTimeStr) >= 0){
                        if(i < prizeLength - 1){
                            var nextBeginTimeStr = data[i + 1].pt + " " + data[i + 1].bt;
                            if(comptime(endTimeStr, nextBeginTimeStr) <= 0){
                                me.endType = 2;
                                // 有下一轮并且  下一轮的开始时间和本轮的结束时间重合
                            } else {
                                // 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
                                me.endType = 1;
                            }
                        }else{
                            // 当前为最后一轮，没有下一轮，倒计时结束之后直接跳转
                            me.endType = 3;
                        }
                        me.nowCountdown(data[i]);
                        return;
                    }
                    if(comptime(nowTimeStr, beginTimeStr) > 0){
                        me.beforeCountdown(data[i]);
                        return;
                    }
                }
            }
        },
        // 摇奖开启倒计时
        beforeCountdown: function(prizeActList) {
            var me = this;
            me.type = 1;
            var beginTimeStr = prizeActList.pt+" "+prizeActList.bt;
            var beginTimeLong = timestamp(beginTimeStr);
            me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty();
            me.$lotteryCountdown.find(".countdown-tip").html('距离摇奖开始还有');
            me.count_down();
            me.$lotteryCountdown.removeClass('none');
            hidenewLoading();
            $("ul li span").addClass("none");
            $("ul li label").removeClass("none");
        },
        // 摇奖结束倒计时
        nowCountdown: function(prizeActList){
            var me = this;
            me.type = 2;
            var endTimeStr = prizeActList.pt+" "+prizeActList.et;
            var beginTimeLong = timestamp(endTimeStr);
            me.$lotteryCountdown.find('.detail-countdown').attr('etime',beginTimeLong).empty();
            me.$lotteryCountdown.find(".countdown-tip").html("距摇奖结束还有");
            me.count_down();
            me.$lotteryCountdown.removeClass('none');
            me.index++;
            hidenewLoading();
            $("ul li span").addClass("none");
            $("ul li label").removeClass("none");

            $("#"+prizeActList.ud).find("li label").addClass("none");
            $("#"+prizeActList.ud).find("li span").removeClass("none");
        },
        change: function() {
            var me = H.index;
            me.$lotteryCountdown.removeClass('none').find(".countdown-tip").html('本期摇奖已结束，下期再战！');
            $("ul li span").addClass("none");
            $("ul li label").removeClass("none");
            hidenewLoading();
        },
        count_down: function() {
            var me = this;
            me.$lotteryCountdown.find('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl: '<span class="fetal-H">%H%' + '</span><label>时</label><span class="fetal-H">' + '%M%' + '</span>分<span class="fetal-H">' + '%S%' + '</span>秒', // 还有...结束
                    stpl: '<span class="fetal-H">%H%' + '</span><label>时</label><span class="fetal-H">' + '%M%' + '</span>分<span class="fetal-H">' + '%S%' + '</span>秒', // 还有...开始
                    sdtpl: '',
                    otpl: '',
                    otCallback: function() {
                                if(me.type == 1){
                                    //距摇奖开始倒计时结束后显示距离下轮摇奖结束倒计时
                                    if(!me.isTimeOver){
                                        me.isTimeOver = true;
                                        me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
                                        shownewLoading(null,'请稍后...');
                                        setTimeout(function() {
                                            me.nowCountdown(me.pal[me.index]);
                                        }, 1000);
                                    }
                                }else if(me.type == 2){
                                    //距摇奖结束倒计时倒计时后显示距离下轮摇奖开始倒计时
                                    if(!me.isTimeOver){
                                        me.isTimeOver = true;
                                        if(me.index >= me.pal.length){
                                            me.type = 3;
                                            me.change();
                                            return;
                                        }
                                        me.$lotteryCountdown.find('.countdown-tip').html('请稍后');
                                        shownewLoading(null,'请稍后...');
                                        var i = me.index - 1;
                                        if(i < me.pal.length - 1){
                                            var endTimeStr = me.pal[i].pt + " " + me.pal[i].et;
                                            var nextBeginTimeStr = me.pal[i + 1].pt + " " + me.pal[i + 1].bt;
                                            if(comptime(endTimeStr,nextBeginTimeStr) <= 0){
                                                // 有下一轮并且下一轮的开始时间和本轮的结束时间重合
                                                me.endType = 2;
                                            } else {
                                                // 有下一轮并且下一轮的开始时间和本轮的结束时间不重合
                                                me.endType = 1;
                                            }
                                        }
                                        setTimeout(function(){
                                            if(me.endType == 2){
                                                me.nowCountdown(me.pal[me.index]);
                                            }else if(me.endType == 1){
                                                me.beforeCountdown(me.pal[me.index]);
                                            } else {
                                                me.change();
                                            }
                                        },1000);
                                    }
                                }
                    },
                    sdCallback: function(){
                        me.isTimeOver = false;
                    }
                });
            });
        }
    };
    W.callbackLinesDiyInfoHandler = function(data){
        if(data.code == 0){
            H.index.swiperTpl(data.gitems);
        }
    };
    W.callbackProgramListHandler = function(data){
        var me = H.index;
        if(data.code == 0){
            me.programlistTpl(data.items);
        }
    }
})(Zepto);
$(function(){
    H.index.init();
    H.jssdk.init();
});