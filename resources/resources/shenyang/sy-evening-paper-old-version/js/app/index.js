var leftCount = 0,
	nowTime = null,
	isLottery = true,
	$rule_section = $('.rule-section'),
	$record_section=$('.record-section'),
	$con_htm = $('.con'),
	$con_record = $('.con-record');

    $(function() {
	imgReady(index_bg, function() {
		$('#tab').removeClass('none').addClass('bounce-in-up');
		$('#jifen').attr('href', "user.html");
		getResult('findyou/info',{},'callbackFindyouInfo',true);
		getResult('user/jf', {oi: openid}, 'callbackUserjfHandler', true);

		/*imgReady(title_img, function() {
			$('#logo').css('background-image', 'url('+ title_img +')').addClass('swing');
		});*/
		//getResult('news/travel', {},'newsTravelHandler');
		setTimeout(function(){
			$('#award').addClass('cjani1');
			setTimeout(function(){$('#award').removeClass('cjani1').addClass('cjani2')}, 2600);
		}, 50);
		getResult('api/lottery/leftLotteryCount', {oi:openid}, 'callbackLotteryleftLotteryCountHandler');
	});
	$('#apply').click(function(){
		toUrl('signup.html?uuid=' + $('#apply').attr('data-uuid'));
	});
	$('#pinglun-cxt').click(function(){
		toUrl('comments.html');
	});
	$('#baoliao-cxt').click(function(){
		toUrl('baoliao.html');
	});
	$('#yanshen-cxt').click(function(){
		toUrl('list.html');
	});
	$("#toupiao-cxt").click(function(){
		if(openid == "" || openid == null){
			return;
		}
		if(getQueryString('from') || getQueryString('gefrom') || !getQueryString('cb41faa22e731e9b')) {
			showTips('看电视-玩微信-摇一摇-抢大奖<br/>对着电视摇进来才能摇奖哦',2,3000);
			return;
		}
		toUrl("answer.html");
	});

		$('#award').click(function(e){
			e.preventDefault();
			if (isLottery) {
				isLottery = false;
			}
			H.dialog.fudai.open();
		});

   
	$(".rule").click(function(){
		getResult('common/activtyRule/'+serviceNo, {}, 'callbackRuleHandler', true);
	});
	
	 $("#rule-close").click(function(){
		$('.rule-section').addClass('none');
	});
	$("#record-close").click(function(){
		$('.record-section').addClass('guide-top-ease');
			setTimeout(function()
			{
				$('.record-section').addClass('none');
				$('.record-section').removeClass('guide-top-ease');
		},700);
	});
});

window.onload = function(){
	var pinglunCxt = function(){
		var canvas = document.getElementById('pinglun-cxt');
		if(canvas.getContext){
			var cxt = canvas.getContext('2d');

			cxt.arc(105, 105, 75, Math.PI*1.5, 0, true);
			cxt.lineWidth = 60.0;
			cxt.strokeStyle= 'rgba(255, 128, 35, .63)';
			cxt.stroke();
			cxt.font = 'bold 15px Arial';
			cxt.fillStyle = '#fff';
			cxt.fillText('我要', 25, 60,60);
			cxt.fillText('评论', 25, 80,60);

			var img=document.getElementById("ping-img");
			cxt.drawImage(img,125,35,36,36);

		}
	};
	pinglunCxt();

	var baoliaoCxt = function(){
		var canvas = document.getElementById('baoliao-cxt');
		if(canvas.getContext){
			var cxt = canvas.getContext('2d');

			cxt.arc(0, 105, 75, 0, Math.PI*1.5, true);
			cxt.lineWidth = 60.0;
			cxt.strokeStyle= 'rgba(238, 101, 172, .63)';
			cxt.stroke();
			cxt.font = 'bold 15px Arial';
			cxt.fillStyle = '#fff';
			cxt.fillText('我要', 45, 60,60);
			cxt.fillText('爆料', 45, 80,60);

			var img=document.getElementById("baoliao-img");
			cxt.drawImage(img,45,35,36,44);

		}
	};
	baoliaoCxt();

	var yanshenCxt = function(){
		var canvas = document.getElementById('yanshen-cxt');
		if(canvas.getContext){
			var cxt = canvas.getContext('2d');

			cxt.arc(105, 0, 75, Math.PI*1.5, Math.PI*0.5, true);
			cxt.lineWidth = 60.0;
			cxt.strokeStyle= 'rgba(238, 101, 172, .63)';
			cxt.stroke();
			cxt.font = 'bold 15px Arial';
			cxt.fillStyle = '#fff';
			cxt.fillText('新闻', 45, 60,60);
			cxt.fillText('延伸', 45, 80,60);

			var img=document.getElementById("yanshen-img");
			cxt.drawImage(img,50,30,39,30);

		}
	};
	yanshenCxt();

	var toupiaoCxt = function(){
		var canvas = document.getElementById('toupiao-cxt');
		if(canvas.getContext){
			var cxt = canvas.getContext('2d');

			cxt.arc(0, 0, 75, 0, Math.PI*0.5, false);
			cxt.lineWidth = 60.0;
			cxt.strokeStyle= 'rgba(255, 128, 35, .63)';
			cxt.stroke();
			cxt.font = 'bold 15px Arial';
			cxt.fillStyle = '#fff';
			cxt.fillText('我要', 30, 60,60);
			cxt.fillText('投票', 30, 80,60);

			var img=document.getElementById("toupiao-img");
			cxt.drawImage(img,115,30,39,39);

		}
	};
	toupiaoCxt();
};

