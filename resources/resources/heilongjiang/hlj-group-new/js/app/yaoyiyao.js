$(function(){
     var W  = window;
     var isToLottey = true;
     var isSbtRed = false;
     var times = 0;
     var thank_times = 0;
     var isCanShake = true;
    //页面的最小高度
    var winH = $(window).height();
    $(".bangtuan").css("min-height",winH-50);
    H.dialog.mytry.open("龙视公共频道《欢乐英雄转》<br/>每天18:20~19:25<br/>现金红包  回馈观众<br/>唱响黑土  转遍龙江");
    setTimeout(function(){
    	$("#guide-dialog").addClass("none");
    }, 4000);

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
             this.yaoRedbao = $("#yao-redbao");
             this.yaoGift = $("#yao-gift");
             this.redHongbao = $(".redhongbao");
             this.yaoTexta = $(".yao-text p:first-child");
             this.yaoTextb = $(".yao-text p:last-child");
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
             
             if(winners == 4) {//中红包

                N.showPage("yao-gift",function(){
                	that.audioStop()//关闭摇声音
		            that.audioZj();//中奖声音
                   that.redHongbao.find("label").text(data.iv+"元");
                   //领红包点击确认后跳转回首页
                   $("#btnBoxc").click(function(){
                	   if(isSbtRed){
              			 return;
              		 }
              		 isSbtRed = true;
              		 showLoading();
                       	location.href = data.redpack;
                   });

                });
              } else { //不中红包
                   N.showPage("yao-redbao",function() {
			             that.audioStop()//关闭摇声音
			             that.audioNone();//中奖声音
                         that.yaoTexta.addClass("none");
                         that.yaoTextb.removeClass("none");
                         $(".yao-text p:last-child").find("span").addClass("yaonone-text").show();
                   });
		           isCanShake = true;
              }

        }
        //this.init();

    });


    H.yao = {
        commActUid:null,
        now_time : null,
        check:null,
        init : function(){
          var me = this;
          me.current_time();
          me.shake();
        },
        shake: function() {
            W.addEventListener('shake', H.yao.shake_listener, false);
        },

        unshake: function() {
            W.removeEventListener('shake', H.yao.shake_listener, false);
        },

            shake_listener: function() { 
	           	 if(isCanShake){
	         		 isCanShake = false;
	         	 }else{
	         		 return;
	         	 }
              if(!$("#yao-redbao").hasClass("none")) {
    	         recordUserOperate(openid, "黑龙江欢乐英雄传摇手机", "hlj-group-shake");
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
	                  getResult('hlj/lottery', {openid:openid,actUid:H.yao.commActUid}, 'hljLotteryHandler',true);
	            }
	     		isToLottey = true;
              }
            },
        current_time: function(){
          getResult('express/lotteryactivity', {}, 'expressLotteryActivityHandler');
        },

        currentPrizeAct:function(data){
          //获取抽奖活动
          var prizeActList = data.activity,
              prizeLength = data.activity.length,
              nowTimeStr = H.yao.now_time,
              me = this;
          
          if(comptime(prizeActList[prizeLength-1].ap+" "+prizeActList[prizeLength-1].ae,nowTimeStr) > 0){
        	  //toUrl("index.html");
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
          //toUrl("index.html");
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
					//setTimeout(toUrl("index.html"), 1600);
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
    W.hljLotteryHandler = function(data){
      
        setTimeout(function() {
             N.yaoRedbao.init(data);//摇一摇
             $('.yao-redbao').removeClass('bbtimg');
        }, 1000)       
    
        setTimeout(function(){
            $('.yao-redbao').removeClass('bbtimg');
        }, 600);
    }

});
$(function(){
	setTimeout(function(){
		H.yao.init();
    }, 1100);
});