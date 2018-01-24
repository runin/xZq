(function($){
    H.answer = {
        $confirm: $("#confirm"),
        repeat_load: true,//用来判断是否重复调用轮次接口， 默认为true, 重复调用一次后改为false;避免死循环
        repeatCheck: true,
        tid: '',
        quid: '',
        qitemsList: [],
        yesAuid: '',
        noAuid: '',
        init: function(){
            this.event();
            this.current_time();
            var height = $(window).height(), width = $(window).width();
            $('body').css({
                'width': width,
                'height': height
            });
        },
        allrecord: function(){
            getResult("api/question/allrecord",{yoi: openid, tid: H.answer.tid},'callbackQuestionAllRecordHandler',true);
        },
        btn_animate: function(str,calback){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        },
        event: function(){
            var me = H.answer;
            $("body").delegate('.yes', 'click', function(e) {
                e.preventDefault();
                me.btn_animate($(this));

                if(!$(this).hasClass("flag-d")){
                    $(this).addClass("flag-d");
                    getResult("api/question/answer",{
                        yoi: openid,
                        suid: me.quid,
                        auid: me.yesAuid
                    },'callbackQuestionAnswerHandler',true);
                }
            });
            $("body").delegate('.no', 'click', function(e) {
                e.preventDefault();
                me.btn_animate($(this));

                if(!$(this).hasClass("flag-d")){
                    $(this).addClass("flag-d");
                    getResult("api/question/answer",{
                        yoi: openid,
                        suid: me.quid,
                        auid: me.noAuid
                    },'callbackQuestionAnswerHandler',true);
                }
            });
        },
        //查询题目信息
        current_time: function(){
            var me = H.answer;
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/question/round' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackQuestionRoundHandler',
                timeout: 11000,
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    if(data.code == 0){
                        me.tid = data.tid;
                        me.qitemsList = data.qitems;
                        me.allrecord();
                    }else{
                        if(me.repeat_load){
                            me.repeat_load = false;
                            setTimeout(function(){
                                me.current_time();
                            },500);
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {}
            });
        },
        questionMath: function(allRecordData) {//随机题目
            var me = H.answer;
            if(me.qitemsList.length >0){
                if(allRecordData.length >0){
                    var alength = me.qitemsList.length;
                    for(var i = 0; i < alength; i++){
                        for(var j = 0,length = allRecordData.length; j < length; j++){
                            if(me.qitemsList[i].quid == allRecordData[j].quid){
                                me.qitemsList.splice(i,1);
                                i--;
                                alength --;
                                break;
                            }
                        }
                    }
                }

                var i = Math.floor((Math.random()*me.qitemsList.length));
                me.spellQuestion(me.qitemsList[i], i);
            }
        },
        spellQuestion: function(qitems, index){
            var me = H.answer; t = simpleTpl();
            me.quid = qitems.quid;
            t._('<dt data-quid="'+ qitems.quid +'">'+ qitems.qt +'</dt>');
                $.each(qitems.aitems, function(i,aitem){
                    t._('<dd data-auid="'+ aitem.auid +'" class="none">'+ aitem.at +'</dd>');
                });
            $('dl').html(t.toString());
            me.yesAuid = qitems.aitems[0].auid;
            me.noAuid = qitems.aitems[1].auid;
            $(".dt-btn").removeClass("none");
        },
        drawlottery: function(){
            var me = H.answer;
            var sn = new Date().getTime()+'';
            recordUserOperate(openid, "调用投票抽奖接口", "doVoteLottery");
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/luck4Vote' + dev,
                data: {
                    oi: openid,
                    sn: sn
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuck4VoteHandler',
                timeout: 11000,
                complete: function() {
                    sn = new Date().getTime()+'';
                },
                success : function(data) {
                    if(data && data.result){
                        if(data.sn == sn){
                            H.dialog.redLottery.open(data);
                        }else{
                            H.dialog.thanks.open(1);
                        }
                    }else{
                        H.dialog.thanks.open(1);
                    }
                },
                error : function(xmlHttpRequest, error) {}
            });
        }
    };
    W.callbackQuestionAnswerHandler = function (data){
        var me = H.answer;
        if (data.code == 0) {
            if(data.rs == 1){//答错题
                H.dialog.error.open();
            }else if(data.rs == 2){//答对题
                me.drawlottery();
            }
            //toUrl("yao.html");
            me.$confirm.addClass('disabled').text("亲，您已经答过题了");
        }
    };
    W.callbackQuestionAllRecordHandler = function(data){
        var me = H.answer;
        if(data.code == 0){
            me.questionMath(data.items);
        }
    }
})(Zepto);