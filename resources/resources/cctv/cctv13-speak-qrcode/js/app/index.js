$(function() {
   H.openjs = {
        init: function() {
            getResult("mp/jsapiticket", {
                appId: shaketv_appid
            }, 'callbackJsapiTicketHandler');
        }   
        
    };
    W.callbackJsapiTicketHandler = function(data){
        var url = window.location.href;
        var nonceStr = 'df51d5cc9bc24d5e86d4ff92a9507361';
        var timestamp = Math.round(new Date().getTime()/1000);
        var signature = hex_sha1('jsapi_ticket=' + data.ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url);

        wx.config({
            appId: shaketv_appid,
            timestamp: timestamp,
            nonceStr:nonceStr,
            signature:signature,
            jsApiList: [
                'checkJsApi',
                'addCard',
                'startRecord',
                'stopRecord',
                'stopVoice',
                'onVoiceRecordEnd',
                'playVoice',
                'stopVoice',
                'onVoicePlayEnd',
                'uploadVoice',
                'downloadVoice'
            ]
        });

        wx.ready(function () {
            wx.checkJsApi({
                jsApiList: [
                    'addCard',
                    'startRecord',
                    'stopRecord',
                    'stopVoice',
                    'onVoiceRecordEnd',
                    'playVoice',
                    'stopVoice',
                    'onVoicePlayEnd',
                    'uploadVoice',
                    'downloadVoice'
                ],
                success: function (res) {}
            });
        });
    };

    
    H.openjs.init();
    var voice = {
        localId: '',
        serverId: ''
      };


    //弹出音频
    $("#sredio").click(function(){
        $("#popradio").removeClass("none");

    });

    //开始录音
    document.querySelector('#startbtn').onclick = function () {
        wx.startRecord({
          cancel: function () {
            showTips('用户拒绝授权录音');
          },
          success: function () {
            $(".redio-ing").find("span").addClass("recording"); 
            $(".uploading").find("#lying").removeClass("none");   
            $("#startbtn").addClass("none");
            $("#stopbtn").removeClass("none");
          }
        });
    };

    //停止录音
    document.querySelector('#stopbtn').onclick = function () {
        $(".uploading").find("#lying").addClass("none");  
        $(".uploading").find("#upling").removeClass("none");
        wx.stopRecord({
          success: function (res) {
            voice.localId = res.localId;
            $(".redio-ing").find("span").removeClass("recording");    
            $(".uploading").find("#upling").addClass("none");
            $("#startbtn").addClass("none");
            $("#stopbtn").addClass("none");
            $(".nonebtn").addClass("none");

            $("#keepbtn").removeClass("none");
            $("#shitingbtn").removeClass("none");
          },
          fail: function (res) {
            // showTips(JSON.stringify(res));
          }
        });
      };

    //试听录音
    document.querySelector('#shitingbtn').onclick = function () {
        if (voice.localId == '') {
            // showTips('请先使用 startRecord 接口录制一段声音');
            return;
        }
        wx.playVoice({
            localId: voice.localId
        });
    };

    // 监听录音播放停止
    wx.onVoicePlayEnd({
        complete: function (res) {
            showTips('录音（' + res.localId + '）播放结束');
        }
    });

    // 监听录音自动停止
    wx.onVoiceRecordEnd({
        complete: function (res) {
            voice.localId = res.localId;
            showTips('录音时间已超过一分钟');
            $(".redio-ing").find("span").removeClass("recording"); 
        }
    });

    // 上传语音
    document.querySelector('#keepbtn').onclick = function () {
        if (voice.localId == '') {
          // showTips('请先使用 startRecord 接口录制一段声音');
          return;
        }
        wx.stopVoice({
            localId: voice.localId 
        });

        wx.uploadVoice({
            localId: voice.localId,
            isShowProgressTips: 1,
            success: function (res) {
                showTips("您的录音已上传成功！");
                voice.serverId = res.serverId;
                getResult('api/uploadrecord/save', {openid:shaketv_openid, title:encodeURIComponent('说吧'), content:encodeURIComponent('说吧'), url:res.serverId, type:3,
                    nickname: nickname ? encodeURIComponent($.fn.cookie(mpappid + '_nickname')) : "",
                    headimgurl: headimgurl ? headimgurl : ""
                }, 'callbackUploadRecordSaveHandler');
                popClose();
            }
        });
    };

    //隐藏音频
    function popClose() {
        $(".redio-ing").find("span").removeClass("recording"); 
        $(".uploading").find("span").addClass("none");
        $("#popradio").addClass("none");
        $("#startbtn").removeClass("none");
        $("#stopbtn").addClass("none");
        $(".nonebtn").removeClass("none");
        $("#keepbtn").addClass("none");
        $("#shitingbtn").addClass("none");
    }
    
    document.querySelector('#popclose').onclick = function(){
        popClose();
        wx.stopVoice({
            localId: voice.localId
        });
    };
});