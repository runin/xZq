$(function() {
    getResult('api/lottery/integral/rank/self', {oi: openid}, 'callbackIntegralRankSelfRoundHandler', true);
	$('.avatar-wrapper img').attr('src',headimgurl ? (headimgurl + '/' + yao_avatar_size) : './images/danmu-head.jpg');
	$('.avatar p').text(nickname ? nickname : '说天下观众');
});

window.callbackIntegralRankSelfRoundHandler = function(data) {
    if (data.result) {
        $('header').find('img').attr('src', headimgurl ? (headimgurl + '/' + 64) : './images/avatar.jpg');
        $('.nickname').text(nickname ? nickname : '匿名用户');
        $('.jf').find('span').text(data.in || 0);
    }
};