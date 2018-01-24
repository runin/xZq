// JavaScript Document

$(function() {
	
	//var winH = $(window).height();
	//$(".content").css("min-height",winH-50);
	
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
	
	N.module("index", function(){
		
		this.idClass = function() {
			this.win = $(window);
			this.content = $(".content");
		}
		
		//最小高度
		this.minheight = function() {
			this.idClass();
			var self = this;
			var winh = self.win.height();
			this.content.css("min-height",winh);
		}
		
		//赞助商品牌图片
		this.mainsponsor  = function() {
			N.loadData({url: domain_url+'gansu/stock/brand',callbackGansuStockBrand:function(data){
				if(data.code == 0){
					$(".mingren").append("<img src='"+data.brand+"' />");
				}
			}});
		}
		
		this.init = function() {
			this.minheight();
			this.mainsponsor();
		}
		
		this.init();
	})
	
	/*if(openid && openid!=null) {
		window['shaketv'] && shaketv.subscribe(weixin_appid, function(returnData){
			//alert('shaketv subscribe: ' + JSON.stringify(returnData));
		});
	}*/
})