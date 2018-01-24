// JavaScript Document

/**
 *说吧
 */

$(function() {

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
                 var nickname = $.fn.cookie(shaketv_appid + '_nickname')?$.fn.cookie(shaketv_appid + '_nickname') : '';
                 var headimgurl = $.fn.cookie(shaketv_appid + '_headimgurl')?$.fn.cookie(shaketv_appid + '_headimgurl') : '';
                 if(data.code == 0) {
                    var filePath = data.filePath;
                    var isSyncSave = data.isSyncSave;
                    getResult('api/uploadrecord/save', {openid:openid, title:encodeURIComponent('说吧'), content:encodeURIComponent('说吧'), url:filePath, type:1,isSyncSave:isSyncSave,
                    	nickname: encodeURIComponent(nickname),
						headimgurl: headimgurl
					}, 'callbackUploadRecordSaveHandler');
                 }
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
    window.callbackUploadRecordSaveHandler =function(data){};
});


