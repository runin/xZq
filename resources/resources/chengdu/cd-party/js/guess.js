/**
 * 成都跨年晚会-生肖列表页
 */
(function($) {
    H.list = {
        $main : $('#main'),
        qiu : getQueryString('qiu'),
        qru : null,
        siu : null,
		expires: {expires: 7},
        init : function(){
            var me = this;
            if(me.qiu == null || me.qiu == 'null'){
                toUrl('index.html');
            }
            var answerCookie = $.fn.cookie("answer-"+me.qiu)
            if(null != answerCookie){
            	alert("您已经答过这道题了，请下次再来~");
            	toUrl('index.html');
            }
            this.event_handler();
            question();
        },
        event_handler: function() {
            var me = this;
            this.$main.delegate('.sx-ul li', 'click', function(e) {
                    e.preventDefault();
                $(this).find('span').toggleClass('none');
                H.list.siu = $(this).attr('data-uuid');
                getResult('party/quiz/answer', {
                    openid : openid,
                    quizInfoUuid : me.qiu,
                    attrUuid : $(this).attr('data-uuid')
                }, 'quizAnswerHandler', true);
                
            });
        },
        tpl: function(data) {
			var $gues_top = $('#gues-top');
            $gues_top.find('h2').text(data.qt);
            var t = simpleTpl(), item = data.qa || [], $sx_ul = $('#sx-ul');
            for (var i = 0, len = item.length; i < len; i++) {
                t._('<li data-uuid = "'+ item[i].au +'" data-collect="true" data-collect-flag="cd-party-guess-li'+ i +'" data-collect-desc="生肖选项答题图列表" >')
                    ._('<img src="'+ item[i].ai +'" "/><span class="right none"></span>')
                ._('</li>');
            }
            return $sx_ul.append(t.toString());
        }
    }
    W.quizAnswerHandler = function(data){
    	$.fn.cookie("answer-"+H.list.qiu,H.list.siu,this.expires);
    	if(H.list.siu == H.list.qru){
            toUrl('lottery.html?code='+ 100 + "&tm="+data.tm+"&qiu=" + H.list.qiu);
        }else{
        	toUrl('lottery.html?code='+ 101 +"&tm="+data.tm+ "&qiu=" + H.list.qiu);
        }

    }
    function question(){
    	var queList = questionList.quizinfo;
		//获取当前题目
		for ( var i = 0; i < queList.length; i++) {
			if(queList[i].qu == H.list. qiu){
				H.list.tpl(queList[i]);
				H.list.qru = queList[i].qr;
			}
		}
    }
})(Zepto);

H.list.init();