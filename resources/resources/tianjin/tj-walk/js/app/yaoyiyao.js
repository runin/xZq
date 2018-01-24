$(function(){
    var W  = window;
    var isToLottey = true;
    var isSbtRed = false;
    var times = 0;
    var thank_times = 0;
    var isCanShake = true;
    var istrue = true;
    var winHeight = $(window).height();
    var timesLimmit = Math.ceil(2*Math.random() + 3);

    var N = {
        showPage: function (pageName, fn, pMoudel) {
            var mps = $(".page");
            mps.addClass("none");
            mps.each(function (i, item) {
                var t = $(item);
                if (t.attr("id") == pageName) {
                    t.removeClass("none");
                    N.currentPage = t;
                    if (fn) {
                        fn(t);
                    };
                    return false;
                }
            })
        },
        loadData: function (param) {
            var p = $.extend({ url: "", type: "get", async: false, dataType: "jsonp", jsonp: "callback" }, param);
            var connt = 0;
            var cbName = "";
            var cbFn = null;
            for (var i in param) {
                connt++;
                if (connt == 2) {
                    cbName = i;
                    cbFn = param[i];
                    break;
                }
            }
            if (cbName && cbFn && !W[cbName]) { W[cbName] = cbFn; }
            $.ajax({ type: p.type, data: param.data, async: p.async, url: p.url, dataType: p.dataType, jsonp: p.jsonp, jsonpCallback: cbName,
                success: function () {
                },
                error: function () {
                    if (param.error) { param.error() };
                }
            });
        },
        module: function (mName, fn) {
            !N[mName] && (N[mName] = new fn());
        }
    };

  
    N.module("yaoRedbao", function(){ 
        this.RedEnvelope = function() {
            this.yaoRedbao = $("#yao-redbao .yao-redbao");
            this.yaoTexta = $("#yao-redbao .yao-text p:first-child");
            this.yaoTextb = $("#yao-redbao .yao-text p:last-child");
            this.timeText = $("#yao-redbao .time-text");

            this.zjGift = $(".yao-gift");
            this.redHongbao = $(".redhongbao");
            this.giftCode = $(".gift-code");
            this.giftForm = $("#gift-form");
            this.addressLi = $(".address");
            this.qrAddress = $("#qrAddress");
            this.giftQr = $("#gift-qr");
            
            this.idRedbao = $("#yao-redbao");
            this.idShiwu = $("#yao-shiwu");

            this.textName = $("#textname");
            this.textPhone = $("#textphone");
            this.textAddress = $("#textaddress");
			
      			this.audioa = $("#audio-a");
      			this.audiob = $("#audio-b");

        }
		
        		this.audioStart = function() {
        			 var self = this;
        			 self.audioa.get(0).play();
                }
        		this.audioStop = function() {
        			 var self = this;
        			 self.audioa.get(0).pause();
                }
        		this.audioZj = function() {
        			 var self = this;
        			 self.audiob.get(0).play();
                }

        this.init=function(data) {
            $('.yao-redbao').removeClass('bbtimg');
             this.RedEnvelope();
             N.showPage("yao-redbao");
             var that = this;
             var winners = data ? data.pt : 0;//判断是否中奖
             if(winners == 2){
                 thank_times ++;
             }else{
                 thank_times = 0;
             }
			 
            switch(winners)
            {
                case 4://红包中奖
                     N.showPage("yao-gift",function(){
                    	 $("#btnBoxc").click(function(){
                    		 if(isSbtRed){
                    			 return;
                    		 }
                    		 isSbtRed = true;
                    		 shownewLoading();
                    		 setTimeout(function(){
                         		location.href = data.rp;
                    		 }, 500);
                    	 });
                    	 $(".gift-hongbao").click(function(){
                    		 if(isSbtRed){
                    			 return;
                    		 }
                    		 isSbtRed = true;
                    		 shownewLoading();
                    		 setTimeout(function(){
                         		location.href = data.rp;
                    		 }, 500);
                    	 });
                    	 recordUserPage(openid, "天津乡村行红包领奖页", '');
          						 that.audioStop()//关闭摇声音
          						 that.audioZj();//中奖声音
                    	 that.redHongbao.find(".gift-hongbao-img").attr('src', (data.pi || ''));
                    	 that.redHongbao.removeClass("none");
                       that.giftCode.addClass("none");
                       that.giftForm.addClass("none");
                       that.giftQr.addClass("none");
                       $('.downContTime').attr('waiting','true');
                     });
                     break;
                case 5://兑换码奖品
                     N.showPage("yao-gift",function(){
                       $("#btn-ok").click(function(e){
                        e.preventDefault();
                        getResult('api/lottery/award', {
                          oi: openid,
                          nn: (nickname ? encodeURIComponent(nickname) : encodeURIComponent('匿名用户'))
                        }, 'callbackLotteryAwardHandler');
                        that.giftCode.addClass("none");
                        that.redHongbao.addClass("none");
                        that.zjGift.addClass('none');
                        that.idRedbao.removeClass('none');
                        $('.downContTime').removeAttr('waiting');
                        $(".yao-text p:last-child").addClass('none');
                        $('.yao-text-default').removeClass('none').find('span').css('display', 'block');
                        isCanShake = true;
                       });
                       recordUserPage(openid, "天津乡村行兑换码领奖页", '');
                       isCanShake = false;
                       that.audioStop()//关闭摇声音
                       that.audioZj();//中奖声音
                       that.giftCode.find(".gift-code-img").attr('src', (data.pi || ''));
                       that.giftCode.find(".gift-code-tips").html(data.tt || '恭喜您中奖了~');
                       if (data.cc.split(',')[0]) {
                        that.giftCode.find(".gift-code-code").text(('兑换码: ' + data.cc.split(',')[0]) || '');
                       }
                       if (data.cc.split(',')[1]) {
                        that.giftCode.find(".gift-code-password").text(('密码: ' + data.cc.split(',')[1]) || '');
                       }
                       that.giftCode.find(".gift-code-reserved").html(data.pd || '');
                       that.giftCode.removeClass("none");
                       that.giftForm.addClass("none");
                       that.giftQr.addClass("none");
                       $('.downContTime').attr('waiting','true');
                     });
                     break;
                default: 
                     N.showPage("yao-redbao",function() {
                        that.audioStop();
                        that.yaoTexta.addClass("none");
                        that.yaoTextb.removeClass("none");
                        $(".yao-text p:last-child").find("span").addClass("yaonone-text").show();
                        isCanShake = true;
                        $('.downContTime').removeAttr('waiting');
                    });
            }

        }
    });
    
    N.module("yaoShiwu", function() { 
        this.RealShiwu = function() {
            N.yaoRedbao.daojishi(N.sysytemTime,N.startTime);
        };
    });

    N.module("yaoGift", function() { //中奖后填写信息

        this.FormWrite = function() {
            this.textName = $("#textname");
            this.textPhone = $("#textphone");
            this.textAddress = $("#textaddress");
            this.addressLi = $(".address");
            this.previewBtn = $("#btnBoxa");
            this.homeBtn = $("#btnBoxb");
            this.redBtn = $("#btnBoxc");
       }

        this.submitForm = function() {
            var that = this;
            this.previewBtn.click(function() {
                if(that.checkParam()) { //假如验证通过
                  getResult('api/lottery/award', {
                    oi:openid,
                    ph:$("#textphone").val().trim(),
                    rn:encodeURIComponent($("#textname").val().trim()),
                    ad:encodeURIComponent($("#textaddress").val())
                  }, 'callbackLotteryAwardHandler', true);
		             	isCanShake = true;
                }
            });

           this.homeBtn.click(function() {
                       N.showPage("yao-redbao",function() {
                           $("#yao-redbao .yao-text p:first-child").removeClass("none");
                           $("#yao-redbao .yao-text p:last-child").addClass("none");
                            that.idRedbao.removeClass("none");
   			             	isCanShake = true;
                      $('.downContTime').removeAttr('waiting');
                        });
            });
        }

        this.checkParam = function() {//验证参数

            if (this.textName.val().trim() == "") {//姓名
               showTips("请填写姓名！");
                return false;
            }
            if (this.textPhone.val().trim() == "") {//手机号码
               showTips("请填写手机号码！");
                return false;
            }
            if (!/^\d{11}$/.test(this.textPhone.val())) {//手机号码格式
                showTips("这手机号，可打不通...");
                return false;
            }
            if(this.addressLi.css("display") != "none") {
                 if (this.textAddress.val().length < 5 || this.textAddress.val().length > 60) {//地址
                    showTips("地址长度应在5到60个字！");
                    return false;
                }
            }
            return true;
    
        };

        this.init=function() {
            this.FormWrite();
            this.submitForm();

        }
        this.init();


    });

    N.module("giftQr", function() { //确认填写信息

        this.giftTouch = function() {
            this.touchName = $("#touchName");
            this.touchPhone = $("#touchPhone");
            this.touchAddress = $("#touchAddress");

            this.touchName.text(this.textName.val());
            this.touchPhone.text(this.textPhone.val());
            this.touchAddress.text(this.addressLi.val());
        }

        this.init=function() {
            this.RedEnvelope();
            this.InitTime();
            N.showPage("gift-qr");
        }

    });


    H.yao = {
        commActUid:null,
        now_time : null,
        check:null,
        init : function(){
          var me = this;
          if (!openid) {
            return false;
          };
          me.ddtj();
          me.current_time();
		      me.shake();
        },
        ddtj: function() {
          $('#ddtj').addClass('none');
          getResult('api/common/promotion', {oi: openid}, 'commonApiPromotionHandler');
        },
            shake: function() {
                W.addEventListener('shake', H.yao.shake_listener, false);
            },

            unshake: function() {
                
            },

            shake_listener: function() {
              if(isCanShake){
	         		 isCanShake = false;
              }else{
                return;
              }
              if(!$("#yao-redbao").hasClass("none")) {
                recordUserOperate(openid, "天津乡村行摇一摇", "shake");
                times++;

                if(!(times % timesLimmit == 0)){
                  isToLottey = false;
                }
                if(thank_times >= 9){
                  isToLottey = false;
                }

                $('.yao-redbao').addClass('bbtimg');
                $("#audio-a").get(0).play();
                $(".yao-text p:first-child,.yao-text p:last-child").find("span").hide();
                $(".yao-text p:last-child").find("span").removeClass("yaonone-text");
                if(!openid || openid=='null' || isToLottey == false){
                  setTimeout(function(){
                    N.yaoRedbao.init(null);
                  }, 1000);
                }else{
                  getResult('api/lottery/luck', {oi: openid}, 'callbackLotteryLuckHandler', true);
                }
                isToLottey = true;
              }
            },
        current_time: function(){
          getResult('api/lottery/round', {}, 'callbackLotteryRoundHandler', true, null, false);
        },

        currentPrizeAct:function(data){
          //获取抽奖活动
          var prizeActList = data.la,
            prizeLength = data.la.length,
            nowTimeStr = H.yao.now_time,
            me = this;
          $('.bangtuan').animate({'opacity':'1'}, 300);
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
                // 当中奖和倒计时没有waiting属性不自动跳转
                if(istrue){
                   istrue = false;
                  if ($('.downContTime').attr('waiting')) {
                    $("#btnBoxb").click(function(event) {
                      $('.downContTime').removeAttr('waiting');
                      toUrl("index.html");
                    });
                  } else { //当抽奖时间结束自动跳到index.html
                      toUrl("index.html");
                  };
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

    W.callbackLotteryLuckHandler = function(data){
      if(!$("#yao-redbao").hasClass("none")) {
        setTimeout(function(){
            N.yaoRedbao.init(data);//摇一摇
        }, 1000);
      }
        setTimeout(function(){
            $('.yao-redbao').removeClass('bbtimg');
        }, 1000);
    }

    W.callbackLotteryAwardHandler = function(data){
      if(data.result){
        showTips('领取成功!');
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
	setTimeout(function(){
		H.yao.init();
  }, 1000);
  var winW = $(window).width(),
      winH = $(window).height();
  $('body, #gift-code').css({
    'width': winW,
    'height': winH
  });
  var lotteryW = Math.ceil(winW * 0.8);
  var lotteryH = Math.ceil(lotteryW * 790 / 545);
  $('.gift-code-content').css({
    width: lotteryW,
    height: lotteryH,
    top: Math.ceil((winH - lotteryH) / 2),
    left: Math.ceil((winW - lotteryW) / 2)
  });
  // $('#redBug').click(function(e) {
  //   e.preventDefault();
  //   H.yao.shake_listener();
  // });
});