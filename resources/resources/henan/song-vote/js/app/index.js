(function($){
    H.index = {
        repeat_load: true,//用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环；
        periodUuid: null, //每期uuid
        nowTime: null,
        init: function(){
            this.event();
            this.getVoteinfo();
        },
        event: function(){
            $('ul').delegate('a div.vote-btn', 'click', function(e) {
                e.preventDefault();
                var $this = $(this);

                if ($(this).hasClass('disabled')) {
                    return;
                }

                var guid = $this.closest('li').attr('data-guid'),
                    pluids = $this.closest('li').attr('data-pid');
                $.ajax({
                    type: 'GET',
                    async: false,
                    url: domain_url + 'api/voteguess/guessplayer' + dev,
                    data: {
                        yoi: openid,
                        guid: guid,
                        pluids: pluids
                    },
                    dataType: "jsonp",
                    jsonpCallback: 'callbackVoteguessGuessHandler',
                    complete: function() {
                    },
                    success: function(data) {
                        if(data.code == 0){
                            var $num = $("#num-"+pluids);
                            var $numText = $("#num-"+pluids).text();
                            $num.text((parseInt($numText.substring(0,$numText.length-1))+1)+"票");
                            $this.addClass('disabled');
                            $("#isVote-"+pluids).removeClass("visibility");
                            showTips("投票成功");
                        }
                    },
                    error: function(xmlHttpRequest, error) {}
                });
            });
        },
        tpl: function(data){
            var me = this,
                t = simpleTpl(),
                attrs = data.items || [];
            me.periodUuid = data.pid; //期uuid

            $.each(attrs, function(i, item){
                var pid = item.pitems[0].pid, //选手uuid
                    guid = item.guid; //组uuid

                t._('<li data-periodUuid="'+ me.periodUuid +'" data-guid="'+ guid +'" data-pid="'+ pid +'">')
                    ._('<label>'+ item.pitems[0].na +'</label>')
                    ._('<p class="visibility" id="isVote-'+ pid +'">(已投)</p>')
                    ._('<span id="num-'+ pid +'">0票</span>')
                    ._('<a href="#"><div class="disabled vote-btn" id="vote-'+ pid +'" data-collect="true" data-collect-flag="index-vote-'+i+'" data-collect-desc="'+ item.pitems[0].na +'投票">投 票</div></a>')
                ._('</li>')
            });
            $('ul').append(t.toString());
            me.allplayertickets();
            me.getVoteAll();
            me.currentPrizeAct(data);
        },
        getVoteinfo: function(){
            getResult('api/voteguess/inforoud', {}, 'callbackVoteguessInfoHandler', true);
        },
        //获取该期所有选手累积的票数
        allplayertickets: function(){
            getResult('api/voteguess/allplayertickets', {periodUuid: H.index.periodUuid}, 'callbackVoteguessAllplayerticketsHandler');
        },
        //该期某组竞猜记录
        getVoteAll: function() {
            var me = H.vote;
            getResult('api/voteguess/isvoteall', { yoi: openid}, 'callbackVoteguessIsvoteAllHandler');
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var me = this,
                nowTimeStr = this.nowTime,
                prizeActList = data.items,
                prizeLength = 0,
                $voteBtn = $(".vote-btn");

            me.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeActList.length > 0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].get,nowTimeStr) >= 0){
                    $voteBtn.addClass("disabled");
                    return;
                }
                //如果第一轮未开始
                if(comptime(prizeActList[0].gst,nowTimeStr) < 0){
                    $voteBtn.addClass("disabled");
                    return;
                }

                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].gst;
                    var endTimeStr = prizeActList[i].get;
                    me.index = i;
                    hidenewLoading();
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr, beginTimeStr) <= 0 && comptime(nowTimeStr, endTimeStr) >= 0){
                        $("#vote-"+ prizeActList[i].pitems[0].pid).removeClass("disabled");
                    }
                    if(comptime(nowTimeStr, beginTimeStr) > 0){
                        $("#vote-"+ prizeActList[i].pitems[0].pid).addClass("disabled");
                    }
                }
            }
        }
    };
    W.callbackVoteguessInfoHandler = function(data){
        // 测试
        // data = testData;
        var me = H.index;
        if(data.code == 0){
            me.nowTime = timeTransform(parseInt(data.cud));
            console.log(me.nowTime);
            me.tpl(data);
        }
    };

    W.callbackVoteguessAllplayerticketsHandler = function (data) {
        // 测试
        // data = testNumData;
        if(data.code == 0){
            var attrs = data.items;
            $.each(attrs, function(i, item){
                $("#num-"+ item.puid).text(item.cunt+"票");
            });
        }
    };

    W.callbackVoteguessIsvoteAllHandler = function (data) {
        // 测试
        // data = isVoteData;
        if(data.code == 0){
            var attrs = data.items;
            $.each(attrs, function(i, item){
                $("#vote-"+ item.so).addClass("disabled");
                $("#isVote-"+ item.so).removeClass("visibility");
            });
        }
    };

})(Zepto);
$(function(){
    H.index.init();
    H.jssdk.init();
});


