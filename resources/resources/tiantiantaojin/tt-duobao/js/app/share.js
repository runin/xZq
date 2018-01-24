/**
 * Created by E on 2015/11/10.
 */
$(document).ready(function () {
    S.share.init();
});

S.share = {
    init: function () {
        var me = S.share;
        me.el.addsBtn = $(".adds-btn");
        me.el.shareUp = $(".share-r");
        me.el.shareCancel = $(".share-l");
        me.el.body = $("body");
        me.el.shareTitleInp = $(".share-title-inp");
        me.el.shareTalkInp = $(".share-talk-inp");
        me.el.previewClose = $(".preview-close");
        me.el.previewPick = $(".preview-pick");
        $(".preview-pic").css("height",($(window).width()*0.2));
        $(".preview-pick>div").css("line-height",($(".preview-pick>div").height())+"px");
        me.even();
        //me.applydata();
    },
    el:{
        addsBtn:null,
        body:null,
        shareUp:null,
        shareTitleInp:null,
        shareTalkInp:null,
        rid:getQueryString("rid"),
        dataPath:null,
        isPick:false,
        upload:false,
        imgType:"jpg",
        imgFail:0,
        imgSuccess:0,
        imgNumb:0,
        updateNumb:1,
        previewClose:null,
        shareCancel:null,
        previewPick:null
    },
    applydata: function () {
    },
    resize: function () {

    },
    ischange: function () {
        var img = event.target.files[0];
        S.share.el.isPick = false;
        // 判断是否图片
        if(!img){
            showTips('图片只能是jpg,gif,png');
        }else if(!(img.type.indexOf('image')==0 && img.type && /\.(?:jpg|png|gif)$/.test(img.name)) ){
            showTips('图片只能是jpg,gif,png');
            return ;
        }else if(img == ""){
            return ;
        }else{
            S.share.el.isPick = true;
            showTips("选取到一张照片");
        }
    },
    chkinfo: function () {
        var title = S.share.el.shareTitleInp.val();
        var talk = S.share.el.shareTalkInp.val();
        var imgs = [];
        if (talk.match("<") || title.match("<")) {
            showTips('含有非法字符');
            return false;
        }else if (title.length < 6 || title.length > 30) {
            showTips('标题字数保持在6到30个字之间');
            return false;
        }else if (talk.length < 30 || talk.length > 200) {
            showTips('感言字数保持在30到200个字之间');
            return false;
        }else {
            showLoading();
            $(".preview").find('.preview-pic').each(function() {
                var url = $.trim($(this).attr('id'));
                url && imgs.push(url);
            });
            getResult('indianaShareOrder/share',
                {
                    oid:openid,
                    puid: S.share.el.rid,
                    sb:encodeURIComponent(title),
                    sm:encodeURIComponent(talk),
                    si:imgs.join(';')
                },'indianaShareOrderCallBackHandler');

        }
    },
    even: function () {
        S.share.el.shareCancel.on("click", function () {
            showLoading();
            setTimeout(function () {
                window.history.back();
            },2000);
        });
        S.share.el.shareUp.on("click", function () {
            S.share.chkinfo();
        })
    },
    removeself: function (self) {
        $(self).parent().remove();
        S.share.el.imgNumb--;
        if(S.share.el.imgNumb == 0){
            S.share.el.isPick = false;
        }
        S.share.el.previewPick.css("display","block");
    },
    info: function (data) {
    }
};

function indianaShareOrderCallBackHandler(data){
    hideLoading();
    if(data.result == true){
        showLoading('','提交成功');
        setTimeout(function () {
            window.history.back();
        },2000);
    }
}



