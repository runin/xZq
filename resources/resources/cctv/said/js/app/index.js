// JavaScript Document

/**
 *说吧
 */

$(function() {
    
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
            })
        },
        //接口管理

        loadData: function (param) {
            W.showLoading();
            var p = $.extend({ url: "", type: "get", async: false, dataType: "jsonp", jsonp: "callback" }, param);
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
            if (cbName && cbFn && !W[cbName]) { W[cbName] = cbFn; }
            $.ajax({ 
                type: p.type, 
                data: param.data, 
                async: p.async, 
                url: p.url, 
                dataType: p.dataType, 
                jsonp: p.jsonp, 
                jsonpCallback: cbName,

                success: function (data) {
                     W.hideLoading();
                },
                
                error: function () {
                    if (param.error) { param.error() };
                     W.hideLoading();
                }
            });
        },

        module: function (mName, fn) {
            !N[mName] && (N[mName] = new fn());
        }
        

    };
    

    N.module("msaid", function(){
		
        

        this.jvideo = function() {
			    var limitSize = 20;
                $(".video-add").upload({// 图片
                url: domain_url + 'fileupload/zonevideo',   // 图片上传路径
                numLimit: 5,                        // 上传图片个数
                formCls: 'upload-form',                 // 上传form的class
                accept: 'video/*',
          
                limit: function (file, form) {
                    window.uploadForm = form;
                    if (file.size) {
                        if (file.size > 1024 * 1024 * limitSize) {
                            //H.dialog.showWin.open("请上传" + limitSize + "m以内的视频！");
							alert("请上传" + limitSize + "m以内的视频！");
                            form[0].reset();
                            return false;
                        }
                    }
                    return true;
                },
                beforFn: function () {
                    //3分钟后可以再上传
//                    if ($.fn.cookie("lastupLoadTime")) {
//                        H.dialog.showWin.open("3分钟以内,仅可添加一段！");
//                        return false;
//                    }
                    return true;

                },
                selectFn: function () {
                    //that.setBgSize();
                },
                afterFn: function (img) {
                    //img.css({ "background": "url(images/vedioImg.png) center center no-repeat", "border": "0px", "background-size": "100% 100%" });
                },
                progressFn:function(e) {
                    // body...
                },
                succussFn: function (data, form, imgA, fileName) {//上传成功

				         N.loadData({url: domain_url+'api/uploadrecord/save',callbackUploadRecordSaveHandler:function(data){

                         },data: {
                            openid: openid,
                            title: "",
                            content: "",
                            url: domain_url + 'fileupload/video',
                            type: 1
                            }
                         });
                        //window.uploadForm = form;
                       // form[0].reset();

                       // imgA.append("<input class='fileName' type='hidden' name='vi' value='" + data.filePath + "' />");
                        //that.fileName += fileName + ",";
                        //imgA.attr("href", data.filePath);

                       // var datet = new Date();
                       // datet.setTime(datet.getTime() + (1000 * 60 * 3));
                       // var expires_in = { expires: datet };
                        //$.fn.cookie("lastupLoadTime", new Date().getTime(), expires_in);
                        //H.dialog.showWin.open("上传成功！");
                   
                },
                erroeFn: function (form) {
                   // H.dialog.showWin.open("抱歉上传失败！");
                   // window.uploadForm = form;
                   // form[0].reset();
                }, closeFn: function (form) {
                   // window.uploadForm = form;
                   // form[0].reset();
                }
            });

        }

        //智能接口
        var voice = {
            localId: '',
            serverId: ''
        };

        this.classid = function() {
            this.repess = $("#repess");//表达人数
            this.sredio = $("#sredio");//音频
            this.video = $(".video");//视频
            this.popradio = $("#popradio");
        }
        this.repess = function() {
            N.loadData({url: domain_url+'log/serpv',callbackCountServicePvHander:function(data){
               $("#repess").text(data.c);
            }});
        }

        wx.onVoiceRecordEnd({// 录音时间超过一分钟没有停止的时候会执行 complete 回调
             complete: function (res) {
                 voice.localId = res.localId;
             }
        });

        //开始
		this.startBtn =  function() {
             var that = this;
             $("#startbtn").click(function() {
                $(".redio-ing").find("span").addClass("recording");    
                $("#startbtn").addClass("none");
                $("#stopbtn").removeClass("none");
                wx.startRecord({//开始录音
                    cancel: function () {
                        alert('用户拒绝授权录音');
                        $("#popradio").remove();
                        that.sredio.find("img").attr("src","images/radio.png");
                    },
                    success:function () {
                        alert('用户同意授权录音');
                    }
                });
             });
             this.stopBtn();
             this.keepsave();
        }

        //暂停
        this.stopBtn =  function() {
            alert(1);
             var that = this;
             $("#stopbtn").click(function() {
                $(".redio-ing").find("span").removeClass("recording");
                $(".uploading").find("span").removeClass("none");
                alert(2);
                wx.stopRecord({//停止录音
                    success: function (res) {
                        voice.localId = res.localId;
                         $(".uploading").find("span").addClass("none");
                         $("#startbtn").addClass("none");
                         $("#stopbtn").addClass("none");
                         $("#shitingbtn").removeClass("none");
                         $(".nonebtn").addClass("none");
                         $("#keepbtn").removeClass("none");
                         that.shiting();
                    },
                     fail: function (res) {
                        alert(JSON.stringify(res));
                    }

                });
             });
             this.shiting();
        }

        //试听
        this.shiting = function() {
            var that = this;
            $("#shitingbtn").click(function() {
                if (voice.localId == '') {
                     alert('请先录制一段声音');
                     return;
                }
                wx.playVoice({
                    localId: voice.localId // 需要播放的音频的本地ID，由stopRecord接口获得
                 });
            });
        }

        //提交数据
        this.keepsave = function() {
            var that = this;
            $("#keepbtn").click(function() {

                wx.uploadVoice({
                    localId: voice.localId, // 需要上传的音频的本地ID，由stopRecord接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                         voice.serverId = res.serverId; // 返回音频的服务器端ID
                         $("#popradio").addClass("none");
                         that.sredio.find("img").attr("src","images/radio.png");
                         N.loadData({url: domain_url+'api/uploadrecord/save',callbackUploadRecordSaveHandler:function(data){
                         },data: {
                            openid: openid,
                            title: "",
                            content: "",
                            url: voice.serverId,
                            type: 3
                            }
                         });
                     }
                });

            });
        }


        //取消
        this.cancel = function() {
            var that = this;
            $("#popclose").click(function() {
                $("#popradio").addClass("none");
                 wx.stopRecord({
                    success: function (res) {
                        voice.localId = res.localId;
                        alert(voice.localId);
                    },
                     fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                 });
                
                that.sredio.find("img").attr("src","images/radio.png");
            });
        }

       //音频录音
        this.redioType = function() {
            var that = this;
            $("#sredio").click(function(e) {
                 e.preventDefault();
                 $(this).find("img").attr("src","images/radio-on.png");
                 $("#popradio").removeClass("none");
            });
        }
        

        this.init = function() {
            this.classid();
            this.startBtn();
            this.cancel();
            this.redioType();
            this.jvideo();
        }
       this.init();

    });

   H.voice = {
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
                    
                    var nonceStr = 'F7SxQmyXaFeHsFOT',
                        timestamp = new Date().getTime(),
                        url = window.location.href.split('#')[0],
                        signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);

                    wx.config({
                        debug: true,
                        appId: shaketv_appid,   
                        timestamp: timestamp,
                        nonceStr: nonceStr,
                        signature: signature,
                        jsApiList: [
                            'startRecord',
                            'stopRecord',
                            'onVoiceRecordEnd',
                            'onVoicePlayEnd',
                            'playVoice',
                            //'pauseVoice',
                            'stopVoice',
                            'uploadVoice'
                           // 'downloadVoice'
                        ]
                    });
                },
                error: function(xhr, type){
                    // alert('获取微信授权失败！');
                }
            });
        }   
        
    };
    H.voice.init();
});
