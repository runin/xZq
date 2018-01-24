(function($) {
	H.index = {
        resultList: new Array(),
        alreadyList: new Array(),
        beforeItem: null,
        isLottery: false, // 当前是否在抽奖时间段内 true 是，false 否
        recordRange: null, // 展示的中奖记录时间区间
        isShow: false, // 是否直接展示中奖记录 true 是，false 否
        localru: localStorage.getItem("ru"),
        ru: '',
        nextBeginTime: null,
		init: function() {
			var me = this, winW = $(window).width(), winH = $(window).height();
			$('body').css({
				'width': winW,
				'height': winH
			});
            me.initRound();
            me.spell();
		},
        spell: function () {
            var me = this;
            setInterval(function(){
                $(".item").addClass("zoomOutUp");
                    var time = getRandomArbitrary(800,1200);
                    setTimeout(function(){
                        $(".single").empty();
                        if(me.beforeItem){
                            me.spellToLine(me.beforeItem);
                            me.beforeItem = null;
                        }
                        if(me.resultList.length == 0){
                            return;
                        }

                        var item = me.resultList.shift();
                        var singleT = new simpleTpl(),
                            hi = item.hi ? item.hi + "/0" : "/images/head.jpg",
                            ni = item.ni ? item.ni : "匿名用户",
                            cls = '';
                        if(item.pn.indexOf("二等奖") >= 0){
                            cls = 'second';
                        }else if(item.pn.indexOf("三等奖") >= 0){
                            cls = 'third';
                        }
                        var h = $(window).height * 0.24;
                        singleT._('<div class="item '+cls+'" style="height: '+h+'px">')
                            ._('<img src="'+hi+'">')
                            ._('<p>'+ni+'</p>')
                            ._('</div>');
                        $(".single").append(singleT.toString());
                        me.beforeItem = item;
                    },time);
            },4000);
        },
        initRound: function(){
            var me = this;
            getResult("api/lottery/round",{},"callbackLotteryRoundHandler");
        },
        initList: function(){
            var me = this;
            getResult("api/lottery/allrecord",{ol:1},"callbackLotteryAllRecordHandler");
        },
        spellToLine: function (record) {
                var t = new simpleTpl(),
                    hi = record.hi ? record.hi + "/0" : "/images/head.jpg",
                    ni = record.ni ? record.ni : "匿名用户",
                    me = this;
                t._('<div>')
                    ._('<img src="'+hi+'">')
                    ._('<p>'+ni+'</p>')
                    ._('</div>');
                if(record.pn.indexOf("一等奖") >= 0){
                    $(".line1").append(t.toString());
                }else if(record.pn.indexOf("二等奖") >= 0){
                    $(".line2").append(t.toString());
                }else if(record.pn.indexOf("三等奖") >= 0){
                    $(".line3").append(t.toString());
                }
        },
        count10: function () {
            var me = this;
            setInterval(function () {
                var next = timestamp(me.nextBeginTime);
                if(next - new Date().getTime() < 10*60*1000){
                    location.reload(true);
                }

            },5000);
        }
	};
    W.callbackLotteryRoundHandler = function (data) {
        var me = H.index;
        if(data.result){
            var nowTimeStr = timeTransform(data.sctm),
                prizeActList = data.la,
                prizeLength = prizeActList.length;
            //如果最后一轮结束
            if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                //展示最后一轮中奖记录
                me.isShow = true;
                me.recordRange = {
                    "st": prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].st,
                    "et": prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et
                };
                me.initList();
                return;
            }
            for ( var i = 0; i < prizeActList.length; i++) {
                var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                //在活动时间段内且可以抽奖
                if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                    // 展示当前时间段内的中奖记录
                    me.recordRange = {
                        "st": beginTimeStr,
                        "et": endTimeStr
                    };
                    setInterval(function () {
                        me.initList();
                    },4000);
                    if( i < prizeActList.length - 1){
                        me.nextBeginTime = prizeActList[i+1].pd+" "+prizeActList[i+1].st;
                        me.count10();
                    }
                    return;
                }
                // 据下次摇奖开始
                if(comptime(nowTimeStr,beginTimeStr) > 0){
                    var dec = timestamp(beginTimeStr) - timestamp(nowTimeStr);
                    if(dec < 10*60*1000){
                        //距下轮不满10分钟,等待下一轮中奖记录
                        me.recordRange = {
                            "st": beginTimeStr,
                            "et": endTimeStr
                        };
                        setInterval(function () {
                            me.initList();
                        },4000);
                        return;
                    }else{
                        // 距下轮满10分钟
                        if(i == 0){
                            //如果是第一轮,等待第一轮中奖记录
                            me.recordRange = {
                                "st": beginTimeStr,
                                "et": endTimeStr
                            };
                            setInterval(function () {
                                me.initList();
                            },4000);
                            if( i < prizeActList.length){
                                me.nextBeginTime = prizeActList[i].pd+" "+prizeActList[i].st;
                                me.count10();
                            }
                            return;
                        }else{
                            me.isShow = true;
                            me.recordRange = {
                                "st": prizeActList[i-1].pd+" "+prizeActList[i-1].st,
                                "et": prizeActList[i-1].pd+" "+prizeActList[i-1].et
                            };
                            me.initList();
                            if( i < prizeActList.length){
                                me.nextBeginTime = prizeActList[i].pd+" "+prizeActList[i].st;
                                me.count10();
                            }
                            return;
                            // 展示上一轮中奖记录
                        }
                    }
                }
            }
        }
    };
    W.callbackLotteryAllRecordHandler = function(data){
        if(data.result){
            var rl = data.rl;
            if(rl && rl.length > 0){
                for (var i = 0; i < rl.length; i ++){
                    var item = rl[i];
                    var beginTimeStr = H.index.recordRange.st, endTimeStr = H.index.recordRange.et;
                    if(comptime(item.lt,beginTimeStr) <0 && comptime(item.lt,endTimeStr) >=0){
                        // 在时间范围内
                        if(H.index.isShow){
                            // 是否直接展示
                            H.index.spellToLine(item);
                        }else{
                            if(H.index.ru.indexOf(item.ud) < 0){
                                H.index.resultList.push(item);
                                H.index.ru += item.ud+",";
                            }
                        }
                    }
                }
            }
        }
    }
})(Zepto);

$(function() {
	H.index.init();
});