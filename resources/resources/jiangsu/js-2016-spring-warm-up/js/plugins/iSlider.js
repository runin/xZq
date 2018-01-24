
/**
 * iSlider ������ȫ��������� 
 * @class iSlider
 * @param {object} opts
 * @param {string} opts.wrap='.wrap' ���� 
 * @param {string} opts.item='.item'  ������Ԫ��Ԫ��
 * @param {string} opts.playClass='play'  �������Ŷ�����class
 * @param {number} [opts.index=0]  ���ó�ʼ��ʾ��ҳ��
 * @param {array} [opts.noslide=[]]  ���ý�ֹ������ҳ�����(0��ʼ), ��ֹ�� ��Ҫ�������ֶ���ҳ���е�ĳ����ť�¼����л��� 
 * @param {number} [opts.speed=400] �����ٶ� ��λ:ms
 * @param {number} [opts.triggerDist=30] ������������ָ�ƶ���Сλ�� ��λ:����
 * @param {boolean} [opts.isVertical=true] �Ƿ��Ǵ�ֱ���� Ĭ����.  ���falseΪˮƽ����.
 * @param {boolean} [opts.useACC=true] �Ƿ�����Ӳ������ Ĭ������
 * @param {boolean} [opts.fullScr=true] �Ƿ���ȫ���� Ĭ����. ����Ǿֲ�����,����Ϊfalse
 * @param {boolean} [opts.preventMove=false] �Ƿ���ֹϵͳĬ�ϵ�touchmove�ƶ��¼�,  Ĭ�ϲ���ֹ, �ò������ھֲ�����ʱ��Ч,   ����Ǿֲ����� ���Ϊtrue ��ô��������򻬶���ʱ�� ���������ҳ��.  �����ȫ����� �����ֹ
 * @param {boolean} [opts.lastLocate=true] ���˺�λ���ϴ������λ�� Ĭ��true
 * @param {function} [opts.onslide]  ������ص�����  ��ش�index����
 * @param {array} [opts.loadingImgs]  loading��Ҫ���ص�ͼƬ��ַ�б�
 * @param {function} [opts.onloading]  loadingʱÿ�������һ��ͼƬ���ᴥ������ص�  �ص�ʱ����ֵΪ (�Ѽ��ظ���,����)
 * @param {number} [opts.loadingOverTime=15]  Ԥ���س�ʱʱ�� ��λ:��
 * @desc 

-  ��˿�������ȫ�������������, ��ҪӦ����΢��H5����ҳ,����,�ƹ���ܵȳ���. ����iSlider,���Կ��ٴЧ��������H5����ҳ��.
-  ���,����.  ��css����.
-  רע��ҳ�滬��, û��������� , ��֤����.
-  ���û���κ�����.
-  imgcache ���õ�ַ : http://imgcache.gtimg.cn/music/h5/lib/js/module/iSlider-1.0.min.js?_bid=363&max_age=2592000
-  github: https://github.com/kele527/iSlider


 * @example

    //�����÷�
    new iSlider(); //����Ĭ���� .wrap  Ԫ��Ĭ���� .item   ��������classĬ���� play

    //��ͨ�÷�
    new iSlider({
        wrap:'.wrap',
        item:'.item',
        playClass:'play',
        onslide:function (index) {
            console.info(index)
        }
    });

    //��loading�������÷�
    new iSlider({
        wrap:'.wrap',
        item:'.item',
        playClass:'play',
        onslide:function (index) {
            console.info(index)
        },
        loadingImgs:[
            'http://imgcache.gtimg.cn/mediastyle/mobile/event/20141118_ten_jason/img/open_cover.jpg?max_age=2592000',
            'http://imgcache.gtimg.cn/mediastyle/mobile/event/20141118_ten_jason/img/im_cover.jpg?max_age=2592000',
            'http://imgcache.gtimg.cn/mediastyle/mobile/event/20141118_ten_jason/img/bg1.jpg?max_age=2592000',
            'http://imgcache.gtimg.cn/mediastyle/mobile/event/20141118_ten_jason/img/bg2.jpg?max_age=2592000'
        ],
        onloading:function (loaded,total) {
            this.$('#loading div').style.width=loaded/total*100+'%';
            if (loaded==total) {
                this.$('#loading').style.display="none"
            }
        }
    });

    demo http://kele527.github.io/iSlider/demo1.html

 * @date 2014/11/3 ����һ
 * @author rowanyang
 * 
 */
