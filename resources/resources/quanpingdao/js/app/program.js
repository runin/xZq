
//******节目单******//

;(function($) {
	
	var classId= {
		$programList: $("#program-list"),
		$pYear: $("#p-year"),
		$pMonth: $("#p-month"),
		$pDay: $("#p-day"),
		$downTime: $(".down-time"),
		$programBox: $(".program-box")
	}
	
	H.program = {
		$next:false,
		$nowT:"",
		$startT:[],
		$endT:[],
		$page:1,
		$pageSize:20,
		init: function() {
			this.boxHFn();
			this.configFn();
			this.commonTimestr();
		},
		boxHFn: function() {
			var wH = $(window).height();
			classId.$programBox.css("min-height",wH-55);
		},
		configFn: function() {//加载logo
			getResult('api/channelhome/config', {}, 'callbackChannelhomeConfigHandler');
		},
		commonTimestr: function() {//当前系统时间
			getResult('api/common/timestr', {}, 'commonApiTimeStrHandler');
		},
		programlist: function() {//节目预约列表
			getResult('api/index/programlist', {page:H.program.$page, pageSize:H.program.$pageSize}, 'callbackProgramlistHander');
		},
		downTimeFn: function() {//倒计时
			function timeFn(time){
				classId.$downTime.html(time);
            };
			function endFn(){
				classId.$programList.find(".here").removeClass("here");
            };
			function hereFn(index){
				if(!H.program.$next || index==0) {
					classId.$programList.find("li").eq(index).addClass("here");
					H.program.$next == true;
					
				}else {
					$(".down-bg").addClass("downbg");
					setTimeout(function() {
						classId.$programList.find("here").removeClass("here").next().addClass("here");
					},500);
				}
				$(window).scrollTop(index*70);
				
            };
			
			
			var la = H.program.$startT;
			var timeArr=[];
			for(var i=0, leg=la.length; i<leg; i++) {
				var sctm = H.program.$nowT;//系统时间
				var pdst = parseInt(H.program.$startT[i]);//开始时间
				var pdet = parseInt(H.program.$endT[i]);//结束时间
				
				var item = {};
				item.st =pdst;
				item.et =pdet;
				item.index = i;
				timeArr.push(item);
			}
			
			$("<div></div>").countDown({
				timeArr: timeArr,
				countDownFn: function(t, time, index, obj, nowTime) { //每次倒数回调
					if(index == 0) {//还没开始
						timeFn(time);
						return;
					}
					timeFn(time);
					
				}, atTimeFn: function (dt, index, nextstartTime, obj, nowTime, endTime) {
					if (nextstartTime) {
						timeFn(obj.showTime(nextstartTime - nowTime));
					} else {
						timeFn(obj.showTime(endTime - nowTime));
					}
					
				}, inQuantumFn: function (t, index) {//在时间断内的回调函数 index 是倒到哪个时间断
				    hereFn(index);
					
				}, endFn: function (dt, index, obj, noTime) {//整个倒计时结束的回调
					endFn();
				}
			});
		}
	};
	
	W.callbackProgramlistHander = function(data) {//节目预约列表
		
		if(data && data.code == 0){
			var items = data.items;
			var t = simpleTpl();
			var cut = H.program.$nowT; //系统时间
			var y = cut.getFullYear();
			var m = cut.getMonth()+1;
			var d = cut.getDate();
			var h = cut.getHours();
			var n = cut.getMinutes();
			var s = cut.getSeconds();
			var ntimes = timestamp(y+"-"+m+"-"+d+" "+h+":"+n+":"+s);
			
			for(var i=0,leg=items.length; i<leg; i++) {
				var pd = items[i].pd;
				var pbt = timestamp(pd+" "+items[i].bt);//开始时间
				var pet = timestamp(pd+" "+items[i].et);//结束时间
				var minute = Math.floor((pet-pbt)/60000);
				var prgt = (items[i].bt).substring(0,5);//节目播放时间
				H.program.$startT.push(pbt);//每个时段的开始时间
				H.program.$endT.push(pet);//每个时段的结束时间
				
				if(pbt<ntimes && ntimes<pet) {
					t._('<li class="here" id="miao'+i+'">')
				}else {
					t._('<li id="miao'+i+'">')
				}
				t._('<div class="down-bg"></div>')
				t._('<div class="program-time">'+prgt+'</div>')
				t._('<div class="program-con">')
				t._('<span class="i-dian"><i></i><i></i><i></i></span>')
				t._('<span class="p-arrow"><i></i></span>')
				t._('<h2>'+items[i].n+'</h2>')
				t._('<p>时长：<label>'+minute+'</label>分钟</p>')
				t._('</div>')
				t._('</li>')
			}
			classId.$programList.empty().append(t.toString());
			H.program.downTimeFn();

		}else {
			$(".program-list").empty().append('<div class="noting">暂无节目</div>');
		}
	}; 
	
	W.commonApiTimeStrHandler = function(data) {//节目预约列表
	    var t = data.t////系统时间
		H.program.$nowT = new Date(t);
		
		classId.$pYear.text(t.substring(0,4));
		classId.$pMonth.text(t.substring(5,7));
		classId.$pDay.text(t.substring(8,10));
		H.program.programlist();
	};
	
	W.callbackChannelhomeConfigHandler = function(data) {//logo
	    if(data && data.code==0) {
			var icon = data.icon;
			$("#p-logo").css("background-image","url('"+icon+"')");
		}
	};
	
	H.program.init();
	
})(Zepto);