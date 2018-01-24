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

    N.module("guide", function () {
		var ruleFn = {
			rPop: function() {
				if(getQueryString("from")) {
					$(".guide-pop").removeClass("none");
					$(".guide-btn").click(function() {
						$(".guide-pop").addClass("none");
					});
				}
			}
		};
		var play = {
			scrollPlay: function() {
				var el = document.querySelector('.plane');
				var elStep = $(window).height() * 0.06;
				var startPosition, 
				    endPosition, 
					deltaX, 
					deltaY, 
					moveLength;
				var clientHeight = $(window).height();
				
				el.addEventListener('touchstart', function (e) {
					e.preventDefault();
					var touch = e.touches[0];
					startPosition = {
						x: touch.pageX,
						y: touch.pageY
					}
				});
				el.addEventListener('touchmove', function (e) {
					e.preventDefault();
					var touch = e.touches[0];
					endPosition = {
						x: touch.pageX,
						y: touch.pageY
					}
					deltaX = endPosition.x - startPosition.x;
					deltaY = startPosition.y - endPosition.y;
					if(deltaY < 0) {
						moveLength = 0 + elStep;
					} else if (deltaY > 0) {
						moveLength = Math.sqrt(Math.pow(Math.abs(deltaX), 2) + Math.pow(Math.abs(deltaY), 2)) + elStep;
					};
					if (moveLength >= 0) {
						$('.plane').css('bottom', moveLength);
						if (moveLength >= Math.round(clientHeight*0.1)-clientHeight) {
							var winH = $(window).height();
							if(moveLength>winH*0.2) {
								$(".plane").addClass("go-play");
								setTimeout(function() {
									window.location.href="main.html";
								},500);
							}
						};
					};
				});
				el.addEventListener('touchend', function (e) {
					e.preventDefault();
					var winH = $(window).height();
					if (moveLength < clientHeight - Math.round(clientHeight*0.06)) {
						$(".plane").css("bottom",winH*0.06);
					} else {
						$('.plane').css('bottom', moveLength);
						if (moveLength >= Math.round(clientHeight*0.1)-clientHeight) {
							var winH = $(window).height();
							if(moveLength>winH*0.2) {
								$(".plane").addClass("go-play");
								setTimeout(function() {
									window.location.href="main.html";
								},500);
							}
						};
					}
				});
			}
		};
        this.init = function() {
			ruleFn.rPop();
			play.scrollPlay();
        };
        this.init();
    });

});
