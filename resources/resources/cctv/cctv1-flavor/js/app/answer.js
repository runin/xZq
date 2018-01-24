(function($) {
	H.answer = {
        quid: '',
        endTime: '',
        nextTime: '',
        voteInfo_data: '',
        dec: 0,
        index: 0,
        istrue: true,
        isCanvasShow: false,
        nowTime: null,
        showinfoFlag: true,
        infoPortFlag: true,
        voteTimeList: [],
        questionSupportData: '',
        tips: '您已经投过票了~',
		init: function() {
            shownewLoading();
			this.showinfo_port();
			this.event();
		},
		event: function() {
            var me = this;
            $('body').delegate('.btn-item', 'tap', function(e) {
                e.preventDefault();
                var that = this;
                if ($(that).hasClass('requesting')) {
                    showTips(me.tips);
                    return;
                }
                if ($(that).hasClass('voted')) {
                    showTips(me.tips);
                    return;
                }
                $(that).addClass('requesting');
                getResult('api/question/answer', {
                    yoi: openid,
                    suid: me.quid,
                    auid: $(this).attr('data-auid')
                }, 'callbackQuestionAnswerHandler');
                showTips('投票成功!');
                $('.btn-item').addClass('voted');
                setTimeout(function(){
                    me.tongjiProcess($(that).attr('data-auid'));
                }, 1500);
            }).delegate('#btn-comment', 'tap', function(e) {
                e.preventDefault();
                if ($(this).hasClass('requesting')) {
                    return;
                }
                var comment = $.trim($('#input-comment').val()) || '', comment = comment.replace(/<[^>]+>/g, ''), len = comment.length;
                if (len < 1) {
                    $('#input-comment').focus();
                    showTips('说说你的看法吧~');
                    return;
                } else if (len > 21) {
                    $('#input-comment').focus();
                    showTips('看法不能超过20字哦~');
                    return;
                }
                $(this).addClass('requesting');
                shownewLoading(null, '发射中...');
                setTimeout(function(){
                    $("#btn-comment").removeClass('requesting');
                    showTips('发射成功');
                    var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/avatar/default-avatar.jpg';
                    barrage.appendMsg('<div><div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div><div class="comment me-content">' + comment + '</div></div>');
                    $('.isme').parent('div').addClass('me');
                    $('#input-comment').removeClass('error').val('');
                    hidenewLoading();
                }, 300);
                // shownewLoading();
                $.ajax({
                    type: 'GET',
                    async: false,
                    url: domain_url + 'api/comments/save' + dev,
                    data: {
                        co: encodeURIComponent(comment),
                        op: openid,
                        ty: 1,
                        tid: H.answer.quid,
                        nickname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : '',
                        headimgurl: headimgurl ? headimgurl : ''
                    },
                    dataType: "jsonp",
                    jsonpCallback: 'callbackCommentsSave',
                    complete: function() {
                        // hidenewLoading();
                    },
                    success : function(data) {
                        // $("#btn-comment").removeClass('requesting');
                        // if (data.code == 0) {
                        //     showTips('发射成功');
                        //     var h= headimgurl ? headimgurl + '/' + yao_avatar_size : './images/avatar/default-avatar.jpg';
                        //     barrage.appendMsg('<div><div class="c_head_img isme"><img class="c_head_img_img" src="' + h + '" /></div><div class="comment me-content">' + comment + '</div></div>');
                        //     $('.isme').parent('div').addClass('me');
                        //     $('#input-comment').removeClass('error').val('');
                        //     return;
                        // }
                        // showTips("评论失败");
                    }
                });
            }).delegate('#btn-tongji-close', 'tap', function(e) {
                e.preventDefault();
                $('.tongji-box').addClass('hide');
                setTimeout(function(){
                    $('.tongji-box').remove();
                }, 600);
            })
            $('.btn-item').tap(function(e) {
            });
		},
        showinfo_port: function() {
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/common/servicetime' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'commonApiServicetimeHandler',
                timeout: 10000,
                complete: function() {
                },
                success : function(data) {
                    if (data && data.st && data.pet && data.pbt && data.fq) {
                        var allday = timeTransform(parseInt(data.st));
                        var sshowTime = allday.split(" ")[0] + ' ' + data.pbt, eshowTime = allday.split(" ")[0] + ' ' + data.pet;
                        var day = new Date(str2date(allday)).getDay().toString();
                        if (day == '0') { day = '7'; }
                        if (data.fq.indexOf(day) >= 0) {
                            if (comptime(eshowTime, allday) >= 0) {
                                cookie4toUrl('over.html');
                            } else {
                                H.answer.questionRound_port();
                            }
                        } else {
                            cookie4toUrl('over.html');
                        }
                    } else {
                        if (H.answer.showinfoFlag) {
                            H.answer.showinfoFlag = false;
                            H.answer.showinfo_port();
                        } else {
                            cookie4toUrl('lottery.html');
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    cookie4toUrl('lottery.html');
                }
            });
        },
		questionRound_port: function() {
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/question/round' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackQuestionRoundHandler',
                timeout: 10000,
                complete: function() {
                },
                success : function(data) {
                    if(data.code == 0){
                        if (data.qitems) {
                            H.answer.voteInfo_data = data;
                            H.answer.nowTime = timeTransform(parseInt(data.cud));
                            H.answer.dec = new Date().getTime() - parseInt(data.cud);
                            H.answer.countdownInfo(data);
                        } else {
                            cookie4toUrl('lottery.html');
                        }
                    } else {
                        if (H.answer.infoPortFlag) {
                            H.answer.infoPortFlag = false;
                            setTimeout(function(){
                                H.answer.questionRound_port();
                            }, 2000);
                        } else {
                            cookie4toUrl('lottery.html');
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    cookie4toUrl('lottery.html');
                }
            });
		},
        questionRecord_port: function() {
            getResult('api/question/record', { yoi: openid, quid: this.quid }, 'callbackQuestionRecordHandler');
        },
        questionEachsupport_port: function() {
            getResult('api/question/eachsupport', { quid: this.quid }, 'callbackQuestionSupportHandler');
        },
        defaultCom_port: function() {
            getResult('api/comments/last', { anys: this.quid, zd: 1 }, 'callbackCommentsLast');
        },
        countdownInfo: function(data) {
            var me = this, voteTimeListLength = 0, nowTimeStr = timeTransform(parseInt(data.cud));
            me.voteTimeList = data.qitems;
            me.dec = new Date().getTime() - data.cud;
            me.updateDec();
            voteTimeListLength =  me.voteTimeList.length;
            me.endTime =  me.voteTimeList[voteTimeListLength-1].qet;
            //最后一轮结束
            if (comptime(me.voteTimeList[voteTimeListLength-1].qet, nowTimeStr) >=0) { 
                me.quid = me.voteTimeList[voteTimeListLength-1].quid;
                cookie4toUrl('lottery.html');
                return;
            };
            for (var i = 0; i < voteTimeListLength; i++) {
                var beginTimeStr =  me.voteTimeList[i].qst, endTimeStr = me.voteTimeList[i].qet;
                 //活动正在进行
                if(comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0) {
                    me.index = i;
                    me.fillVoteinfo(me.voteTimeList[i]);
                    me.nowCountdown(me.voteTimeList[i]);
                    me.quid = me.voteTimeList[i].quid;
                    me.defaultCom_port();
                    $.fn.cookie('jumpNum', 0, {expires: -1});
                    return;
                }
                if(comptime(nowTimeStr, beginTimeStr) > 0){    //活动还未开始
                    me.index = i;
                    cookie4toUrl('lottery.html');
                    return;
                }
            };
        },
        fillVoteinfo: function(data) {
            var me = this;
            if (data.aitems.length > 0) {
                var t = simpleTpl(), itemsList = data.aitems || [], itemsListLen = data.aitems.length;
                me.quid = data.quid;
                $('.answer-box').append('<p class="food-name">' + data.qt || '本轮佳肴' + '</p>');
                $('.answer-box').append('<img class="food" src="./images/icon-food-load.gif" onload="$(this).attr(\'src\',\'' + data.bi + '\')" onerror="$(this).addClass(\'none\')">');
                for (var i = 0; i < itemsListLen; i++) {
                    t._('<a href="javascript:void(0);" class="btn-item" data-auid="' + data.aitems[i].auid + '" data-collect="true" data-collect-flag="answer-btn-item" data-collect-desc="答题页-答题按钮">' + data.aitems[i].at + '</a>');
                    $('.tongji-result').append('<p id="tongji-' + data.aitems[i].auid + '"><i></i><span>' + data.aitems[i].at + '</span><label></label></p>')
                };
                $('.item-box').append(t.toString());
                me.resize();
                me.questionRecord_port();
                me.questionEachsupport_port();
                setTimeout(function(){
                    $('.btn-item').animate({'opacity': '1'}, 500);
                }, 1000);
                $('header, .container, footer .ctrls').removeClass('none').animate({'opacity':'1'}, 300, function(){
                    H.comment.init();
                });
            } else {
                cookie4toUrl('lottery.html');
            }
        },
        resize: function(){
            var winH = $(window).height();
            $('.container').css('min-height', Math.ceil(winH - 260));
            $('article').css('height', Math.ceil(winH - 260));
            $('#comments').css('height', Math.ceil(winH - 260));
        },
        nowCountdown: function(pra){
            var endTimeStr = pra.qet;
            var beginTimeLong = timestamp(endTimeStr);
            beginTimeLong += H.answer.dec;
            $('.detail-countdown').attr('etime',beginTimeLong);
            H.answer.count_down();
            $(".countdown-tip").html("距离摇奖开始还有");
            H.answer.istrue = true;
            H.answer.quid = pra.quid;
            $(".time-box").removeClass("hidden");
            $(".zan-box").css('opacity', '1');
            H.answer.index ++;
            hidenewLoading();
        },
        count_down : function() {
            $('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl : '<span class="fetal-H">%H%'+':</span>'+'%M%' + ':' + '%S%',
                    stpl : '<span class="fetal-H">%H%'+':</span>'+'%M%' + ':' + '%S%',
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(H.answer.istrue){
                            H.answer.istrue = false;
                            H.answer.change();
                        }
                    },
                    sdCallback :function(){
                        H.answer.istrue = true;
                    }
                });
            });
        },
        updateDec: function() {
            var delay = Math.ceil(60000 * 5 * Math.random() + 60000 * 3);
            setInterval(function() {
                $.ajax({
                    type: 'GET',
                    async: false,
                    url: domain_url + 'api/common/time' + dev,
                    data: {},
                    dataType: "jsonp",
                    jsonpCallback: 'commonApiTimeHandler',
                    timeout: 10000,
                    complete: function() {
                    },
                    success: function(data) {
                        if(data.t){
                            H.answer.dec = new Date().getTime() - data.t;
                        }
                    },
                    error: function(xmlHttpRequest, error) {
                    }
                });
            },delay);
        },
        change: function(data){
            $(".countdown-tip").html('请稍后');
            $('header, .container, footer .ctrls').animate({'opacity':'0'}, 800);
            cookie4toUrl('lottery.html');
        },
        tongji_canvas: function(target) {
            var canvas = document.getElementById(target);
            var ctx = canvas.getContext("2d");
            var fixRatio = window.devicePixelRatio || 1;
            var W = canvas.width / fixRatio;
            var H = canvas.height / fixRatio;
            var me = '#' + target;
            var percent = $(me).attr('data-percent') || 0;
            var incolor = $(me).attr('data-incolor') || '#d4c59c';
            var outcolor = $(me).attr('data-outcolor') || '#ebdebb';
            var percentcolor = $(me).attr('data-percentcolor') || 'rgba(255,0,0,.45)';
            var bgcolor = $(me).attr('data-bgcolor') || '#FFF';
            var fontcolor = $(me).attr('data-fontcolor') || '#000';
            var deg=0,new_deg=0,dif=0
            var loop,re_loop,text,text_w;
            
            function init(){
                ctx.clearRect(0,0,W,H);

                // ctx.beginPath();
                // ctx.arc(W/2,H/2,W/2-5,0,Math.PI*2,false);
                // ctx.fillStyle = bgcolor;//填充颜色,默认是黑色
                // ctx.fill();
                
                ctx.beginPath();
                ctx.strokeStyle = incolor;
                ctx.lineWidth = 60;
                ctx.arc(W/2,H/2,95,0,Math.PI*2,false);
                ctx.stroke();
                
                // ctx.beginPath();
                // ctx.strokeStyle = outcolor;
                // ctx.lineWidth = 190;
                // ctx.arc(W/2,H/2,30,0,Math.PI*2,false);
                // ctx.stroke();
                
                var r = deg*Math.PI/180;
                
                // ctx.fillStyle = fontcolor;
                // ctx.font="18px Arial";
                // text = percent+"%";
                // text_w = ctx.measureText(text).width;
                // ctx.fillText(text,W/2 - text_w/2,H/2+7);

                ctx.beginPath();
                ctx.strokeStyle = percentcolor;
                ctx.lineWidth = 60;
                // ctx.globalAlpha=0.45;
                ctx.arc(W/2,H/2,95,0-90*Math.PI/180,r-90*Math.PI/180,false);
                ctx.stroke();
                
                ctx.closePath();
            };
            function draw(){
                new_deg = Math.round((percent/100) * 360);
                dif = new_deg - deg;
                loop = setInterval(circle,800/dif);
            };
            function circle(){
                if(deg == new_deg){
                    clearInterval(loop);
                }
                if(deg < new_deg){
                    deg++;
                } else {
                    clearInterval(loop);
                }
                init();
            };
            draw();
        },
        tongjiProcess: function(auid) {
            var me = this, sumCount = 0, sumPercent = 0;
            if (me.isCanvasShow) {
                if (me.questionSupportData != '') {
                    var aitemsList = me.questionSupportData.aitems, aitemsListLen = me.questionSupportData.aitems.length;
                    if (aitemsListLen == 2) {
                        for (var i = 0; i < aitemsListLen; i++) {
                            sumCount += aitemsList[i].supc;
                        };
                        finalSumCount = sumCount + 1;
                        for (var i = 0; i < aitemsListLen; i++) {
                            if (auid == aitemsList[i].auid) {
                                auidCount = aitemsList[i].supc + 1;
                            } else {
                                auidCount = aitemsList[i].supc;
                            }
                            var percent = (auidCount / finalSumCount * 100).toFixed(2);
                            if (i == aitemsListLen - 1) {
                                percent = (100.00 - sumPercent).toFixed(2);
                            }
                            $('#tongji-' + aitemsList[i].auid + ' label').text(percent + '%');
                            if (i == 0) {
                                $('.tongji-canvas').html('<canvas width="260" height="260" id="tj" data-percent="' + percent + '" data-incolor="#ff5a4e" data-percentcolor="#eb001c"></canvas>');
                            }
                            sumPercent += percent * 1;
                        };
                        $('.tongji-box').removeClass('none');
                        setTimeout(function(){
                            $('.tongji-box').removeClass('hide');
                            setTimeout(function(){
                                me.tongji_canvas('tj');
                            }, 300);
                        }, 100);
                    } else {
                        $('.tongji-box').addClass('none');
                    }
                } else {
                    $('.tongji-box').addClass('none');
                }
            } else {
                $('.tongji-box').addClass('none');
            }
        }
	};

    H.comment = {
        timer: 5000,
        maxid: 0,
        pageSize: 50,
        $comments: $('#comments'),  
        init: function() {
            var me = this;
            W['barrage'] = this.$comments.barrage();
            W['barrage'].start(1);
            setInterval(function() {
                me.flash();
            }, me.timer);
        },
        flash: function() {
            var me = this;
            getResult('api/comments/room?temp=' + new Date().getTime(), {
                anys: H.answer.quid,
                ps: me.pageSize,
                maxid: me.maxid
            }, 'callbackCommentsRoom');
        }
    };

    W.callbackCommentsRoom = function(data) {
        if (data.code == 0) {
            H.comment.maxid = data.maxid;
            var items = data.items || [];
            for (var i = 0, len = items.length; i < len; i++) {
                var hmode = "<div class='c_head_img'><img src='./images/avatar/default-avatar.jpg' class='c_head_img_img'></div>";
                if (items[i].hu) {
                    if (items[i].hu.indexOf('.jpg') || items[i].hu.indexOf('.jepg') || items[i].hu.indexOf('.png')) {
                        hmode = "<div class='c_head_img'><img src='" + items[i].hu + " class='c_head_img_img'></div>";
                    } else {
                        hmode = "<div class='c_head_img'><img src='" + items[i].hu + "/64' class='c_head_img_img'></div>";
                    }
                }
                barrage.pushMsg(hmode + items[i].co);
            };
        }
    };

    W.callbackQuestionRecordHandler = function(data) {
        if (data.code == 0) {
            if (data.anws) {
                $('.btn-item').addClass('voted');
            } else {
                $('.btn-item').removeClass('voted');
            }
        }
    };

    W.callbackQuestionSupportHandler = function(data) {
        if (data.code == 0) {
            if (data.aitems.length > 0) {
                H.answer.questionSupportData = data;
                H.answer.isCanvasShow = true;
            } else {
                H.answer.isCanvasShow = false;
            }
        } else {
            H.answer.isCanvasShow = false;
        }
    };
    
    W.callbackQuestionAnswerHandler = function(data) {};

    W.callbackCommentsLast = function(data) {
        if (data.code == 0 && data.items) {
            var items = data.items, length = data.items.length;
            for (var i = 0; i < length; i++) {
                window.CACHEMSG.push("<div class='c_head_img'><img src='" + items[i].im + "'></div>" + items[i].co);
            };
        }
    };
})(Zepto);

$(function() {
	H.answer.init();
});