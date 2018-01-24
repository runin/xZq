
var aniTrue = true;
window.showTips = function(word, pos, timer) {
    if(aniTrue) {
        aniTrue = false;
        var pos = pos || '2',
        timer = timer || 1500;
        $('body').append('<div class="alert none"></div>');
        $('.alert').css({
            'position': 'fixed' ,
            'max-width': '80%' ,
            'top': '60%' ,
            'left': '50%' ,
            'z-index': '99999999' ,
            'color': 'rgb(255, 255, 255)' ,
            'padding': '20px 10px' ,
            'border-radius': '5px' ,
            'margin-left': '-120px' ,
            'background': 'rgba(0, 0, 0, 0.8)' ,
            'text-align': 'center'
        });
        $('.alert').html(word);
        var winW = $(window).width(),
            winH = $(window).height();
        $('.alert').removeClass('none').css('opacity', '0');
        var alertW = $('.alert').width(),
            alertH = $('.alert').height();
        $('.alert').css({'margin-left': -alertW/2,'top':(winH - alertH)/(pos - 0.2)}).removeClass('none');
        $('.alert').animate({
            'opacity': '1',
            'top': (winH - alertH)/pos}, 300, function() {
                setTimeout(function() {
                    $('.alert').animate({'opacity':'0'}, 300, function() {
                        $('.alert').addClass('none').css('top', (winH - alertH)/(pos - 0.2));
                    });
                }, timer);
                setTimeout(function() {
                    $('.alert').remove();
                    aniTrue = true;
                }, timer + 350);
        });
    };
};
