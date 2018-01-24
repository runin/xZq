+(function($) {
	
    var tool = { //工具类
        setCookie: function(name, value) {
            //$.fn.cookie(name + "_" + petuid, value, expires_in);
			localStorage.setItem(name + "_" + petuid, value);
        },
        getCookie: function(name) {
           //return $.fn.cookie(name + "_" + petuid);
		   return localStorage.getItem(name + "_" + petuid);
        },
        getDataStr: function() {
            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            return y + (m < 10 ? ("0" + m) : m) + (d < 10 ? ("0" + d) : d);
        },
        timestamp: function(str) { //转化字符串类型的时间
            var str2date = function(str) {
                str = str.replace(/-/g, '/');
                return new Date(str);
            };
            var timestamp = function(str) {
                return Date.parse(str2date(str));
            };
            return timestamp(str);
        }
    };
	
	H.classid = {//样式
		$biao_qing:$("#biao-qing"),
		$news_record:$(".news-record"),
		$tangYuan: $(".tang-yuan"),
		$gold_num: $(".gold-num")
	};
	
	//点击动画
	H.ani = {
		btnAni: function(clid) {
			clid.addClass("on-btn");
			setTimeout(function() {
				clid.removeClass("on-btn");
			},500)
		}
	};
	
	H.gold = {//添加金币动画
	    $irgold_xz:2,
		$irgold_dg:3,
		$self:"",
		$openid:"",
		goldFn: function() {
			$("body").append('<i class="add-gold"></i>');
			setTimeout(function() {
				$(".add-gold").remove();
				H.classid.$biao_qing.removeClass();
			},2500);
		},
		isreceiveHtml: function() {
			var t = simpleTpl();
			t._('<section class="pop-bg" id="evolve-box">')
			t._('<div class="evolve_int_a"></div>')
			t._('<div class="evolve_int_b">')
			t._('<span class="integration"></span></div>')
			t._('<a href="javascript:void(0)" class="btn-a" id="evolve-close"></a>')
			t._('</section>')
			$("body").append(t.toString());
			$("#evolve-close").unbind("click").click(function(e) {
				e.preventDefault();
				H.gold.evolveFn();
			});
		},
		evolveFn: function() {//成长成功后领取金币
			loadData({
				url: domain_url + "api/pet/receiveGolds",callbackApiPetReceiveGolds: function(data) {
					if (data && data.code == 0) {
						$("#evolve-box").remove();
						var text = parseInt(H.classid.$gold_num.text());
						H.classid.$gold_num.text(text+data.gold);
					} else {
						$("#evolve-box").remove();
						showTips("抱歉请稍后再试");
					}
				},
				data: {
					oi: openid
				}
			});
		},
		petIsreceive: function() {//判断是否已经领取过金币
		    if(window.ex==4 && H.gold.$openid==window.openid) {
				loadData({
					url: domain_url + "api/pet/isreceive",callbackApiPetIsreceive: function(data) {
						if (data.code == 0) {
							H.gold.isreceiveHtml();
							$(".integration").html(data.gold);
						}
					},data: {
						oi: openid
					}
				});
			}
		}
		
	};
	
	H.recordaNews = {//消息记录
	    recordFn: function(oi) {
			var that = this;
            this.$MsgTemp = $('<dl class="news-table"><dd class="date"></dd><dd class="time"></dd><dt class="msg"></dt></dl>');

            function appendMsg(data) {
                H.classid.$news_record.empty();
                for (var i = 0; i < data.items.length; i++) {
                    var item = that.$MsgTemp.clone();
                    item.find(".date").html(data.items[i].tt.split(" ")[0]);
                    item.find(".time").html(data.items[i].tt.split(" ")[1]);
                    item.find(".msg").html(data.items[i].ms);
                    H.classid.$news_record.append(item);
                }
            };
            loadData({
                url: domain_url + "api/pet/mymsg",callbackApiPetMymsg: function(data) {
                    if (data.code == 0) {
                        appendMsg(data);
                    }else {
						H.classid.$news_record.empty().append("<p>啥都没有~</p>");
					}
                },
                data: {
                    oi: oi
                },
				showload: false
           });
		}
	};
	
	//欢迎回家
	H.welcomeFn = {
		goHome: function() {
			H.classid.$tangYuan.append('<em class="welcome-home">欢迎回家！<i></i></em>');
			setTimeout(function() {
				$(".welcome-home").remove();
			},2000);
		}
	};
	
	H.bodybg = {
		bodybgFn: function(data) {
			var bgs = data.style;
			var sty="main_bg_a";
			if(bgs == "pet_them1") {
				sty ="main_bg_a";
				$(".bg-a").parent().addClass("on");
			}else if(bgs == "pet_them2"){
				sty ="main_bg_b";
				$(".bg-b").parent().addClass("on");
			}else if(bgs == "pet_them3"){
				sty ="main_bg_c";
				$(".bg-c").parent().addClass("on");
			}else {
				sty ="main_bg_d";
				$(".bg-d").parent().addClass("on");
			}
			top.setBgStyle(sty); // 设置背景
		}
	};
	
    var top = { //上部
        initParam: function() {},
        infoCardFn: (function() { //信息板块
            function infoCard(that, data) {
				window.img = data.hu;
				//H.gold.$self = data.self;
				//H.recordaNews.recordFn(data.oi);//好友的消息记录
				window.oi = data.oi;
                this.$notice_box = $(".notice-box");
                this.setData = function() {
                    this.$notice_box.find(".myhead-img").css({
                        "background-image": "url('" + (data.hu || "./images/icon-avatar.png") + "')"
                    }); //头像
                    this.$notice_box.find(".my-name h2").html(data.nn); //昵称
                    this.$notice_box.find(".my-name .user_level").html(that.setLevel(data.exp)); //等级
                    this.$notice_box.find(".my-name .gold-num").html(data.gold); //金币
                    this.$notice_box.find(".expnum").css({
                        //width: data.exp / 700 * 100 + "%"
						width: that.setLevel(data.exp) / 4 * 100 + "%"
                    }); //经验值
                }
                this.register = function() {};
                this.init = function() {
                    this.setData();
                    this.register();
                };
                this.init();
            }
            return infoCard;
        })(),
        toolbarFn: (function() { //功能栏
            function toolbar(that, data) {
                this.$work_a = $(".work-a");
                this.$work_b = $(".work-b");
                this.$work_c = $(".work-c");
                this.$work_d = $(".work-d");
				this.$biao_qing = $("#biao-qing");
                this.$work_status = $(".work_status"); //状态进度
				this.$gold_num = $(".gold-num");
                this.$broom = $("<div class='Broom'><div class='BroomImg animate'></div><div class='BroomDrag'></div></div>");
                this.$BroomDrag = this.$broom.find(".BroomDrag");
                this.status = "";
                var th = this; { //工具函数

                    this.setStatus = function(status) {
                        switch (status) {
                            case 0:
                                th.statusName = "";
                                th.status = 0;
                                break;
                            case 1:
                                th.statusName = "打工中";
                                th.status = 1;
                                break;
                            case 2:
                                th.statusName = "洗澡中";
                                th.status = 2;
                                break;
                            case 3:
                                th.statusName = "喂食中";
                                th.status = 3;
                                break;
                            case 4:
                                //  this.status = "打扫中";
                                break;
                        }
                    }
                    this.downCountFn = function(st, et, status) {
                        var timeArr = [];
                        var timeItem = {};
                        var $timeobj = th.$work_status.find(".work_status h2");
                        var $precent = th.$work_status.find(".working-schedule i");
                        var totaltime = timestamp(et) - st;
						if(status ==1){
							totaltime = 1000*60*60;
						}
						if(status ==2){
						   	totaltime = 1000*300;
						}
                        timeItem.st = st;
                        timeItem.et = timestamp(et);
                        timeArr.push(timeItem);
                        th.setStatus( parseInt(status));
                        $("<div></div>").countDown({
                            timeArr: timeArr,
                            countDownFn: function(t, time, index,startTime,endTime,nowTime,obj) {
                                //$timeobj.html(th.statusName + "（" + time + "）");
						       $timeobj.html(th.statusName + "（" + obj.showTime(endTime - nowTime) + "）");
							    var per = 100-parseInt((timeItem.et - nowTime) / totaltime * 100);
                                $precent.css("width",per+"%");
                            },
                            atTimeFn: function(dt, index, nextstartTime, obj, nowTime, endTime) {
                                $timeobj.html(th.statusName + "（" + obj.showTime(endTime - nowTime) + "）");
                                var per = 100-parseInt((timeItem.et - nowTime) / totaltime * 100);
                                $precent.css("width",per+"%");
                            },
                            inQuantumFn: function(t, index) {
								
						   },
                            endFn: function(dt, index, obj, noTime) {
                                th.$work_status.addClass("none");
                                showTips(th.statusName.substring(0, 2) + "已经完成");
                                th.statusName = "";
							    
								th.setGoldandText();
								
                                th.status = 0;
                                H.classid.$biao_qing.removeClass("a-weishi").removeClass("a-xizao").removeClass("a-dasao").removeClass("a-bianbian").removeClass("a-dagong");
                            }
                        });
                    }
					
					this.setGoldandText =function(){
						 var text = parseInt(th.$gold_num.text()); 
						 //that.isMyPet
						 if (H.gold.$self) {//自己升级
						     if(th.status==1){
								 H.gold.goldFn();
								 setTimeout(function() {
									 th.$gold_num.text(text+H.gold.$irgold_dg);
								 },2500);
						     }
							 if(th.status==2){
								  H.gold.goldFn();
								  setTimeout(function() {
									 th.$gold_num.text(text+H.gold.$irgold_xz);
								 },2500);
						     }
						 }else{
	/*					     if(th.status==1){
								 H.gold.goldFn();
								 setTimeout(function() {
								     th.$gold_num.text(text+H.gold.$irgold_dg);
								 },2500);
						     }
							 if(th.status==2){
								 H.gold.goldFn();
								 setTimeout(function() {
								     th.$gold_num.text(text+H.gold.$irgold_xz);
							     },2500);
						     }*/
					     }
						 //this.evolveFn();
				    
					}
                    this.checkUpgrade = function(exp) { //检查有没有升级
						if (that.isMyPet) {
                            if (that.oldLevel < getLevelNum(exp)) {
                                that.setLevel(exp);
                                showTips("恭喜你升级啦");
                            }
                        }

                    };
                    this.returnIsMy =  function(){
                          if(that.isMyPet){
                            return  "你";
                          }else{
                            return  "他";
                          }
                    }
                };
                this.Weishi = function(fn) {
                    if (!tool.getCookie("weishi_" + tool.getDataStr())) { //判断今天有没有喂食过
                        loadData({
                            url: domain_url + "api/pet/feed",callbackApiPetFeed: function(data) {
                                if (data.code == 0) {
									H.classid.$biao_qing.removeClass("a-dasao").removeClass("a-bianbian").removeClass("a-xizao").removeClass("a-dagong").addClass("a-weishi");
                                    that.infoCard.$notice_box.find(".expnum").css({
                                        width: data.exp / 700 * 100 + "%"
                                    }); //经验值
                                    fn && fn(data.exp);
                                    showTips("喂食成功");
									var text = parseInt(th.$gold_num.text());  
								    if (that.isMyPet && H.gold.$openid==window.openid) {//自己升级
									   if(th.status==0){
										   th.$gold_num.text(text+2);
									   }
									}else {
										//if(th.status==0){
										//   th.$gold_num.text(text+1);
									    //}
									}
                                    tool.setCookie("weishi_" + tool.getDataStr(), true);
                                }else {
									if(H.classid.$biao_qing.hasClass("a-xizao")) {
										showTips("洗澡中不能喂食哦~");
									}else if(H.classid.$biao_qing.hasClass("a-dagong")){
										showTips("打工中不能喂食哦~");
									}else {
										showTips("已经有人帮"+th.returnIsMy()+"喂食过咯");
									}
                                }
                            },
                            data: {
                                petuid: that.petuid,
                                oi: openid,
                                nn: encodeURIComponent(nickname),
                                hu: encodeURIComponent(headimgurl)
                            }
                        });
                    } else {
                        showTips("你今天已经"+(that.isMyPet?"":"帮他")+"喂食过咯");
                    }
                };
                this.Dagong = function(fn) {

                    if (!tool.getCookie("dagong_" + tool.getDataStr())) { //判断今天有没有打工过
                        loadData({
                            url: domain_url + "api/pet/work",
                            callbackApiPetWork: function(data) {
                                if (data.code == 0) {
									H.gold.$irgold_dg = data.irgold;
									H.gold.$self = data.self;
									H.classid.$biao_qing.removeClass("a-weishi").removeClass("a-dasao").removeClass("a-bianbian").removeClass("a-xizao").addClass("a-dagong");
                                    data.status = 1;
                                    tool.setCookie("dagong_" + tool.getDataStr(), true);
                                    th.statusName = "打工中";
                                    th.downCountFn(data.cut, data.edtime, data.status);
									th.$work_status.removeClass("none");
									fn && fn(data.exp);
                                } else {
                                    showTips("已经有人帮"+th.returnIsMy()+"打工啦");
                                }
                            },
                            data: {
                                petuid: that.petuid,
                                oi: openid,
                                nn: encodeURIComponent(nickname),
                                hu: encodeURIComponent(headimgurl)
                            }
                        });
						if(fn){
						    fn();
					    };
                    } else {
                        showTips("你今天已经"+(that.isMyPet?"":"帮他")+"打工过咯");
                    }
                };

                this.Xizao = function(fn) {
                    if (!tool.getCookie("xizao_" + tool.getDataStr())) { //判断今天有没有洗澡过
                        loadData({
                            url: domain_url + "api/pet/bathe",
                            callbackApiPetBathe: function(data) {

                                if (data.code == 0) {
									H.gold.$irgold_xz = data.irgold;
									H.gold.$self = data.self;
									H.classid.$biao_qing.removeClass("a-weishi").removeClass("a-dasao").removeClass("a-bianbian").removeClass("a-dagong").addClass("a-xizao");
                                    data.status = 2;
                                    that.infoCard.$notice_box.find(".expnum").css({
                                        width: data.exp / 700 * 100 + "%"
                                    }); //经验值
                                    fn && fn(data.exp);
                                    th.$work_status.removeClass("none");
                                    th.statusName = "洗澡中";
                                    tool.setCookie("xizao_" + tool.getDataStr(), true);
                                    th.downCountFn(data.cut, data.edtime, data.status);
                                } else {
                                    showTips("已经有好友帮"+th.returnIsMy()+"洗过啦");
                                }
                            },
                            data: {
                                petuid: that.petuid,
                                oi: openid,
                                nn: encodeURIComponent(nickname),
                                hu: encodeURIComponent(headimgurl)
                            }
                        });
                    } else {
                        showTips("你今天已经"+(that.isMyPet?"":"帮他")+"洗过咯");
                    }
                }
                this.Dashao = function(fn) {
					 if ($(".rubblish").length == 0) {
						 showTips("亲，辣么干净不用打扫了");
						 $("#biao-qing").removeClass("a-dasao");
						 return false;
					 }
                    if (!this.Dashao.hasBroom) {
						$("#biao-qing").addClass("a-dasao");
                        $("body").append(this.$broom);
                        this.Dashao.hasBroom = true;
                    } else {
						$("#biao-qing").removeClass("a-dasao").removeClass("a-bianbian");
                        this.$broom.remove();
                        this.Dashao.hasBroom = false;
                    }
					if(fn){
						fn()
					};
                }
                this.register = function(it) {
                    function check(s) {

                      /*  if (th.status == 1 || th.status == 2) {
                            showTips("正在" + th.statusName);
                            return false;
                        }*/
                        //clearInterval(window.intervalt);
						if(s == "打工"){
						     if(th.status == 1){
								 showTips("宠物正在打工中");
								 return false;
							 }	
							 if(th.status == 2) {
								 showTips("不可以边洗澡边打工哦");
								 return false;
							 }
						 }
						 if(s == "洗澡"){
							 if(th.status == 1){
								 showTips("不可以边打工边洗澡哦");
								 return false;
							 }	
							 if(th.status == 2) {
								 showTips("宠物正在洗澡中");
								 return false;
							 }
						 }
                        it.$broom.remove();
                        return true;
                    }
                    it.$work_a.unbind("click").click(function() { //喂食
                        H.ani.btnAni($(this).find("i"));
						if (!check("喂食")) {
                            return false;
                        }
                        it.Weishi(function(exp) {
							H.classid.$biao_qing.addClass("a-weishi");
							setTimeout(function() {
								H.classid.$biao_qing.removeClass("a-weishi");
							},600);
                            it.checkUpgrade(exp);
                        });
                    });
                    it.$work_b.unbind("click").click(function() { //洗澡
                        H.ani.btnAni($(this).find("i"));
						if (!check("洗澡")) {
                            return false;
                        }
                        it.Xizao(function(exp) {
                            it.checkUpgrade(exp);
                        });
                    });
                    it.$work_c.unbind("click").click(function() { //打扫
                        H.ani.btnAni($(this).find("i"));
						
						if (!check("打扫")) {
                            return false;
                        }
                        it.Dashao(function() {
							//it.$biao_qing.addClass("a-dasao");
						});
                    });
                    it.$work_d.unbind("click").click(function() { //打工
                        H.ani.btnAni($(this).find("i"));
						if (!check("打工")) {
                            return false;
                        }
                        it.Dagong(function(exp) {
                            it.checkUpgrade(exp);
                        });
                    });

                    function MoveBroom(x, y) {
                        var b = it.$broom;
                        b.css({
                            "-webkit-transform": "translate(" + x + "px," + y + "px)"
                        });
                        //判断是否有 便便在扫把的范围里
                        var bleft = b.offset().left;
                        var btop = b.offset().top + b.height();
                        var rs = that.floor.rubblishArr;
                        for (var i = 0; i < rs.length; i++) {
                            var item = rs[i];
                            var x = item.offset().left;
                            var y = item.offset().top;
                            if ((bleft > x && bleft < x + item.width()) && (btop > y && btop < y + item.height())) {
                                item.remove();
                                loadData({
                                    url: domain_url + "api/pet/clean",
                                    callbackApiPetClean: function(data) {
                                        if (data.code == 0) {
											if(that.isMyPet) {
												var text = parseInt(it.$gold_num.text());  
											    it.$gold_num.html(text+2);
											}
										} else {
                                           // showTips("抱歉哦，打扫失败请稍后再试~");
                                        }
                                    },
                                    data: {
                                        petuid: that.petuid,
                                        oi: openid,
                                        nn: encodeURIComponent(nickname),
                                        hu: encodeURIComponent(headimgurl)
                                    },
                                    showload: false
                                });
                                if ($(".rubblish").length == 0) {
                                    b.remove();
									H.classid.$biao_qing.removeClass("a-dasao").removeClass("a-bianbian");
                                    it.Dashao.hasBroom = false;
                                    showTips("打扫成功~");
                                }
                            }
                        }
                    }
                    it.$BroomDrag.bind("touchstart", function(e) {
                        e.preventDefault();
                        it.offset = it.$BroomDrag.offset();
                        it.dx = e.changedTouches[0].clientX - it.offset.left;
                        it.dy = e.changedTouches[0].clientY - it.offset.top;
                        return false;
                    });
                    it.$BroomDrag.get(0).addEventListener("touchmove", function(e) { //移动事件  
                        e.preventDefault(); //防止mousemove 事件
                        if (!$(e.target).hasClass("BroomDrag")) {
                            return;
                        }
                        var pageX = e.touches[0].pageX;
                        var pageY = e.touches[0].pageY;
                        if (it.lastdistancex) {
                            MoveBroom(it.lastdistancex + pageX - it.dx - it.offset.left, it.lastdistancey + pageY - it.dy - it.offset.top);
                            return;
                        }
                        if (!it.offset) {
                            return;
                        }
                        it.tx = pageX - it.offset.left - it.dx;
                        it.ty = pageY - it.offset.top - it.dy;
                        MoveBroom(it.tx, it.ty);
                    }, false);
                    it.$BroomDrag.get(0).addEventListener("touchend", function(e) {
                        e.preventDefault(); //防止mousemove 事件
                        if (it.lastdistancex) {
                            it.lastdistancex = it.lastdistancex + e.changedTouches[0].pageX - it.offset.left - it.dx;
                            it.lastdistancey = it.lastdistancey + e.changedTouches[0].pageY - it.offset.top - it.dy;
                            MoveBroom(it.lastdistancex, it.lastdistancey);
                        } else {
                            it.lastdistancex = it.tx;
                            it.lastdistancey = it.ty;
                            MoveBroom(it.tx, it.ty);
                        }
                    }, false);
                };
                this.checkStatus = function() { //检查状态
                    if (data.status && data.cut && data.edtime && (data.status == 1 || data.status == 2)) {
                        this.$work_status.removeClass("none");
                        this.downCountFn(data.cut, data.edtime, data.status);
						H.gold.$self = data.self;
                    } else {}
                }
                this.init = function() {
                    this.checkStatus(this);
                    this.register(this);
                };
                this.init();
            }
            return toolbar;
        })(),
        tangYuanFn: (function() { //汤圆对象
            function tangYuan(that, data) {
                this.register = function() {

                };
                this.init = function() {
                    this.register();
                };
                this.init();
            }
            return tangYuan;
        })(),
        floorFn: (function() { //汤圆对象
            function floor(that, data) {
                this.$tang_yuan_box = $(".tang-yuan-box");
                this.offsetTop = this.$tang_yuan_box.get(0).offsetTop;
                this.offsetLeft = this.$tang_yuan_box.get(0).offsetLeft;
                this.offsetWidth = this.$tang_yuan_box.get(0).offsetWidth;
                this.offsetHeight = this.$tang_yuan_box.get(0).offsetHeight;

                this.$tang_yuan = $(".tang-yuan"); //汤圆对象
                this.toffsetTop = this.$tang_yuan.get(0).offsetTop;
                this.toffsetLeft = this.$tang_yuan.get(0).offsetLeft;
                this.toffsetWidth = this.$tang_yuan.get(0).offsetWidth;
                this.toffsetHeight = this.$tang_yuan.get(0).offsetHeight;


                this.rubblishArr = [];
                this.$rubblish = $("<div class='rubblish'></div>");
                this.rw = 42;
                this.rh = 33;

                var f = this;

                function setPosition(item) { //设置位置
                    var left = Math.random() * ((f.offsetWidth - f.rw) - f.rw + 1) + f.rw;
                    var top = Math.random() * ((f.offsetHeight - f.rh) - f.rh + 1) + f.rh;
                    item.css({
                        "left": left + "px",
                        "top": top + "px"
                    });
                    item.top = top;
                    item.left = left;

                    if ((left > f.toffsetLeft && left < (f.toffsetLeft + f.toffsetWidth)) && (top > f.toffsetTop && top < (f.toffsetTop + f.toffsetHeight))) {
                        setPosition(item)
                    } else {
                        f.rubblishArr.push(item);
                        f.$tang_yuan_box.append(item);
                    }
                }
                this.setRubblish = function(Rubblishs) {
                    $(".rubblish").remove();
                    for (var i = 0; i < Rubblishs; i++) {
                        var item = this.$rubblish.clone();
                        setPosition(item);
                    }
                }
                this.addRubblish = function(Rubblishs) {
                    for (var i = 0; i < Rubblishs; i++) {
                        var item = this.$rubblish.clone();
                        setPosition(item);
                    }
                }
                this.init = function() {
                    this.setRubblish(data.leftRubblish);
                };
                this.init();
            }
            return floor;
        })(),
        setBgStyle: function(style) {
            $("body").removeClass("main_bg_a").removeClass("main_bg_b").removeClass("main_bg_c").removeClass("main_bg_d").addClass(style);
        },
		setPet: function(no) {//宠物的类型
			 
			 var className ="pet_no1";
			 if(no == "pet_no1"){
				 className = "star-a";
			 }
			  if(no == "pet_no2"){
				 className = "star-b";
			 }
			  if(no == "pet_no3"){
				 className = "star-c";
			 }
			  if(no == "pet_no4"){
				 className = "star-d";
			 }
		     $("body").removeClass("star-a").removeClass("star-b").removeClass("star-c").removeClass("star-d").addClass(className);
		},
        loadDataUser: function(fn, master) { //拉取领养人的信息 
            loadData({
                url: domain_url + "api/pet/get",
                callbackApiPetGet: function(data) {
                    //调试
                    if (data && data.code == 0) {
                        // data.edtime = tool.timestamp(data.edtime);
						H.gold.$openid = openid;
                        fn(data);
                    }else {
						window.location.href="index.html?"+new Date().getTime();
                    }
                },
                data: {
                    oi: openid,
                    nn: encodeURIComponent(nickname),
                    hu: encodeURIComponent(headimgurl),
					
                }
            });
        },
        setLevel: function(exp) {
            this.oldLevel = getLevelNum(exp);
            var ty = $(".tang-yuan");
            ty.removeClass("tang-yuan-a").removeClass("tang-yuan-b").removeClass("tang-yuan-c").removeClass("tang-yuan-d");
            ty.addClass(getTangYangClass(this.oldLevel)); // 改变汤圆的形象
			$(".user_level").html(this.oldLevel);
			
            return this.oldLevel;
        },
        reSet: function() {
            $(".Broom").remove();
            $(".work_status").addClass("none") //工作状态
        },
        init: function() {
			clearInterval(window.intervalt);
			window.myopenod = window.headimgurl;
            var that = this;
            this.initParam(); //参数
            this.loadDataUser(function(data) { //用户数据
                that.reSet();
                that.isMyPet = true; //是否是自己的宠物
                that.petuid = data.petuid;
                window.petuid = data.petuid;
                that.infoCard = new that.infoCardFn(that, data); //信息板
                that.toolbar = new that.toolbarFn(that, data); //工具栏目
                that.tangYuan = new that.tangYuanFn(that, data); //汤圆
                that.floor = new that.floorFn(that, data); //汤圆
				H.bodybg.bodybgFn(data);// 设置背景
                that.setLevel(data.exp); //设置等级
				window.ex = parseInt($(".user_level").text());
				that.setPet(data.petno||"pet_no1");
				if(data.status == 1) { 
					H.classid.$biao_qing.addClass("a-dagong");
				}else if(data.status == 2) {
					H.classid.$biao_qing.addClass("a-xizao");
				}else {
					H.classid.$biao_qing.removeClass();
				}
				H.welcomeFn.goHome();//欢迎回家
				
				//H.gold.$openid = openid;
				H.gold.petIsreceive();//成长成功后领取金币
				
                +(function(){ //系统下发便便
                  if(!$.fn.cookie("isPush" + "_" + openid+tool.getDataStr())){
                      $.fn.cookie("isPush" + "_" + openid+tool.getDataStr(),true);
                       loadData({url: domain_url + "api/pet/sysRubblish",callbackApiPetSysRubblish:function(data){
						   
                       },data:{petuid:that.petuid},showload:false
                   });
                  }  
                })(Zepto);
            }, "my");
        }
    };
    top.init();
    window.topobj = top;
})(Zepto);

