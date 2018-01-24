var type = [{
	id:0,
	class:"click-a"
},{
	id:1,
	class:"click-b"
},{
	id:2,
	class:"click-c"
},{
	id:3,
	class:"click-d"
},{
	id:4,
	class:"click-e"
}];

+(function($) {
	var aim = {
		$tangYuan: $(".tang-yuan"),
		$nowGo: $("#now-go"),
		$audioA: $("#audio-a"),
		$tang_a: "tang-yuan-d",
		init: function() {
			this.animationFn();
			this.nowGo();
		},
		animationFn: function() {
			var t,className;
			this.$tangYuan.click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				if($(this).hasClass(className) || $(this).hasClass(aim.$tang_a)) {
					return;
				}
				$("#audio-a,#audio-b,#audio-c,#audio-d,#audio-e").get(0).pause();
				t = Math.floor(Math.random()*type.length);
				className = type[t].class;
				if(type[t].id==0) {
					$("#audio-d").get(0).play();
				}else if(type[t].id==1){
					$("#audio-c").get(0).play();
				}else if(type[t].id==2){
					$("#audio-b").get(0).play();
				}else if(type[t].id==3){
					$("#audio-a").get(0).play();
				}else{
					$("#audio-e").get(0).play();
				}
				
				$(this).addClass(className);
				setTimeout(function() {
					aim.$tangYuan.removeClass(className);
				},800);
			});
		},
		nowGo: function() {
			this.$nowGo.unbind("click").click(function() {
				var t = simpleTpl();
				t._('<section class="pop-bg" id="meteor-box">')
				t._('<p class="add-ally">多一个盟友，就多一道光</p>')
				t._('<span class="meteor meteor-a"></span><span class="meteor meteor-b"></span><span class="meteor meteor-c"></span><span class="meteor meteor-d"></span><span class="meteor meteor-e"></span>')
				t._('</section>')
				$("body").append(t.toString());
				aim.meteorRemove();
				H.bottom.loadFriend();
			});
		},
		meteorRemove: function() {
			$("#meteor-box").click(function() {
				$("#meteor-box").remove();
			});
		}
	};
	aim.init();
})(Zepto);