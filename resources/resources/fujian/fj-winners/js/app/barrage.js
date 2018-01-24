/**
*   JQuery-plus barrage
*       opt.fontSize    Array<Int>
*       opt.fontColor   Array<String>
*       opt.padding     int     (default 10)
*       opt.heightOffset    int (default 10)
*       opt.leftRange   int     (default 50)
*       opt.heightPre       int (default 80)
*       opt.speed       int     (default 100px/s)
*
*   Example:
*       var barrage = $(selector).barrage() ;
*       barrage.appendMsg("Hello word!");
*   
*   tips :
*       setTimeout(function(){
*           barrage.appendMsg("Hello word!");
*       },257); 
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
            fontSize: [16, 18, 24],
            fontColor: ["FFFFFF", "6FC3EF", "DE0E4E"],
            padding: 10,
            heightOffset: 15,
            itemHeight: 35,
            leftRange: 40,
            maxLeftWidth: 2000,
            heightPre: 80,
            speed: 80
        };
 
        setting = $.extend({}, setting, opts);
         
        var that = this,
            msgPre = "msg-index",
            leftWidth = width = that.width(),
            startHeight = height = that.height(),
            msgIndex = 0,
            fontSizeLen = setting.fontSize.length,
            fontColorLen = setting.fontColor.length;
 
         
 
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
 
            $msgDiv.html(msg);
 
            $msgDiv.css({
                "white-space": "nowrap",
                "position": "absolute",
                "display": "block",
                "-webkit-transform": "translateX(" + (leftWidth + 40) + "px)",
                "top": (height - startHeight + setting.itemHeight) + "px",
                "height": setting.itemHeight + "px",
                "line-height": setting.itemHeight + "px",
                "fontSize": this.randSize() + "px",
                "color": "#" + this.randColor()
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
            var sid = "s_" + msgPre + msgIndex + parseInt(Math.random() * 1000);
            var className = "pass_barrage" + msgIndex + parseInt(Math.random() * 1000);
            var style = $('<style style="display:none" id=" + sid + "></style>');
            var arr = [];
            arr.push("." + className + " {");
            arr.push("-webkit-animation-name: " + className + "_a;");
            arr.push("-webkit-animation-duration: " + (dtime / 1000) + "s;");
            arr.push("-webkit-animation-timing-function: " + (parseInt(Math.random() * 10) % 2 == 0 ? "linear" : "ease") + ";");
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
            }
            if (window.CACHEMSG.length < window.maxCache) {
                window.CACHEMSG.push(msg);
            } else {
                window.CACHEMSG[Math.floor(Math.random() * 1000) % window.maxCache] = msg;
            }
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
 
        }, 70);
    };
 
})();


(function($) {
	
	H.comment = {
		$content: $(".main"),
		$commentsWrapper: $('.barrage-wrapper'),
		$comments: $(".comments"),
		$inputWrapper: $(".comment-input-wrapper"),
		$input: $('#input'),
		$submit: $('#submit'),
		$topic: $('.comment-topic'),
		$commentSuccess: $('.comment-success'),

		$tabRule: $('#rule'),
		$tabScore: $('#score'),

		pageSize: 50,
		maxid: 0,
		lastCommnet: '',

		init: function() {
			
			this.resize();
			this.bindBtn();
			getResult('api/comments/room',{
				ps : this.pageSize,
				maxid : this.maxid,
			},'callbackCommentsRoom');
			
		},

		initComments: function(data){
			if(!W.barrage){
				this.initBarrage();
			}
			this.fillComments(data);
		},

		initBarrage: function(){
			W.barrage = this.$comments.barrage({ fontColor: ["FFFFFF"] });
			W.barrage.start(1);
		},

		fillComments: function(data){
			if(data.maxid){
				this.maxid = data.maxid;
			}
			
			for(var i in data.items){

				var t = simpleTpl();
				t._($('#tmpl_barrage').tmpl({
					'src': data.items[i].hu,
					'content': data.items[i].co
				}));

				W.barrage.pushMsg(t.toString());
			}
		},

		bindBtn: function(){
			this.$submit.click(function(){
				var val = H.comment.$input.val();
				if(val.length > 0){
					H.comment.lastCommnet = val;
					showNewLoading();
					getResult('api/comments/save',{
						co: encodeURIComponent(val),
                        op: openid,
                        tid: 'uuid',
                        ty: 2,
                        nickname: nickname ? encodeURIComponent(nickname) : "",
                        headimgurl: headimgurl ? headimgurl : ""
					},'callbackCommentsSave');
				}else{
					alert('内容不能为空哦~');
				}
			});
		},

		submitSuccess: function(){
			this.$commentSuccess.removeClass('none');
			setTimeout(function(){
				H.comment.$commentSuccess.addClass('none');
			},1500);

			this.$input.val('');
			var t = simpleTpl();
			t._($('#tmpl_barrage').tmpl({
				'src': headimgurl,
				'content': this.lastCommnet
			}));

			W.barrage.appendMsg(t.toString());
		},

		fillTopic: function(data){
			if(data.items.length > 0){
				this.$topic.find('a')
					   .text(data.items[0].t)
					   .attr('href', data.items[0].c);

				this.$topic.find('.topic-img')
						   .attr('src', data.items[0].av)
						   .removeClass('none');

				this.$content.css('background-image','url("' + data.items[0].im + '")');
			}
		},

		resize: function(){
			var originWidth = this.$content.attr('origin-width');
			var originHeight = this.$content.attr('origin-height');
			var xRatio = originWidth / $(window).width();
			var yRatio = originHeight / $(window).height();

			var commentWrapperHeight = parseInt(this.$commentsWrapper.css('height'),10);
			var commentWrapperWidth = parseInt(this.$commentsWrapper.css('width'),10);
			var inputHeight = parseInt(this.$inputWrapper.css('height'),10);

			this.$comments.css('height',commentWrapperHeight - inputHeight).css('width',commentWrapperWidth);

			this.$commentSuccess.css({
				top : ($(window).height() - 70) / 2,
				left : ($(window).width() - 110) / 2
			});

			this.$input.val('');
		}
	};

	W.callbackCommentsRoom = function(data) {
		if(data.code == 0){
			H.comment.initComments(data);
		}

		setTimeout(function(){
			getResult('api/comments/room',{
				ps : H.comment.pageSize,
				maxid : H.comment.maxid,
			},'callbackCommentsRoom');
		}, 5000);
	};

	W.callbackCommentsSave = function(data){
		hideNewLoading();
		if(data.code == 0){
			H.comment.submitSuccess();
		}else{
			alert('网络错误，请稍后重试');
		}
	};

	W.callbackCommentsTopicInfo = function(data){
		if(data.code == 0){
			H.comment.fillTopic(data);
		}
	}

	H.comment.init();

})(Zepto);