function iSlider(opts) {
    this.opts={
        wrap:'.wrap',
        item:'.item',
        playClass:'play',
        index:0,
        noslide:[],
        noslideBack:false, //��noslide��Ч��ʱ�� �Ƿ��������ػ���  Ĭ�ϲ�����, �������Ҫ���Կ���
        speed:400, //�����ٶ� ��λ:ms
        triggerDist:30,//������������ָ�ƶ���Сλ�� ��λ:����
        isVertical:true,//��ֱ������ˮƽ����
        useACC:true, //�Ƿ�����Ӳ������ Ĭ������
        fullScr:true, //�Ƿ���ȫ���� Ĭ����. ����Ǿֲ�����,����Ϊfalse
        preventMove:false, //�Ƿ���ֹϵͳĬ�ϵ�touchmove�ƶ��¼�,  Ĭ�ϲ���ֹ, �ò������ھֲ�����ʱ��Ч,   ����Ǿֲ����� ���Ϊtrue ��ô��������򻬶���ʱ�� ���������ҳ��.  �����ȫ����� �����ֹ
        lastLocate:true, //���˺�λ���ϴ������λ�� Ĭ�Ͽ���
        loadingImgs:[], //loading Ԥ����ͼƬ��ַ�б�
        onslide:function (index) {},//�����ص� �����Ǳ�����
        onloading:function (loaded,total) {},
        loadingOverTime:15 //Ԥ���س�ʱʱ�� ��λ:��
    }

    for (var i in opts) {
        this.opts[i]=opts[i];
    }

    this.init();
}
/**  @lends iSlider */
iSlider.prototype={
    wrap:null,
    index : 0,
    length:0,
    _tpl:[],
    _delayTime:150,
    _sessionKey : location.host+location.pathname,
    _prev:null,
    _current:null,
    _next:null,
    $:function (o,p) {
        return (p||document).querySelector(o);
    },
    addClass:function (o,cls) {
        if (o.classList) {
            o.classList.add(cls)
        }else {
            o.className+=' '+cls;
        }
    },
    removeClass:function (o,cls) {
        if (o.classList) {
            o.classList.remove(cls)
        }else {
            o.className=o.className.replace(new RegExp('\\s*\\b'+cls+'\\b','g'),'')
        }
    },
	init:function () {
        var self = this;
        this.wrap = typeof this.opts.wrap=='string' ? this.$(this.opts.wrap) : this.opts.wrap ;
        //ʹ��sessionStorage�����浱ǰ������ڼ�ҳ��   ���˻�����ʱ�� ��λ����һҳ
        this._sessionKey=btoa(encodeURIComponent(this._sessionKey+this.wrap.id+this.wrap.className));

        var lastLocateIndex=parseInt(sessionStorage[this._sessionKey]);
        this.index = ((this.opts.lastLocate && lastLocateIndex>=0) ? lastLocateIndex : 0) || this.opts.index || 0;

        if (!this.wrap) {
            throw Error('"wrap" param can not be empty!');
            return ;
        }

        this._tpl = this.wrap.cloneNode(true);
        this._tpl = this.opts.item ? this._tpl.querySelectorAll(this.opts.item) : this._tpl.children;

        for (var i=0; i<this._tpl.length; i++) {
            this._tpl[i].style.cssText+='display:block;position:absolute;left:0;top:0;width:100%;height:100%'
        };

        this.length=this._tpl.length; //��ҳ������
        this.touchInitPos = 0;//��ָ��ʼλ��
        this.startPos = 0;//�ƶ���ʼ��λ��
        this.totalDist = 0,//�ƶ����ܾ���
        this.deltaX1 = 0;//ÿ���ƶ�������
        this.deltaX2 = 0;//ÿ���ƶ�������
        
        //ȫ������ ������ʽ
        if (this.opts.fullScr) {
            var s = document.createElement('style');
            s.innerHTML = 'html,body{width:100%;height:100%;overflow:hidden}';
            document.head.appendChild(s);
            s = null;
        }

        this.wrap.style.cssText+="display:block;position:relative;"+(this.opts.fullScr ? 'width:100%;height:100%':'');
        
        //����Ҫ��ǰ��Ĳ��ֶ����úú� ������ȡ�ߴ�
        this.displayWidth = this.wrap.clientWidth; //�������������
        this.displayHeight = this.wrap.clientHeight; //�����������߶�

        this.scrollDist=this.opts.isVertical ? this.displayHeight : this.displayWidth;//����������ߴ� 

        this._setHTML();// ����ʼDOM

        if (this.opts.loadingImgs && this.opts.loadingImgs.length) {
            this._loading();
        }else {
            this._pageInit();
        }

        if (/iPhone|iPod|iPad/.test(navigator.userAgent)) {
            this._delayTime=50;
        }

        this._bindEvt();
	},
    _bindEvt:function () {
        var self = this;
        var handlrElm= this.opts.fullScr ? this.$('body') : this.wrap;
        handlrElm.addEventListener('touchstart',function (e) {
            self._touchstart(e);
        },false);
        handlrElm.addEventListener('touchmove',function (e) {
            self._touchmove(e);
            if (!self.opts.fullScr) { //�޸���Q�оֲ�ʹ��ʱ��һ��bug
                e.stopPropagation();
                e.preventDefault();
            }
        },false);
        handlrElm.addEventListener('touchend',function (e) {
            self._touchend(e);
        },false);
        handlrElm.addEventListener('touchcancel',function (e) {
            self._touchend(e);
        },false);

        if (this.opts.fullScr || this.opts.preventMove) {
            handlrElm.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        }
    },
    _setHTML:function (index) {
        if (index>=0) {
            this.index=parseInt(index);
        }
        this.wrap.innerHTML='';

        var initDom = document.createDocumentFragment();

        if (this.index>0) {
            this._prev=this._tpl[this.index-1].cloneNode(true);
            this._prev.style.cssText+=this._getTransform('-'+this.scrollDist+'px');
            initDom.appendChild(this._prev)
        }else {
            this._prev=null;
        }
        this._current =this._tpl[this.index].cloneNode(true);

        this._current.style.cssText+=this._getTransform(0);
        initDom.appendChild(this._current);
        
        if (this.index<this.length-1) {
            this._next=this._tpl[this.index+1].cloneNode(true);
            this._next.style.cssText+=this._getTransform(this.scrollDist+'px');
            initDom.appendChild(this._next)
        }else {
            this._next=null;
        }

        this.wrap.appendChild(initDom);

    },
    _pageInit:function () {
        var self = this;
        setTimeout(function () {
            self.addClass(self._current,self.opts.playClass);

            try {
                self.opts.onslide.call(self,self.index);
            } catch (e) {
                console.info(e)
            }
        },this._delayTime);
    },
	_touchstart : function (e) {
        var self=this;
		if(e.touches.length !== 1){return;}//�������1����ָ���򲻴���
        
        this.lockSlide=false;
        this._touchstartX=e.touches[0].pageX;
        this._touchstartY=e.touches[0].pageY;

		this.touchInitPos = this.opts.isVertical ? e.touches[0].pageY:e.touches[0].pageX; // ÿ��move�Ĵ���λ��
		this.deltaX1 = this.touchInitPos;//touchstart��ʱ���ԭʼλ��

		this.startPos = 0;
		this.startPosPrev = -this.scrollDist;
		this.startPosNext = this.scrollDist;
		//��ָ������ʱ����õ�����
		if (this._next) {
			self._next.style.cssText+='-webkit-transition-duration:0;'
		}

		self._current.style.cssText+='-webkit-transition-duration:0;'
		if (this._prev) {
			self._prev.style.cssText+='-webkit-transition-duration:0;'
		}
	},
	_touchmove : function (e) {
        var parent=e.target;
        do {
            parent=parent.parentNode;
        } while (parent!=this.wrap);
 
        if (!parent && e.target!=this.wrap ) {
            return ;
        }

        var self = this;
		if(e.touches.length !== 1 || this.lockSlide){return;}

        var gx=Math.abs(e.touches[0].pageX - this._touchstartX);
        var gy=Math.abs(e.touches[0].pageY - this._touchstartY);
        
        //�����ָ��ʼ�����ķ����ҳ�����õķ���һ��  �Ͳ��ᴥ������  �����Ҫ�Ǳ��������, ����ҳ���Ǵ�ֱ����, ��ĳһҳ���˺��򻬶��ľֲ�����, ��ô���һ�����ʱ��Ҫ��֤ҳ�治�������ƶ�. ��������������.
        if (gx>gy && this.opts.isVertical) { //ˮƽ����
            this.lockSlide=true;
            return ;
        }else if(gx<gy && !this.opts.isVertical){ //��ֱ����
            this.lockSlide=true;
            return ;
        }

        if (this.opts.noslide && this.opts.noslide.indexOf(this.index)>=0) {
            //noslideBack Ĭ��ֵ��false   Ĭ���ǽ��û����� ǰ�󶼲����ٻ���,
            //���ǵ�noslideBackΪtrueʱ, ��������һҳ�Ļ���, ��ô�����ǻ�������  ���ǿ������ϻ�
            if (!this.opts.noslideBack || (e.touches[0].pageY - this._touchstartY < 0 || e.touches[0].pageX - this._touchstartX < 0)) {
                return ;
            }
        }


		var currentX = this.opts.isVertical ? e.touches[0].pageY:e.touches[0].pageX;
		this.deltaX2 = currentX - this.deltaX1;//��¼�����ƶ���ƫ����
		this.totalDist = this.startPos + currentX - this.touchInitPos;

		self._current.style.cssText+=this._getTransform(this.totalDist+'px');
		this.startPos = this.totalDist;
		
		//������һ�ź���һ��
		if (this.totalDist<0) {//¶����һ��
			if (this._next) {
				this.totalDist2 = this.startPosNext + currentX - this.touchInitPos;
				self._next.style.cssText += this._getTransform(this.totalDist2+'px');
				this.startPosNext = this.totalDist2;
			}
		}else {//¶����һ��
			if (this._prev) {
				this.totalDist2 = this.startPosPrev + currentX - this.touchInitPos;
				self._prev.style.cssText += this._getTransform(this.totalDist2+'px');
				this.startPosPrev = this.totalDist2;
			}
		}

		this.touchInitPos = currentX;
	},
	_touchend : function (e) {
		if(this.deltaX2 < -this.opts.triggerDist){
			this.next();
		}else if(this.deltaX2 > this.opts.triggerDist){
			this.prev();
		}else{
			this._itemReset();
		}
		this.deltaX2 = 0;
	},
    _getTransform:function (dist) {
        var pos= this.opts.isVertical? '0,'+dist : dist+',0';
        return ';-webkit-transform:' + (this.opts.useACC ? 'translate3d('+pos+',0)' : 'translate('+pos+')');
    },

    _itemReset:function () {
        var self = this;
        self._current.style.cssText+='-webkit-transition-duration:'+this.opts.speed+'ms;'+this._getTransform(0);
        if (self._prev) {
            self._prev.style.cssText+='-webkit-transition-duration:'+this.opts.speed+'ms;'+this._getTransform('-'+this.scrollDist+'px');
        }
        if (self._next) {
           self._next.style.cssText+='-webkit-transition-duration:'+this.opts.speed+'ms;'+this._getTransform(this.scrollDist+'px');
        }
		this.deltaX2 = 0;
    },

    _loading:function () {
        var self = this;
        var imgurls=this.opts.loadingImgs;
        var fallback=setTimeout(function () {
            try {
                self.opts.onloading.call(self,total,total);
            } catch (e) { }
            
            self._pageInit();
        },this.opts.loadingOverTime*1000);//loading��ʱʱ��  ��һ������������ 15���ֱ����ʾ

        var imgs=[], loaded=1;
        var total=imgurls.length+1;
        for (var i=0; i<imgurls.length; i++) {
            imgs[i]=new Image();
            imgs[i].src=imgurls[i];
            imgs[i].onload=imgs[i].onerror=imgs[i].onabort=function (e) {
                loaded++;
                if (this.src === imgurls[0] && e.type === 'load') {
                    clearTimeout(fallback)
                }
                checkloaded();
                this.onload=this.onerror=this.onabort=null;
            }
        }

        try {
            self.opts.onloading.call(self,1,total);
        } catch (e) { }

        function checkloaded() {
            try {
                self.opts.onloading.call(self,loaded,total);
            } catch (e) { }
            if (loaded==total) {
                if (fallback) {
                    clearTimeout(fallback)
                }
                self._pageInit();
                imgs=null;
                if (self.opts.preLoadingImgs && self.opts.preLoadingImgs.length) {
                    self.preloading();
                }
            }
        }
    },
    /** 
     * ��������һҳ
     * @example
        s1.prev();
     */
    prev:function () {
        var self = this;

        if (!this._current || !this._prev) {
            this._itemReset();
            return ;
        }
        if (this.index > 0) {
            this.index--;
        }else {
            this._itemReset();
            return false;
        }

//        var nextIndex = this.index+1 > this.length-1 ? 0 : this.index+1;

        if (this._next) {
            this.wrap.removeChild(this._next);
        }

        this._next=this._current;
        this._current=this._prev;
        this._prev=null;

        this._next.style.cssText+='-webkit-transition-duration:'+this.opts.speed+'ms;'+this._getTransform(this.scrollDist+'px');
        this._current.style.cssText+='-webkit-transition-duration:'+this.opts.speed+'ms;'+this._getTransform(0);

        sessionStorage[this._sessionKey]=this.index;

        setTimeout(function () {

            if (self.$('.'+self.opts.playClass,self.wrap)) {
                self.removeClass(self.$('.'+self.opts.playClass,self.wrap),self.opts.playClass)
            }
            self.addClass(self._current,self.opts.playClass)

            try {
                self.opts.onslide.call(self,self.index);
            } catch (e) {
                console.info(e)
            }

            var prevIndex = self.index-1;
            if (prevIndex < 0) {
                prevIndex =  self.length-1;
                return false;
            }

            self._prev = self._tpl[prevIndex].cloneNode(true);
            self._prev.style.cssText+='-webkit-transition-duration:0ms;'+self._getTransform('-'+self.scrollDist+'px');
            self.wrap.insertBefore(self._prev,self._current);

        },this._delayTime)

    },

    /** 
     * ��������һҳ
     * @example
        s1.next();
     */
    next:function () {
        var self = this;

        if (!this._current || !this._next) {
            this._itemReset();
            return ;
        }

        if (this.index < this.length-1) {
            this.index++;
        }else {
            this._itemReset();
            return false;
        }
        
//        var prevIndex = this.index===0 ? this.length-1 : this.index-1;

        if (this._prev) {
            this.wrap.removeChild(this._prev);
        }

        this._prev=this._current;
        this._current=this._next;
        this._next=null;

        this._prev.style.cssText+='-webkit-transition-duration:'+this.opts.speed+'ms;'+this._getTransform('-'+this.scrollDist+'px');
        this._current.style.cssText+='-webkit-transition-duration:'+this.opts.speed+'ms;'+this._getTransform(0);
        sessionStorage[this._sessionKey]=this.index;

        setTimeout(function () {
            if (self.$('.'+self.opts.playClass,self.wrap)) {
                self.removeClass(self.$('.'+self.opts.playClass,self.wrap),self.opts.playClass)
            }
            self.addClass(self._current,self.opts.playClass)

            try {
                self.opts.onslide.call(self,self.index);
            } catch (e) {
                console.info(e)
            }

            var nextIndex = self.index+1;
            if (nextIndex >= self.length) {
                return false;
            }

            self._next = self._tpl[nextIndex].cloneNode(true);
            self._next.style.cssText+='-webkit-transition-duration:0ms;'+self._getTransform(self.scrollDist+'px');
            self.wrap.appendChild(self._next);

        },this._delayTime)

    },
    /** 
     * ��ת��ָ��ҳ��
     * @param {number} index ҳ�� ��0��ʼ��
     * @example
        s1.slideTo(3);
     */
    slideTo:function (index) {
        this._setHTML(index);
        this._pageInit();
    }

}

if (typeof module == 'object') {
    module.exports=iSlider;
}else {
    window.iSlider=iSlider;
}