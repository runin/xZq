(function($) {
	var classId = {
		$nickname: $("#nickname"),
		$headimg: $(".headimg")
	};
	
	H.index = {
		$hstime:[],//互动时间
		$hcud:null,//互动系统时间
		//预约
		$tvid:[],
		$reserveid:[],
		$datetime:[],
		
		init: function() {

			this.nowtimtFn();
			this.nicknameFn();
			this.friendsFn();
		},
		
		nowtimtFn: function() {//查询当前系统时间
		    getResult('api/common/time', {}, 'commonApiTimeHandler');
		},
		
		nicknameFn: function() {
			var headimgurl = window.headimgurl?window.headimgurl+"/64":"images/avatar.jpg";
			var nickname = window.nickname?window.nickname:"匿名";
			classId.$headimg.css("background-image","url('"+headimgurl+"')");
			classId.$nickname.html(nickname);
		},
		
		
		changeSileFn: function(index){//获取滚动图片的第几个
            $(".enter p").eq(index).removeClass("none").siblings().addClass("none");
        },
		
		getTimeImgFn: function() {//节目管理(首页滚动图片)
			getResult('index/programlist', {}, 'callbackRcommendProgramlistHander');
		},
		
		dowmCountFn: function(index) {//不同时间段的倒计时
			var arr=[];
			var ym =  H.index.$hcud;
			var gety = ym.getFullYear();
			var getm = ym.getMonth()+1;
			var getd = ym.getDate();
			var hst,het;
			var sarray = H.index.$hstime;
			var leg = $("#swiper-img>div");
			for(var i=0; i<leg.length; i++) {
				clearInterval(window["down"+i]);
			}
			
            var d = $("<div></div>");
            d.html(sarray[index]);
			var s = d.text();
			var sa = s.substr(0,8);
			var ea = s.substr(9,8);
			
			hst = gety+"-"+getm+"-"+getd+" "+sa;
			het = gety+"-"+getm+"-"+getd+" "+ea;

			var pdst = parseInt(timestamp(hst));//开始时间
			var pdet = parseInt(timestamp(het));//结束时间 
			var item = {};
			item.st =pdst;
			item.et =pdet;
	
			arr.push(item);
			
            function endFn(){
              $(".timebox"+index).addClass("none");
			  $("#interact"+index).addClass("none").siblings().addClass("none");
            }

			$(".down"+index).countDown({
				id:"down"+index,
				timeArr: arr,
				countDownFn: function (t, tmp) {//每次倒数回调;
					 $("#interact"+index).addClass("none").siblings().removeClass("none");
				}, atTimeFn: function (t, startTime) {//在时间断内的回调函数 index 是倒到哪个时间断
                  
					 $(".timebox"+index).addClass("none");
					 $("#interact"+index).removeClass("none").siblings().addClass("none");
				}, endFn: function(t) {//整个倒计时结束的回调
                      endFn();   
					
				}
			});
		},

		bespeakFn: function() {//预约活动请求
		    var leg = this.$reserveid.length;
			for(var i=0; i<leg; i++) {
				var reserveid = H.index.$reserveid[i];
				var date = H.index.$datetime[i];
				
				if(reserveid) {
					window['shaketv'] && shaketv.preReserve_v2({tvid:yao_tv_id, reserveid:reserveid, date:date}, function(resp) {
						if (resp.errorCode == 0) {
						    $(".bespeak"+i).removeClass("grey");
						}else if(resp.errorCode == -1007) {//已经预约过的
							$(".bespeak"+i).addClass("grey");//隐藏按钮
						}
					});
				}else {
					$(".bespeak"+i).addClass("grey");//隐藏按钮
				}
			}
			this.reserveFn();
		},
		
		reserveFn: function() {//点击预约
		    $("body").delegate(".enter a.yy-btn","click",function(e) {
				e.preventDefault();
				if($(this).hasClass("grey")) {
					return;
				}
				var id = $(this).attr("id");
				var reserveid = $(this).attr("data-reserve");
				var date = $(this).attr("data-date");
				if(!reserveid) {
					return;
				}
				
				//shaketv.reserve_v2({tvid:10048, reserveid:155370, date:20151120},function(data) {
				shaketv.reserve_v2({tvid:yao_tv_id, reserveid:reserveid, date:date},function(data) {
					if(data.errorCode == 0) {//预约成功回调
						$("#"+id).addClass("grey");//隐藏按钮
					}
				});
			});
		},
		
	
		friendsFn: function() {//温馨提示
		    var that = this;
			$(".user-gold").unbind("click").click(function() {
				var t = simpleTpl();
				t._('<section class="pop-bg">')
				t._('<div class="friends-tips in-up">')
				t._('<div class="friends-tips-text">成功参与互动即可获得不同数量的福荔币，收集福荔币，可在奖池兑换多种好礼！</div>')
				t._('<a href="javascript:void(0);" class="btn-b" id="iknow">我知道了</a>')
				t._('</div>')
				t._('</section>')
				$("body").append(t.toString());
				that.closeFn("#iknow",".friends-tips");
			})
		},
		
		closeFn: function(classid,conclass) {//关闭弹层
			$(classid).click(function() {
				$(conclass).removeClass("in-up").addClass("out-down");
				setTimeout(function() {
					$(".pop-bg").remove();
				},400);
			});
		}
		
	};
	
	W.commonApiTimeHandler = function(data) {//获取系统当前时间串
	    H.index.$hcud = new Date(parseInt(data.t));
		H.index.getTimeImgFn();
	}
	
	W.callbackRcommendProgramlistHander = function(data) {//首页滚动图
	    if(data&&data.code == 0){
			var items = data.items;
			var t = simpleTpl();
			var p = simpleTpl();
			for(var k=0, leg=items.length; k<leg; k++) {
				t._('<div class="swiper-slide" data-uid="'+items[k].uid+'" id="uid'+k+'">')
				t._('<div class="scroll-img" style="background-image:url('+items[k].is+')">')
				t._('<div class="down-time timebox'+k+'">距离互动开始还有 <lable class="d-time down'+k+'"></lable></div>')
				t._('</div>')
				t._('</div>')
				
				if(k==0) {
					p._('<p class="btnbox'+k+'">')
					p._('<a href="'+items[k].gourl+'" class="btn-a none" id="interact'+k+'" data-interact="'+items[k].uid+'" data-collect="true" data-collect-flag="education-jrhd" data-collect-desc="进入互动">进入互动</a>')
					p._('<a href="javascript:void(0)" class="btn-a yy-btn bespeak'+k+' none" id="bespeak'+k+'" data-reserve="'+items[k].reserveId+'" data-date="'+items[k].date+'" data-collect="true" data-collect-flag="education-yy" data-collect-desc="预约">预约</a>')
					p._('</p>')
					
				}else {
					p._('<p class="none btnbox'+k+'">')
					p._('<a href="'+items[k].gourl+'" class="btn-a none" id="interact'+k+'" data-interact="'+items[k].uid+'" data-collect="true" data-collect-flag="education-jrhd" data-collect-desc="进入互动">进入互动</a>')
					p._('<a href="javascript:void(0)" class="btn-a yy-btn bespeak'+k+' none" id="bespeak'+k+'" data-reserve="'+items[k].reserveId+'" data-date="'+items[k].date+'" data-collect="true" data-collect-flag="education-yy" data-collect-desc="预约">预约</a>')
					p._('</p>')
				}
				H.index.$hstime.push(items[k].pd);//每个互动时间
				H.index.$tvid.push(items[k].rds);//节目tvid
				
				H.index.$reserveid.push(items[k].reserveId);//业务reserveid
				H.index.$datetime.push(items[k].date);//预约时间
			}
			
			$("#swiper-img").append(t.toString());
			$(".enter").append(p.toString());
			H.index.dowmCountFn(0);
			H.index.bespeakFn();//预约请求
			
			var mySwiper = new Swiper('.swiper-container',{
				pagination: '.pagination',
				loop:true,
				grabCursor: true,
				paginationClickable: true,
				onInit:function(){//初始化后执行的事件
				},
				onSlideChangeEnd: function(swiper){
					var index = $(".swiper-active-switch").index();
					H.index.changeSileFn(index);
					H.index.dowmCountFn(index);
				}
			});
		}
	};
	
	
	H.index.init();

})(Zepto);