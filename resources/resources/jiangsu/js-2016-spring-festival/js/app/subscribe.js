//注: 定义了appid 后 直接引用这个js文件就可以了

; (function(w, $) {
        
    w.Subscribe = function(obj) {
        this.appid = 'wxca9de9df38b0951e';
        this.type = obj && obj.type || 2;
        this.selector = obj && obj.selector || "div_subscribe_area";
        this.sub_contain = $('<div id="' + this.selector + '" class="none ' + this.selector + '"></div>');
    };

   Subscribe.prototype.setCss = function() {

        var cssObj = {
            'position': 'fixed',
            'bottom': '0',
            'left': '0',
            'width': '100%',
            'height': '50px',
            'overflow': 'hidden',
            'z-index': '9999999'     
        };
        this.sub_contain.css(cssObj);   
    };

    Subscribe.prototype.appendHtml = function() {
        $("#cover").append(this.sub_contain);
        this.setCss();   
    };

   Subscribe.prototype.shaketv_subscribe = function() {
        
        
        w.shaketv && shaketv.subscribe({
            appid: this.appid,
            selector: "#" + this.selector,
            type: this.type     
        },function(returnData) {
            // alert(JSON.stringify(returnData));    
        });   
    };

    Subscribe.prototype.switch_state = function() {
        if (w.location.href.indexOf('cb41faa22e731e9b') == -1) {
            this.sub_contain.addClass('none').css('height', '0');     
        } else {
            this.sub_contain.removeClass('none').css('height', '50px');     
        }
    };

    Subscribe.prototype.initEvent = function() {   
        if (w.shaketv) {
            this.shaketv_subscribe();
            this.switch_state();     
        } else {

            // 微信api加载重试，每次间隔1秒，重试10次
            var that = this;
            that.shaketvCount = 0;
            w.shaketvInterval = setInterval(function() {
                that.shaketvCount++;       
                if (w.shaketv) {
                    that.shaketv_subscribe();
                    that.switch_state();
                    clearInterval(w.shaketvInterval);       
                }       
                
                if (that.shaketvCount > 10) {
                    clearInterval(w.shaketvInterval);
                    that.shaketvCount = 0;       
                }
            },1000);     
        }
    };

    Subscribe.prototype.init = function() {
        this.appendHtml();
        this.initEvent();
    };

    new Subscribe().init();

})(window, Zepto);