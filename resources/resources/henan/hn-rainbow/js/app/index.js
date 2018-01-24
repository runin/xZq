+(function ($) {
    var index = {
        initParam: function () {
            this.car = $(".car"); //����
            this.swpie_car = $(".swpie_car"); //���ӵ�·��
            this.lastdistance = 0; //��һ���ߵľ���
            this.lastdeltax = 0; //�����жϲ��� ����30 �ö�������ȫ��
            this.allwidth = this.swpie_car.width() - this.car.width(); //��·��
            this.episodeBtn = $(".episode"); //�������
            this.episodeDialog = $("#episode"); //������� ����
            this.dialogClose = $(".dialog-close");
            this.dx = 0;
        },
        initEvent: function () {
            var that = this;
            $(document).delegate(".episode", "touchstart", function (e) {
                e.preventDefault();
                that.episodeDialog.removeClass("none");
                return false;
            });
            $(document).delegate("#episode .dialog-close", "touchstart", function (e) {
                e.preventDefault();
                that.episodeDialog.addClass("none");
                return false;
            });
            $(document).delegate("#episode .dialog-sure", "touchstart", function (e) {
                e.preventDefault();
                that.episodeDialog.addClass("none");
                return false;
            });
            function goToComment() {//��������ҳ
                setTimeout(function () {
                    showLoading();
                    setTimeout(function () {
                        window.location.href = "comment.html";
                    }, 300)
                }, 300);
            }
            function setContainerOffset(deltaX, animate) { //����С���ƶ�
                that.car.removeClass("animate");
                if (animate) {
                    that.car.addClass("animate");
                }
                that.lastdeltax = deltaX;
                that.car.css("-webkit-transform", "translateX(" + (deltaX) + "px)");
                if (deltaX >= that.allwidth) {
                    goToComment();
                }
            };
            that.car.bind("touchstart", function (e) {
                e.preventDefault();
                var offset = that.car.offset();
                that.dx = e.changedTouches[0].clientX - offset.left;
            });
            document.addEventListener("touchmove", function (e) { //�ƶ��¼�  
                if (!$(e.target).hasClass("car") && !$(e.target).hasClass("finger")) {
                    return;
                }
                e.preventDefault(); //��ֹmousemove �¼�
                if (that.lastdistance) {
                    setContainerOffset(that.lastdistance + e.touches[0].pageX - that.dx);
                    return;
                }
                var pageX = e.touches[0].pageX;
                setContainerOffset(pageX - that.dx);
            }, false);
            document.addEventListener("touchend", function (e) {//��ָ�ſ��¼�
                e.preventDefault(); //��ֹmousemove �¼�
                if (Math.abs(that.lastdeltax) > 30) {//�ƶ��������ĳ����ֵ��ʱ���ö�������ȫ��
                    setContainerOffset(that.allwidth, true);
                } else {
                    if (that.lastdistance) {
                        that.lastdistance = that.lastdistance + e.touches[0].pageX - that.dx;
                        setContainerOffset(that.lastdistance);
                    } else {
                        setContainerOffset(0, true);
                    }
                }
            }, false);
        },
        loadEpisode: function () {//���ؾ缯��Ϣ
            loadData({ url: domain_url + "api/article/list", callbackArticledetailListHandler: function (data) {
                if (data.code == 0) {
                    var art = data.arts[0];
                    var uuid = art.uid;
                    loadData({ url: domain_url + "api/article/detail", callbackArticledetailDetailHandler: function (data2) {
                        if (data2.code == 0) {
                            $(".episode_con").html(data2.i);
                        }

                    }, data: { uuid: uuid }, showload: false
                    });
                }
            }, showload: false
            });
        },
        init: function () {
            this.initParam();
            this.initEvent();
            this.loadEpisode();
        }
    };
    index.init();
})(Zepto);