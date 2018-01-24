H.openjs = {
	localId: "",
	serverId: "",
	init: function() {
		window.callbackJsapiTicketHandler = function(data) {};
		$.ajax({
			type: 'GET',
			url: domain_url + 'mp/jsapiticket',
			data: {
				appId: shaketv_appid
			},
			async: true,
			dataType: 'jsonp',
			jsonpCallback: 'callbackJsapiTicketHandler',
			success: function(data){
				if (data.code !== 0) {
					return;
				}
				var nonceStr = 'da7d7ce1f499c4795d7181ff5d045760',
					timestamp = Math.round(new Date().getTime()/1000),
					url = window.location.href.split('#')[0],
					signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);
				wx.config({
					debug: false,
					appId: shaketv_appid,   
					timestamp: timestamp,
					nonceStr: nonceStr,
					signature: signature,
					jsApiList: [
						'addCard'
					]
				});
			},
			error: function(xhr, type){
				 alert('获取微信授权失败！');
			}
		});
	}     
};
H.openjs.init();

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
	
    N.module("card", function () {
		var cardBox = {
			cardH: function() {
				var wH = $(window).height();
				$(".card-box").css("min-height",wH-50);
			}
		};
		var cardFn = {
			uuid:null,
			number:0,
			pal:10,
			wxcardList: function() {
				N.loadData({ url: domain_url + "api/lottery/prizes", callbackLotteryPrizesHandler: function(data) {
					if(data.result == true) {
						var t = simpleTpl();
						var pa = data.pa;
						var lh = pa.length;
						
						if(pa.length<=10) {
							for(var i=0; i<lh; i++) {
								t._('<li data-ci="'+data.ci+'" data-ts="'+data.ts+'" data-si="'+data.si+'" id="'+pa[i].id+'">')
								t._('<img src="'+pa[i].pi+'" />')
								t._('<span class="none">'+pa[i].tp+'</span>')
								t._('<i class="none">'+pa[i].pd+'</i>')
								t._('</li>')
							}
						}else {
							if(lh>cardFn.pal) {
								$(".more-yh").removeClass("none");
								for(var i=cardFn.number; i<cardFn.pal; i++) {
									t._('<li data-ci="'+data.ci+'" data-ts="'+data.ts+'" data-si="'+data.si+'" id="'+pa[i].id+'">')
									t._('<img src="'+pa[i].pi+'" />')
									t._('<span class="none">'+pa[i].tp+'</span>')
									t._('<i class="none">'+pa[i].pd+'</i>')
									t._('</li>')
								}
								cardFn.number+=10;
								cardFn.pal += (lh-cardFn.pal);
							}else {
								for(var i=cardFn.number; i<cardFn.pal; i++) {
									t._('<li data-ci="'+data.ci+'" data-ts="'+data.ts+'" data-si="'+data.si+'" id="'+pa[i].id+'">')
									t._('<img src="'+pa[i].pi+'" />')
									t._('<span class="none">'+pa[i].tp+'</span>')
									t._('<i class="none">'+pa[i].pd+'</i>')
									t._('</li>')
								}
								$(".more-yh").addClass("none");
							}
						}
						$("#card-img").append(t.toString());
						cardFn.cardInfo();
					}
				},data:{
					at:5
				}})
			},
			moreyh: function() {
				$(".more-yh").click(function() {
					cardFn.wxcardList();
				});
			},
			cardInfo: function() {
				$("#card-img>li").click(function() {
					cardFn.uuid = $(this).attr("id");
					var src = $(this).find("img").attr("src");
					var tp = $(this).find("span").text();
					var pd = $(this).find("i").text();
					var pt = $(this).attr("data-pt");
					
					$(".card-select").find("img").attr("src",src);
					$(".card-address").empty().text(tp);
					$(".card-time").empty().text(pd);
					$(".card-list").addClass("none");
					$(".card-details").removeClass("none");
					
					$(".go-home").addClass("none");
					$(".go-return").removeClass("none");
					cardFn.lqCard();
				});
			},
			lqCard: function() {
				// 在这里调用 API
				//document.querySelector('#lqcard-a').onclick = function() {
				$('#lqcard-a').click(function() {
					N.loadData({ url: domain_url + "api/lottery/collect", callbackLotteryCollectHandler: function(data) {
						if(data.result == 0) {
							if(data.pt==7) {
								wx.addCard({
									cardList: [{
										cardId: data.ci,
										cardExt: "{\"timestamp\":\""+ data.ts +"\",\"signature\":\""+ data.si +"\"}"
									}], // 需要添加的卡券列表
									success: function(res) {
										$(".card-details").addClass("none");
										$(".card-collect").removeClass("none");
										var cardList = res.cardList; // 添加的卡券列表信息
									},
									fail: function(res){
										$(".card-details").addClass("none");
										$(".card-collect").removeClass("none");
										$(".card-error").removeClass("none");
										$(".card-prosit").addClass("none");
									},
									complete: function(){
										//hidenewLoading();
									}
								});
							}else {
								$(".card-details").addClass("none");
								$(".card-collect").removeClass("none");
							}
						}else {
							$(".card-details").addClass("none");
							$(".card-collect").removeClass("none");
							$(".card-error").removeClass("none");
							$(".card-prosit").addClass("none");
						}
					},data:{
						oi:openid,
						pu:cardFn.uuid
					}});
				});
			},
			goHome: function() {
				$(".go-home").click(function() {
					window.location.href="main.html";
				});
			},
			goReturn: function() {
				$(".go-return").click(function() {
					$(".card-list").removeClass("none");
					$(".card-details,.card-collect").addClass("none");
					$(".go-home").removeClass("none");
					$(".go-return").addClass("none");
				});
			}
		};
		
        this.init = function() {
			cardBox.cardH();
			//cardFn.cardList();
			cardFn.wxcardList();
			wx.ready(function() {
				//wx.config成功
				//执行业务代码
				//cardFn.wxcardList();
			});
			wx.error(function(res){
				//alert("权限验证错误:"+res.errMsg);
			 });
			cardFn.moreyh();
			cardFn.goHome();
			cardFn.goReturn();
        };
        this.init();
    });

});