function fileSelected(numb) {
    if(!numb){numb=0}
    var $file_upload = document.getElementById('share-pick'),
        count = $file_upload.files.length,
        img_id = "share-pick";
    if(count == 0){
        return;
    }else if(S.share.el.imgNumb > 10){
        hideLoading();
        showTips("图片数不能超过10张");
        S.share.el.imgNumb = 10;
        return;
    }else{
        if(numb == (count)){
            S.share.el.updateNumb = 0;
        }else{
            var fd = new FormData();
            var count = $file_upload.files.length;
            if (count == 0) {
                return;
            }
            var img = $file_upload.files[numb];
            // 判断是否图片
            if(!img){
                showTips('图片只能是jpg,gif,png');
            }else if(!(img.type.indexOf('image')==0 && img.type && /\.(?:jpg|png|gif)$/.test(img.name)) ){
                showTips('图片只能是jpg,gif,png');
                return ;
            }else {
                S.share.el.isPick = true;
                fd.append('file', img);
                fd.append('serviceName', 'clueImg');
                var imgData = "";
                if ($file_upload.files && $file_upload.files[numb]) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        if (e.target.result) {
                            imgData = e.target.result;
                            showLoading(false,'正在上传');
                            setTimeout(function () {
                                uploadimg(img_id,fd,imgData);
                            },500);
                        }
                    };
                    reader.readAsDataURL($file_upload.files[numb]);
                }
            }
        }
    }
}

//function uploadFile(img_id) {
//    var fd = new FormData();
//    var count = S.share.el.imgNumb = document.getElementById('share-pick').files.length;
//    if (count == 0) {
//        return;
//    }
//    for(var a = 0 ; a < count ; a++){
//        fd.append('file', document.getElementById('share-pick').files[a]);
//        fd.append('serviceName', 'clueImg');
//        showLoading();
//        uploadimg(img_id, fd);
//        showLoading(false,'正在上传');
//    }
//}

function uploadimg(img_id, fd, flag){
    S.share.el.imgNumb++;
    var xhr = new XMLHttpRequest(),
        $img_id = $('#' + img_id);
    xhr.addEventListener("load", function(evt) {
        if (evt.target && evt.target.responseText) {
            var data = $.parseJSON(evt.target.responseText);
            if (!data || data.result == false) {
                hideLoading();
                showTips("上传失败，单张图片大小不能超过5M");
                S.share.el.upload = false;
                S.share.el.imgFail++;
                return;
            }else if(data.result == true){
                S.share.el.upload = true;
                S.share.el.dataPath = data.filePath;
                S.share.el.imgSuccess++;
                if(S.share.el.imgNumb > 10){
                    hideLoading();
                    showTips("图片数不能超过10张");
                    S.share.el.imgNumb = 10;
                    S.share.el.previewPick.css("display","none");
                    return;
                }else{
                    setTimeout(fileSelected(S.share.el.updateNumb),1000);
                    $(".preview-pick").before('<div id="' + data.filePath +'" class="preview-pic"><img src="' + flag + '" /><div onclick="S.share.removeself(this)" class="preview-close"></div></div>');
                    $(".preview-pic").css("height",($(window).width()*0.2));
                }
                hideLoading();
                S.share.el.updateNumb++;
            }
            //if(S.share.el.imgSuccess + S.share.el.imgFail == S.share.el.imgNumb){
            //    if(S.share.el.imgFail > 0){
            //        hideLoading();
            //        showTips('有图片上传失败，再试一次吧');
            //    }else{
            //        hideLoading();
            //        showTips('图片上传成功');
            //    }
            //    S.share.el.imgFail = 0;
            //    S.share.el.imgSuccess = 0;
            //}
        }
    }, false);
    if(fd == 0){ return; }
    xhr.addEventListener("error", function() {
        $('#' + img_id).removeClass('loading');
        S.share.el.upload = false;
        hideLoading();
        showTips('上传出错,文件大小不能超过5M');
    }, false);
    xhr.addEventListener("abort", function() {
        $('#' + img_id).removeClass('loading');
        S.share.el.upload = false;
        hideLoading();
        showTips("上传已取消");
    }, false);
    xhr.open('POST', business_url+"file/upload/image");
    //xhr.open('POST', "http://192.168.0.110:8080/mpAccount/mobile/file/upload/images");
    //xhr.open('POST', "http://192.168.0.188/test/index.php");
    //xhr.open('POST', 'http://test.holdfun.cn/portal/fileupload/image');
    xhr.send(fd);
}

