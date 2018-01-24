/**
 * 明星同乐会-答题页
 */
(function(){
    H.answer = {
        $nav_item: $('.nav a'),
        $list: $('.detail-list'),
        $btnCmt: $('#btn-comment'),
        $inputCmt: $('#input-comment'),
        $guess_img: $('#guess-img'),
        $article: $('#article'),
        $count_down: $("#count-down"),
        $btnRank: $('.ranking'),
        wan: 0,
        REQUEST_CLS: 'requesting',
        actuid: 0,
        checkedParams:[],
        quesData : '',
        now_time : null,
        curr_index : 0,
        dc : '',//积分排行榜顶部文案
        init: function(){
            this.audio();
            this.event();
            H.utils.resize();
            this.get_index();
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler',true);
        },
        get_index: function(){
            getResult("reunion/index/" + openid, 'reunionIndexHandler',true);
            /*this.checkActivity(data_test);*/
        },
        event: function(){
            var me = this;
            this.$nav_item.click(function(e) {
                e.preventDefault();

                var index = me.$nav_item.index($(this));
                me.$nav_item.removeClass('curr');
                $(this).addClass('curr');
                me.$list.find('li').css({
                    'opacity': 0,
                    'height': 0
                }).eq(index).css({
                    'opacity': 1,
                    'height': 'auto'
                });

                if($(this).attr('id') == 'guess-a'){
                    me.isShow('header', false);
                    /*if($('xq').css('opacity') == 0){
                        me.isShow('.wrapper .jifen-btn', true);
                    }*/
                }else{
                    H.comment.init();
                    me.isShow('header', true);
                   /* me.isShow('.wrapper .jifen-btn', false);*/
                }
            });

            this.$guess_img.delegate('dd', 'click',function(e) {
                e.preventDefault();

                if($(this).parent().parent().hasClass(me.REQUEST_CLS)){
                    alert('拼命加载中....');
                    return;
                }

                var $span = $(this).parent().siblings('div').find('span'),
                    $dd = me.$guess_img.find('dd');
                    dd_len = $dd.size();
                    len = $span.length;

                if(me.wan < len && Boolean($(this).text())){
                    me.isShow('.error', false);
                    for(var i = 0; i < len; i++){
                        if(!Boolean($span.eq(i).text())){
                            $span.eq(i).text($(this).text()).attr("id",$(this).attr('data-au')).removeClass('select').addClass('selected');
                            $(this).text('');
                            me.wan++;
                            if(len == me.wan){
                                setTimeout(function(){
                                    var inRight = 0, isError = false;
                                    for(var j = 0; j < len; j++){
                                        var span_index = $span.eq(j);
                                        if(span_index.attr('data-au') != span_index.attr('id')){
                                            me.isShow('.error', true);
                                            isError = true;
                                            console.log('你答错了。请从新输入');
                                        }else{
                                            inRight ++;
                                        }

                                        if(isError){
                                            for(var n = 0; n < len; n++){
                                                var span_n = $span.eq(n);
                                                for(var m = 0; m < dd_len; m++){
                                                    if(span_n.attr('id') == $dd.eq(m).attr('id')){
                                                        $dd.eq(m).text(span_n.text());
                                                        span_n.text('').attr('id','').removeClass('selected').addClass('select');
                                                    }
                                                }
                                            }
                                            me.wan = 0;
                                        }
                                    }
                                    if(len == inRight){
                                        me.$guess_img.addClass(me.REQUEST_CLS);
                                        console.log('正确');
                                        me.isShow('#lottery-bingo', true);
                                        getResult("party/quiz/answer",{
                                            openid: openid,
                                            quizInfoUuid: me.$guess_img.attr('data-qu'),
                                            attrUuid: me.checkedParams
                                        },'quizAnswerHandler',true);
                                    }
                                },500);
                            }
                            return;
                        }
                    }
                }

            });

            this.$guess_img.delegate('span', 'click',function(e) {
                e.preventDefault();

                if($(this).parent().parent().hasClass(me.REQUEST_CLS)){
                    alert('拼命加载中....');
                    return;
                }

                var $dd = $(this).parent().siblings('dl').find('dd');
                len = $dd.length;

                if(!Boolean($(this).text())){
                    alert('此处你还未填写答案！');
                }else{
                    for(var i = 0; i < len; i++){
                        if($(this).attr('id') == $dd.eq(i).attr('id')){
                            $dd.eq(i).text($(this).text());
                            $(this).text('').removeClass('selected').addClass('select');
                            me.wan--;
                            return;
                        }
                    }
                }

            });

            this.$btnRank.click(function(e) {
                e.preventDefault();

                H.dialog.rank.open();
            });

            this.$btnCmt.click(function(e) {
                e.preventDefault();

                if ($(this).hasClass(me.REQUEST_CLS)) {
                    return;
                }
                var comment = $.trim(me.$inputCmt.val()) || '',
                    comment = comment.replace(/<[^>]+>/g, ''),
                    len = comment.length;

                if (len < 1) {
                    alert('请先说点什么吧');
                    me.$inputCmt.removeClass('error').addClass('error').focus();
                    return;
                } else if (len > 20) {
                    alert('观点字数超出了20字');
                    me.$inputCmt.removeClass('error').addClass('error').focus();
                    return;
                }

                $(this).addClass(me.REQUEST_CLS);

                shownewLoading();
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/comments/save',
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
                        tid: me.tid,
                        ty: 1,
                        nickname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                        headimgurl: headimgurl ? headimgurl : ""
                    },
                    dataType : "jsonp",
                    jsonpCallback : 'callbackCommentsSave',
                    complete: function() {
                        hidenewLoading();
                    },
                    success : function(data) {
                        me.$btnCmt.removeClass(me.REQUEST_CLS);

                        if (data.code == 0) {
                            //var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/avatar.jpg';
                            //barrage.appendMsg("<img src="+ h +"/>"+comment);
                            barrage.appendMsg("<img src='./images/danmu_head.png' />"+comment);
                            me.$inputCmt.removeClass('error').val('');
                            return;
                        }
                        alert(data.message);
                    }
                });

            });
        },
        isShow : function($target, isShow){
            var $target = $($target);
            $target.removeClass('none');
            isShow ? $target.show() : $target.hide();
        },
        audio: function(){
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'reunion/info',
                dataType : "jsonp",
                jsonpCallback : 'callbackReunionInfo',
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    if (data.code == 0) {
                        $('.icon').find('img').attr('src',data.hi);
                        H.answer.actuid = data.iu;
                        H.answer.dc = data.dc;
                        var $audio = $('#ui-audio').audio({
                            auto: false,			// 是否自动播放，默认是true
                            stopMode: 'stop',	// 停止模式是stop还是pause，默认stop
                            audioUrl:  data.iv,
                            steams: ["<img src='images/icon-musical-note.png' />", "<img src='images/icon-musical-note.png' />"],
                            steamHeight: 150,
                            steamWidth: 44
                        });

                        setTimeout(function() {
                            $audio.pause();
                            //$audio.stop();
                        }, 2000);
                    }
                }
            });

        },
        count_down: function(count) {
            var me = this;
            $('.countdown').each(function(index) {
                var curr = new Date().getTime(),
                    before = curr - 1 * 60 * 60 * 1000,
                    after = curr + count,
                    stime = '',
                    etime = '';
                switch (index) {
                    case 0:
                        stime = before;
                        etime = after;
                        break;
                    case 1:
                        stime = curr - 60 * 1000;
                        etime = curr;
                        break;
                    case 2:
                        stime = after;
                        etime = after + 60 * 1000;
                        break;
                }
                $(this).attr('data-stime', stime).attr('data-etime', etime);
            });

            $('.countdown').countdown({
                stpl: '0',
                etpl: '<p class="state2">距下次答题抽奖还有</p><div class="time-box"><span class="time">%H%</span><span class="dot">:</span><span class="time">%M%</span><span class="dot">:</span><span class="time">%S%</span></div>',
                otpl: '',
                callback: function(state) {
                    var me = H.answer;
                    if(state === 3){
                        window.location.reload();
                    }
                }
            });
        },
        checkActivity: function(data){

            var prizeActList = data.quizinfo,
                prizeLength = prizeActList.length,
                $countdown = $('.countdown'),me = this;
            var nowTimeStr = me.now_time;

            if(comptime(prizeActList[prizeLength-1].qe,nowTimeStr) > 0 || prizeActList[prizeLength-1].qf){
               /* me.isShow('.wrapper .jifen-btn', true);*/
                me.$guess_img.addClass("none");
                me.$count_down.removeClass('none');
                $countdown.html('活动已结束！');
                return;
            }
            for ( var i = 0; i < prizeLength; i++) {
                var bTime = prizeActList[i].qb ,
                    eTime = prizeActList[i].qe;
                me.fill(data, i);
                me.curr_index = i;
                if(comptime(nowTimeStr, bTime) > 0){
                    var count = timestamp(bTime) - timestamp(nowTimeStr);
                    me.count_down(count);
                    me.$count_down.removeClass("none");
                    me.$guess_img.addClass("none");
                    /*me.isShow('.wrapper .jifen-btn', true);*/
                    return;
                }else if( comptime(nowTimeStr, eTime) > 0 && !prizeActList[i].qf){
                    me.$count_down.addClass("none");
                    me.$guess_img.removeClass("none");
                    return;
                }
            }
        },
        fill: function(data, index){
            var t = simpleTpl(),
                qitems = data.quizinfo || [],
                i = index;

            this.tid = data.tid;
            this.checkedParams = qitems[i].qr;

            //qu--题目uuid
            //qr--题目正确选项
            //qt--题目title
            //qi--题目img
            //qa--题目选项
            //qf--题目是否答题状态
            //au--题目选项uuid

                t._('<h1 id="question-'+ qitems[i].qu +'">'+ qitems[i].qt +'</h1>')
                    ._('<div class="answer-box"><img src="'+ qitems[i].qi +'"></div><div class="key">');

                var aitems = qitems[i].qa || [],
                    qrArry = qitems[i].qr.split(",");
                for (var l = 0, llen = qrArry.length; l < llen; l ++) {
                    t._('<span class="select" data-au="'+ qrArry[l] +'" data-collect="true" data-collect-flag="hb-star-festival-answer-answer" data-collect-desc="答题页面-答案按钮"></span>');
                }
                t._('</div><dl>');
                    for (var j = 0, jlen = aitems.length; j < jlen; j ++) {
                        t._('<dd class="q-item" id="'+ aitems[j].au +'" data-au="'+ aitems[j].au +'" data-collect="true" data-collect-flag="hb-star-festival-answer" data-collect-desc="答题页面-选项按钮">'+ aitems[j].ai +'</dd>');
                    }
                t._('</dl><p class="error none">啊哦，答错了，重新选择答案吧！</p>');
            this.$guess_img.html(t.toString()).attr('data-qu', qitems[i].qu);
            var dl_width = $('.xq dl').css('width');
            var dd_width = (dl_width.slice(0, -2)-32)/8;
            $('.xq dl dd').css({
                "width": dd_width+'px',
                "height": dd_width+'px',
                "line-height": dd_width+'px'
            });
        }
    };
    H.comment = {
        timer: 5000,
        maxid: 0,
        pageSize: 10,
        $comments: $('#comments'),
        init: function() {
            var me = this;
            W['barrage'] = this.$comments.barrage();
            setTimeout(function(){
                W['barrage'].start(1);

                setInterval(function() {
                    me.flash();
                }, me.timer);

            }, 1000);
        },

        flash: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : true,
                url : domain_url + "api/comments/room?temp=" + new Date().getTime(),
                data: {
                    ps: me.pageSize,
                    maxid: me.maxid
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackCommentsRoom',
                success : function(data) {
                    if (data.code != 0) {
                        return;
                    }
                    me.maxid = data.maxid;
                    var items = data.items || [];
                    for (var i = 0, len = items.length; i < len; i ++) {
                        //barrage.pushMsg("<img src='"+ (items[i].hu ? (items[i].hu + '/' + yao_avatar_size) : './images/avatar.jpg') +"'/>"+items[i].co);
                        barrage.pushMsg("<img src='./images/danmu_head.png'/>"+items[i].co);
                    }
                }
            });
        }
    };
    H.utils = {
        $header: $('header'),
        $wrapper: $('.wrapper'),
        $comments: $('#comments'),
        resize: function() {
            var height = $(window).height(),width = $(window).width();
            this.$header.css({
                'height': height * 0.20 + 'px',
                'width': width + 'px',
                'padding-top': Math.floor((height * 0.20)/3.9) + 'px'
            });
            this.$wrapper.css('height', height * 0.80);
            this.$comments.css({'height': height * 0.75 - 55});
            $('body').css('height', height);
        }
    };

    W.reunionIndexHandler = function(data) {
        var me = H.answer ;
        if(data.code == 0){
            me.now_time = data.tm;
            me.quesData = data;
            me.checkActivity(data);

        }else if(data.code == 2){//活动已结束，查得昨天最后一道题
            /*me.isShow('.wrapper .jifen-btn', true);*/
            me.$count_down.removeClass('none');
            $('.countdown').html('活动已结束！');
        }
    };

    W.quizAnswerHandler = function(data) {
        var me = H.answer ;
        if(data.code == 0){
            me.$guess_img.removeClass(me.REQUEST_CLS);

            getResult('api/common/time', {}, 'commonApiTimeHandler', true);

            me.quesData.quizinfo[me.curr_index].qf = true;
            me.checkActivity(me.quesData);
            me.wan = 0;

            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/luck',
                data: {
                    oi: openid
                },
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuckHandler',
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    setTimeout(function(){
                        me.isShow('#lottery-bingo', true);
                        H.dialog.lottery.open(data);
                    },2000);
                },
                error : function() {
                    setTimeout(function(){
                        me.isShow('#lottery-bingo', true);
                        H.dialog.lottery.open(null);
                    },2000);
                }
            });

        }
    };

    W.commonApiTimeHandler = function(data){
        var date=new Date(data.t);

        Date.prototype.format = function(format){
            var o = {
                "M+" : this.getMonth()+1, //month
                "d+" : this.getDate(), //day
                "h+" : this.getHours(), //hour
                "m+" : this.getMinutes(), //minute
                "s+" : this.getSeconds(), //second
                "q+" : Math.floor((this.getMonth()+3)/3), //quarter
                "S" : this.getMilliseconds() //millisecond
            }

            if(/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
            }

            for(var k in o) {
                if(new RegExp("("+ k +")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
                }
            }
            return format;
        };
        H.answer.now_time = date.format("yyyy-MM-dd hh:mm:ss");
    };

})(Zepto);
$(function(){
    H.answer.init();
});