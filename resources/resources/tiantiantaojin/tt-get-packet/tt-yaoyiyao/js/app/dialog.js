(function($) {
    var str="1. 报名方式：全国范围内小学、初中和高中学校均可报名参加，须到活动官方平台注册报名。报名网址：http://2u4u.fltrp.com/bookworm。<br>";
        str += "2. 全国海选、市级决赛均免费参赛。活动组委会根据网上报名数据统一安排并免费向参赛学校赠送牛津·书虫英汉双语读物或轻松英语名作欣赏（小学版）系列漂流用书（每所学校按参与年级数量分别赠送指定系列盒装图书两套，具体级别和品种由组委会统一安排）。<br>"
        str +="3. 参赛学校收到活动用书后，以班级为单位进行阅读漂流，教师采用“班级读书会”的方式，布置全班学生同读一本书，并组织学生以指定图书内容范围为蓝本编演英文短剧并上传至活动官方平台。<br>"
        str +="4. 组别设置：小学低年级组（1-3年级）、小学高年级组（4-6年级）、中学组（初中、高中）共三个组别。<br>"
        str +="5. 赛程赛制安排：漂流活动分为全国海选、市级决赛和全国决赛三个阶段。海选阶段全国分区不设限制，网络报名截止时间为2015年1月31日，海选成绩公布后组委会将按组别及地区划分进行第二阶段的市级决赛和第三阶段的全国决赛。"
    H.dialog = {
        puid: 0,
        $container: $('body'),
        REQUEST_CLS: 'requesting',
        iscroll: null,
        init: function() {
            var me = this;
            this.$container.delegate('.link-a', 'click', function(e) {
                e.preventDefault();
                H.dialog.rule.open();
            }).delegate('.btn-close', 'click', function(e) {
                e.preventDefault();
                $(this).closest('.modal').addClass('none');
            }).delegate('.btn-result', 'click', function(e) {
                e.preventDefault();
                H.dialog.result.open();
            }).delegate('.btn-receive', 'click', function(e) {
                e.preventDefault();
                H.dialog.receive.open();
            });
        },
        close: function() {
            $('.modal').addClass('none');
        },
        open: function() {
            H.dialog.close();
            if (this.$dialog) {
                this.$dialog.removeClass('none');
            } else {
                this.$dialog = $(this.tpl());
                H.dialog.$container.append(this.$dialog);
            }

            H.dialog.relocate();
        },
        
        relocate: function() {
            var height = $(window).height(),
                width = $(window).width(),
                top = $(window).scrollTop() + height * 0.06;

            $('.modal').each(function() {
                $(this).css({ 'width': width, 'height': height }).find('.btn-close').css({'right': width * 0.06 - 15, 'top': top - 15})
            });
            $('.dialog').each(function() {
                if ($(this).hasClass('relocated')) {
                    return;
                }
                $('.rule-dialog').css({ 
                    'width': width*0.8, 
                    'height': height * 0.5, 
                    'left':'50%',
                    'top': height * 0.10,
                    'margin-left':-(width*0.8)/2,
                });
                 $('.rule-con').css({ 
                    'height': height * 0.5-70, 
                });
                
                $(".win-dialog").css({ 
                    'width': width*0.8, 
                    'height': height * 0.44, 
                    'left':'50%',
                    'top': height * 0.33,
                    'bottom': height * 0.06,
                    'margin-left':-((width+20)*0.4),
                    'overflow':'visible',
                });
                $(".usr-img-border").css({
                    'height': $(".win-dialog").height() * 0.46, 
                    'margin-top': $(".pop-title").height()+10, 
                });
                var $box = $(this).find('.box');
                if ($box.length > 0) {
                    $box.css('height', height * 0.38);
                }
            });
        },
         
       	// 规则
		rule: {
			$dialog: null,
			open: function () {
				H.dialog.open.call(this);
				this.event();
				//getResult('common/rule', {}, 'callbackRuleHandler', true, this.$dialog);
			},
			close: function () {
                $('.rule-dialog').removeClass('rule-top-ease');
				this.$dialog && this.$dialog.addClass('none');
			},
			event: function () {
				var me = this;
				this.$dialog.find('.close').click(function (e) {
					e.preventDefault();
                    $('.rule-dialog').addClass('rule-top-ease');
                    setTimeout(function()
                    {
                        me.close();
                    },500);
				});
			},
			update: function (rule) {
				this.$dialog.find('.rule-con').html(rule).closest('.content').removeClass('none');
			},
			tpl: function () {
				var t = simpleTpl();
				t._('<section class="modal modal-rule" id="rule-dialog">')
					._('<div class="dialog rule-dialog">')
                    ._('<p><span class="close" >X</span></p>')
					._('<h3 style="color:#fff!important;">活动说明</h3>')
					._('<div class="rule-con">')
                    ._('<p>'+ str + '</p>')
                    ._('</div>')
					._('</div>')
					._('</section>');
				return t.toString();
			}
		},
        // 摇奖弹出页面
        rockPize: {
            $dialog: null,
            open: function() {
                H.dialog.open.call(this);
                $(".modl-win").css("background","transparent");
                $(".img-prize").attr("src","./images/spend300.png")
                $(".img-round").removeClass("shaking");
                this.event();
                count--;
                $('body').addClass('noscroll');
               
            },
            close: function() {
                $('body').removeClass('noscroll');
                $('.continue-img').removeClass("buttonScale");
                $(".img-prize").removeClass("popdown");
                $(".index-title span").text("还有"+count);
                this.$dialog && this.$dialog.addClass('none');
            },
            event: function() {
                var me = this;
                this.$dialog.find('.continue-img').click(function(e) {
                    e.preventDefault();
                    $(this).addClass("buttonScale");
                    $(".img-prize").addClass("popdown");
                    setTimeout(function(){me.close()},2000);
                });
            },
            tpl: function() {
                var t = simpleTpl();
                	t._('<div class="modal modl-win">')
						._('<div class="dialog win-dialog">')
						._('<p class="pop-title">恭喜你获取<span class="data-value">时尚大礼包</span>一份<br>')
						._('<span class="user-infor">快去个人中心查看你的战绩</span></p>')
						._('<div class="usr-img-border"><img src="" class="img-prize"></div>')
						._('<a class="btn-rockcontinue" data-collect="true" data-collect-flag="pop-rockcontinue" data-collect-desc="弹出层-继续摇奖">')
						._('<img src="./images/rockagin.png" class="continue-img">')
						._('</a></div>')
						._('</div>')
					._('</div>');
                return t.toString();
            }
        }
    };
    W.callbackRuleHandler = function(data) {
		if(data.code == 0){
			$(".rule-con").html(data.rule);
		}
	};
})(Zepto);

$(function() {
    H.dialog.init();
});
