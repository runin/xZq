$(function() {

    getResult('user/'+openid+'/phone', {},'callbackUserPhoneHandler');

	$('#btn-upload').click(function(e) {
		e.preventDefault();
		if ($(this).hasClass('none')) {
			return;
		}
		$('#input-file-upload').trigger('click');
	});
	$('#btn-submit').click(function(e) {

		e.preventDefault();
		if ($(this).hasClass('requesting')) {
			return;
		}
        $(this).addClass('requesting');

		var $content = $('#content'),
			content = $.trim($content.val()),
			$phone = $('#phone'),
			phone = $.trim($phone.val()),
			regex = /(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)|(^\d{11}$)/,
			$img_ctrl = $('#img-ctrl'),
			imgs = [];
		
		if (!content) {
			$(this).removeClass('requesting');
			alert('请您写下新闻线索');
			$content.focus();
			return;
		}
		var len = content.length;
		if (len < 10 || len > 200) {
			$(this).removeClass('requesting');
			alert('新闻线索长度为10-200字');
			$content.focus();
			return;
		}
		if (!phone || !regex.test(phone)) {
			$(this).removeClass('requesting');
			alert('请输入正确的电话号码，格式为：\n座机：010-12345678\n手机：13800138000');
			$phone.focus();
			return;
		}
		
		$img_ctrl.find('.img-preview').each(function() {
			if ($(this).hasClass('loading')) {
				alert('图片上传中，请稍候...');
				return false;
			}
			var url = $.trim($(this).attr('data-url'));
			url && imgs.push(url);
		});
		

		getResult('news/clue', {
			serviceNo: service_no,
			openid: openid,
			phone: phone,
			content: encodeURIComponent(content),
			imgs: imgs.join(';')
		}, 'callbackClueHandler');
		
	});
	
	$('#img-ctrl').on('click', '.img-preview', function(e) {
		e.preventDefault();
		if ($(e.target).hasClass('close')) {
			return;
		}
		preview($(this).find('img').attr('src'));
		
	}).on('click', '.close', function(e) {
		e.preventDefault();

		$(this).closest('a').remove();
		$('#btn-upload').removeClass('none');
	});
	
	$('.btn-back-simple').click(function(e) {
		e.preventDefault();
		
		var content = $.trim($('#content').val()),
			phone = $.trim($('#phone').val()),
			img_len = $('#img-ctrl').find('.img-preview').length;
		
		if (content.length > 0 || phone.length > 0 || img_len > 0) {
			if (!confirm('是否放弃提交新闻线索？')) {
				return;
			} else {
				window.location.href = 'index.html';
			}
			return;
		}
		window.location.href = 'index.html';
	});
});

window.callbackUserPhoneHandler=function (data){
    $('#phone').val(data.result);
}

window.callbackClueHandler = function(data) {
	$('#btn-submit').removeClass('requesting');
	if (data.code == 0) {
		window.is_submit = true;
		window.location.href = 'baoliao_success.html';
	} else {
		alert(data.message);
	}
}

function fileSelected() {
	var $file_upload = document.getElementById('input-file-upload'),
		count = $file_upload.files.length,
		img_id = 'img-' + new Date().getTime();

	if ($('.img-preview').length >= 4) {
		$('#btn-upload').addClass('none');
	}
    if ($file_upload.files && $file_upload.files[0]) {
        var reader = new FileReader(),
        	t = simpleTpl();
        
        t._('<a href="#" id="'+ img_id +'" class="img-preview loading" data-collect="true" data-collect-flag="hnjs-news-baoliao-preview-btn" data-collect-desc="爆料页面 预览图片按钮">')
			._('<span class="lc"><i class="uploading"></i></span>')
			._('<i class="close"  data-collect="true" data-collect-flag="hnjs-news-baoliao-remove-img-btn" data-collect-desc="爆料页面 删除上传的图片按钮" data-stoppropagation="true"></i>')
			._('<span class="ic"><img src="http://yao.holdfun.cn/portal/resources/news/images/blank.gif" /></span>')
		._('</a>');
        $('#btn-upload').before(t.toString());
	
        reader.onload = function (e) {
        	if (e.target.result) {
        		$('#' + img_id).find('img').attr('src', e.target.result);
				if((e.target.result).indexOf('image/') == -1){ uploadimg(img_id, 0, true); }
        	}
        }
        reader.readAsDataURL($file_upload.files[0]);
    }
    
    uploadFile(img_id);
}

function uploadFile(img_id) {
	var fd = new FormData();
    var count = document.getElementById('input-file-upload').files.length;
    if (count == 0) {
    	return;
    }
    fd.append('file', document.getElementById('input-file-upload').files[0]);
    fd.append('serviceName', 'clueImg');
	uploadimg(img_id, fd);
}

var _flag = false;
function uploadimg(img_id, fd, flag){
	_flag = flag;
	var xhr = new XMLHttpRequest(),
		$img_id = $('#' + img_id);
	xhr.addEventListener("load", function(evt) {
		if (evt.target && evt.target.responseText) {
			var data = null;
			try {
				data = $.parseJSON(evt.target.responseText);
			} catch(e) {}

			if (!data || data.code != 0) {
				alert('上传图片失败')
				return;
			}
			if(_flag){ $img_id.find('img').attr('src', data.filePath); }
			$img_id.attr('data-url', data.filePath).removeClass('loading');
		}
	}, false);
	if(fd == 0){ return; }
	xhr.addEventListener("error", function() {
		$('#' + img_id).removeClass('loading');
		alert('上传出错')
	}, false);
	xhr.addEventListener("abort", function() {
		$('#' + img_id).removeClass('loading');
		alert("上传已取消");
	}, false);
	xhr.open('POST', domain_url + 'fileupload/image');
	xhr.send(fd);

}

function preview(src) {
	var t = simpleTpl(),
		$preview_box = $('#preview-box'),
		w = $(window).width(),
		h = $(window).height();
	
	if ($preview_box.length == 0) {
		t._('<div class="preview-box" id="preview-box">')
		   	._('<img class="none" src="http://yao.holdfun.cn/portal/resources/news/images/blank.gif" />')
		._('</div>');
		$preview_box = $(t.toString());
	} else {
		$preview_box.show();
	}
	imgReady(src, function() {
		var to_w = w - 20,
			to_h = h - 20,
			to_rotate = to_w / to_h,
			src_rotate = this.width / this.height;
		
		if (this.width > to_w || this.height > to_h) {
			if (to_rotate <= src_rotate) {
				to_h = to_w * (this.height / this.width);
			} else {
				to_w = to_h * (this.width / this.height);
			}
		} else {
			to_w = this.width;
			to_h = this.height;
		}
		
		$preview_box.find('img').attr('src', src).css({'width': to_w, 'height': to_h, 'margin-left': (w - to_w) / 2, 'margin-top': (h - to_h) / 2}).removeClass('none');
	});
	
	$('html').addClass('noscroll');
	$('body').append($preview_box).delegate('.preview-box', 'click', function(e) {
		$preview_box.hide();
		$('html').removeClass('noscroll');
	});
	
};
