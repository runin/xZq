/**
 * 帮帮团-相亲
 */
(function($) {
	H.date = {
		$name:$("#name"),
		$sex:$("#sex"),
		$birthday:$("#birthday"),
		$phone:$("#phone"),
		$occupation:$("#occupation"),
		$salary:$("#salary"),
		$hobby:$("#hobby"),
		$description:$("#description"),
		uuid:"",
		init: function () {
			this.event_handler();
			getResult('travel/enter/indexnew', {openid:openid}, 'indexNewHandler');
		},
		event_handler : function() {
			var me = this;
			$("#btn-submit").on("click",function(){
				if(me.check()){
					getResult('travel/enter/fjsure', {
						openid:openid,
						n:encodeURIComponent(me.$name.val().trim()),
						se:encodeURIComponent(me.$sex.val().trim()),
						b:encodeURIComponent(me.$birthday.val().trim()),
						p:encodeURIComponent(me.$phone.val().trim()),
						o:encodeURIComponent(me.$occupation.val().trim()),
						sa:encodeURIComponent(me.$salary.val().trim()),
						h:encodeURIComponent(me.$hobby.val().trim()),
						d:encodeURIComponent(me.$description.val().trim()),
						uuid:me.uuid
					}, 'fjSureHandler');
				}
			});
		},
		check:function(){
			var name = this.$name.val().trim();
			var sex = this.$sex.val().trim();
			var birthday = this.$birthday.val().trim();
			var phone = this.$phone.val().trim();
			var occupation = this.$occupation.val().trim();
			var salary = this.$salary.val().trim();
			var hobby = this.$hobby.val().trim();
			var description = this.$description.val().trim();
			if(name == "" || name == null){
				alert("请输入姓名");
				return false;
			}
			if(birthday == "" || birthday == null){
				alert("请输入出生年月");
				return false;
			}
			if(phone == "" || phone == null){
				alert("请输入联系电话");
				return false;
			}
			if(occupation == "" || occupation == null){
				alert("请输入职业");
				return false;
			}
			if(salary == "" || salary == null){
				alert("请输入年薪");
				return false;
			}
			if(description.length > 100){
				alert("择偶期望限100字");
				return false;
			}
			return true;
		}
		
	}
	
	W.indexNewHandler = function(data){
		if(data.code == 0){
			if(data.i){
				$(".content").removeClass("none");
				H.date.uuid = data.id;
			}else{
				$(".already").removeClass("none");
			}
		}else if(data.code == 5){
			$(".already").find("h2").text(data.message);
			$(".already").removeClass("none");
		}else{
			$(".already").find("h2").text("报名活动还未开始， 敬请期待！");
			$(".already").find("p").addClass("none");
			$(".already").removeClass("none");
		}
	};
	
	W.fjSureHandler = function(data){
		if(data.code == 0){
			$(".content").addClass("none");
			$(".succ").removeClass("none");
		}else{
			alert(data.message);
			location.reload(true);
		}
	};
})(Zepto);

$(function(){

	$("body").css({"width":"100%","background":"url(./images/dating-bg.jpg) no-repeat bottom center #ffdcdc","background-size":"100% 100%"});
	$("body").css("min-height",$(window).height());
	H.date.init();
});


