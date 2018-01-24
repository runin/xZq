$(function(){
    H.yao = {
        commActUid:null,
        now_time : null,
        check:null,
        nowTime: null,
        isCanShake:true,
        isToLottey:true,
        times:0,
        timesLimmit:getRandomArbitrary(4,7),
        yaoBg:[],
        istrue:true,
        first:true,
        isReady:false,
        canJump:true,
        wxCheck:false,
        isError:false,
        init : function(){
            var me = this;
            me.current_time();
		    me.shake();
            $("#test").click(function(){
                me.shake_listener();
            });
            $(".contact-url").click(function(e){
                e.preventDefault();
                location.href = contact_url;
            });
            me.account_num();
            setInterval(function(){
                me.account_num();
            },5000);
            me.red_record();
            setInterval(function(){
                me.red_record();
            },10000);
            me.leftPrizeCount();
            setInterval(function(){
                me.leftPrizeCount();
            },5000);
            me.ddtj();

        },
        ddtj: function() {
            $('#ddtj').addClass('none');
            getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        },
        wxConfig: function(){
            //后台获取jsapi_ticket并wx.config
            getResult("mp/jsapiticket", {
                appId: shaketv_appid
            }, 'callbackJsapiTicketHandler', false);
        },
        shake: function() {
            W.addEventListener('shake', H.yao.shake_listener, false);
        },
        thanks: function() {
            $("#audio-a").get(0).pause();
            $("#audio-c").get(0).play();//不中奖声音
            $(".texta").addClass("none");
            $(".textb").removeClass("none");
            $(".textb").addClass("yaonone-text").show();
            H.yao.textMath();
            H.yao.isCanShake = true;
        },
        scroll: function(options) {
            $('.marquee').each(function(i) {
                var me = this, com = [], delay = 1000;
                var len  = $(me).find('li').length;
                var $ul = $(me).find('ul');
                if (len == 0) {
                    $(me).addClass('none');
                } else {
                    $(me).removeClass('none');
                }
                if(len > 1) {
                    com[i] = setInterval(function() {
                        $(me).find('ul').animate({'margin-top': '-20px'}, delay, function() {
                            $(me).find('ul li:first').appendTo($ul)
                            $(me).find('ul').css({'margin-top': '0'});
                        });
                    }, 3000);
                };
            });
        },
        imgMath: function() {//随机背景
            if(H.yao.yaoBg.length >0){
                var i = Math.floor((Math.random()*H.yao.yaoBg.length));;
                $("body").css("backgroundImage","url('"+H.yao.yaoBg[i]+"')");
            }
        },
        textMath: function() {//随机文案
            if(textList.length >0){
                var i = Math.floor((Math.random()*textList.length));;
                $(".textb").text(textList[i]);
            }
        },
        downloadImg: function(){
            var t = simpleTpl();
            for(var i = 0;i < H.yao.yaoBg.length;i++){
                t._('<img src="'+H.yao.yaoBg[i]+'" style="width:0px;heigth:0px;">')
            }
            $("body").append(t.toString());
        },
        shake_listener: function() {
          if(H.yao.isCanShake){
              H.yao.isCanShake = false;
          }else{
            return;
          }
          if(!$("#yao-redbao").hasClass("none")) {
              recordUserOperate(openid, "CCTV7乡约摇手机", "cctv7-meet-shake");
              recordUserPage(openid, "cctv7乡约摇手机", 0);
              H.yao.times++;
                if(!(H.yao.times % H.yao.timesLimmit == 0)){
                    H.yao.isToLottey = false;
                }

              if(!$(".home-box").hasClass("yao")) {
                  $("#audio-a").get(0).play();
                  H.yao.imgMath();
                  $(".textb").removeClass("yaonone-text");
                  $(".home-box").addClass("yao");
              }
                if(!openid || openid=='null' || H.yao.isToLottey == false){
                  setTimeout(function(){
                    H.yao.thanks();//未中奖
                  }, 1000);
                }else{
                    if(!H.yao.wxCheck){
                        //微信config失败
                        setTimeout(function(){
                            H.yao.thanks();//未中奖
                        }, 1000);
                        return;
                    }
                    H.yao.drawlottery();
                }

              setTimeout(function() {
                  $(".home-box").removeClass("yao");
              },1000);
              H.yao.isToLottey = true;
          }
        },
        current_time: function(){
            getResult('api/lottery/round', 'callbackLotteryRoundHandler',true);
        },
        //查询当前参与人数
        account_num: function(){
            getResult('log/serpv ', {}, 'callbackCountServicePvHander');
        },
        //查询最新20条中奖记录
        red_record: function(){
            getResult('api/lottery/allrecord', {}, 'callbackLotteryAllRecordHandler');
        },
        //查询业务当前抽奖活动有限制奖品剩余数量
        leftPrizeCount:function(){
            getResult('api/lottery/leftDayCountLimitPrize',{},'callbackLeftDayCountLimitPrizeHandler');
        },
        currentPrizeAct:function(data){
            //获取抽奖活动
            var prizeActListAll = data.la,
                prizeLength = 0,
                nowTimeStr = H.yao.nowTime,
                prizeActList = [];
            var day = nowTimeStr.split(" ")[0];
            if(prizeActListAll&&prizeActListAll.length>0){
                for ( var i = 0; i < prizeActListAll.length; i++) {
                    if(prizeActListAll[i].pd == day){
                        prizeActList.push(prizeActListAll[i]);
                    }
                }
            }
            prizeLength = prizeActList.length;
            if(prizeActList.length >0){
                //如果最后一轮结束
                if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) >= 0){
                    H.yao.change();
                    return;
                }
                for ( var i = 0; i < prizeActList.length; i++) {
                    var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
                    var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
                    //在活动时间段内且可以抽奖
                    if(comptime(nowTimeStr,beginTimeStr) <0 && comptime(nowTimeStr,endTimeStr) >=0){
                        if(prizeActList[i].bi.length>0){
                            H.yao.yaoBg = prizeActList[i].bi.split(",");
                            H.yao.downloadImg();
                        }
                        H.yao.isLottery = true ;
                        var beginTimeLong = timestamp(endTimeStr);
                        var nowTime = Date.parse(new Date())/1000;
                        var serverTime = timestamp(nowTimeStr);
                        if(nowTime > serverTime){
                            beginTimeLong += (nowTime - serverTime);
                        }else if(nowTime < serverTime){
                            beginTimeLong -= (serverTime - nowTime);
                        }
                        $('.detail-countdown').attr('etime',beginTimeLong);
                        H.yao.count_down();
                        $(".countdown").removeClass("none");
                        return;
                    }
                    if(comptime(nowTimeStr,beginTimeStr) > 0){
                        H.yao.change();
                        return;
                    }

                }
            }else{
                H.yao.change();
                return;
            }
        },
        change: function(){
            shownewLoading();
            toUrl("main.html");
        },
        // 倒计时
        count_down : function() {
          $('.detail-countdown').each(function() {
            var $me = $(this);
            $(this).countDown({
              etpl : '<span class="time">' + '%H%' + '</span><span>小时</span><span class="time">' + '%M%' + '</span><span>分</span><span class="time">' + '%S%' + '</span><span>秒</span>', // 还有...结束
              stpl : '<span class="time">' + '%H%' + '</span><span>小时</span><span class="time">' + '%M%' + '</span><span>分</span><span class="time">' + '%S%' + '</span><span>秒</span>', // 还有...开始
              sdtpl : '',
              otpl : '',
              otCallback : function() {
                  // canJump 用来判断倒计时结束后是否可以自动跳转 默认 为 true;
                  // 当前有中奖弹层弹出时 canJump = false; 不能跳转
                  // 同时增加重复判断，进入判断后 canJump = false; 不能重复进入
                  if(H.yao.canJump){
                      H.yao.canJump = false;
                      H.yao.change();
                  }
              },
              sdCallback :function(){
              }
            });
          });
        },
        drawlottery:function(){
            shownewLoading();
            $.ajax({
                type : 'GET',
                async : false,
                url : domain_url + 'api/lottery/luck',
                data: { oi: openid },
                dataType : "jsonp",
                jsonpCallback : 'callbackLotteryLuckHandler',
                complete: function() {
                    hidenewLoading();
                },
                success : function(data) {
                    if(data && data.result && data.pt != 0){
                        setTimeout(function(){
                            $('.yao-redbao').removeClass('bbtimg');
                            H.dialog.lottery.open();
                            H.dialog.lottery.update(data);
                        }, 1000);
                    }else{
                        setTimeout(function(){
                            H.yao.thanks();
                        }, 1000);
                    }
                },
                error : function() {
                    setTimeout(function(){
                        H.yao.thanks();
                    }, 1000);
                }
            });
        }
      };
    W.callbackLotteryRoundHandler = function(data){
        if(data.result == true){
            hidenewLoading();
            H.yao.nowTime = timeTransform(data.sctm);
            H.yao.currentPrizeAct(data);
        }else{
            H.yao.change();
        }
    };

    W.callbackCountServicePvHander = function(data){
        if(data.code == 0){
            $(".count label").html(data.c);
            $(".count").removeClass("hidden");
        }
    }

    W.callbackLotteryAllRecordHandler = function(data){
        if(data.result){
            var list = data.rl;
            if(list && list.length>0){
                var con = "";
                for(var i = 0 ; i<list.length; i++){
                    con +="<li>"+(list[i].ni || "匿名用户")+"中了"+list[i].pn+"</li>";
                }
                var len = $(".marquee").find("li").length;
                if(len >= 500){
                    $(".marquee").find("ul").html(con);
                }else{
                    $(".marquee").find("ul").append(con);
                }
                if(H.yao.first){
                    H.yao.first = false;
                    H.yao.scroll();
                }
                $(".marquee").removeClass("none");
            }
        }
    }

    W.callbackLeftDayCountLimitPrizeHandler = function(data){
        if(data.result){
            $(".rednum").find("span").text(data.lc);
            if(data.lc == 0){
                $(".rednum").addClass("none");
            }else{
                $(".rednum").removeClass("none");
            }
        }
    }

    W.callbackJsapiTicketHandler = function(data) {
        var url = window.location.href.split('#')[0];
        var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
        var timestamp = Math.round(new Date().getTime()/1000);
        var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
        //权限校验
        wx.config({
            debug: false,
            appId: shaketv_appid,
            timestamp: timestamp,
            nonceStr:nonceStr,
            signature:signature,
            jsApiList: [
                "addCard",
                "checkJsApi"
            ]
        });
    };

    W.commonApiPromotionHandler = function(data){
        if (data.code == 0 && data.desc && data.url) {
            $('#ddtj').attr('href', (data.url || '')).removeClass('none');
            $(".contact-info").addClass("none");
        } else {
            $('#ddtj').remove();
            $(".contact-info").removeClass("none");
        };
    }
});
$(function(){
    var hei = $(window).height();
    $("body").css("height",hei+"px");
    if(is_android()){
        $(".main-top").css("height",(hei/2+0.5)+"px");
        $(".main-foot").css("height",(hei/2+0.5)+"px");
    }
    shownewLoading();
    //config微信jssdk
    H.yao.wxConfig();

    wx.ready(function () {
        H.yao.isReady = true;
        wx.checkJsApi({
            jsApiList: [
                'addCard'
            ],
            success: function (res) {
                var t = res.checkResult.addCard;
                //判断checkJsApi 是否成功 以及 wx.config是否error
                if(t && !H.yao.isError){
                    H.yao.wxCheck = true;
                }
            }
        });
        //wx.config成功
        //执行业务代码
        H.yao.init();
    });

    wx.error(function(res){
        H.yao.isError = true;
//        alert(JSON.stringify(res));
        //wx.config失败，重新执行一遍wx.config操作
        //H.record.wxConfig();
    });
});