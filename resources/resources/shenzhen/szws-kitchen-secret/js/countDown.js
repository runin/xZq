//倒计时插件的编写
;(function (w,$) {
   if(!domain_url){
     var domain_url = "http://test.holdfun.cn/portal/";
   }
   $.fn.countDown =function(obj){
     var defaultParam = {
         getSystemTimeUrl:domain_url+'common/timestr',//取系统时间的url
         timeArr:[],//倒计时的时间段数组 例子 [{st:"",et:""},{st:"",et:""},{st:"",et:""}]
         timeInterval:1000,//倒数时间间隔 默认1000 毫秒
         countDownFn:null,//到计时函数，可能触发多次
         atTimeFn:null,//时间段在当前时间内时触发的函数，有多少个时间断就会触发多少次
         endFn:null//整个倒计时结束触发的函数
     };
     var p =$.extend(defaultParam,obj||{});
     var systemTime = new Date().getTime();
     var timeDiff =0;//系统时间和本地时间的差数
     var countIndex =0;//计数
     var that =this;
     var o = {
		 init:function(systemTime,timeDiff){//主函数
		 	o.sort();//排序时间数组
			var tm = timeDiff;
			function downFn(){
				try{
					for(var i=countIndex,len= p.timeArr.length;i<len;i++){
						var t = new Date().getTime()-tm;
						var st = p.timeArr[i].st;
						var et = p.timeArr[i].et;
						if(t<st) {
							(function(){
								var tmp= o.showTime(st-t);
								$(that).html(tmp);
								p.countDownFn && p.countDownFn(that,tmp);
							}());
							break;
						}
						if(st<t&&t<et){
							//var ta =p.timeArr[i+1];
							//var startTime = (ta&&ta.st)?ta.st:0;
							//----
							var startTime = et;
							//----
							p.atTimeFn && p.atTimeFn(that, p.timeArr[i].index,startTime,o,t);
							var tmp= o.showTime(startTime-t);
							$(that).html(tmp);
							break;
						};
						if(t>et){
							countIndex++;
							(function(){
								if(countIndex==p.timeArr.length){
									clearInterval(window.countDownInterval);
								if(p.endFn){  p.endFn(that);}
							}}());
							break;
						};
					}
             	}
             	catch(e){
                	clearInterval(window.countDownInterval);
             	}
          	};
          	downFn();
          	window.countDownInterval =setInterval(downFn,p.timeInterval);
         },
         sort:function(){//排序函数
          if(!/^\d+$/.test(p.timeArr[0].st)){//支持字符串类型
             for(var i=0;i<p.timeArr.length;i++){
               var it =p.timeArr[i];
               it.st = o.timestamp(it.st);
               it.et = o.timestamp(it.et);
               it.index =i;
            }
          };
          function asc(a, b) {
             if (a.st > b.st){return 1;}
             else { return -1;}  
           }
           p.timeArr.sort(asc);
         },
         timestamp:function(str){//转化字符串类型的时间
             var str2date = function(str) {
                str = str.replace(/-/g, '/');
                return new Date(str);};
             var timestamp = function (str) {
                return Date.parse(str2date(str));};
             return timestamp(str);
         },
         showTime:function(rT){//显示时间
            var dateNum = function (num) {
            return num < 10 ? '0' + num : num;};
            var showTpl = '%H%:%M%:%S%';
            var s_ = Math.round((rT % 60000) / p.timeInterval);
            s_ = dateNum(Math.min(Math.floor(s_ / 1000 * p.timeInterval), 59));
            var m_ = dateNum(Math.floor((rT % 3600000) / 60000));
            var h_ = dateNum(Math.floor((rT % 86400000) / 3600000));
            var d_ = dateNum(Math.floor(rT / 86400000));
            return showTpl.replace(/%S%/, s_).replace(/%M%/, m_).replace(/%H%/, h_).replace(/%D%/, d_);
         },
         loadData:function (param)  {//封装加载函数
            var p = $.extend({ url: "", type: "get", async: false, dataType: "jsonp", showload: false }, param);
            var connt = 0,cbName = "",cbFn = null;
            for (var i in param) {
                connt++;if (connt == 2) {cbName = i;cbFn = param[i];break;}
            }
            if (/test/.test(domain_url)) {
                if (!param.data) {param.data = {}; }
                param.data.dev = "jiawei";
            }
            $.ajax({ type: p.type, data: param.data, async: p.async, url: p.url, dataType: p.dataType, jsonpCallback: cbName,
                success: function (data) {
                cbFn(data);},
                error: function () {
                if (param.error) { param.error() };}
            });
        }
     };
     o.loadData({url:p.getSystemTimeUrl,callbackTimeStrHandler:function(data){
           systemTime =data.t;//赋值系统时间
           if(!/^\d+$/.test(systemTime)){//支持字符串类型
           systemTime = o.timestamp(systemTime);}
           timeDiff = new Date().getTime()-systemTime;
           o.init(systemTime,timeDiff);
     }});
     return this;
 }
})(window, Zepto)