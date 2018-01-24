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

    N.module("lottery", function () {
		var winFn = {
			winH: function() {
				var wh = $(window).height();
				$(".lottery-con").css("height",wh-50);
			},
			goHome: function() {
				$(".go-home").click(function() {
					window.location.href="main.html";
				});
			}
		};
		var toTop = function() {
			$(".lottery-con").scroll(function() {
				var t = $(this).scrollTop();
				if(t>250) {
					$(".to-top").removeClass("none");
				}else {
					$(".to-top").addClass("none");
				}
			});
			$(".to-top").click(function() {
				$(".lottery-con").scrollTop(0);
			});
		};
		var detailFn = {
			getId: getQueryString("uid"),
			detail: function() {
				N.loadData({ url: domain_url + "api/article/detail", callbackArticledetailDetailHandler: function(data) {
					if(data.code == 0) {
						var img = data.img;
						
						var imgArray = img.split(",");
						var t = simpleTpl();
						for(var i=0; i<imgArray.length; i++) {
							t._('<div class="swiper-slide" style="background-image:url('+imgArray[i]+')"></div>')
						}
						$("#swiper-img").append(t.toString());
						
						var mySwiper = new Swiper('.swiper-container',{
							pagination: '.pagination',
							loop:true,
							grabCursor: true,
							paginationClickable: true
						  })
						  $('.arrow-left').on('click', function(e){
							e.preventDefault()
							mySwiper.swipePrev()
						  })
						  $('.arrow-right').on('click', function(e){
							e.preventDefault()
							mySwiper.swipeNext()
						});
						
						$(".address").find("h2").text(data.t);
						$(".address").find("p").text(data.st);
						$(".phone").attr("href","tel:'"+data.m+"'");
						var di = data.i;
						var si,oi;
						if(di.length>70) {
							si = di.substr(0,70)+'......<a href="###" id="j-more">查看更多>></a>';
							$(".groom").html(si);
							$("body").delegate("#j-more","click",function(e) {
								$(".groom").html(di+'<a href="###" id="s-more">收起>></a>');
							});
							$("body").delegate("#s-more","click",function(e) {
								si = di.substr(0,70)+'......<a href="###" id="j-more">查看更多>></a>';
								$(".groom").html(si);
							});
						}else {
							$(".groom").html(di);
						}
					}
				},data:{
					uuid:detailFn.getId
				}})
			}
		};
        this.init = function() {
			winFn.winH();
			winFn.goHome();
			detailFn.detail();
			toTop();
        };
        this.init();
    });

});
