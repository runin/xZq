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
        hashchange: (function () {
            $(window).bind("hashchange", function () {
                var pname = window.location.hash.slice(1);
                if (pname) {
                    N.page[pname]();
                } else {
                    pname = "firstPage";
                    N.page[pname]();
                }
                if (N[pname].goIntoFn) {
                    N[pname].goIntoFn();
                }
            });
            return {};
        })(),
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
                    cbFn(data);
                    W.hideLoading();
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
        module: function (mName, fn) {
            !N[mName] && (N[mName] = new fn());
        },
        page: {
            firstPage: function (fn) {
                window.location.hash = "firstPage";
                $(".footer").show();
                $(".bottom_tip").show();
                N.showPage("firstPage", function () {

                    if (fn) {
                        fn();
                    }
                })
            },
            commentPage: function (fn) {
                window.location.hash = "commentPage";

                $(".footer").hide();
                N.showPage("commentPage", function () {

                    if (fn) {
                        fn();
                    }
                })
            },
            buyPage: function (fn) {
                window.location.hash = "buyPage";
                $(".footer").show();
                $(".bottom_tip").hide();
                N.showPage("buyPage", function () {
                    if (fn) {
                        fn();
                    }
                })
            }
        }
    };
    N.module("firstPage", function () {

        N.loadImg([{ isLoad: false, src: './images/1.jpg' }, { isLoad: false, src: './images/2.jpg' }, { isLoad: false, src: './images/3.jpg' }
        , { isLoad: false, src: './images/4.jpg' }, { isLoad: false, src: './images/5.jpg' }, { isLoad: false, src: './images/6.jpg' }
        , { isLoad: false, src: './images/7.jpg' }, { isLoad: false, src: './images/8.jpg' }, { isLoad: false, src: './images/9.jpg' }
        , { isLoad: false, src: './images/10.jpg' }, { isLoad: false, src: './images/11.jpg' }, { isLoad: false, src: './images/12.jpg' }
        , { isLoad: false, src: './images/13.jpg' }, { isLoad: false, src: './images/14.jpg' }, { isLoad: false, src: './images/15.jpg' }
        , { isLoad: false, src: './images/16.jpg' }, { isLoad: false, src: './images/17.jpg' }, { isLoad: false, src: './images/18.jpg' }
        , { isLoad: false, src: './images/19.jpg' }, { isLoad: false, src: './images/20.jpg'}]);


        H.audio = {
            $audio: $('.ui-audio'),
            $audio_btn: $('.audio-icon'),
            audio: null,
            audio_val: true,
            zlow: function () {
                this.$audio.addClass('zlow');
            },
            show: function () {
                this.$audio.removeClass('zlow none');
            },
            init: function () {
                $('#coffee-flow').coffee({
                    steams: ["<img src='./images/audio_icon.png' />", "<img src='./images/audio_icon.png' />"],
                    steamHeight: 150,
                    steamWidth: 44
                });

                var options_audio = {
                    loop: true,
                    preload: "auto",
                    src: this.$audio.attr('data-src')
                }
                this.audio = new Audio();

                for (var key in options_audio) {
                    if (options_audio.hasOwnProperty(key) && (key in this.audio)) {
                        this.audio[key] = options_audio[key];
                    }
                }
                this.audio.load();
            },

            event_handler: function () {
                var me = this;
                if (this.$audio.length == 0) {
                    return;
                }

                var txt = me.$audio.find('.audio-txt'),
				time_txt = null;
                me.$audio.find('.btn-audio').on('click', function () {
                    me.audio_contorl();
                });

                $(me.audio).on('play', function () {
                    me.audio_val = false;

                    audio_txt(txt, true, time_txt);

                    me.$audio_btn.addClass('animated');
                    $.fn.coffee.start();
                    $('.coffee-steam-box').show(500);
                })

                $(me.audio).on('pause', function () {
                    audio_txt(txt, false, time_txt)
                    me.$audio_btn.removeClass('animated');
                    $.fn.coffee.stop();
                    $('.coffee-steam-box').hide(500);
                });

                function audio_txt(txt, val, time_txt) {
                    txt.text(val ? '打开' : '关闭');
                    if (time_txt) {
                        clearTimeout(time_txt);
                    }

                    txt.removeClass('animated hide');
                    time_txt = setTimeout(function () {
                        txt.addClass('animated').addClass('hide');
                    }, 1000)
                }
            },

            audio_contorl: function () {
                if (!this.audio_val) {
                    this.audio_stop();
                } else {
                    this.audio_play();
                }
            },

            audio_play: function () {
                this.audio_val = false;
                if (this.audio) {
                    this.audio.play();
                }
            },

            audio_stop: function () {
                this.audio_val = true;
                if (this.audio) {
                    this.audio.pause();
                }
            }
        };


        this.initParam = function () {
            var that = this;



            this.swiper_a = null;
            this.swiper_a_param = {
                direction: 'horizontal',
                loop: true,
        
                onInit: function (s) {


                },
                onSlideChangeEnd: function (s) {

                }
            };


            this.swiper_e = null;
            this.swiper_e_param = {
                direction: 'horizontal',
                loop: true,
                prevButton: '.a_l_e',
                nextButton: '.a_r_e',
         
                onInit: function (s) {


                },
                onSlideChangeEnd: function (s) {

                }
            };

            this.swiper_c = null;
            this.swiper_c_param = {
                direction: 'horizontal',
                loop: true,
                prevButton: '.a_l_c',
                nextButton: '.a_r_c',
         
                onInit: function (s) {

                },
                onSlideChangeEnd: function (s) {

                }
            };

            this.swiper_h = null;
            this.swiper_h_param = {
                direction: 'horizontal',
                loop: true,
                prevButton: '.a_l_h',
                nextButton: '.a_r_h',
          
                onInit: function (s) {

                },
                onSlideChangeEnd: function (s) {

                }
            };

            this.swiper_g = null;
            this.swiper_g_param = {
                direction: 'horizontal',
         
                onInit: function (s) {

                },
                onSlideChangeEnd: function (s) {

                }
            };



            this.swiper_f = null;
            this.swiper_f_param = {
                direction: 'vertical',
                loop: true,
				followFinger: false,
                nextButton: '.parallax-arrow',
                onInit: function () {
                    that.swiper_a = new Swiper('.swiper_a', that.swiper_a_param);
                    that.swiper_e = new Swiper('.swiper_e', that.swiper_e_param);
                    that.swiper_c = new Swiper('.swiper_c', that.swiper_c_param);
                    that.swiper_h = new Swiper('.swiper_h', that.swiper_h_param);
                    that.swiper_g = new Swiper('.swiper_g', that.swiper_g_param);
                }, onSlideChangeEnd: function (s) {
                    if (s.activeIndex == 1) {
//                        $(".fadeText").fadeIn(1000, function () {
//                            $(this).fadeOut(1000);
//                        })
                    }
                }
            };
        };
        this.initWrapper = function () {
            this.swiper_f = new Swiper('.swiper_f', this.swiper_f_param);
        }
        this.init = function () {
            this.initParam();

            this.initWrapper();

            H.audio.init();
            // 播放声音
            if (!H.audio.audio) return;
            H.audio.show();
            H.audio.audio.play();
            H.audio.event_handler();
            // 声音启动
            $(document).one("touchstart", function () {
                H.audio.audio.play();
            });
        }
        this.init();

    });
});
