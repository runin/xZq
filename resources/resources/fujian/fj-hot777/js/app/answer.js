(function($) {
	H.comments = {
		actUid : null,
		page : 0,
		beforePage : 0,
		pageSize:10,
		item_index : 0,
		commActUid: "",
		loadmore : true,
		isCount : true,
		expires: {expires: 7},
        attrUuid: null,
		init : function(){
			this.event_handler();
		},
		event_handler: function() {
			var me = this;
			$('body').delegate('.show-all', 'click', function(e) {
				e.preventDefault();
				var $class_all = $(this).parent('div').find('.all-con');
				$class_all.find('span').toggleClass('all');
				if( $class_all.find('span').hasClass('all')){
					$(this).text('^显示全部');
				}else{
					$class_all.css('height','auto');
					$(this).text('^收起');
				}
			}).delegate('.baoliao', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    toUrl('clue.html');
                }
            }).delegate('.countdown', 'click', function(e) {
                e.preventDefault();
                if(!$(this).hasClass('requesting')){
                    $(this).addClass('requesting');
                    toUrl('lottery.html');
                }
            });
			$(".top-back").click(function(e){
				e.preventDefault();
				$(window).scrollTop(0);
				$(this).addClass('none');
			});

			$(window).scroll(function(){
				var scroH = $(this).scrollTop(),
					$fix = $('.fix');
				if(scroH > 0){
					$fix.removeClass('none');
					$(".top-back").removeClass('none');
				}else if(scroH == 0){
					$fix.addClass('none');
					$(".top-back").addClass('none');
				}
			});
			
			var range = 55, //距下边界长度/单位px
			maxpage = 100, //设置加载最多次数
			totalheight = 0;
			$(window).scroll(function(){
			    var srollPos = $(window).scrollTop();
			    totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
				if (($(document).height() - range) <= totalheight  && H.comments.page < maxpage && H.comments.loadmore) {
					if ($('#qy_loading').length > 0) {
						return;
					}
					H.comments.getList(H.comments.page);
			    }
			});
			
			$("#send").click(function(){
				if(!$.trim($("#comments-info").val())){
					showTips('请填写评论');
					$("#comments-info").focus();
					return;
				}
				if(openid != null){
					$("#send").attr("disabled","disabled");
					$("#comments-info").attr("disabled","disabled");
					if(headimgurl != null && headimgurl.indexOf("./images/avatar.png") > 0){
						headimgurl='';
					}
					getResult('api/comments/save', {
						co:encodeURIComponent($("#comments-info").val()),
						op:openid,
						tid:H.comments.commActUid, 
						ty:1,
						pa:null,
						nickname: encodeURIComponent(nickname || ''),
						headimgurl: headimgurl || ''
						}, 'callbackCommentsSave',true);
				}
			});
			$("#back-index").click(function(e){
				e.preventDefault();
				toUrl("index.html");
			});
		},
		getList:function(page){
			if(page - 1  == this.beforePage){
				getResult('comments/list', {page:page,ps:this.pageSize,anys:H.comments.commActUid,op:openid,zd:0,kind:0}, 'callbackCommentsList', true);
			}
		},
		bindZanClick: function(cls){
			$("."+cls).click(function(){
				if($(this).hasClass('z-ed')){ return; }
				$(this).addClass("curZan").addClass('z-ed');
				getResult('api/comments/praise', {
					uid:$(this).parent().parent().attr("data-uuid"),
					op:openid
					}, 'callbackCommentsPraise');
			});
		},
		is_show: function(i){
			var $all_con = $('#all-con' + i);
			var height = $all_con.height(),
				inner_height = $all_con.find('span').height();
			if(inner_height > height){
				$all_con.find('span').addClass('all');
				$('#show-all' + i).removeClass('none');
			}
		},
		tpl: function(data) {
			var me = this, t = simpleTpl(), item = data.items || [], $top_comment = $('#top-comment'),$nor_comment = $('#nor-comment');
			for (var i = 0, len = item.length; i < len; i++) {
				var isZan = item[i].isp ? "z-ed":"";
				t._('<li data-uuid = "'+ item[i].uid +'">')
					._('<section class="avatar"><img src="'+ (item[i].im ? (item[i].im + '/' + yao_avatar_size) : './images/avatar.png')+'"/></section>')
					._('<div>')
						._('<label class="zan '+isZan+'" data-collect="true" data-collect-flag="answer-zan" data-collect-desc="点赞按钮" >'+ item[i].pc +'</label>')
						._('<p>'+ (item[i].na || '匿名用户') +'</p>')
						._('<p class="all-con" id="all-con'+ me.item_index +'">')
							._('<span>'+ item[i].co +'</span>')
						._('</p>')
						._('<a class="show-all none" id="show-all'+ me.item_index +'" data-collect="true" data-collect-flag="answer-show" data-collect-desc="评论收缩显示" >^显示全部</a>')
					._('</div>')
					._('</li>');
				++ me.item_index;
			}
			if(data.kind == 1){
				$top_comment.append(t.toString());
			}else{
				$nor_comment.append(t.toString());
			}
			// for (var i = 0, len = me.item_index; i < len; i++) { me.is_show(i); }
			H.comments.bindZanClick("zan");
		},
		currentComments : function(commActUid) {
			getResult('api/comments/list', {page:1,ps:this.pageSize,anys:commActUid,op:openid,dt:1,zd:1,kind:1}, 'callbackCommentsList',true);
			getResult('api/comments/list', {page:1,ps:this.pageSize,anys:H.comments.commActUid,op:openid,zd:0,kind:0}, 'callbackCommentsList');
		}
	};

    H.answer = {
        $current_box: $("#current_box"),
        $surveyed: $("#surveyed"),
        $answer_container: $('.answer-container'),
        $answer: $('.answer'),
        $submitBtn: $("#submitBtn"),
        $adver: $('.adver'),
        surveyInfoUuid: '',
        user_answer_uuid: '',
        checkedParams: '',
        isSubmit: false,
        isSelect: false,
        infordata: '',
        anws: '',
        $new: $("#new"),
        dec: 0,
        isTimeOver: false,
        repeat_load: true,
        nowTime: timeTransform(new Date().getTime()),
        init: function(){
            this.get_theTitle();
            this.event();
            this.current_time();
            this.refreshDec();
            this.tttj();
        },
        get_theTitle: function(){
            getResult("api/question/round",{yoi: openid},'callbackQuestionRoundHandler',true);
        },
        question_record: function(){
            getResult("api/question/record",{yoi: openid, quid: H.answer.surveyInfoUuid},'callbackQuestionRecordHandler',true);
        },
        answer_jk: function(){
            var me = H.answer;
            getResult("api/question/answer",{
                yoi: openid,
                suid: me.surveyInfoUuid,
                auid: me.checkedParams
            },'callbackQuestionAnswerHandler',true);
        },
        question_support: function(){
            getResult("api/question/eachsupport",{quid: H.answer.surveyInfoUuid},'callbackQuestionSupportHandler',true);
        },
        event: function(){
            var me = H.answer;
            $('.back-home').click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl('index.html');
            });
            me.$submitBtn.click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                me.submitSurvey();
            });
            $('.topic').click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl("comments.html");
            });

            $(".new").click(function(e){
                e.preventDefault();
                me.btn_animate($(this));
                toUrl('yao.html');
            });
        },
        submitSurvey: function () {
            var me = H.answer;
            if(me.isSubmit){
                return;
            }
            me.isSubmit = true;
            me.checkedParams = me.user_answer_uuid;
            if(me.isSelect){
                return;
            }
            if (null == me.checkedParams || me.checkedParams.length == 0) {
                showTips("请选择您赞同的观点");
                me.isSubmit = false;
                return;
            } else {
                me.checkedParams = me.checkedParams.substring(1);
            }
            me.answer_jk();
        },
        spellCurrentHtml: function (data){
            var me = H.answer;
            var resultStr = '<div class="tlt"><p  class="title">'+ data.qitems[0].qt +'<label>'+ (data.qitems[0].ty==1? '（单选）':'（可多选）') +'</label></p></div>' + '<ul class="ques">';
            if(data.qitems[0].aitems){
                $.each(data.qitems[0].aitems,function(i,item){
                    resultStr += '<li class="ques-lied" id="'+item.auid+'"><label>'
                    + item.at + '</label></li>';
                });
            }
            resultStr +='</ul>';

            me.$current_box.empty().html(resultStr);
            me.$answer_container.removeClass('none');
            me.$answer.removeClass('none');
        },
        spellpercentHtml: function (data){
            var me = H.answer, resultStr = '';
            $.each(me.infordata.qitems,function(i,item){
                resultStr = '<div class="tlt"><p  class="title">'+ item.qt +'</p></div> <!--<p class="result">本期调查结果为：</p>-->' + '<ul class="re-ul">';
                $.each(item.aitems,function(j,jtem){
                    resultStr += '<li id="'+jtem.auid+'"><div class="perce-tlt"><p class="tlt">'
                    + jtem.at +'</p><label class="percent">-</label ></div><div class="progress"><div class="progress-bar""></div></div></li>';
                });
            });
            resultStr +='</ul>';
            me.$surveyed.empty().html(resultStr);
            if(data.aitems){
                var countResult = 0,
                    checkedResult = 0,
                    sum = 0;
                $.each(data.aitems,function(i,item){
                    sum += item.supc;
                });
                $.each(data.aitems,function(j,jtem){
                    if(j == (data.aitems.length - 1)){
                        checkedResult = (100 - countResult)+"%";
                        if((100 - countResult) < 0){
                            checkedResult = 0+"%";
                        }
                    }else{
                        checkedResult = (jtem.supc/sum * 100).toFixed(0) + '%';
                        if((jtem.supc/sum * 100).toFixed(0) < 0){
                            checkedResult = 0+"%";
                        }
                        countResult += (jtem.supc/sum * 100).toFixed(0)*1;
                    }
                    $('.percent').eq(j).text(checkedResult);
                    $('.progress-bar').eq(j).animate({
                        'width': checkedResult
                    }, 350);
                });
                var selectedAttry = "";
                if(me.anws){
                    selectedAttry = me.anws.split(",");
                }else{
                    selectedAttry = me.checkedParams.split(",");
                }
                $.each(selectedAttry,function(a,atem){
                    $.each($(".re-ul li"),function(l,ltem){
                        if(atem == $(".re-ul li").eq(l).attr("id")){
                            $(".re-ul li").eq(l).find(".progress-bar").addClass("selected-li");
                        }
                    });
                });
            }
            me.$answer.addClass('none');
            me.$answer_container.removeClass('none');
            $(".surveyed").removeClass('none');
        },
        btn_animate: function(str){
            str.addClass('flipInY');
            setTimeout(function(){
                str.removeClass('flipInY');
            },200);
        },
        refreshDec: function() {
            var me = this, delay = Math.ceil(50000*5*Math.random() + 50000*3);
            setInterval(function(){
                $.ajax({
                    type : 'GET',
                    async : false,
                    url : domain_url + 'api/common/time' + dev,
                    data: {},
                    dataType : "jsonp",
                    jsonpCallback : 'commonApiTimeHandler',
                    timeout: 10000,
                    complete: function() {
                    },
                    success : function(data) {
                        if(data.t){
                            me.dec = new Date().getTime() - data.t;
                        }
                    },
                    error : function(xmlHttpRequest, error) {
                    }
                });
            }, delay);
        },
        current_time: function() {
            var me = this;
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/round' + dev,
                data: {},
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryRoundHandler',
                timeout: 10000,
                complete: function() {
                },
                success : function(data) {
                    if(data.result == true){
                        me.nowTime = timeTransform(data.sctm);
                        var nowTime = new Date().getTime();
                        var serverTime = data.sctm;
                        me.dec = nowTime - serverTime;
                        me.currentPrizeAct(data);
                    }else{
                        if(me.repeat_load){
                            me.repeat_load = false;
                            setTimeout(function(){
                                me.current_time();
                            },500);
                        }else{
                            me.change();
                        }
                    }
                },
                error : function(xmlHttpRequest, error) {
                    me.change();
                }
            });
        },
        currentPrizeAct: function(data) {
            var me = this, nowTimeStr = this.nowTime, prizeActListAll = data.la, prizeLength = 0, prizeActList = [], day = nowTimeStr.split(" ")[0];
            if(prizeActListAll && prizeActListAll.length > 0){
                for ( var i = 0; i < prizeActListAll.length; i++) {
                    if(prizeActListAll[i].pd == day){
                        prizeActList.push(prizeActListAll[i]);
                    }
                };
            }
            me.pal = prizeActList;
            prizeLength = prizeActList.length;
            if(prizeActList.length > 0) {
                if(comptime(prizeActList[prizeLength-1].pd + " " + prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    me.change();
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd + " " + prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd + " " + prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr, beginTimeStr) < 0 && comptime(nowTimeStr, endTimeStr) >= 0){
                        $('.countdown').addClass('shake');
                        return;
                    }
                    if(comptime(nowTimeStr, beginTimeStr) > 0){
                        me.beforeCountdown(prizeActList[i]);
                        return;
                    }
                };
            }else{
                me.change();
                return;
            }
        },
        beforeCountdown: function(prizeActList) {
            var me = this, beginTimeLong = timestamp(prizeActList.pd+" "+prizeActList.st);
            beginTimeLong += me.dec;
            $('.detail-countdown').attr('etime', beginTimeLong);
            me.count_down();
        },
        count_down : function() {
            var me = this;
            $('.detail-countdown').each(function() {
                $(this).countDown({
                    etpl: '<span class="fetal-H">%H%' + ':</span>' + '%M%' + ':' + '%S%', // 还有...结束
                    stpl: '<span class="fetal-H">%H%' + ':</span>' + '%M%' + ':' + '%S%', // 还有...开始
                    sdtpl : '',
                    otpl : '',
                    otCallback : function() {
                        if(!me.isTimeOver){
                            me.isTimeOver = true;
                            $('.countdown').addClass('shake');
                        }
                    },
                    sdCallback :function(){ 
                        me.isTimeOver = false;             
                    }
                });
            });
        },
        initPage: function() {
            $('textarea').val('');
            $('.img-preview').remove();
            $('.btn-upload').removeClass('none');
        },
        change: function() {
            $('.countdown').removeClass('shake').find(".countdown-tip").html('本期摇奖已结束');
        },
        tttj: function() {
            $('#tttj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        }
    };

    W.commonApiPromotionHandler = function(data) {
        if (data.code == 0 && data.desc && data.url) {
            $('#tttj').removeClass('none').find('p').text(data.desc || '');
            $('#tttj').click(function(e) {
                e.preventDefault();
                if ($("#btn-rule").hasClass('requesting')) {
                    return;
                }
                $("#btn-rule").addClass('requesting');
                shownewLoading(null, '请稍后...');
                location.href = data.url
            });
        } else {
            $('#tttj').remove();
        };
    };

    W.callbackQuestionRecordHandler = function(data) {
        var me = H.answer;
        if (data.code == 0) {
            if (data.anws) {
                me.anws = data.anws;
                me.question_support();
                return;
            }
        }
    };

    W.callbackQuestionRoundHandler = function(data){
        if(data.code == 0){
            var me = H.answer;
            me.surveyInfoUuid = data.qitems[0].quid;
            me.infordata = data;
            me.question_record();

            
            H.comments.commActUid = data.qitems[0].quid;
            H.comments.currentComments(H.comments.commActUid);
            var now = new Date();
            var currentYMD = now.getFullYear()+"-"+((now.getMonth()+1)<10?"0":"")+(now.getMonth()+1)+"-"+(now.getDate()<10?"0":"")+now.getDate();
            if(new Date(currentYMD).getTime() != new Date(data.pst.split(" ")[0]).getTime()){
                me.isSelect = true;
                me.$submitBtn.attr('class','subed').text("本期话题已结束");
            }
            me.spellCurrentHtml(data);

            if(data.qitems[0].ty==1){
                $("li").on('click', function(){
                    if(me.isSelect){
                        return;
                    }
                    $(this).addClass('ques-li').removeClass('ques-lied');
                    $(this).siblings().removeClass('ques-li').addClass('ques-lied');
                    //me.user_answer_uuid += "," + $(this).attr('id');
                    me.user_answer_uuid = "," + $(this).attr('id');
                });
            }else{
                $("li").on('click',function(){
                    if(me.isSelect){
                        return;
                    }
                    $(this).toggleClass('ques-li');
                    if($(this).hasClass('ques-li')){
                        me.user_answer_uuid += "," + $(this).attr('id');
                    }else{
                        me.user_answer_uuid = me.user_answer_uuid.replace("," + $(this).attr('id'),"");
                    }
                });
            }
        }else{
            $('.answer-box').append('<p class="free" id="free">本期话题已结束，敬请期待</p>');
            $('.topic-voice, .sx-ul, footer').addClass('none');
            $('.copyright').removeClass('none');
        }
    };

    W.callbackQuestionAnswerHandler = function (data){
        var me = H.answer;
        if (data.code == 0) {
            showTips("谢谢您参与调查");
            me.question_support();
        } else {
            showTips("话题还未开始~<br>请留意节目提示");
            me.isSubmit = false;
        }
    };

    W.callbackQuestionSupportHandler = function (data){
        var me = H.answer;
        if(data.code == 0){
            me.spellpercentHtml(data);
        }
    };
	
	W.callbackCommentsList = function(data){
		if(data.code == 0){
			if (data.items.length < H.comments.pageSize && data.kind == 0) {
				H.comments.loadmore = false;
			}
			if(data.items.length == H.comments.pageSize){
				if(H.comments.page == 0){
					H.comments.beforePage = 1;
					H.comments.page = 2;
				}else{
					H.comments.beforePage = H.comments.page;
					H.comments.page++ ;
				}
			}
			H.comments.tpl(data);

            $('#nor-comment li').unbind('click');
            $('#nor-comment li').click(function(e) {
                e.preventDefault();
                var me = this;
                if ($(me).hasClass('big')) {
                    $(me).removeClass('big');
                } else {
                    $('#nor-comment li').removeClass('big');
                    $(me).addClass('big');
                }
            });
		}else {
		}
	};
	
	W.callbackCommentsSave = function(data){
		if(data.code == 0 ){
			var headImg = null;
			if(headimgurl == null || headimgurl == ''){
				headImg = './images/avatar.png';
			}else{
				headImg = headimgurl + '/' + yao_avatar_size;
			}
			var t = simpleTpl(),$nor_comment = $('#nor-comment');
			t._('<li id="'+ data.uid +'" data-uuid = "'+ data.uid +'">')
			._('<section class="avatar"><img src="'+ headImg +'"/></section>')
			._('<div>')
				._('<label class="zan-'+data.uid+'" class="zan" data-collect="true" data-collect-flag="answer-zan" data-collect-desc="点赞按钮" >'+ 0 +'</label>')
				._('<p>'+ (nickname || '匿名用户') +'</p>')
				._('<p class="all-con" id="all-con'+ data.uid +'">')
					._('<span>'+ $("#comments-info").val() +'</span>')
				._('</p>')
				// ._('<a class="show-all none" id="show-all'+ data.uid +'" data-collect="true" data-collect-flag="answer-show" data-collect-desc="评论收缩显示">^显示全部</a>')
			._('</div>')
			._('</li>');

			if($nor_comment.children().length==0){
				$nor_comment.append(t.toString());
			}else{
				$nor_comment.children().first().before(t.toString());
			}
			H.comments.is_show(data.uid);
			$("#comments-info").val("");
			H.comments.bindZanClick("zan-"+data.uid);
			$('.com-head').find("label").html($('.com-head').find("label").html()*1+1);

			var navH = $("#"+data.uid).offset().top;
			$(window).scrollTop(navH);
			
			$("#send").removeAttr("disabled");
			$("#comments-info").removeAttr("disabled");
		}else{
			showTips('评论失败');
			// $("#comments-info").val("");
			$("#send").removeAttr("disabled");
			$("#comments-info").removeAttr("disabled");
		}

        $('#nor-comment li').unbind('click');
        $('#nor-comment li').click(function(e) {
            e.preventDefault();
            var me = this;
            if ($(me).hasClass('big')) {
                $(me).removeClass('big');
            } else {
                $('#nor-comment li').removeClass('big');
                $(me).addClass('big');
            }
        });
	};
	
	W.callbackCommentsPraise = function(data){
		if(data.code == 0){
			$(".curZan").text($(".curZan").text()*1 + 1);
			$(".curZan").removeClass("curZan");
		}
	};

    W.callbackQuestionInfoHandler = function(data) {
        if (data.code == 0) {
            var aitems = data.qitems;
            if (aitems) {
                H.answer.fillContent(data);
            } else {
                H.answer.loadError();
            };
        } else {
            H.answer.loadError();
        };
    };
})(Zepto);

$(function(){
    var exp = new Date();
    exp.setTime(exp.getTime() + 5*60*1000);
    if($.fn.cookie(openid + '_ruleShow') == null) {
        $.fn.cookie(openid + '_ruleShow', true, {expires: exp});
        H.dialog.rule.open();
    }
    H.comments.init();
	H.answer.init();
});