+ (function($) { //底部
    H.bottom = {
        initParam: function() {
            this.$tab_box = $(".tab-box");
            this.$tab_top = $(".tab-top"); //导航栏
            this.$tab_con = $(".tab-con"); //底部容器
            this.$tab_friend = $(".tab-friend"); //好友
            this.$tab_message = $(".tab-message"); //消息
			this.$tab_collect = $(".tab-collect");//收藏
            this.$tab_bg = $(".tab-bg"); //背景
            this.$news_record = $(".news-record"); //消息记录容器
            this.$FriendContainer = $(".swiper-wrapper");
			this.$not_text = $(".not-text");
			this.$biao_qing = $("#biao-qing");
        },
		
        initEvent: function() {
            var that = this;
            this.$tab_top.find("a").click(function() { //导航
                that.$tab_box.find("a").removeClass("on");
                $(this).addClass("on");
                var index = $(this).index();
                that.$tab_con.addClass("none");
                $(that.$tab_con.get(index)).removeClass("none");
				if(index==0 && !that.$not_text.hasClass("none")) {
					H.bottom.loadFriend();
				}
				if(index==1) {
					H.recordaNews.recordFn(window.oi);
				}
            });
        },
        loadFriend: function() {
            this.friends = [];
            var that = this;
            this.$FriendTemp = $('<div class="swiper-slide friends-con"><div class="friends-gai">' +
                '</div><i class="friends-number">1</i> <span class="friends-name"></span> ' +
                '<span class="friends-lv "></span></div>');
            that.$FriendContainer.css({
                //width: $(".s-a").width() + "px",
                //height: $(".s-a").height() + "px"
            });
            function appendFriend(data) {
                for(var i = 0; i < data.items.length; i++) {
                    var item = that.$FriendTemp.clone();
                    item.find(".friends-number").html(i + 1);
                    item.find(".friends-name").html(data.items[i].nn);
                    var levelClass = getLevel(data.items[i].exp);
                    var exp = data.items[i].exp;
                    item.find(".friends-name").html(data.items[i].nn);
                    item.find(".friends-lv").addClass(levelClass);
                    item.css({"background-image":"url("+data.items[i].hu+")"});
                    item.data("petuid", data.items[i].petuid);
                    item.data("fdata", data.items[i]);
                    that.$FriendContainer.append(item);
                    that.friends.push(data.items[i]);
					if(data.items[i].hu == headimgurl) {
						window.findex = i;
						$(".swiper-wrapper .friends-con").eq(i).addClass("on");
					}
                }
				
                var swiper = new Swiper('.s-a', {
                    paginationClickable: true,
					slidesPerView: 4,
					slidesPerGroup:4,
					nextButton: '.swiper-button-next',
					prevButton: '.swiper-button-prev',
                    onInit: function() { //初始化后执行的事件
					  if(data.items.length>4) {
						  $(".swiper-button-next,.swiper-button-prev").removeClass("none");
					  }
                    },
                });
            }
            loadData({
                url: domain_url + "api/pet/friendRank",callbackApiPetFriendRank: function(data) {//好友排行
                    if (data.code == 0) {
                        appendFriend(data);
						that.$not_text.addClass("none");
                    }else {
						that.$not_text.removeClass("none");
					}
                },
                data: {
                    oi: openid
                },
                showload: false
            });

            function initEvent() {
                var t = window.topobj;
                $(".work-e").unbind("click").click(function() {
					H.ani.btnAni($(this).find("i"));
                    var l = $(".rubblish").length;
                    if (l >= 10) {
                        showTips("最多允许10个便便哦");
                        return;
                    }
                    loadData({
                        url: domain_url + "api/pet/rubblish",callbackApiPetRubblish: function(data) {
							 if (data.code == 0) {
								H.classid.$biao_qing.addClass("a-bianbian");
								t.floor.addRubblish(1);
                            }else {
								if(data.personCount>=3) {
									showTips("今天三枚便便已经丢光啦，明天再继续!");
									return;
								}
								if(data.leftRubblish>=10) {
									showTips("这宠物被扔太多便便了，不如选择其它好友宠物吧");
									return;
								}
                            }
                        },
                        data: {
                            petuid: window.petuid,
                            oi: openid,
                            nn: encodeURIComponent(nickname),
                            hu: encodeURIComponent(headimgurl)
                        },
                        showload: false
                    });
                });
            };

            function setData(data) { //用户数据 
			   clearInterval(window.intervalt);
                var t = window.topobj;
                t.reSet();
                t.isMyPet = false; //是否是自己的宠物
                t.petuid = data.petuid;
                window.petuid = data.petuid;
                t.infoCard = new t.infoCardFn(t, data); //信息板
                t.toolbar = new t.toolbarFn(t, data); //工具栏目
                t.tangYuan = new t.tangYuanFn(t, data); //汤圆
                t.floor = new t.floorFn(t, data); //汤圆
                //H.gold.$self = data.self;//判断是否自己操作
                //that.$tab_message.addClass("none"); //好友
				that.$tab_collect.addClass("none");//收藏
                that.$tab_bg.addClass("none"); //消息
		        H.bodybg.bodybgFn(data);// 设置背景
                t.setLevel(data.exp);
				t.setPet(data.petno||"pet_no1");
                $(".work-e").removeClass("none"); //便便选项
                $(".go-home").removeClass("none");//回家按钮
				if(data.status == 1) { 
					H.classid.$biao_qing.addClass("a-dagong");
					t.toolbar.$work_d.trigger("click");
				}else if(data.status == 2) {
					t.toolbar.$work_b.trigger("click");
					H.classid.$biao_qing.addClass("a-xizao");
				}else {
					H.classid.$biao_qing.removeClass();
				}
                t.infoCard.$notice_box.find(".my-name .user_level").html(t.setLevel(data.exp)); //等级
                initEvent();

            };
            $(".go-home").unbind("click").click(function(){
				        clearInterval(window.intervalt);
                        $(this).addClass("none");
                        that.$tab_message.removeClass("none"); //好友
                        that.$tab_bg.removeClass("none"); //消息
						that.$tab_collect.removeClass("none");//收藏
                        var t = window.topobj;
                        $(".work-e").addClass("none");
						$(".swiper-wrapper .friends-con").removeClass("on").eq(window.findex).addClass("on");//标明点击的好友
						
                        showLoading();
                        t.loadDataUser(function(data) { //用户数据
                            t.reSet();
                            t.isMyPet = true; //是否是自己的宠物
                            t.petuid = data.petuid;
                            window.petuid = data.petuid;
                            t.infoCard = new t.infoCardFn(t, data); //信息板
                            t.toolbar = new t.toolbarFn(t, data); //工具栏目
                            t.tangYuan = new t.tangYuanFn(t, data); //汤圆
                            t.floor = new t.floorFn(t, data); //汤圆
							
                            t.setLevel(data.exp); //设置等级
							window.ex = parseInt($(".user_level").text());
							t.setPet(data.petno||"pet_no1");
							if(data.status == 1) { 
								H.classid.$biao_qing.addClass("a-dagong");
								t.toolbar.$work_d.trigger("click");
							}else if(data.status == 2) {
								t.toolbar.$work_b.trigger("click");
								H.classid.$biao_qing.addClass("a-xizao");
							}else {
								H.classid.$biao_qing.removeClass();
							}
							t.setPet(data.petno||"pet_no1");
							$(".s-b .bg-color").removeClass("on");
							H.bodybg.bodybgFn(data);//设置背景
							
                        }, "my");
						H.welcomeFn.goHome();
						H.gold.petIsreceive();
             
            });
            $(".s-a").delegate(".swiper-slide", "click", function() {
			    var index = $(this).index();
			    var d = that.friends[index];
			    if(d.hu == window.myopenod && d.hu == window.img){//好友中的自己不可点
					if($(".tang-yuan").hasClass("tang-yuan-d")) {
						showTips("亲，这就是我~");
						return;
					}
					$(".tang-yuan").addClass("click-a");
					setTimeout(function() {
						$(".tang-yuan").removeClass("click-a");
					},800);
					return;
			    }else if(d.hu == window.myopenod && d.hu != window.img){
					$(".go-home").click();
					return;
				}else if(d.hu == window.img) {
					showTips("亲，当前就是这位朋友的家~");
					return;
				}
				clearInterval(window.intervalt);
                $(".s-a .swiper-slide").removeClass("on");
				$(this).addClass("on");
                var ct = $(this);
                loadData({
                    url: domain_url + "api/pet/friendpet",
                    callbackApiPetFriendPet: function(data) { //跳转到好友界面


                        if (data.code == 0) {
                            setData(data);
                        } else {}
                    },
                    data: {
                        petuid: ct.data("petuid")
                    },
                    showload: true
                });
            });

        },
        loadMsg: function() {
            //H.recordaNews.recordFn(openid);
			window.oi=openid;
        },
        initBg: function() {
            var b = $("body");
            $(".s-b").delegate(".bg-color", "touchend", function() {
                $(".s-b .bg-color").removeClass("on");
                b.removeClass("main_bg_a").removeClass("main_bg_b").removeClass("main_bg_c").removeClass("main_bg_d");
				
                var bgs = "main_bg_" + $(this).addClass("on").find("span").get(0).className.substring(3, 4);
                b.addClass(bgs);
				var sty;
				if(bgs == "main_bg_a") {
					sty ="pet_them1";
				}else if(bgs == "main_bg_b"){
					sty ="pet_them2";
				}else if(bgs == "main_bg_c"){
					sty ="pet_them3";
				}else {
					sty ="pet_them4";
				}
                loadData({
                    url: domain_url + "api/pet/style",
                    callbackApiPetStyle: function(data) { //设置样式
						if (data.code == 0) {
							
						} else {}
                    },
                    data: {
                        oi: openid,
                        sty: sty
                    },
                    showload: false
                })
            });
        },
        init: function() {
            this.initParam();
            this.initEvent();
            this.loadFriend();
            this.loadMsg();
            this.initBg();
        }
    };
    H.bottom.init();
})(Zepto);

+(function($){ //新手指引
   var guide  ={  
        initParam:function(){
            this.$guidebar =$(".guidebar");
            this.$guides = this.$guidebar.find("div"); 
            this.step =1;
        },
        initEvent:function(){ 
          var that =  this;
           this.$guides.find("a").click(function(){
               $(this).parent().addClass("none");
               that.step++
               that.stepFn(that.step);
           });
        },
        startAn:function(){
            if(!localStorage.getItem("isFirstLoad")){
                localStorage.setItem("isFirstLoad",true);
                this.$guidebar.removeClass("none"); 
                this.stepFn(this.step);
            }else{
            }
        },
        stepFn:function(step){
          if(this.step>6){
             this.$guidebar.addClass("none");
             return;
          }
          this.$guides.addClass("none"); 
          $(this.$guides.get(this.step-1)).removeClass("none");
        },
        init:function(){
          this.initParam();
          this.initEvent();
          this.startAn();
        }
   };
   guide.init();
})(Zepto);





