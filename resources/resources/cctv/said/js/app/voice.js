// JavaScript Document

/**
 *说吧
 */

$(function() {
   H.openjs = {
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
                        debug: false,
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

    
    H.openjs.init();
    //var W  = window;
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
            alert('用户拒绝授权录音');
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
            alert(JSON.stringify(res));
          }
        });
      };

    //试听录音
    document.querySelector('#shitingbtn').onclick = function () {
         if (voice.localId == '') {
            alert('请先使用 startRecord 接口录制一段声音');
            return;
         }
         wx.playVoice({
            localId: voice.localId
        });
    };

    // 监听录音播放停止
      wx.onVoicePlayEnd({
        complete: function (res) {
          alert('录音（' + res.localId + '）播放结束');
        }
      });

    // 监听录音自动停止
      wx.onVoiceRecordEnd({
        complete: function (res) {
          voice.localId = res.localId;
          alert('录音时间已超过一分钟');
          $(".redio-ing").find("span").removeClass("recording"); 
        }
      });

    // 上传语音
  document.querySelector('#keepbtn').onclick = function () {
	var nickname = $.fn.cookie(shaketv_appid + '_nickname')?$.fn.cookie(shaketv_appid + '_nickname') : '';
    var headimgurl = $.fn.cookie(shaketv_appid + '_headimgurl')?$.fn.cookie(shaketv_appid + '_headimgurl') : '';
    if (voice.localId == '') {
      alert('请先使用 startRecord 接口录制一段声音');
      return;
    }
    wx.stopVoice({
        localId: voice.localId 
    });

    wx.uploadVoice({
      localId: voice.localId,
      success: function (res) {
        alert("您的录音已上传成功！");
        voice.serverId = res.serverId;
        getResult('api/uploadrecord/save', {openid:openid, title:encodeURIComponent('说吧'), content:encodeURIComponent('说吧'), url:res.serverId, type:3,
        	nickname: encodeURIComponent(nickname),
			headimgurl: headimgurl
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

    H.share = {
        getUrl: function() {
            var href = window.location.href;
            href = add_param(href, 'resopenid', hex_md5(openid), true);
            href = add_param(href, 'from', 'share', true);
            return add_yao_prefix(href);
        },
        getTitle: function() {
            return '我是走进清明说吧的第'+ (window['pvnum'] || 1) +'人，你还在等什么？';
        }
    };

    //参与人数
    H.index = {

       $pvtotal: $('#pvtotal'),
       updatepv: function() {
            var me = this;
            this.getpv();
            setInterval(function() {
                me.getpv();
            }, 5000);
        },  
        format: function(num) {
            return (num + '').replace(/(\d)(?=(\d{3})+$)/g, "$1,");  
        },
        getpv: function() {
            var me = this;

            window.callbackCountServicePvHander = function(data) {
                window['pvnum'] = data.c || 1;
                var num = me.format(window['pvnum'] + '');
                me.$pvtotal.length > 0 && me.$pvtotal.text(num).closest('.pv').removeClass('none');
                window['shaketv'] && shaketv.wxShare(share_img, H.share.getTitle(), share_desc, H.share.getUrl());
            };
            getResult( 'log/serpv',{},'callbackCountServicePvHander');
        }

    };
	
	//一键关注
	if(openid) {
		shaketv.subscribe({
			appid: weixin_appid,
			selector: "#div_subscribe_area",
			type: 1
		}, function(returnData) {
			//一键关注bar消失后会调用回调函数，在此处理bar消失后带来的样式问题
		   //console.log(JSON.stringify(returnData));
		   //alert(JSON.stringify(returnData));
		});
	}
    H.index.updatepv();
});


