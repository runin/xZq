(function($) {
	
	H.index = {
			
		init: function() {
			$('#upload-box').upload({
				url: domain_url + 'fileupload/image', 	// 图片上传路径
				numLimit: 2,							// 上传图片个数
				formCls: 'upload-form'					// 上传form的class
			});
		}
		
	};
	
})(Zepto);

$(function() {
	H.index.init();
});

