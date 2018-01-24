/**
*	JQuery-plus barrage
*		opt.fontSize	Array<Int>
*		opt.fontColor	Array<String>
*		opt.padding		int		(default 10)
*		opt.heightOffset	int	(default 10)
*		opt.leftRange	int 	(default 50)
*		opt.heightPre		int (default 80)
*		opt.speed		int		(default 100px/s)
*
*	Example:
*		var barrage = $(selector).barrage() ;
*		barrage.appendMsg("Hello word!");
*	
*	tips :
*		setTimeout(function(){
*			barrage.appendMsg("Hello word!");
*		},257);	
*
*
*/
; (function () {
    window.appendMsgTimer = 100; //评论插入时间
    window.maxCache = 50; //最大评论数
    window.maxMsgLength = 15; //评论出现的最多条数
    window.CACHESEND = [];
    window.CACHEMSG = [];
    window.CACHEMSGINDEX = 0;
 
    $.fn.barrage = function (opts) {
        var setting = {
        	fontSize: [12],
           // fontSize: [16, 18, 24],
            fontColor: ["FFFFFF"],
//          fontColor: ["FFFFFF", "ffEA00", "FF7600"],
            padding: 10,
            heightOffset: 10,
            itemHeight: 40,
            leftRange: 80,
            maxLeftWidth: 4000,
            heightPre: 80,
            speed:80
        };

        var that = this,
			msgPre = "msg-index",
			leftWidth = width = that.width(),
			startHeight = height = that.height(),
			msgIndex = 0,
			fontSizeLen = setting.fontSize.length,
			fontColorLen = setting.fontColor.length;

        $.extend({}, setting, opts);
        this.getLastLeft = function () {
            var $msg = $("#" + msgPre + msgIndex);

            if ($msg.length != 0) {
                $msg.removeAttr("id");
                var lastWidth = $msg.offset().left + $msg.width();
                return (lastWidth > 0 && lastWidth < width) ? null : lastWidth;
            }
            return null;
        };

        this.appendMsg = function (msg) {
            if (!msg) {
                return;
            }
            var leftWidth = this.getLastLeft() || width,
		    $msgDiv = $("<div>").attr("id", msgPre + msgIndex);
            $msgDiv.addClass("comment_item");

            if (leftWidth > setting.maxLeftWidth) {
                leftWidth = leftWidth % setting.maxLeftWidth + width;
            }
            // $('.isme').parent('div').addClass('me');
            $msgDiv.html(msg);

            $msgDiv.css({
                "white-space": "nowrap",
                "position": "absolute",
                "display": "block",
                "-webkit-transform": "translateX(" + (leftWidth + 100) + "px)",
                "top": (height - startHeight + setting.itemHeight) + "px",
                "height": setting.itemHeight + "px",
                "line-height": setting.itemHeight + "px",
                "fontSize": this.randSize() + "px",
                "color": "#" + this.randColor(),
                "width": "100%"
            });

            startHeight = startHeight - setting.itemHeight - setting.heightOffset;
            msgIndex++;
            if (startHeight <= setting.heightPre) {
                startHeight = height;
                msgIndex = 0;
            }

            $msgDiv.appendTo(this);
            var msgWidth = $msgDiv.width();


            var that = this;
            var dtime = that.duration(msgWidth + leftWidth);
            var sid = "s_" + msgPre + msgIndex+parseInt(Math.random() * 1000);
            var className = "pass_barrage" + msgIndex+parseInt(Math.random() * 1000);
            var style = $('<style style="display:none" id=' + sid + '></style>');
            var arr = [];
            arr.push("." + className + " {");
            arr.push("-webkit-animation-name: " + className + "_a;");
            arr.push("-webkit-animation-duration: " + (dtime / 1000) + "s;");
            arr.push("-webkit-animation-timing-function: " + (parseInt(Math.random() * 10) % 2 == 0 ? "ease-in" : "ease-out") + ";");
            arr.push("-webkit-animation-iteration-count: 1;");
            arr.push("}");
            arr.push(" @-webkit-keyframes " + className + "_a {");
            arr.push(" 100% {");
            arr.push(" -webkit-transform:translateX(" + (0 - msgWidth) + "px);");
            arr.push(" }");
            arr.push("}");
            style[0].innerHTML = arr.join("");
            $("head").append(style);
            $msgDiv.addClass(className);

            (function (m, t, s) {
                setTimeout(function () {
                    m.hide();
                    m.remove();
                    s.remove();
                }, t);
            })($msgDiv, dtime, style);

        };

        this.randSize = function () {
            return setting.fontSize[Math.floor(Math.random() * fontSizeLen)];
        };

        this.randColor = function () {
            return setting.fontColor[Math.floor(Math.random() * fontColorLen)];
        };

        this.duration = function (distance) {
            return distance / setting.speed * 1000;
        };

        this.pushMsg = function (msg) {
            if (window.CACHESEND.length < window.maxCache) {
                window.CACHESEND.push(msg);
            } else {
                window.CACHESEND[Math.floor(Math.random() * 1000) % window.maxCache] = msg;
            };

            if (window.CACHEMSG.length < window.maxCache) {
                window.CACHEMSG.push(msg);
            } else {
                window.CACHEMSG[Math.floor(Math.random() * 1000) % window.maxCache] = msg;
            };
        };

        this.start = function (startType) {
            $.appendMsg4Cache();

            if (startType != 0) {
                $.appendMsg4Data();
            }
        };
        return this;
    };

    $.appendMsg4Cache = function () {
        setTimeout(function () {
            if (window.CACHESEND.length > 0 && barrage.find("div").length < window.maxMsgLength) {
                barrage.appendMsg(window.CACHESEND.pop());
            }
            $.appendMsg4Cache();
        }, window.appendMsgTimer);
    };

    $.appendMsg4Data = function () {
        setTimeout(function () {
            var cacheLen = window.CACHEMSG.length;
            window.CACHEMSGINDEX = window.CACHEMSGINDEX % cacheLen;

            if (barrage.find("div").length < Math.min(cacheLen, window.maxMsgLength)) {
                window.CACHESEND.push(window.CACHEMSG[window.CACHEMSGINDEX++]);
            }
            $.appendMsg4Data();

        }, 100);
    };


    /*var tpl = function(){
        var t = simpleTpl();
        $.each(barrage_tips, function(i, item){console.log(item);
            t._('<div class="c_head_img">')
                ._('<img src="./images/head/'+ i +'q.jpg" class="c_head_img_img">')
            ._('</div>')
            ._('<div class="ron">')
                ._('<p>测试用户_91</p>')
                ._('<span class="triangle"></span><div class="article">'+ item +'</div>')
            ._('</div>');
            window.CACHEMSG.push(t.toString());
        });

    };
    tpl();*/
})();
window.CACHEMSG.push('<div class="cor">' +
                        '<div class="c_head_img">' +
                            '<img src="./images/head/0q.jpg" class="c_head_img_img">' +
                        '</div>' +
                        '<div class="ron">' +
                            '<p>麦子</p>' +
                            '<span class="triangle"></span>' +
                            '<div class="article">撒浪嘿~撒浪嘿~</div>' +
                        '</div>' +
                    '</div>');
