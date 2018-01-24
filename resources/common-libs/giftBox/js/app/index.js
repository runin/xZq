$(function(){
    $('.giftBoxDiv').click(function(e) {
        createPaper(30);
        e.preventDefault();
        if($('.giftBoxDiv').hasClass("step-1")){
            $('.giftBoxDiv').removeClass('step-1').addClass('step-2');
            $('.wer').addClass('page-a');
        } else{
            $('.giftBoxDiv').removeClass('step-2').addClass('step-1');
            $('.wer').removeClass('page-a');
        }
    });
});

function getRandomArbitrary(min, max) {
    return parseInt(Math.random()*(max - min)+min);
}

function getRandomColor() {
    return '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6);
}

function createPaper(num) {
    $('.wer').empty();
    if (num == null || num <= 6) {
        num = getRandomArbitrary(10, 20);
    }
    for (var i = 0; i < num; i++) {
        $('.wer').append('<span id="paper-' + (i + 1) + '" style="-webkit-transform: translate(' + getRandomArbitrary(100, 250) + 'px,' + getRandomArbitrary(100, 250) + 'px);-webkit-animation-name:f' + getRandomArbitrary(1, 7) + ';-webkit-animation-duration: ' + 0.1*getRandomArbitrary(8, 20) + 's;border-left: ' + getRandomArbitrary(0, 8) + 'px solid transparent;border-right: ' + getRandomArbitrary(0, 8) + 'px solid transparent;border-bottom: ' + getRandomArbitrary(0, 8) + 'px solid transparent;border-top: ' + getRandomArbitrary(10, 20) + 'px solid ' + getRandomColor() + ';width: ' + getRandomArbitrary(5, 12) + 'px;height: ' + getRandomArbitrary(5, 12) + 'px;"></span>')
    };
}