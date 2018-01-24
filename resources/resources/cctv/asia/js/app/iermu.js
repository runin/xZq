var Iermu = function() {
    _this = this;
    _this.option = {};
    _this.init = function(theOpts) {
        _this.option = theOpts;
        _this.addShade();
        _this.getPlaySrc();
		
    }
    _this.addShade = function() {
        if (document.getElementById("player-shade")) {
            return true;
        }
        var shade = document.createElement("div");
        shade.id = "player-shade";
        shade.style = {
            "position": "absolute",
            "top": "0",
            "width": "100%",
            "height": "100%",
            "visibility": "visible",
            "background": "#000",
            "font-size": "20px",
            "letter-spacing": "2px",
            "text-align": "center",
            "color": "#9d9a93",
            "line-height": "186px",
            "z-index": "99"
        };
        document.getElementById(_this.option.container).appendChild(shade);
    }
    _this.getPlaySrc = function() {
        var header = document.getElementsByTagName("head")[0];
        if (document.getElementById("player-src")) {
            var src = document.getElementById("player-src");
            header.removeChild(src);
        }
        var millisecond = 0;
        var timer = setInterval(function() {
                                if ("undefined" != typeof _this.option.shareid) {
                                clearInterval(timer);
                                millisecond = 0;
                                var src = document.createElement("script");
                                src.id = "player-src";
                                src.type = "text/javascript";
                                src.src = "https://pcs.baidu.com/rest/2.0/pcs/device?method=liveplay&shareid=" + _this.option.shareid + "&uk=" + _this.option.uk + "&type=hls&callback=_this.playHlsLive";
                                header.appendChild(src);
                                } else if (millisecond < 1e3) {
                                millisecond += 13;
                                } else {
                                clearInterval(timer);
                                _this.playFailed();
                                }
                                }, 13);
    }
    _this.playHlsLive = function(data) {
        var shade = document.getElementById("player-shade");
        if (!shade) {
            var shade = document.createElement("div");
            shade.id = "player-shade";
            shade.style = {
                "position": "absolute",
                "top": "0",
                "width": "100%",
                "height": "100%",
                "visibility": "visible",
                "background": "#000",
                "font-size": "20px",
                "letter-spacing": "2px",
                "text-align": "center",
                "color": "#9d9a93",
                "line-height": "186px",
                "z-index": "99"
            };
            document.getElementById(_this.option.container).appendChild(shade);
        }
        if ("undefined" == typeof data.error_code) {
            if (data.status & 0x4 == 0) {
                shade.style.visibility = "visible";
                shade.innerHTML = "直播君已尽力，请刷新页面再来...";
            } else {
                var player = document.createElement("video");
                player.id = "video-player";
                player.controls = "controls";
                player.poster = _this.option.image;
				player.preload="auto";
                player.src = data.src;
				//player.src = vis;
                document.getElementById(_this.option.container).appendChild(player);
                shade.style.visibility = "hidden";
            }
        } else {
            shade.style.visibility = "visible";
            shade.innerHTML = "加载失败..." + data.error_msg;
        }
    }
    this.playFailed = function() {
        var shade = document.getElementById("player-shade");
        if (!shade) {
            var shade = document.createElement("div");
            shade.id = "player-shade";
            shade.style = {
                "position": "absolute",
                "top": "0",
                "width": "100%",
                "height": "100%",
                "visibility": "visible",
                "background": "#000",
                "font-size": "20px",
                "letter-spacing": "2px",
                "text-align": "center",
                "color": "#9d9a93",
                "line-height": "186px",
                "z-index": "99"
            };
            document.getElementById(_this.option.container).appendChild(shade);
        }
        shade.style.visibility = "visible";
        var num = 10;
        var timer = setInterval(function() {
                                if (num) {
                                shade.innerHTML = "加载中..." + --num;
                                } else {
                                clearInterval(timer);
                                shade.innerHTML = "加载失败...";
                                }
                                }, 1000);
    }
}