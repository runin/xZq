
; (function (w) { 
    H.index={
       	loadData: function (param) {
			var p = $.extend({ url: "", type: "get", async: false, dataType: "jsonp", showload: true }, param);
			if (p.showload) {
				W.showNewLoading();
			}
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
			if (/test/.test(domain_url)) {
				if (!param.data) {
					param.data = {};
				}
				param.data.dev = "jiawei";
			}
			$.ajax({ type: p.type, data: param.data, async: p.async, url: p.url, dataType: p.dataType, jsonpCallback: cbName,
				success: function (data) {
		
					W.hideNewLoading();
					cbFn(data);
		
				},
				error: function () {
					if (param.error) { param.error() };
					W.hideNewLoading();
					// H.dialog.showWin.open("抱歉网络延迟，请稍后再试！");
				}
			});
		},
		rule: function() {
			function html() {
				var t = simpleTpl();
				t._('<section class="shade">')
				t._('<div class="rule-box">')
				t._('<div class="rule-con">')
				t._('<a href="###" class="rule-close"></a>')
				t._('<h2 class="rule-text"></h2>')
				t._('</div>')
				t._('</div>')
				t._('</section>')
				$("body").append(t.toString());
			}
			$(".rule-btn").unbind("click").click(function() {
				$("body").delegate(".rule-close","click",function(e) {
					$(".rule-box").removeClass("out").addClass("go");
					setTimeout(function() {
						$(".shade").addClass("none");
					    $(".rule-box").removeClass("go");
					},550);
				});
				if($("body").find(".rule-box").length == 0) {
					html();
					$(".rule-box").addClass("out");
					H.index.loadData({ url: domain_url + "api/common/rule", commonApiRuleHandler: function(data) {
						if(data.code == 0){
							$(".rule-text").html(data.rule);
						}
					}});
				}else {
					$(".shade").removeClass("none");
					$(".rule-box").addClass("out");
				}
			});
		},
        praiseFn: function() {//点赞
		    var that = this;
			$(".btn-zan a").unbind("click").click(function() {
				var zan = null;
				var mun = 0;
				if($(this).hasClass("has")) {
					return;
				}
				if($(this).hasClass("grey")) {
					$(".d-time,#jqqd-text").addClass("dtime");
					setTimeout(function() {
						$(".d-time,#jqqd-text").removeClass("dtime");
					},600)
					return
				}
				zan = $(this).attr("id");
				mun = parseInt($("."+zan).text());
				window.episodeuuid = $(this).attr("data-uid");
				$("."+zan).text(mun+=1);
				$(this).addClass("has").text("已 赞");
                $.fn.cookie("ClickIndex",H.index.ClickIndex);
				$.fn.cookie(window.episodeuuid+"",window.episodeuuid);
                H.index.loadData({url:domain_url+'api/article/praize?time='+new Date().getTime(),callbackArticledetailPraizeHandler:function(data){
                  	window.location.href= "./smashing_golden_egg.html?uuid="+window.episodeuuid+"";
                },data: {uid:window.episodeuuid, op:openid}});
				setTimeout(function() {
					window.location.href= "./smashing_golden_egg.html?uuid="+window.episodeuuid+"";
				},1000);

			})
            },
           changeSile:function(index){
            	$(".btn-zan a").eq(index).removeClass("none").siblings().addClass("none");
            },
           scroll:function(){
         		H.index.loadData({url: domain_url+'api/article/list',callbackArticledetailListHandler:function(data){
				var arts = data.arts;
				if(arts && data.code == 0) {
					var t = simpleTpl();
					var b = [];
					for(var k=0; k<arts.length; k++) {
						t._('<div class="swiper-slide" data-uid="'+arts[k].uid+'" id="uid'+k+'">')
						t._('<p class="swiperimg-p" style="background-image:url('+arts[k].img+')">')
						t._('<span class="uid'+k+'"></span>')
						t._('</p>')
						t._('<h2 class="swiper-text">'+arts[k].i+'</h2>')
						t._('</div>')
						
						if(k==0) {
							b.push('<a href="javascript:void(0)" class="btn-a grey" id="uid'+k+'" data-uid="'+arts[k].uid+'" data-collect="true" data-collect-flag="winners-zan" data-collect-desc="点赞">点 赞</a>');
						}else {
							b.push('<a href="javascript:void(0)" class="btn-a grey none" id="uid'+k+'" data-uid="'+arts[k].uid+'" data-collect="true" data-collect-flag="winners-zan" data-collect-desc="点赞">点 赞</a>');
						}
					}
					    $("#swiper-img").append(t.toString());
				    	$(".btn-zan").append(b.join(""));
                     	H.index.praiseFn();
                        $('.arrow-left').on('click', function(e){
						    e.preventDefault();
						    mySwiper.swipePrev();
						})
						$('.arrow-right').on('click', function(e){
						    e.preventDefault();
						    mySwiper.swipeNext();
				    	});
					var mySwiper = new Swiper('.swiper-container',{
						pagination: '.pagination',
						loop:true,
						grabCursor: true,
						paginationClickable: true,
                        onInit:function(){//初始化后执行的事件

                        },
						onSlideChangeEnd: function(swiper){
							var index = $(".swiper-active-switch").index();
							H.index.changeSile(index);
						}
					 })
				
				}
			}});
        
        },
        getActivityTime:function(){//取列表时间
         	H.index.loadData({url: domain_url+'api/lottery/round',callbackLotteryRoundHandler:function(data){
              if(data.result){//成功
                   H.index.dowmCountFn(data);
              }else{
                   alert("抱歉请求数据失败");
              }
            }});
        },
        dowmCountFn:function(data){
            function showJq(){//显示敬请期待
                $("#jqqd-text").removeClass("none");//敬请期待文本
				$(".btn-zan a").addClass("grey");
				$(".d-time").addClass("none");
             };
             function hideJq(){//隐藏敬请期待
                $("#jqqd-text").addClass("none");//敬请期待文本
             }
             function showDownCount(time){//显示倒计时
                $(".d-time").removeClass("none");
                $("#downTime").html(time);
				$(".btn-zan a").addClass("grey");
             };
             function hideDownCount(start){//隐藏倒计时
                $(".d-time").addClass("none");
                if(start){
                	$(".btn-zan a").addClass("grey");
                }else{
                 	$(".btn-zan a").removeClass("grey");
                }
             };
             H.index.CountArr=[];//时间数组
             for(var i=0,len=data.la.length;i<len;i++){
                 var item ={};
				 var pdst = parseInt(timestamp(data.la[i].pd+" "+data.la[i].st));//开始时间
				 var pdet = parseInt(timestamp(data.la[i].pd+" "+data.la[i].et));//结束时间 
				 item.st =pdst;
				 item.et =pdet;
                 item.index = i;
                 H.index.CountArr.push(item);
             }
            $(".downcountValue").countDown({
			    timeArr:  H.index.CountArr,
			    countDownFn: function (t, tmp,index) {//每次倒数回调
       
                    if(index==0){
                       hideDownCount(true);
                       showJq();
                       return;
                    }else{
                        showDownCount(tmp);
                        hideJq();
                    }
			    },atTimeFn: function(that,index,startTime,o,t,et){
      
                     H.index.ClickIndex =index;
                     if($.fn.cookie("ClickIndex")==index){
                       hideJq();
                       if(startTime==0&&(t>= et )){
                             window.location.href = "last.html";
                             return;
                       }
                       if(startTime==0&&(t<et)){
                           showDownCount(o.showTime(et-t));
                           $(".btn-zan a").removeClass("grey");
                           $("#time-tips").html("离结束还有：");
                 
                          return;
                       }
                       showDownCount(o.showTime(startTime-t));
                       return;
                     }
				     hideDownCount();
                     hideJq();

			    },inQuantumFn: function(t, startTime) {//在时间断内的回调函数 index 是倒到哪个时间断
 
                   
			    },endFn: function(t) {//整个倒计时结束的回调
            
                   setTimeout(function(){
                       window.location.href = "last.html";
                   },2000);
			    }
		    });

        },
		praiseAllFn: function() {//获取点赞数
			H.index.loadData({url: domain_url+'api/article/allpraizecount',callbackArticledetailPraizeCountHandler:function(data){
				var arts = data.arts;
				if(data.code == 0) {
					for(var i=0; i<arts.length; i++) {
						$("#swiper-img").find(".uid"+i+"").text(arts[i].cc);
						if(arts[i].ex) {
							$(".btn-zan a").eq(i).addClass("has").text("已 赞");
						}
					}
				}else {
				    var items = $(".btn-zan a");
					for(var i=0;i<items.length;i++) {
						 var item = $(items[i]);
						 if(item.attr("data-uid") == $.fn.cookie(item.attr("data-uid"))){
							item.addClass("has").text("已 赞");
						 }
					}
				}
			},error: function() {
				var items = $(".btn-zan a");
				  for(var i=0;i<items.length;i++) {
					   var item = $(items[i]);
					   if(item.attr("data-uid") == $.fn.cookie(item.attr("data-uid"))){
						  item.addClass("has").text("已 赞");
					   }
				  }
			},data:{
				op:openid
			}})
		},
        init:function(){
		  $.fn.cookie("outside",null);
		  
          this.scroll();//拉列表
          this.getActivityTime();//取列表时间 并且初始化倒计时
		  this.praiseAllFn();
		  this.rule();
        }

   };
   H.index.init();

})(window);
