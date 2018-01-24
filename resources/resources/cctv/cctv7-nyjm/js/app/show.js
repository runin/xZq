// JavaScript Document
$(function() {
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
            });
        },
        loadData: function (param) {
            var p = $.extend({ url: "", type: "get", async: false, dataType: "jsonp", jsonp: "callback", showload: true }, param);
            if (p.showload) {
                W.showLoading();
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
            if (cbName && cbFn && !W[cbName]) { W[cbName] = cbFn; }
            $.ajax({ type: p.type, data: param.data, async: p.async, url: p.url, dataType: p.dataType, jsonp: p.jsonp, jsonpCallback: cbName,
                success: function () {
                    W.hideLoading();
                },
                error: function () {
                    if (param.error) { param.error() };
                    W.hideLoading();
                    // H.dialog.showWin.open("抱歉网络延迟，请稍后再试！");
                }
            });
        },
        module: function (mName, fn) {
            !N[mName] && (N[mName] = new fn());

        }
    };
	
    N.module("show", function(){
		var headImg = {
			$sList: $(".head-img"),
			headimgFn: function() {
				var that = this;
				N.loadData({url: domain_url+'api/ad/get?areaNo=ad_homepage_program',callbackAdGetHandler:function(data) {
					var ads = data.ads;
                    if(data.st == 1) {
						for(var i=0; i<ads.length; i++) {
							that.$sList.find("img").attr("src",ads[i].p)
						}
                    }else {
						that.$sList.find("img").addClass("none");
					}
					
                }});
			}
		};
        var showList = {
            $sList: $("#show-list"),
            showFn: function() {
                var that = this;
                var t = simpleTpl();
                N.loadData({url: domain_url+'index/programlist',callbackRcommendProgramlistHander:function(data) {
                    var items= data.items;
                    if(items && data.code == 0) {
                        for(var i =0; i<items.length; i++) {
							if(i != 0 && i%2 == 0) {
								t._('<li class="hr"></li>')
							}
                            t._('<li data-name="'+i+'">')
                                t._('<div class="act-box">')
									t._('<img src="'+items[i].is+'" />')
									t._('<h2>'+items[i].n+'</h2>')
									t._('<p>'+items[i].pd+'</p>')
                                t._('</div>')
                            t._('</li>')
							if(i==items.length-1) {
								t._('<li class="hr"></li>')
							}
                        }
                        that.$sList.html(t.toString());
                    }
                    
                },data:{
                    page: 1,
					pageSize:20
                }});
            }
        };
        this.init = function() {
			headImg.headimgFn();
            showList.showFn();
        };
        this.init();
    });
})