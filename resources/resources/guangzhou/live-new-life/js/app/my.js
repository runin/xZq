$(function () {
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

            var p = $.extend({ url: "", type: "get", async: false, dataType: "jsonp", showload: true }, param);
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
            $.ajax({ type: p.type, data: param.data, async: p.async, url: p.url, dataType: p.dataType, jsonpCallback: cbName,
                success: function (data) {

                    W.hideLoading();
                    cbFn(data);

                },
                error: function () {
                    if (param.error) { param.error() };
                    W.hideLoading();
                    // H.dialog.showWin.open("抱歉网络延迟，请稍后再试！");
                }
            });
        },
        loadImg: function (img) {
            if (!this.images) {
                this.images = [];
            }
            if (img && !(img instanceof Array)) {
                img.isLoad = false;
                this.images.push(img);
            } else if ((img instanceof Array)) {
                for (var i = 0; i < img.length; i++) {
                    img[i].isLoad = false;
                    this.images.push(img[i]);
                }
            }
            for (var j = 0; j < this.images.length; j++) {
                var that = this;
                if (!this.images[j].isLoad) {
                    var im = new Image();
                    im.src = this.images[j].src;
                    this.images[j].isLoad = true;
                    im.onload = function () {

                    }
                }
            }
        },
        module: function (mName, fn, fn2) {
            !N[mName] && (N[mName] = new fn());
            if (fn2) {
                $(function () {
                    fn2();
                });
            }

        }
    };

    N.module("my", function () {
		var myImg = function() {
			if(headimgurl) {
				$("#my-img").find("img").attr("src",headimgurl+"/64");
			}else {
				$("#my-img").find("img").attr("src","images/avatar.jpg");
			}
			if(nickname) {
				$(".my-head").find("p").text(nickname);
			}else {
				$(".my-head").find("p").text("匿名");
			}
		};
		var myRecord = {
			tf:false,
			number:0,
			pal:10,
			th:0,
			listHtml: function() {
				if(myRecord.tf == true) {
					return;
				}
				N.loadData({ url: domain_url + "api/lottery/record", callbackLotteryRecordHandler: function(data) {
					if(data.result == true) {
						var t = simpleTpl();
						var rl = data.rl;
						var lh = rl.length;
						$(".my-l-box").removeClass("none");
						
						if(lh<=10) {
							for(var i=0; i<lh; i++) {
								t._('<li>')
								t._('<i></i>')
								t._('<h2>'+rl[i].lt+'</h2>')
								t._('<div class="my-card">')
								t._('<h3 class="card-title">您在拉阔新生活节目中赢得'+rl[i].pn+'</h3>')
								t._('<p class="card-p">奖品名称：'+rl[i].pn+'</p>')
								if(rl[i].cc) {
									t._('<p class="card-p">兑奖码：'+rl[i].cc+'</p>')
								}
								t._('</div>')
								t._('</li>')
							}
							myRecord.tf = true;
						}else {
							if(lh>myRecord.pal) {
								for(var i=myRecord.number; i<myRecord.pal; i++) {
									t._('<li>')
									t._('<i></i>')
									t._('<h2>'+rl[i].lt+'</h2>')
									t._('<div class="my-card">')
									t._('<h3 class="card-title">您在拉阔新生活节目中赢得'+rl[i].pn+'</h3>')
									t._('<p class="card-p">奖品名称：'+rl[i].pn+'</p>')
									if(rl[i].cc) {
										t._('<p class="card-p">兑奖码：'+rl[i].cc+'</p>')
									}
									t._('</div>')
									t._('</li>')
								}
								myRecord.number+=10;
								myRecord.pal += (lh-myRecord.pal);
							}else {
								for(var i=myRecord.number; i<myRecord.pal; i++) {
									t._('<li>')
									t._('<i></i>')
									t._('<h2>'+rl[i].lt+'</h2>')
									t._('<div class="my-card">')
									t._('<h3 class="card-title">您在拉阔新生活节目中赢得'+rl[i].pn+'</h3>')
									t._('<p class="card-p">奖品名称：'+rl[i].pn+'</p>')
									if(rl[i].cc) {
										t._('<p class="card-p">兑奖码：'+rl[i].cc+'</p>')
									}
									t._('</div>')
									t._('</li>')
								}
								myRecord.tf = true;
							}
						}
						$("#myrecord").append(t.toString());
						myRecord.th = $(".my-l-box").height();
					}else {
						$(".list-none").removeClass("none");
					}
				},data:{
					oi:openid,
					pt:"1,5,7"
				}})
			},
			sclFn: function() {
				var lbox = $(".my-list");
				var ts = lbox.height();
				$(".my-list").scroll(function(e) {
					var tsh = lbox.get(0).scrollHeight;
					var top = lbox.scrollTop();
					if(top+ts>myRecord.th) {
						myRecord.listHtml();
					}
				});
			},
			myBtn: function() {
				$(".my-btn").click(function() {
					window.location.href="main.html";
				});
			}
		};
        this.init = function() {
			myImg();
			myRecord.listHtml();
			myRecord.myBtn();
			myRecord.sclFn();
        };
        this.init();
    });

});