window.CACHEMSG.push('<div class="cor">' +
                        '<div class="c_head_img">' +
                            '<img src="./images/head/1q.jpg" class="c_head_img_img">' +
                        '</div>' +
                        '<div class="ron">' +
                            '<p>幼幼。</p>' +
                            '<span class="triangle"></span>' +
                            '<div class="article">我家爱豆干啥都帅</div>' +
                        '</div>' +
                    '</div>');
window.CACHEMSG.push('<div class="cor">' +
                        '<div class="c_head_img">' +
                            '<img src="./images/head/2q.jpg" class="c_head_img_img">' +
                        '</div>' +
                        '<div class="ron">' +
                            '<p>stefanie_yang</p>' +
                            '<span class="triangle"></span>' +
                            '<div class="article">看到爱豆心情都会好一整天</div>' +
                        '</div>' +
                    '</div>');
window.CACHEMSG.push('<div class="cor">' +
                        '<div class="c_head_img">' +
                            '<img src="./images/head/3q.jpg" class="c_head_img_img">' +
                        '</div>' +
                        '<div class="ron">' +
                            '<p>薛。</p>' +
                            '<span class="triangle"></span>' +
                            '<div class="article">永远支持你，永远的动力！</div>' +
                        '</div>' +
                    '</div>');
window.CACHEMSG.push('<div class="cor">' +
                        '<div class="c_head_img">' +
                            '<img src="./images/head/4q.jpg" class="c_head_img_img">' +
                        '</div>' +
                        '<div class="ron">' +
                            '<p>夏天文</p>' +
                            '<span class="triangle"></span>' +
                            '<div class="article">表白表白表白</div>' +
                        '</div>' +
                    '</div>');
window.CACHEMSG.push('<div class="cor">' +
                        '<div class="c_head_img">' +
                            '<img src="./images/head/5q.jpg" class="c_head_img_img">' +
                        '</div>' +
                        '<div class="ron">' +
                            '<p>Doldrums-</p>' +
                            '<span class="triangle"></span>' +
                            '<div class="article">你就是我努力工作努力赚钱的动力！！</div>' +
                        '</div>' +
                    '</div>');
window.CACHEMSG.push('<div class="cor">' +
                        '<div class="c_head_img">' +
                            '<img src="./images/head/6q.jpg" class="c_head_img_img">' +
                        '</div>' +
                        '<div class="ron">' +
                            '<p>秘密。</p>' +
                            '<span class="triangle"></span>' +
                            '<div class="article">表白wuli亲亲，向全世界安利你</div>' +
                        '</div>' +
                    '</div>');
window.CACHEMSG.push('<div class="cor">' +
                        '<div class="c_head_img">' +
                            '<img src="./images/head/7q.jpg" class="c_head_img_img">' +
                        '</div>' +
                        '<div class="ron">' +
                            '<p>涼生</p>' +
                            '<span class="triangle"></span>' +
                            '<div class="article">和我家大脑壳表白了！！</div>' +
                        '</div>' +
                    '</div>');
window.CACHEMSG.push('<div class="cor">' +
                        '<div class="c_head_img">' +
                            '<img src="./images/head/8q.jpg" class="c_head_img_img">' +
                        '</div>' +
                        '<div class="ron">' +
                            '<p>石某某</p>' +
                            '<span class="triangle"></span>' +
                            '<div class="article">娱乐圈的明星我只喜欢你一个，你是唯一的...</div>' +
                        '</div>' +
                    '</div>');
window.CACHEMSG.push('<div class="cor">' +
                        '<div class="c_head_img">' +
                            '<img src="./images/head/9q.jpg" class="c_head_img_img">' +
                        '</div>' +
                        '<div class="ron">' +
                            '<p>Spencer</p>' +
                            '<span class="triangle"></span>' +
                            '<div class="article">吃过午饭来例行表白</div>' +
                        '</div>' +
                    '</div>');


