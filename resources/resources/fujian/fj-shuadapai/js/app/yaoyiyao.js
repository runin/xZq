$(function(){
    H.yao = {
        commActUid:null,
        now_time : null,
        check:null,
        times:0,
        isCanShake:true,
        lotteryTime:getRandomArbitrary(3,6),
        isToLottey:false,
        redpack:null,
        canJump:true,
        init : function(){
          var me = this;
          if (!openid) {
            return false;
          };
          me.event();
          me.ddtj();
          me.current_time();
          me.shake();
        },
        event:function(){
            var me =this;
            $('#btn-rule').click(function(e) {
                e.preventDefault();
                H.dialog.rule.open();
            });
            $("#test").click(function(){
                me.shake_listener();
            });
            $("#red-award").click(function(){
                if(!$(this).hasClass("flag")){
                    $(this).addClass("flag");
                    $(".red-img").addClass("flag");
                    shownewLoading();
                    $(this).html("领取中");
                    location.href = me.redpack;
                }
            });
            $(".red-img").click(function(){
                if(!$(this).hasClass("flag")){
                    $("#red-award").addClass("flag");
                    $(this).addClass("flag");
                    shownewLoading();
                    $("#red-award").html("领取中");
                    location.href = me.redpack;
                }
            });
            $("#gift-award").click(function(){
                if(me.check()){
                    var $mobile = $('.phone'),
                        mobile = $.trim($mobile.val()),
                        $name = $('.name'),
                        name = $.trim($name.val()),
                        $address = $('.address'),
                        address = $.trim($address.val());
                    getResult('api/lottery/award', {
                        nn: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                        hi: headimgurl ? headimgurl : "",
                        oi: openid,
                        rn: encodeURIComponent(name),
                        ph: mobile,
                        ad:encodeURIComponent(address)
                    }, 'callbackLotteryAwardHandler', true, me.$dialog);
                }
            });
            $("#gift-sure").click(function(){
               $("input").val("");
               $("input").attr("disabled","");
               $(".ple-tip").html("请填写您的手机号，以便顺利领奖");
                $(this).addClass("none");
                $("#gift-award").removeClass("none");
                $("#yao-redbao").removeClass("zoomOut").removeClass("none");
                $("#yao-gift").addClass("none");
                $(".yao-text-default").removeClass("none");
                $(".yao-cool-tips").addClass("none");
                H.yao.isCanShake = true;
                H.yao.canJump = true;
            });
        },
        check:function(){
            var $mobile = $('.phone'),
                mobile = $.trim($mobile.val()),
                $address = $('.address'),
                address = $.trim($address.val()),
                $name = $('.name'),
                name = $.trim($name.val());
            if (name.length > 20 || name.length == 0) {
                showTips('请输入您的姓名，不要超过20字哦!');
                return false;
            }else if (!/^\d{11}$/.test(mobile)) {
                showTips('这手机号，可打不通...');
                return false;
            }else if(address.length == 0){
                showTips('请填写正确的地址');
                return false;
            }
            return true;
        },
        textMath: function() {
            if(textList.length >0){
                var i = Math.floor((Math.random()*textList.length));;
                $(".yao-cool-tips span").text(textList[i]);
            }
        },
        ddtj: function() {
          $('#ddtj').addClass('none');
          getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        },
        shake: function() {
            W.addEventListener('shake', H.yao.shake_listener, false);
        },
        shake_listener: function() {
            if(H.yao.isCanShake){
                H.yao.isCanShake = false;
            }else{
                return;
            }
            recordUserOperate(openid, "谁来耍大牌摇手机", "fjqy-shuadapai-shake");
            recordUserPage(openid, "谁来耍大牌摇手机", 0);

            if(!$(".yao").hasClass("bbtimg")) {
                $("#audio-a").get(0).play();
                $(".yao-cool-tips").removeClass("yaonone-text");
                $(".yao").addClass("bbtimg");
            }

            H.yao.times++;
            if(H.yao.times % H.yao.lotteryTime == 0){
                H.yao.isToLottey = true;
            }
            if(!openid || openid=='null' || H.yao.isToLottey == false){
                setTimeout(function(){
                    H.yao.fill(null);//摇一摇
                }, 1500);
            }else{
                H.yao.drawlottery();
                H.yao.isToLottey = false;
            }
        },
        fill:function(data){
            setTimeout(function() {
                $(".yao").removeClass("bbtimg");
            },500);
            if(data == null || data.result == false || data.pt == 0){
                $("#audio-a").get(0).pause();
                $(".yao-text-default").addClass("none");
                H.yao.textMath();
                $(".yao-cool-tips").removeClass("none");
                $(".yao-cool-tips").addClass("yaonone-text").show();
                H.yao.isCanShake = true;
                return;
            }else{
                $("#audio-a").get(0).pause();
                $("#audio-b").get(0).play();//中奖声音
                H.yao.point_gift(data);
            }
        },
        point_gift:function(data){
            if(data.pt == 4){
                H.yao.canJump = false;
                //中红包
                $(".yao-red").find(".red-img").attr("src",data.pi);
                H.yao.redpack = data.rp;
                $("#yao-redbao").addClass("zoomOut");
                setTimeout(function(){
                    $("#yao-redbao").addClass("none");
                    $("#yao-red").removeClass("none").addClass("zoomIn");
                },1000);
            }else if(data.pt == 1){
                H.yao.canJump = false;
                //中红包
                $(".yao-gift").find(".gift-img").attr("src",data.pi);
                $(".yao-gift").find(".con-tip").html(data.tt);
                $(".yao-gift").find(".name").html(data.rn);
                $(".yao-gift").find(".phone").html(data.ph);
                $(".yao-gift").find(".address").html(data.ad);
                $("#yao-redbao").addClass("zoomOut");
                setTimeout(function(){
                    $("#yao-redbao").addClass("none");
                    $("#yao-gift").removeClass("none").addClass("zoomIn");
                },1000);
            }
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
                    setTimeout(function(){
                        H.yao.fill(data);//摇一摇
                    }, 1500);
                },
                error : function() {
                    setTimeout(function(){
                        H.yao.fill(null);//摇一摇
                    }, 1500);
                }
            });
        },
        current_time: function(){
          getResult('api/lottery/round', {}, 'callbackLotteryRoundHandler', true);
        },
        currentPrizeAct:function(data){
          //获取抽奖活动
          var prizeActList = data.la,
            prizeLength = data.la.length,
            nowTimeStr = H.yao.now_time,
            me = this;
          if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) > 0){
        	  toUrl("index.html");
        	  return;
          }
          for ( var i = 0; i < prizeActList.length; i++) {
            var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
            var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
            if(comptime(beginTimeStr,nowTimeStr) >= 0 && comptime(nowTimeStr,endTimeStr) >=0){
            	H.yao.commActUid = prizeActList[i].ud;
            	var endTimeLong = timestamp(endTimeStr);
    			     var nowTime = Date.parse(new Date())/1000;
            	var serverTime = timestamp(nowTimeStr);
        			if(nowTime > serverTime){
        				endTimeLong += (nowTime - serverTime);
        			}else if(nowTime < serverTime){
        				endTimeLong -= (serverTime - nowTime);
        			}
                $('.downContTime').attr('etime',endTimeLong);
                H.yao.count_down();
                $(".time-text").removeClass("none");
                return;
            }
          }
          toUrl("index.html");
  		  return;
        },
        // 倒计时
        count_down : function() {
          $('.downContTime').each(function() {
            var $me = $(this);
            $(this).countDown({
              etpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...结束
              stpl : '%H%' + '<label class="dian">:</label>' + '%M%' + '<label class="dian">:</label>' + '%S%', // 还有...开始
              sdtpl : '',
              otpl : '',
              otCallback : function() {
                  // canJump 用来判断倒计时结束后是否可以自动跳转 默认 为 true;
                  // 当前有中奖弹层弹出时 canJump = false; 不能跳转
                  // 同时增加重复判断，进入判断后 canJump = false; 不能重复进入
                  if(H.yao.canJump){
                      H.yao.canJump = false;
                      $(".time-text").html("摇奖结束");
                      toUrl("index.html");
                  }
              },
              sdCallback :function(){
              }
            });
          });
        }
      };
    W.callbackLotteryRoundHandler = function(data){
        if(data.result){
          H.yao.now_time = timeTransform(data.sctm);
          H.yao.currentPrizeAct(data);
        } else {
            toUrl("index.html");
        }
    }

    W.callbackLotteryAwardHandler = function(data){
          if(data.result){
              showTips('领取成功!');
              $(".ple-tip").html("提交成功，工作人员稍后会联系您");
              $("input").attr("disabled","disabled");
              $("#gift-award").addClass("none");
              $("#gift-sure").removeClass("none");
          }
    }

    W.commonApiPromotionHandler = function(data){
    if (data.code == 0 && data.desc && data.url) {
      $('#ddtj').text(data.desc || '').attr('href', (data.url || '')).removeClass('none');
    } else {
      $('#ddtj').remove();
    };
  }
});
$(function(){
    var hei = $(window).height();
    $("body,html").css("height",hei+"px");
    H.yao.init();
});