$(function(){
     var W  = window;
     var isToLottey = true;
     var isSbtRed = false;
     var times = 0;
     var thank_times = 0;
     var isCanShake = true;
     var istrue = true;

    var winHeight = $(window).height();
    $('.bangtuan').css('min-height', winHeight);

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
            //W.showLoading();
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
                   // W.hideLoading();
                },
                error: function () {
                    if (param.error) { param.error() };
                   // W.hideLoading();
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
            this.iTv = $(".itv");
            this.liuLiang = $(".liuliang");
            this.redHongbao = $(".redhongbao");
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
      			this.audioc = $("#audio-c");

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
        		this.audioNone = function() {
        			 var self = this;
        			 self.audioc.get(0).play();
                }

        this.init=function(data) {

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
                case 1://itv中奖
                     N.showPage("yao-gift",function(){
						             that.audioStop()//关闭摇声音
						             that.audioZj();//中奖声音
                    	   that.iTv.find("img").attr("src",data.pi);
                    	   that.iTv.find(".gift-text").html(data.ptt);
                         that.iTv.removeClass("none");
                         that.liuLiang.addClass("none");
                         that.redHongbao.addClass("none");
                         that.giftForm.removeClass("none");
                         //that.addressLi.removeClass("none");
                         that.giftQr.addClass("none");
                         $('.downContTime').attr('waiting','true');
                     });
                     break;
                case 5://流量包中奖
                     N.showPage("yao-gift",function(){
						             that.audioStop()//关闭摇声音
						             that.audioZj();//中奖声音
                    	   that.liuLiang.find("img").attr("src",data.pi);
                    	   that.liuLiang.find(".gift-text").html(data.ptt);
                         that.iTv.addClass("none");
                         that.liuLiang.removeClass("none");
                         that.redHongbao.addClass("none");
                         that.giftForm.removeClass("none");
                         that.addressLi.addClass("none");
                         that.giftQr.addClass("none");
                         $('.downContTime').attr('waiting','true');
                     });
                     break;
                case 4://红包中奖
                     N.showPage("yao-gift",function(){
                    	 $("#btnBoxc").click(function(){
                    		 if(isSbtRed){
                    			 return;
                    		 }
                    		 isSbtRed = true;
                    		 showLoading();
                    		 setTimeout(function(){
                         		location.href = data.redpack;
                    		 }, 500);
                    	 });
                    	 $(".gift-hongbao").click(function(){
                    		 if(isSbtRed){
                    			 return;
                    		 }
                    		 isSbtRed = true;
                    		 showLoading();
                    		 setTimeout(function(){
                         		location.href = data.redpack;
                    		 }, 500);
                    	 });
                    	 recordUserPage(openid, "今晚有礼了红包领奖页", '');
          						 that.audioStop()//关闭摇声音
          						 that.audioZj();//中奖声音
                    	 that.redHongbao.find("label").text(data.iv+"元");
                    	 that.redHongbao.removeClass("none");
                         that.iTv.addClass("none");
                         that.liuLiang.addClass("none");
                         that.redHongbao.removeClass("none");
                         that.giftForm.addClass("none");
                         that.giftQr.addClass("none");
                         $('.downContTime').attr('waiting','true');
                     });
                     break;
                default: 
                     N.showPage("yao-redbao",function() {
						 that.audioStop()//关闭摇声音
						 that.audioNone();//不中奖声音
                         that.yaoTexta.addClass("none");
                         that.yaoTextb.removeClass("none");
						 $(".yao-text p:last-child").find("span").addClass("yaonone-text").show();
			             isCanShake = true;
                   $('.downContTime').removeAttr('waiting');
                     });

            }

        }
        //this.init();

    });
    
    N.module("yaoShiwu", function() { 

        
        this.RealShiwu = function() {
            N.yaoRedbao.daojishi(N.sysytemTime,N.startTime);
        }



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
                  getResult('fjgift/award', {
                    yoi:openid,
                    ph:$("#textphone").val().trim(),
                    rl:encodeURIComponent($("#textname").val().trim()),
                    ad:encodeURIComponent($("#textaddress").val())
                  }, 'callbackFjGiftAward', true);

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
               H.dialog.showWin.open("请填写姓名！");
              // alert("请填写姓名！");
                return false;
            }
            if (this.textPhone.val().trim() == "") {//手机号码
               H.dialog.showWin.open("请填写手机号码！");
               //alert("请填写手机号码！");
                return false;
            }
            if (!/^\d{11}$/.test(this.textPhone.val())) {//手机号码格式
                H.dialog.showWin.open("这手机号，可打不通...");
                //alert("这手机号，可打不通...");
                return false;
            }
            if(this.addressLi.css("display") != "none") {
                 if (this.textAddress.val().length < 5 || this.textAddress.val().length > 60) {//地址
                    H.dialog.showWin.open("地址长度应在5到60个字！");
                    //alert("请填写地址！");
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
          me.current_time();
		      me.shake();
          me.ddtj();
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
                recordUserOperate(openid, "福建今晚有礼了摇手机", "fj-gift-shake");
                times++;

                if(!(times % 3 == 0)){
                  isToLottey = false;
                }
                if(thank_times >= 4){
                  isToLottey = false;
                }

                $("#audio-a").get(0).play();//摇声音
                $('.yao-redbao').addClass('bbtimg');
                $(".yao-text p:first-child,.yao-text p:last-child").find("span").hide();
                $(".yao-text p:last-child").find("span").removeClass("yaonone-text");
                if(!openid || openid=='null' || isToLottey == false){
                  setTimeout(function(){
                    N.yaoRedbao.init(null);//摇一摇
                  }, 1000);
                  setTimeout(function(){
                    $('.yao-redbao').removeClass('bbtimg');
                  }, 1000);
                }else{
                  getResult('fjgift/fjlottery', {openid:openid,actUid:H.yao.commActUid}, 'fjGiftLotteryHandler',true);
                }
                isToLottey = true;
              }
            },
        current_time: function(){
          getResult('express/lotteryactivity', {}, 'expressLotteryActivityHandler', true, null, false);
        },

        currentPrizeAct:function(data){
          //获取抽奖活动
          var prizeActList = data.activity,
            prizeLength = data.activity.length,
            nowTimeStr = H.yao.now_time,
            me = this;
          
          if(comptime(prizeActList[prizeLength-1].ap+" "+prizeActList[prizeLength-1].ae,nowTimeStr) > 0){
        	  toUrl("support.html");
        	  return;
          }
          for ( var i = 0; i < prizeActList.length; i++) {
            var beginTimeStr = prizeActList[i].ap+" "+prizeActList[i].ab;
            var endTimeStr = prizeActList[i].ap+" "+prizeActList[i].ae;
            if(comptime(beginTimeStr,nowTimeStr) >= 0 && comptime(nowTimeStr,endTimeStr) >=0){
            	H.yao.commActUid = prizeActList[i].au;
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
          toUrl("support.html");
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
                      toUrl("support.html");
                    });
                  } else { //当抽奖时间结束自动跳到support.html
                    setTimeout(toUrl("support.html"), 1000);
                  };
                }
              },
              sdCallback :function(){
              }
            });
          });
        }
      };
    W.expressLotteryActivityHandler = function(data){
    if(data.code == 0){
      H.yao.now_time = data.tm;
      H.yao.currentPrizeAct(data);
    }
  }

    W.fjGiftLotteryHandler = function(data){
      if(!$("#yao-redbao").hasClass("none")) {
        setTimeout(function(){
            N.yaoRedbao.init(data);//摇一摇
        }, 1000);
        
      }
        setTimeout(function(){
            $('.yao-redbao').removeClass('bbtimg');
        }, 600);
    }

    W.callbackFjGiftAward = function(data){
      if(data.code == 0){
            N.showPage("yao-gift",function() {
                  $("#gift-form").addClass("none");
                  $("#gift-qr").removeClass("none");

                  if($(".address").css("display") == "none") {
                     $("#qrAddress").addClass("none");
                  }else {
                     $("#qrAddress").removeClass("none");
                  }
                  $("#touchName").text($("#textname").val().trim());
                  $("#touchPhone").text($("#textphone").val().trim());
                  $("#touchAddress").text($("#textaddress").val());
            });
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
});