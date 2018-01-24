;(function($) {
	
	/**
	 * 抽奖转盘
	 */
	$.fn.lottery = function(options) {
		var defauls = {
			// 奖品区的背景颜色
			colors: [ '#FFE327', '#FFFF98' ],
			// 奖品图片路径
			images: [],
			// 奖品尺寸大小
			image_size: 85,
			// 奖品图片半径
			image_radius: 98,
			// 抽奖按钮
			btn_needle: '',
			// 转盘大小
			canvas_size: 270,
			// 转盘border
			outside_stroke_width: 10,
			inside_stroke_width: 1,
			// 转盘填充色
			stroke_color: '#FEAE01',
			// 奖品文字大小
			text_size: 16,
			// 奖品文字颜色
			text_color: '#ED4344',
			// 奖品对应的文字
			texts: [],
			// 奖品文字半径
			text_radius: 105,
			duration: 8500,
			cycles: 2,
            clickNum:0,
            clickFn:null//点击抽奖的回调
		};
		var options = $.extend({}, defauls, options),
			canvas = $(this).get(0);

		var drawWheel = function() {
			if (canvas.getContext) {
				var ctx = canvas.getContext("2d"),
					start_angle = 1.5 * Math.PI,
					origin_x = options.canvas_size / 2,
					origin_y = options.canvas_size / 2,
					inside_radius = 20,
					outside_radius = (options.canvas_size - options.outside_stroke_width) / 2,
					arc = Math.PI * 2 / options.texts.length,
					tmp = [];
				
				ctx.clearRect(0, 0, 500, 500);
				
				for ( var i = 0, len = options.texts.length; i < len; i++) {
					var angle = start_angle + i * arc;
					ctx.fillStyle = options.colors[i % 2];
					ctx.strokeStyle = options.stroke_color;

					ctx.beginPath();
					ctx.arc(origin_x, origin_y, outside_radius, angle, angle + arc, false);
					ctx.lineWidth = options.outside_stroke_width;
					ctx.fill();
					ctx.stroke();
					
					ctx.arc(origin_x, origin_y, inside_radius, angle + arc, angle, true);
					ctx.lineWidth = options.inside_stroke_width;
					ctx.closePath();
					
					ctx.fill();
					ctx.stroke();
					
					ctx.save();
					
					// 奖品对应的文字
					ctx.fillStyle = options.text_color;
					ctx.font = options.text_size + "px 'Microsoft YaHei'";
					
					ctx.save();
					ctx.translate(origin_x + Math.cos(angle + arc / 2) * options.text_radius, origin_y + Math.sin(angle + arc / 2) * options.text_radius);
					ctx.rotate(angle + arc / 2 + Math.PI / 2);
					var text = options.texts[i];
					ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
					
					ctx.restore();
					
					// 奖品对应的图片
					var image = new Image(),
						x = origin_x + Math.cos(angle + arc / 2) * options.image_radius,
						y = origin_y + Math.sin(angle + arc / 2) * options.image_radius;
					
					tmp.push({'x': x, 'y': y});
					image.src = options.images[i]
					image.onload = (function(ctx, angle, arc, tmp, i, image) {
						return function() {
							ctx.save();
							var size_obj = resize_rate(image.width, image.height);
							ctx.translate(tmp[i].x, tmp[i].y);
							ctx.rotate(angle + arc / 2 + Math.PI / 2);
                           
							ctx.drawImage(image, - size_obj.width / 2, 0, size_obj.width, size_obj.height);
							ctx.restore();
						};
					})(ctx, angle, arc, tmp, i, image);

					ctx.restore();
				}
			}
		};

		var resize_rate = function(width, height) {
			var new_width = options.image_size, 
				new_height = options.image_size,
				size_obj = {'width': new_width, 'height': new_height};
			
			if (width > options.image_size || height > options.image_size) {
				var rate = width / height;
				if (rate <= 1) {
					size_obj.width = Math.round(width * new_width / height);
				} else {
					size_obj.height = Math.round(height * new_width / width);
				}
			}
			return size_obj;
		};
		var initEvent = function() {
			var $btn = $(options.btn_needle),
				award_len = options.texts.length,
				arc = Math.PI * 2 / award_len;
			if ($btn.length == 0) {
				return;
			}
			$btn.click(function(e) {
				e.preventDefault();
                options.clickNum ++;
                if(options.clickNum>1){
                    return;
                }
                if(options.clickFn){
                 options.clickFn(function(rs){
                   if(rs){
                   var prize_index =rs.prize_index,
					size = 360 / award_len,
					angle_fix = size / 5,
					angle_start = size * (prize_index - 1) + angle_fix,
					angle_end = size * prize_index - angle_fix,
					angle = Math.floor( Math.random() * (angle_end - angle_start) + angle_start);
                    $btn.stopRotate();
                    var al =   angle + options.cycles * 360
                    if(!rs.isLottery&&rs.ai==-1){
                       al =options.cycles * 360;
                    }
			    	$btn.rotate({
					angle : 0,
					duration : options.duration,
					animateTo : al, 
					callback : function() {
                      options.clickNum=0;
                        if(options.callBackFn){
                            options.callBackFn(prize_index,options,rs.isLottery,rs.data,rs.ganxie);
                        }
					}
			    	});  
                  }else{
                  options.clickNum=0;
                  }
                  });
                }
			
			});
		};
		
		drawWheel();
		initEvent();
	};
	
})(Zepto);