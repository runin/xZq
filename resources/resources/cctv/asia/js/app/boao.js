/**
 *博鳌论坛
 */
var vis = '';
$(function(){
	
     var W  = window;
     var isToLottey = true;
     var isSbtRed = false;
    //页面的最小高度
   // var winH = $(window).height();
    //$(".bangtuan").css("min-height",winH-50);

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

		
		//详情
		
		this.details = function()
		{
			//debugger;
			 N.loadData({url: domain_url+'articledetail/detail',callbackArticledetailDetailHandler:function(data){
				
				var detailstime = $("#detailstime");
				var timeslot = $("#timeslot");
				var detailstitle = $("#details-title");
				var detailscon = $("#details-con");
				var videoplayer = $("#video-player");
				
				if(data.vis){
					vis = data.vis;
					$(".video-con").removeClass("none");
				}else{
					$(".video-con").addClass("none");
				}
				
				function livename() {

					var pdtime = data.pd;
					var sttime = data.st;
					var ettime = data.et;
					var tstart = sttime.substr(0,5);//开始时间
					var tsop = ettime.substr(0,5);//结束时间
	
					var a = new Date(pdtime +" " +sttime).getTime();
					var b = new Date(pdtime +" " +ettime).getTime();
					var c  = new Date().getTime();
	
					if(a<c&&c<b){
						 $(".live-now").removeClass("none");
					}else {
						 $(".live-now").addClass("none");
					}

					detailstime.text(data.cus);
					timeslot.text(tstart+"-"+tsop);	
					detailstitle.text(data.t);
					detailscon.text(data.cn);
				}
				livename();
				setInterval(livename,2000);
				
			 },data: {
				 uuid: getQueryString("uuid")
			   }
			 });
			
		}
		
		//评论我说两句
		this.discuss = function() {
			var self = this;
			self.$discussbtn.click(function(e) {
				e.preventDefault();
				var $textareacon = $('#textarea-con');
			    var content = $.trim($textareacon.val());
				if (!content) {
					//alert('请您写下您的评论');
					H.dialog.showWin.open("请您写下您的评论！");
					$content.focus();
					return;
				}
				var len = content.length;
				if (len == 0|| len > 200) {
					//alert('评论长度为0-200字');
					H.dialog.showWin.open("评论长度为0-200字！");
					$textareacon.focus();
					return;
				}
				$(this).addClass("none").next().removeClass("none");
                var con = encodeURIComponent($textareacon.val());
				var headimgurl = $.fn.cookie(shaketv_appid + '_headimgurl');
				var nickname = $.fn.cookie(shaketv_appid + '_nickname');
				
				N.loadData({url: domain_url+'comments/save',callbackCommentsSave:function(data){
					if(data.code == 0) {
						$textareacon.val("");
						$("#discuss-btn").removeClass("none");
						$("#discuss-loading").addClass("none");
						H.dialog.showWin.open("提交成功！");
						//alert('提交成功！');
					} else {
						//alert(data.message);
						H.dialog.showWin.open(data.message);
						$("#discuss-btn").removeClass("none");
						$("#discuss-loading").addClass("none");
				    }
				},data:{
					co:con,
					op:openid,
					tid:getQueryString("uuid"),
					ty:1,
					nickname: null,
					headimgurl: null
				 }});
				 
				 
			});
		}
		
		//返回首页
		this.gohome = function() {
			var self= this;
			self.$gohome.click(function(e) {
				e.preventDefault();
				var content = $.trim($('#textarea-con').val());
				if (content.length > 0){
					if (!confirm('是否放弃正在编辑的信息吗？')) {
						return;
					} else {
						window.location.href = 'index.html';
					}
				return;
			    }
				window.location.href = 'index.html';
			});
		}
		
		
		
        this.init = function() {
			this.idClass();
			this.mainheight();
			//this.videoplay();
			this.discuss();
			this.gohome();
			//this.newlist();
			this.details();

		}
        this.init();

    });
	
	H.share = {
			getUrl: function() {
				var href = window.location.href;
				href = href.replace(/[^\/]*\.html/i, 'index.html');
				href = add_param(href, 'resopenid', hex_md5(openid), true);
				href = add_param(href, 'from', 'share', true);
				return add_yao_prefix(href);
			}
		};
	window['shaketv'] && shaketv.wxShare(share_img, share_title, share_desc, H.share.getUrl());
});