var lotteryRound = function(){
	getResult('api/lottery/round', {}, 'callbackLotteryRoundHandler');
};
var showLottery = function() {
	$('#award').removeClass('none');
	$('.awardline').removeClass('none');
	$('.tab span').css('margin', '0 12px');
};
var hideLottery = function() {
	$('#award').addClass('none');
	$('.awardline').addClass('none');
	$('.tab span').css('margin', '0 20px');
};
var timeTransform = function(TimeMillis){
	var data = new Date(TimeMillis);
	var year = data.getFullYear();
	var month = data.getMonth()>9?(data.getMonth()+1).toString():'0' + (data.getMonth()+1);//获取月
	var day = data.getDate()>9?data.getDate().toString():'0' + data.getDate(); //获取日
	var hours = data.getHours()>9?data.getHours().toString():'0' + data.getHours();
	var minutes = data.getMinutes()>9?data.getMinutes().toString():'0' + data.getMinutes();
	var ss = data.getSeconds()>9?data.getSeconds().toString():'0' + data.getSeconds();
	var time = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":"+ ss;
	return time;
};
var comptime = function (beginTime, endTime){
	var beginTimes=beginTime.substring(0,10).split('-');
	var endTimes=endTime.substring(0,10).split('-');
	beginTime=beginTimes[1]+'-'+beginTimes[2]+'-'+beginTimes[0]+' '+beginTime.substring(10,19);
	endTime=endTimes[1]+'-'+endTimes[2]+'-'+endTimes[0]+' '+endTime.substring(10,19);
	var a =(timestamp(endTime)-timestamp(beginTime))/3600/1000;
	if(a<0){
		return -1;
	}else if (a>0){
		return 1;
	}else if (a==0){
		return 0;
	}else{
		return -2
	}
}
var lotteryAct = function(data){
	var prizeActListAll = data.la,
		prizeLength = 0,
		nowTimeStr = timeTransform(data.sctm),
		prizeActList = [],
		day = nowTimeStr.split(" ")[0];

	if(prizeActListAll && prizeActListAll.length > 0) {
		for (var i = 0; i < prizeActListAll.length; i++) {
			if(prizeActListAll[i].pd == day){
				prizeActList.push(prizeActListAll[i]);
			}
		}
	};
	prizeLength = prizeActList.length;
	if(prizeActList.length >0){
		if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) > 0) {
			isLottery = false;
			hideLottery();
			return;
		};
		if(comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].st,nowTimeStr) >= 0 && comptime(prizeActList[prizeLength-1].pd+" "+prizeActList[prizeLength-1].et,nowTimeStr) <= 0 && leftCount<=0){
			isLottery = false;
			hideLottery();
			return;
		};
		for (var i = 0; i < prizeActList.length; i++) {
			var beginTimeStr = prizeActList[i].pd+" "+prizeActList[i].st;
			var endTimeStr = prizeActList[i].pd+" "+prizeActList[i].et;
			var beginTime = str2date(beginTimeStr), endTime = str2date(endTimeStr), nowTime = str2date(nowTimeStr);
			if(comptime(beginTimeStr,nowTimeStr) >= 0 && comptime(nowTimeStr,endTimeStr) >= 0 && leftCount > 0){
				isLottery = true;
				var lastEndTime = new Date(endTime).getTime() - new Date(nowTime).getTime();
				setTimeout(function() {hideLottery();isLottery = false;}, lastEndTime);
				showLottery();
			};
			if (comptime(beginTimeStr,nowTimeStr) < 0) {
				isLottery = false;
				var lastBeginTime = new Date(beginTime).getTime() - new Date(nowTime).getTime();
				var lastEndTime = new Date(endTime).getTime() - new Date(nowTime).getTime();
				setTimeout(function() {showLottery();isLottery = true;}, lastBeginTime);
				setTimeout(function() {hideLottery();isLottery = false;}, lastEndTime);
			};
		};
	} else {
		isLottery = false;
		hideLottery();
		return;
	};
};

var tzIsShow = function(data){
	if(data.desc && (comptime(data.pst, data.cut)>= 0 && comptime(data.cut, data.pet)>= 0)){
		//$rule_section.find('h2').empty().text('通 知');
		$con_record.html(data.desc);
		$record_section.removeClass('none');
	}
};
window.newsTravelHandler=function (data){
	if(data.code == 0){
		$('#apply').removeClass('none');
		$("#apply").prev().removeClass('none');
		$('#apply').attr('data-uuid',data.id);
	}
};
window.callbackUserjfHandler = function(data) {
	if (data.code == 0) {
		if (data.hn > 0) {
			$('#jifen').addClass('news');
		}
	}
};

window.callbackRuleHandler = function(data) {
	if (data.code == 0) {
		$rule_section.find('h2').empty().text('活动规则');
		$con_htm.html(data.rule);
		$rule_section.removeClass('none');
	}
};

window.callbackLotteryleftLotteryCountHandler = function(data){
	if(data.result){
		leftCount = data.lc;
		lotteryRound();
	} else {
		hideLottery();
	}
};

window.callbackLotteryRoundHandler = function(data) {
	if(data.result){
		lotteryAct(data);
	} else {
		hideLottery();
	}
};

window.callbackFindyouInfo = function(data){
	if(data.code == 0){
		tzIsShow(data);
	}
};