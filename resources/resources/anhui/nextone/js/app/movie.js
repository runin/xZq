(function($) {
	
	H.movie = {
		guid: getQueryString('guid'),
		init: function() {
			this.event();
			
			if (!this.guid) {
				this.error();
				return false;
			}
			getResult('comedian/audio/' + this.guid, {}, 'callbackComedianAudio', true);
			
			var height = $(window).height();
			$('.main').css('minHeight', height);
		},
		error: function() {
			alert('视频信息不存在');
			//window.location.href = 'index.html';
			return false;
		},
		
		event: function() {
			$('video').on('play', function() {
				recordUserOperate(openid, '视频播放按钮', 'ah-movie-playbtn');
			});
		},
		
		fill_data: function(data) {
			var $content = $('#ui-content').attr('data-url', data.vu),
				$cover = $('#cover');
			$content.find('.title').find('span').html(data.da);
			$content.find('.desc').text(data.vt);
			$cover.find('video').attr('poster',  data.vi).html('<source src="'+ data.vu +'" type="video/mp4" />');
			
			var total = data.pc + data.wc + data.wdc;
			$('#cw-voted').find('.pg').each(function() {
				var percent = (total ? Math.round((data[$(this).attr('data-type')] / total)* 100) : 0) + '%';				
				$(this).css('width', percent).closest('dd').find('.pgt').text(percent);
			});
		}
	};
	
	W.callbackComedianAudio = function(data) {
		if (data.code != 0) {
			H.movie.error();
			return;
		}
		H.movie.fill_data(data);
	};
	
})(Zepto);

H.movie.init();
