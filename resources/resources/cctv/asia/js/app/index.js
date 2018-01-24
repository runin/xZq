/**
 *博鳌论坛
 */

$(function(){
	
     var W  = window;
     var isToLottey = true;
     var isSbtRed = false;

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
		//接口管理
        loadData: function (param) {
            W.showLoading();
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
                     W.hideLoading();
                },
                error: function () {
                    if (param.error) { param.error() };
                     W.hideLoading();
                }
            });
        },
        module: function (mName, fn) {
            !N[mName] && (N[mName] = new fn());
        }
        

    };
	
	
    N.module("boaodetails", function(){ 
 
        this.idClass = function() {
			 this.$main = $(".main-box");
			// this.$playbtn = $("#play-btn");
		     this.$video = $("#video-player");
		     this.$discussbtn = $("#discuss-btn");
			 this.$gohome = $("#gohome");
			 this.$timenow = $("#timenow")
        }
		
		//页面最小高度 
		this.mainheight = function() {
			var self = this;
			this.idClass();
			var winH = $(window).height();
			self.$main.css("min-height",winH-80);
		}
		
		
		
		//新闻列表
		this.newlist = function() 
		{
			   var that =this;
			   N.loadData({url: domain_url+'articledetail/list',callbackArticledetailListHandler:function(data) {

				   var timecon = $("#timenow");
				   timecon.text(data.cus);
				   var mainlist = $("#mainlist");
				   mainlist.empty();
				   
				   var v = function() {
					   if(data.vgs) {
						 var vbox = [];
					         vbox.push('<div class="v-boao">');
						     vbox.push('<span>V观博鳌</span>');
						     vbox.push('<div class="vtop">');
							 vbox.push('<div id="v-gla"></div>');
							 vbox.push('</div></div>');
						// mainlist.append(vbox.join(''));
						
						 $(".live-con:first-child").after(vbox.join(''));
						     
						 var vgla = $("#v-gla");
						 						
						// function setvgla() {
							 //var value = Math.round(Math.random()*(data.vgs.length-1));
							 var num = data.vgs.length;
							 var arr =[];
							 var arrb =[];
							 
							 for(var v=0; v<data.vgs.length; v++) {
								 var eachVgs = data.vgs[v];
								 if(eachVgs.url && eachVgs.url !="" ) {
									 arr.push('<p><a href="'+eachVgs.url+'">'+eachVgs.t+'</a></p>');
								 } else {
									 arr.push('<p>'+eachVgs.t+'</p>');
								 }
								
								// if(data.val==0) {
									 //vgla.append(arrb.join(''));
								 //} else if(v == value){
								//	 vgla.append(arr.join('value'));
								//	 return;
								// }
							 } 
							 
							 for (var i = 0; i<num; i++){
									arrb.push(arr.splice(Math.floor(Math.random()*arr.length), 1));
							 }
							 vgla.append(arrb.join(''));
						 };
					 } 
				   
				   if(data.cos) {
					   
					 that.cos =data.cos;
					 for(var i=0; i<data.cos.length; i++) {
						 var eachCos = data.cos[i];
						 var html = [];
						 var pdtimeC = eachCos.pd;
						 var sttimeC = eachCos.st;
						 var ettimeC = eachCos.et;
						 var tstartC = sttimeC.substr(0,5);//开始时间
				         var tsopC = ettimeC.substr(0,5);//结束时间
						 
						 var a = timestamp(pdtimeC+" "+sttimeC);
						 var b = timestamp(pdtimeC+" "+ettimeC);
						 var c = new Date();
						 var dtnow = c.getFullYear()+"-"+(c.getMonth()+1)+"-"+c.getDate()+" "+c.getHours()+":"+c.getMinutes()+":"+c.getSeconds();
						 var d = timestamp(dtnow);

						 if(d<b) {
							 
							 html.push('<div class="live-con">');
							 html.push('<span class="live-time">');
							 html.push('<label>'+tstartC+''+"-"+''+tsopC+'</label>');
							 html.push('<em class="live-now" id="L'+i+'"><i></i> 耳目直播</em>');
							 html.push('</span>');
							 if(eachCos.url) {
								 html.push('<h3><a href="'+eachCos.url+'" class="">'+eachCos.t+'</a></h3>');
								 html.push('<p><a href="'+eachCos.url+'">'+eachCos.i+'</a></p></div>');
								 
							 } else {
								 html.push('<h3><a href="details.html?uuid='+ eachCos.uid +'">'+eachCos.t+'</a></h3>');
								 html.push('<p><a href="details.html?uuid='+ eachCos.uid +'">'+eachCos.i+'</a></p></div>');
							 }
							
							 var aphtml  = $(html.join(''));
							 
							// if(i==1) {
							//	 v();
							 //}
							 
							// var a = new Date(pdtimeC +" " +sttimeC).getTime();
							 //var b = new Date(pdtimeC +" " +ettimeC).getTime();
							 if(a<d && d<b){
								 aphtml.find("#L"+i).removeClass("none");
							 }else {
								 aphtml.find("#L"+i).addClass("none")
							
							 }
							 mainlist.append(aphtml[0].outerHTML);
						}
					}
					
					v();
					if($(".live-con").length == 0) {
						$(".data-none").removeClass("none");
					}
				    that.turnShowBtn();
				  }
			  }});
			  
			  
		} 
		
		//列表定时刷新时间
		this.turnShowBtn =function(){
			var that =this;
			
			 setInterval(function(){ 
			 
				  for(var i =0; i< that.cos.length;i++){
					  	 var pdtimeC = that.cos[i].pd;
						 var sttimeC = that.cos[i].st;
						 var ettimeC = that.cos[i].et;
						 
						 var a = timestamp(pdtimeC+" "+sttimeC);
						 var b = timestamp(pdtimeC+" "+ettimeC);
						 var c = new Date();
						 var nowd = c.getFullYear()+"-"+(c.getMonth()+1)+"-"+c.getDate()+" "+c.getHours()+":"+c.getMinutes()+":"+c.getSeconds();
						 var d = timestamp(nowd);
						 if(a<d && d<b){
							 $("#L"+i).removeClass("none");
						 }else {
							  $("#L"+i).addClass("none")
						
						 } 
			        }
				 
	        },2000); 
			
	    }
		
		//v博鳌定滚动
		this.vmovetop = function() {
			var self = this;
			setInterval(function() {
					$("#v-gla").addClass("vmove");
			},4500);
			setInterval(function() {
				$("#v-gla p:first-child").clone().appendTo("#v-gla");
				$("#v-gla p:first-child").remove();
				$("#v-gla").removeClass("vmove");
			}, 5000);
		}
		
        this.init = function() {
			this.idClass();
			this.mainheight();
			this.vmovetop(); 
			this.newlist();
		}
        this.init();
    });
	
	/*H.share = {
			getUrl: function() {
				var href = window.location.href;
				href = href.replace(/[^\/]*\.html/i, 'index.html');
				href = add_param(href, 'resopenid', hex_md5(openid), true);
				href = add_param(href, 'from', 'share', true);
				return add_yao_prefix(href);
			}
		};
	window['shaketv'] && shaketv.wxShare(share_img, share_title, share_desc, H.share.getUrl());*/
	if(openid && openid!=null) {
		window['shaketv'] && shaketv.subscribe(weixin_appid, function(returnData){
			//alert('shaketv subscribe: ' + JSON.stringify(returnData));
		});
	}
});