var testData = {
    "code": 0,
    "cud": "1452825000000", //2016-01-15 10:30:00
    "pid": "51a92870c9214b00a179ce36688e5a6d",
    "items": [
        {
            "t": "第一组",
            "guid": "b288607e601b48fcb2b965623c93fb0d",
            "hlo": 0,
            "gst": "2016-01-15 10:20:10",
            "get": "2016-01-15 10:30:20",
            "pitems": [
                {
                    "pid": "1",
                    "na": "1歌手——徐良(名称)"
                }
            ]
        },
        {
            "t": "第二组",
            "guid": "f960fd1379374dff856e3d0257f475e3",
            "hlo": 0,
            "gst": "2016-01-15 10:10:30",
            "get": "2016-01-15 10:30:40",
            "pitems": [
                {
                    "pid": "2",
                    "na": "2歌手——徐良(名称)"
                }
            ]
        },
        {
            "t": "第三组",
            "guid": "b41c12102fcd41148001d93ff38ee225",
            "hlo": 0,
            "gst": "2016-01-15 10:30:50",
            "get": "2016-01-15 10:31:00",
            "pitems": [
                {
                    "pid": "3",
                    "na": "3歌手——徐良(名称)"
                }
            ]
        },
        {
            "t": "第四组",
            "guid": "4",
            "hlo": 0,
            "gst": "2016-01-15 10:10:10",
            "get": "2016-01-15 10:31:20",
            "pitems": [
                {
                    "pid": "4",
                    "na": "4歌手——徐良(名称)"
                }
            ]
        }
    ]
};


var testNumData = {
    "code": 0,
        "items": [
        {
            "puid": "1",
            "name": "1歌手——徐良(名称)",
            "img1": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/zhima/images/2017118/eb152a82e10c4befbd43bd4bb1034540.png",
            "cunt": 123123
        },
        {
            "puid": "2",
            "name": "2歌手——徐良(名称)",
            "img1": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/zhima/images/2017118/6f9ee5acdeda4b419595d9ffd437ef92.png",
            "cunt": 123123
        },
        {
            "puid": "3",
            "name": "3歌手——徐良(名称)",
            "img1": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/zhima/images/2017118/eb152a82e10c4befbd43bd4bb1034540.png",
            "cunt": 123123
        },
        {
            "puid": "4",
            "name": "4歌手——徐良(名称)",
            "img1": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/zhima/images/2017118/6f9ee5acdeda4b419595d9ffd437ef92.png",
            "cunt": 123123
        }
    ]
};

var isVoteData = {
    "code": 0,
    "items": [
        {
            "guid": "34784088f71c41fa945f0bd49173ff63",
            "so": "1"
        },
        {
            "guid": "bf58611507364c4d9b267bdcf329be5d",
            "so": "2"
        }
    ]
};