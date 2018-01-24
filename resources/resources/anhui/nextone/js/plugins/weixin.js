;(function($){
    $.fn.wx = function(option){
        var $wx = $(this);
        var opts = $.extend({}, $.fn.wx.defaults, option);

        // 确定微信是否准备好
        document.addEventListener("WeixinJSBridgeReady", function(){
            window.G_WEIXIN_READY = true;
        }, false);

        // 回到函数循环执行
        function CallWeiXinAPI(fn, count){
            var total = 2000;   //30s     
            count = count || 0;
            
            if (true === window.G_WEIXIN_READY || ("WeixinJSBridge" in window)){
                fn.apply(null, []);
            } else{
                if(count <= total){
                    setTimeout(function(){
                        CallWeiXinAPI(fn, count++);
                    }, 15);
                }
            }
        }

        var _unit = {
            /**
             * 执行回调
             * @param Object handler {Function callback, Array args, Object context, int delay}
             */
             execHandler : function(handler){
                if(handler && handler instanceof Object){
                    var callback = handler.callback || null;
                    var args = handler.args || [];
                    var context = handler.context || null;
                    var delay = handler.delay || -1;

                    if(callback && callback instanceof Function){
                        if(typeof(delay) == "number" && delay >= 0){
                            setTimeout(function(){
                                callback.apply(context, args);
                            }, delay);
                        }else{
                            callback.apply(context, args);
                        }
                    }
                }
            },

            /**
             * 合并参数后执行回调
             * @param Object handler {Function callback, Array args, Object context, int delay}
             * @param Array args 参数
             */
            execAfterMergerHandler : function(handler, _args){
                if(handler && handler instanceof Object){
                    var args = handler.args || [];

                    handler.args = _args.concat(args);
                }
                
                this.execHandler(handler);
            },
            
            addOpenid: function() {
            	var url = window.location.href;
            	if(url.indexOf("resopenid=") > 0){
            		url = this.replaceParamVal('resopenid',hex_md5(openid));
            	}else{
            		if (url.indexOf(".html?") > 0) {
            			url = url + "&resopenid=" + hex_md5(openid);
            		} else {
            			url = url + "?resopenid=" + hex_md5(openid);
            		}
            	}
            	return add_yao_prefix(url);
            },

            replaceParamVal: function(paramName,replaceWith) {
                var oUrl = window.location.href.toString();
                var re=eval('/('+ paramName+'=)([^&]*)/gi');
                var nUrl = oUrl.replace(re,paramName+'='+replaceWith);
                return nUrl;
            }
        }

        // 微信的接口
        var _api = {
            Share : {
                // 分享到朋友圈
                "timeline" : function(options, handler){
                    CallWeiXinAPI(function(){
                        WeixinJSBridge.on("menu:share:timeline",function(argv){
                            WeixinJSBridge.invoke('shareTimeline', options, function(res){
                                _unit.execAfterMergerHandler(handler, [res, 'timeline']);
                            });
                        });
                    });
                },
                
                // 分享给朋友
                "message" : function(options, handler){
                    CallWeiXinAPI(function(){
                        WeixinJSBridge.on("menu:share:appmessage",function(argv){
                            WeixinJSBridge.invoke('sendAppMessage', options, function(res){
                                _unit.execAfterMergerHandler(handler, [res, 'message']);
                            });
                        });
                    });
                }
            },
            
            /**
             * 设置右上角选项菜单
             * @param boolean visible 是否显示
             * @param Object handler
             */
            "setOptionMenu" : function(visible, handler){
                CallWeiXinAPI(function(){
                    if(true === visible){
                        WeixinJSBridge.call('showOptionMenu');
                    }else{
                        WeixinJSBridge.call('hideOptionMenu');
                    }
                    _unit.execAfterMergerHandler(handler, [visible]);
                });
            }
        };

        var opt = {
            "img_url" : opts.img_url,
            "img_width" : 180,
            "img_height" : 180,
            "link" : _unit.addOpenid(),
            "desc" : opts.desc,
            "title" : opts.title
        };

        handler = {
            callback : function(res, type){
                opts.callback && opts.callback(res, type);
            }
        }

        // 执行函数
        _api.Share.timeline(opt, handler);
        _api.Share.message(opt, handler);

        return $wx;
    }
    
    $.fn.wx.defaults = {
        title : '', 
        desc : '',
        link : document.URL, 
        img  : ''
    };

    $.fn.wx.version = '1.0.0';

})(Zepto);


