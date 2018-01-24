var h_s = 3600;
var m_s = 60;
var div_ele_temp = '<div class="box-orient-h newlistbox %statusClass%" name="%timerv%" id="%bTime%"><div class="time"><span>%time%</span></div><div class="gcontent box-flex"><h3>%name%</h3><h4>时长：%duration%</h4></div></div>';
var now = new Date();
var pjson_path = rs_domain_url + "resources/programlist/" + stationUuid + "/" + channelUuid + "/programlist-" + now.getFullYear() +"-"+ c((now.getMonth()+1)) + "-" +  c(now.getDate()) + ".js";
var status_class="";
var task;
var bocu_task;
$(function() {
	$.getScript(pjson_path, function(){
		  $("#h2-channel").empty().html(l.c);
		  $("#h2-date").empty().html(now.getFullYear()+"年"+(now.getMonth()+1)+"月"+now.getDate()+"日节目导视");
		  var parray = l.p;
		  var $newlist = $("div.newlist");
		  for(var i =0; i<parray.length; i++){
			  var object = parray[i];
			  $newlist.append(div_ele_temp.replace("%time%", t(object.b)).replace("%bTime%", (object.b)).replace("%name%",object.n).replace("%duration%", calc(object.d)).replace("%statusClass%", s(object.b, object.d)).replace("%timerv%", (object.d*1000)));
		  }
		  scr();
		  bocu_task = setInterval("bocu()", 10000);
	});
});

function scr(){
	var $selected = $("div.selected");
	if($selected.length > 0 && $selected.offset() && $selected.offset().top && $selected.offset().top > 0){
		$("html,body").animate({scrollTop : $selected.offset().top}, 800);
	}
}

function calc(d){
	if(d < 30)
		return (d+"秒");
	var h = d >= h_s ? parseInt(d/h_s) : 0;
	if(h > 0)
		d -= (h*3600);
	var m = d >= m_s ? parseInt(d/m_s) : 0;
	if(m > 0)
		d -= (m*60);
	var ds = "";
	if(h > 0)
		ds += (h+"小时");
	if(d >= 30)
		m++;
	if(m > 0)
		ds += (m+"分钟");
	//if(d > 0)
		//ds += (d+"秒");
	return ds;
}

function c(v){
	var s = ""+v;
	s = "00"+s;
	return s.substring(s.length-2);
}

function t(t){
	t = t.substr(0,5);
	if(t.indexOf("0")==0)
		t = t.substr(1,4);
	return t;	
}

function s(b,e){
	var nt = now.getTime();
	var bd = new Date();
	var ed = new Date();
	var ba = b.split(":");
	bd.setHours(ba[0], ba[1], ba[2], 0);
	ed.setTime(bd.getTime() + (e*1000));
	var bt = bd.getTime();
	var et = ed.getTime();
	if(bt < nt && et < nt)
		status_class = "old";
	else if(bt <= nt && et >= nt){
		status_class = "selected";
		task = setTimeout("cg()", parseInt(e*1000 - (nt-bd.getTime())));
	}
	else
		status_class = "";
	return status_class;
}

function cg(){
	var $selected = $("div.selected");
	var $next = $selected.next();
	$selected.removeClass("selected").addClass("old");
	clearTimeout(task);
	document.head.removeChild(document.head.lastChild);
	if($next.length > 0){
		$next.addClass("selected");
		if($next.attr("name") > 0)
			task = setTimeout("cg()", $next.attr("name"));
		scr();
	}
}

function bocu(){
	document.head.removeChild(document.head.lastChild);
	var $selected = $("div.selected");
	var $next = $selected.next();
	if($selected.length > 0 && $next.length > 0){
		var bt = $selected.attr("id");
		var bta = bt.split(":");
		var cd = new Date();
		var bd = new Date(cd.getFullYear(),cd.getMonth(),cd.getDate(),bta[0],bta[1],bta[2]);
		var dr = $selected.attr("name");
		var rt = (cd.getTime() - bd.getTime());
		var rp = (rt / dr) * 100;
		rp = (parseInt(rp)) + 30;
		if(rp > 100)
			rp = 100;
		$('head').append("<style>.selected .time:after{ height:"+rp+"% }</style>");
	}else{
		clearInterval(bocu_task);
	}
}