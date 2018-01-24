/**
 * 成都跨年晚会-卡包
 */
(function($) {
	H.card = {
		$get_award : $('#get-award'),
		cPrize : null,
		expires : {
			expires : 7
		},
		init : function() {
			this.event_handler();
			initCard();
		},
		event_handler : function() {
			var me = this;

			H.card.$get_award.click(function(e) {
				e.preventDefault();
				toUrl('lottery.html?card=1&pru=' + $.fn.cookie("cardprize"));
			})
		},
		tpl : function(data) {
			var t = simpleTpl(), item = data || [], $card_ul = $('#card-ul');
			for ( var i = 0, len = item.length; i < len; i++) {
				t._('<li class="select-img" data-uuid = "' + item[i].ct + '">')._(
						'<img src="' + item[i].ci
								+ '" "/>')._('</li>');

			}
			return $card_ul.append(t.toString());
		},
		fill_data : function(data) {
			var t = simpleTpl(), $back_home = $('#back-home'), $card_ul_li = $(
					'#card-ul').find('li');

			if ($card_ul_li.length == data.length) {
				$card_ul_li.removeClass('select-img');
				return;
			} else {
				$back_home.removeClass('none');
			}
			;
			for ( var i = 0, len = data.length; i < len; i++) {
				$card_ul_li.each(function() {
					if ($(this).attr('data-uuid') == data[i]) {
						$(this).removeClass('select-img');
					}
					;
				});
			}
		}
	}

	W.quizLotteryRecordHandler = function(data) {
		if (data.code == 0) {
			H.card.$get_award.removeClass('none');
			$.fn.cookie("cardprize", data.result, this.expires);
		} else {
			alert("奖品已经被领完了，请下次再来~");
			window.location.href = "index.html"
					+ (gefrom ? ('?gefrom=' + gefrom) : '');
		}
	};

	function initCard() {
		var cards = cardList.card;
		H.card.tpl(cards);
		var ownCards = ownCardList();
		H.card.fill_data(ownCards);
		if (ownCards.length >= cards.length) {
			var cprizeCookie = $.fn.cookie("cardprize");
			if (cprizeCookie == null) {
				H.card.cPrize = cardPrize();
				getResult('party/quiz/lotteryrecord', {
					openid : openid,
					prizeUuid : H.card.cPrize.pu,
					quizInfoUuid : null,
					useScene : 2
				}, 'quizLotteryRecordHandler', true);
			} else {
				var cardAward = $.fn.cookie("cardaward");
				H.card.$get_award.removeClass('none');
				if (cardAward != null) {
					H.card.$get_award.text("查看奖品");
				}
			}
		}
	}
	function ownCardList() {
		var cardList = [], queList = questionList.quizinfo;
		for ( var i = 0; i < queList.length; i++) {
			var prizeCookie = $.fn.cookie("prize-" + queList[i].qu);
			if (null != prizeCookie) {
				var prizeType = prizeCookie.split("-")[1];
				if (prizeType >= 3 && cardList.indexOf(prizeType) < 0) {
					cardList.push(prizeType);
				}
			}
		}
		return cardList;
	}
	function cardPrize() {
		for ( var i = 0; i < prizeList.prize.length; i++) {
			var eachPrize = prizeList.prize[i];
			if (eachPrize.ps == 2) {
				return eachPrize;
			}
		}
	}
})(Zepto);

H.card.init();
