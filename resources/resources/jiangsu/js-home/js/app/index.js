+(function ($) {
    var index = {
        initParam: function () {
            this.form = $(".form");
            this.name = $('[name="name"]'); //姓名
            this.sex = $('[name="sex"]'); //性别
            this.age = $('[name="age"]'); //年龄
            this.school = $('[name="address"]'); //学校
            this.phone = $('[name="phone"]'); //家长联系方式
            this.submit = $(".submit"); //提交按钮
            this.select = $(".select");
            this.s_t = $(".s_t");
            this.a_t = $(".a_t");
            this.age_con = $(".age");
        },
		personcount: function() {//判断是否已经报名已满
			var that = this;
			loadData({ url: domain_url + "api/entryinfo/personcount", callbackActiveEntryPersoncountHandler: function (data) {
				if(data && data.result == true) {
					$("body,html").css({"background":"url('./images/bg_01.jpg')","background-size":"cover"});
					$("#success-info").removeClass("none");
				}else {
					that.timeFn();
				}
			},data:{
				openid:openid
			}})
		},
		timeFn: function() {//获取系统当前时间毫秒数
		    var that = this;
			loadData({ url: domain_url + "api/common/time", commonApiTimeHandler: function (data) {
				var t = parseInt(data.t);
				that.achieveFn(t);
			}})
		},
		achieveFn: function(t) {//获取报名活动信息
		    var that = this;
			loadData({ url: domain_url + "api/entryinfo/info", callbackActiveEntryInfoHandler: function (data) {
				if(data && data.code == 0) {
					var eb = parseInt(timestamp(data.eb));
					var ee = parseInt(timestamp(data.ee));
					if(eb<t && t<ee) {
						$(".form").removeClass("none");
						that.initEvent();
					}
				}
			}})
		},
        check: function () {
            var name = this.name.val(); //姓名
            var sex = this.sex.val(); //性别
            var age = this.age.val(); //年龄
            var school = this.school.val(); //学校
            var phone = this.phone.val(); //电话
            if (!name) {
                alert("请填写名字");
                return false;
            }
            if (name.length > 15) {
                alert("名字过长了");
                return false;
            }
            if (!age || age=="0") {
                alert("请选择年龄");
                return false;
            }
            if (this.s_t.text() == "性别") {
                alert("请选择性别");
                return false;
            }

            if (!school) {
                alert("请填写学校");
                return false;
            }
            if (!(/^[0-9]*$/.test(age) && (age >= 4 && age <= 18))) {
                alert("请正确填写年龄(限4~18岁哦)");
                return false;
            }
            if (!(phone && /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(phone))) {
                alert("请填写正确家长联系方式");
                return false;
            }
            return true;
        },
        initEvent: function () {
            function turnJson(str) {
                var strArr = str.split("&");
                var resultJson = {};
                for (var i = 0, l = strArr.length; i < l; i++) {
                    var sindex = strArr[i].search("=");
                    var tname = strArr[i].substring(0, sindex);
                    var tval = strArr[i].substring(sindex + 1, strArr[i].length);
                    resultJson[tname] = tval
                }
                return resultJson;
            };
            this.submit.click($.proxy(function() {
                if (this.check()) {
                    var resultJson = turnJson(this.form.serialize());
                    if (!openid) {
                        alert("抱歉提交失败");
                        return;
                    }

                    openid && (resultJson.openid = openid);
                    headimgurl && (resultJson.images = headimgurl);
                    var that = this;
                    loadData({ url: domain_url + "api/entryinfo/asyncsave", callbackActiveEntryInfoSaveHandler: function (data) {
                        if (data.code == 0) {
                            alert("恭喜提交成功");
                            that.form.get(0).reset();
                            that.s_t.text("性别");
                            that.a_t.text("年龄(4-18岁)");
                            that.age.val("0");
							
							$(".form").addClass("none");
							$("#success-info").removeClass("none");
							$("body,html").css({"background":"url('./images/bg_01.jpg')","background-size":"cover"});
                        } else {
                            alert("抱歉提交失败");
                        }
                    }, data: resultJson, error: function () {
                        alert("抱歉提交失败");
                    }
                    });
                }

            }, this));
			
            var that = this;
            this.select.click(function () {
                if ($(this).hasClass("open")) {
                    $(this).removeClass("open");
                } else {
                    $(this).addClass("open");
                }
                return false;

            });
            this.select.find(".s_m").click(function () {
                that.s_t.text("男");
                that.sex.val("1");
            });
            this.select.find(".s_l").click(function () {
                that.s_t.text("女");
                that.sex.val("2");
            });

            this.age_con.click(function () {
                if ($(this).hasClass("open")) {
                    $(this).removeClass("open");
                } else {
                    $(this).addClass("open");
                }
                return false;
            });
            this.age_con.find(".a_v").click(function () {
                that.a_t.text($(this).text());
                that.age.val($(this).text());
            });
        },
		successFn: function() {//报名成功后
			
		},
        init: function () {
            this.initParam();
			this.personcount();
        }
    };
    index.init();
})(Zepto);