function Lottery(node, cover, coverType, width, height, drawPercentCallback) {
    this.conNode = node;
    this.background = null;
    this.backCtx = null;
    this.mask = null;
    this.maskCtx = null;
    this.lottery = null;
    this.lotteryType = 'image';
    this.cover = cover || "#000";
    this.coverType = coverType;
    this.pixlesData = null;
    this.width = width;
    this.height = height;
    this.lastPosition = null;
    this.drawPercentCallback = drawPercentCallback;
    this.vail = false;
    this.percent = 30;

}

Lottery.prototype = {
    createElement: function (tagName, attributes) {
        var ele = document.createElement(tagName);
        for (var key in attributes) {
            ele.setAttribute(key, attributes[key]);
        }
        return ele;
    },

    getTransparentPercent: function(ctx, width, height) {
        var imgData = ctx.getImageData(0, 0, width, height),
            pixles = imgData.data,
            transPixs = [];

        for (var i = 0, j = pixles.length; i < j; i += 4) {
            var a = pixles[i + 3];
            if (a < 128) {
                transPixs.push(i);
            }
        }
        return (transPixs.length / (pixles.length / 4) * 100).toFixed(2);
    },

    resizeCanvas: function (canvas, width, height) {
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').clearRect(0, 0, width, height);
    },

    resizeCanvas_w : function(canvas, width, height){
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').clearRect(0, 0, width, height);

        if(this.vail) this.drawLottery();
        else this.drawMask();
    },

    drawPoint: function (x, y, fresh) {
    	var offset = $(this.mask).offset();
		x = x - offset.left;
		y = y - offset.top;
	
        this.maskCtx.beginPath();
        this.maskCtx.arc(x, y, 30, 0, Math.PI * 2);
        this.maskCtx.fill();

        this.maskCtx.beginPath();

        this.maskCtx.lineWidth = 60;
        this.maskCtx.lineCap = this.maskCtx.lineJoin = 'round';

        if (this.lastPosition) {
            this.maskCtx.moveTo(this.lastPosition[0], this.lastPosition[1]);
        }
        this.maskCtx.lineTo(x, y);
        this.maskCtx.stroke();

        this.lastPosition = [x,y];

        this.mask.style.zIndex = (this.mask.style.zIndex == 20) ? 21 : 20;
    },

    bindEvent: function () {
        var _this = this;
        var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
        var clickEvtName = device ? 'touchstart' : 'mousedown';
        var moveEvtName = device? 'touchmove': 'mousemove';
        if (!device) {
            var isMouseDown = false;
            _this.conNode.addEventListener('mouseup', function(e) {
                e.preventDefault();

                isMouseDown = false;
                var per = _this.getTransparentPercent(_this.maskCtx, _this.width, _this.height);

                if(per >= _this.percent){
                    if(typeof(_this.drawPercentCallback)=='function') _this.drawPercentCallback();
                }
            }, false);
        } else {
            _this.conNode.addEventListener("touchmove", function(e) {
                if (isMouseDown) {
                    e.preventDefault();
                }
                if (e.cancelable) { e.preventDefault(); }else{window.event.returnValue = false;}
            }, false);
            _this.conNode.addEventListener('touchend', function(e) {
                isMouseDown = false;
                var per = _this.getTransparentPercent(_this.maskCtx, _this.width, _this.height);
                if(per >= _this.percent){
                    if(typeof(_this.drawPercentCallback)=='function') _this.drawPercentCallback();
                }
            }, false);
        }

        this.mask.addEventListener(clickEvtName, function (e) {
            e.preventDefault();

            isMouseDown = true;

            var x = (device ? e.touches[0].pageX : e.pageX||e.x);
            var y = (device ? e.touches[0].pageY : e.pageY||e.y);

            _this.drawPoint(x, y,isMouseDown);
        }, false);

        this.mask.addEventListener(moveEvtName, function (e) {
            e.preventDefault();

            if (!isMouseDown)  return false;
            e.preventDefault();

            var x = (device ? e.touches[0].pageX : e.pageX||e.x);
            var y = (device ? e.touches[0].pageY : e.pageY||e.y);

            _this.drawPoint(x, y,isMouseDown);
        }, false);
    },

    resize: function(width, height, dstWidth, dstHeight) {
    	var dstRotate = dstWidth / dstHeight,
			srcRotate = width / height;
		
		if (width > dstWidth || height > dstHeight) {
			if (dstRotate <= srcRotate) {
				dstHeight = dstWidth * (height / width);
			} else {
				dstWidth = dstHeight * (width / height);
			}
		} else {
			dstWidth = width;
			dstHeight = height;
		}
		return {width: dstWidth, height: dstHeight};
    },
    
    drawLottery: function () {
        if (this.lotteryType == 'image') {
            var image = new Image(),
                _this = this;
            image.onload = function () {
            	var resizeVal = _this.resize(this.width, this.height, _this.width, _this.height),
            		x = Math.ceil((_this.width - resizeVal.width) / 2),
            		y = Math.ceil((_this.height - resizeVal.height) / 2);
            	
                this.width = _this.width;
                this.height = _this.height;
                
                _this.resizeCanvas(_this.background, _this.width, _this.height);
                _this.backCtx.drawImage(this, x, y, resizeVal.width, resizeVal.height);
                _this.drawMask();
            }
            image.src = this.lottery;
        } else if (this.lotteryType == 'text') {
            this.width = this.width;
            this.height = this.height;
            this.resizeCanvas(this.background, this.width, this.height);
            this.backCtx.save();
            this.backCtx.fillStyle = '#FFF';
            this.backCtx.fillRect(0, 0, this.width, this.height);
            this.backCtx.restore();
            this.backCtx.save();
            var fontSize = 30;
            this.backCtx.font = 'Bold ' + fontSize + 'px Arial';
            this.backCtx.textAlign = 'center';
            this.backCtx.fillStyle = '#F60';
            this.backCtx.fillText(this.lottery, this.width / 2, this.height / 2 + fontSize / 2);
            this.backCtx.restore();
            this.drawMask();
        }
    },

    drawMask: function() {
        if (this.coverType == 'color') {
            this.maskCtx.fillStyle = this.cover;
            this.maskCtx.fillRect(0, 0, this.width, this.height);
            this.maskCtx.globalCompositeOperation = 'destination-out';
        } else if (this.coverType == 'image'){
            var image = new Image(),
                _this = this;
            image.onload = function () {
                _this.resizeCanvas(_this.mask, _this.width, _this.height);

                var android = (/android/i.test(navigator.userAgent.toLowerCase()));

                _this.maskCtx.globalAlpha=1;
                _this.maskCtx.drawImage(this,0,0,this.width,this.height,0,0,_this.width,_this.height);
                _this.maskCtx.globalAlpha=1;
                _this.maskCtx.globalCompositeOperation = 'destination-out';
            }
            image.src = this.cover;
        }
    },

    init: function (lottery, lotteryType) {
        if(lottery){
            this.lottery = lottery;
            this.lottery.width = this.width;
            this.lottery.height = this.height;
            this.lotteryType = lotteryType || 'image';

            this.vail = true;
        }
        if(this.vail){
            this.background = this.background || this.createElement('canvas', {
                style: 'position:absolute;left:0;top:0px;background-color:transparent;',id:'lottery-mask'
            });
        }

        this.mask = this.mask || this.createElement('canvas', {
            style: 'position:absolute;left:0;top:0;background-color:transparent;',id:'lottery-cover'
        });
        this.mask.style.zIndex = 20;

        if (!this.conNode.innerHTML.replace(/[\w\W]| /g, '')) {
            if(this.vail) this.conNode.appendChild(this.background);
            this.conNode.appendChild(this.mask);
            this.bindEvent();
        }
        if(this.vail) this.backCtx = this.backCtx || this.background.getContext('2d');
        this.maskCtx = this.maskCtx || this.mask.getContext('2d');

        if(this.vail) this.drawLottery();
        else this.drawMask();

        var _this = this;
        window.addEventListener('resize',function(){
            _this.width = document.documentElement.clientWidth;
            _this.height = document.documentElement.clientHeight;

            _this.resizeCanvas_w(_this.mask, _this.width, _this.height);
        },false);

    }
}
