;(function($) {
	
	H.audio = {
		$audio: $('.ui-audio'),
		$audio_btn: $('.audio-icon'),
		audio: null,
		audio_val: true,
		zlow: function() {
			this.$audio.addClass('zlow');
		},
		
		show: function() {
			this.$audio.removeClass('zlow none');
		},
		
		init: function(url) {
			var options_audio = {
				loop: false,
				preload: "auto",
				src: url,
				autoplay: true
			}
			this.audio = new Audio();

			for (var key in options_audio) {
				if (options_audio.hasOwnProperty(key) && (key in this.audio)) {
					this.audio[key] = options_audio[key];
				}
			}
			this.audio.load();
			
			this.$audio_btn.addClass('animated');
		},

		event_handler: function() {
			var me = this;
			if (this.$audio.length == 0) {
				return;
			}

			var txt = me.$audio.find('.audio-txt'),
				time_txt = null;
			me.$audio.find('.btn-audio').on('click', function(e) {
				e.preventDefault();
				
				me.audio_contorl();
			});

			$(me.audio).on('play', function() {
				me.audio_val = false;

				audio_txt(txt, true, time_txt);
				
				me.$audio_btn.addClass('animated');
			})

			$(me.audio).on('pause', function() {
				audio_txt(txt, false, time_txt)

				me.$audio_btn.removeClass('animated');
			});
			
			function audio_txt(txt, val, time_txt) {
				txt.text(val ? '打开' : '关闭');
				if (time_txt) {
					clearTimeout(time_txt);
				}

				txt.removeClass('animated hide');
				time_txt = setTimeout(function() {
					txt.addClass('animated').addClass('hide');
				}, 1000)
			}
		},

		audio_contorl: function() {
			if (!this.audio_val) {
				this.audio_stop();
			} else {
				this.audio_play();
			}
		},

		audio_play: function() {
			this.audio_val = false;
			if (this.audio) {
				this.audio.play();
			}
		},

		audio_stop: function() {
			this.audio_val = true;
			if (this.audio) {
				this.audio.pause();
			}
		}
	};
	
})(Zepto);