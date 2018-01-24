(function ($) {
    H.dialog = {
        callBack: null,
        puid: 0,
        $container: $('body'),
        REQUEST_CLS: 'requesting',
        iscroll: null,
        init: function () {
            var me = this;
            this.$container.delegate('.btn-close', 'click', function (e) {
                e.preventDefault();
                $(this).closest('.modal').addClass('none');
            }).delegate('.btn-result', 'click', function (e) {
                e.preventDefault();
                H.dialog.result.open();
            }).delegate('.btn-receive', 'click', function (e) {
                e.preventDefault();
                var r = true;
                if (H.dialog.receiveFn) {
                    r = H.dialog.receiveFn();
                }
                if (r) {
                    H.dialog.receive.open();
                }
            });
        },
        close: function () {
            $('.modal').remove();
        },
        open: function () {
            H.dialog.close();
            this.$dialog = $(this.tpl());
            H.dialog.$container.append(this.$dialog);
            H.dialog.relocate();
        },

        relocate: function () {
            var height = $(window).height(),
				width = $(window).width(),
				top = $(window).scrollTop() + height * 0.06;

            $('.modal').each(function () {
                $(this).css({ 'width': width, 'height': height }).find('.btn-close').css({ 'right': width * 0.06 - 15, 'top': top - 15 })
            });
            $('.dialog').each(function () {
                if ($(this).hasClass('relocated')) {
                    return;
                }
                $(this).css({
                    'width': width * 0.88,
                    'height': height * 0.88,
                    'left': width * 0.06,
                    'right': width * 0.06,
                    'top': top,
                    'bottom': height * 0.06
                });
                var $box = $(this).find('.box');
                if ($box.length > 0) {
                    $box.css('height', height * 0.38);
                }
            });
        },
        showWin: {
            $dialog: null,
            open: function (temp, openFn, closeFn, customTemp) {
                this.customTemp = null;
                this.innerText = temp;
                this.closeFn = closeFn;
                this.customTemp = customTemp;
                H.dialog.open.call(this);
                this.event();
                if (openFn) {
                    openFn(this.$dialog);
                }
                this.changeText();
            },
            event: function () {
                var b = this;
                this.$dialog.find("#showWin-sure").unbind("click").click(function (c) {
                    c.preventDefault();
                    b.close()
                })
            },
            close: function () {
                this.$dialog && this.$dialog.addClass("none");

                if (this.closeFn) {
                    this.closeFn(this.$dialog);
                }
            },
            getText: function () {
                return this.innerText;

            },
            changeText: function () {
                this.$dialog.find(".safety-text").text(this.getText());
            },
            tpl: function () {
                if (!this.customTemp) {
                    var b = simpleTpl();
                    b._('<section class="modal" id="guide-dialog">')
				    ._('<div class="receive relocated">')
				    ._('<p class="safety-text">' + this.getText())
				    ._('</p>')
				    ._('<a href="javascript:void(0)" id="showWin-sure" class="activities-btn" data-collect="true" data-collect-flag="dn-podium-trybtn" data-collect-desc="领奖成功-关闭按钮">确定</a>')
				    ._('</div>')
				    ._('</section>');
                    return b.toString()
                } else {
                    return this.customTemp(this);

                }

            }
        }


    };

})(Zepto);

$(function () {
    H.dialog.init();
});
