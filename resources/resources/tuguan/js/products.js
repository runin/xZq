
var productsList = [{
    id: 1,
	type: "新闻类",
    name: "央视两会朋友圈",
    img: "./images/p01.jpg",
    url: "http://yao.qq.com/tv/entry?redirect_uri=http://yaotv.qq.com/shake_tv/auto/8qt3rli7weeja3/index.html"
},{
    id: 2,
	type: "新闻类",
    name: "直播广州第一现场",
    img: "./images/p02.jpg",
    url: "http://yao.qq.com/tv/entry?redirect_uri=http://yaotv.qq.com/shake_tv/auto/8rz5ymi0m83w6i/index.html"
},{
    id: 3,
	type: "晚会类",
    name: "北京卫视春晚",
    img: "./images/p03.jpg",
    url: "http://yao.qq.com/tv/entry?redirect_uri=http://yaotv.qq.com/shake_tv/auto/24ds3hbi7ccg0j9/index.html"
},{
    id: 4,
    type: "晚会类",
    name: "安徽国剧盛典",
    img: "./images/p04.jpg",
    url: "http://yao.qq.com/tv/entry?redirect_uri=http://yaotv.qq.com/shake_tv/auto/8r82ngi5dvkogd/index.html"
},{
    id: 5,
	type: "真人秀",
    name: "家庭幽默大赛",
    img: "./images/p05.jpg",
    url: "http://yao.qq.com/tv/entry?redirect_uri=http://yaotv.qq.com/shake_tv/auto/24da4d7i915gmv6/index.html"
},{
    id: 6,
	type: "真人秀",
    name: "超级笑星",
    img: "./images/p06.jpg",
    url: "http://yao.qq.com/tv/entry?redirect_uri=http://yaotv.qq.com/shake_tv/auto/8r82x3i601qqtg/index.html"
},{
    id: 7,
	type: "电视剧",
    name: "神探包青天",
    img: "./images/p07.jpg",
    url: "http://yao.qq.com/tv/entry?redirect_uri=http://yaotv.qq.com/shake_tv/auto/8qk52pi9pmoqd7/index.html"
},{
    id: 8,
	type: "电视剧",
    name: "封神英雄榜",
    img: "./images/p08.jpg",
    url: "http://yao.qq.com/tv/entry?redirect_uri=http://yaotv.qq.com/shake_tv/auto/8r842vi8hb40h1/index.html"
},{
    id: 9,
	type: "体育类",
    name: "中超直播互动",
    img: "./images/p09.jpg",
    url: "http://yao.qq.com/tv/entry?redirect_uri=http://yaotv.qq.com/shake_tv/auto/8tc745iahvjuj4/index.html"
},{
    id: 10,
	type: "电商类",
    name: "辽宁宜佳购物",
    img: "./images/p10.jpg",
    url: "http://yao.qq.com/tv/entry?redirect_uri=http://yaotv.qq.com/shake_tv/auto/8si68zi0tkd6cl/index.html"
},{
    id: 11,
	type: "音乐类",
    name: "西安民曲比赛",
    img: "./images/p11.jpg",
    url: "http://yao.qq.com/tv/entry?redirect_uri=http://yaotv.qq.com/shake_tv/auto/8rt36yi6qk8v08/index.html"
},{
    id: 12,
	type: "现场互动类",
    name: "广州美在花城",
    img: "./images/p12.jpg",
    url: "http://yao.qq.com/tv/entry?redirect_uri=http://yaotv.qq.com/shake_tv/auto/24cy2b8i4o0oxa3/index.html"
}] 


$(function() {
	var products = {
		proFn:function() {
			var that = this,
			    pLength = productsList.length;
				t = simpleTpl();
			for(var i=0; i<pLength; i++){
				t._('<div class="swiper-slide imgsize">')
					t._('<div class="p-img" data-ulr="'+productsList[i].url+'" style="background-image:url('+productsList[i].img+')">')
						t._('<div class="products-tyle">')
							t._('<p>'+productsList[i].type+'</p>')
							t._('<h2>'+productsList[i].name+'</h2>')
						t._('</div>')
					t._('</div>')
				t._('</div>')
			}
			$("#products").append(t.toString());
			yao.init();
		}
	};
    //摇项目
    
    var yao = {
        init:function() {
            yao.murl();
            yao.shake();
        },
        murl:function() {
			$(".yao-icon").click(function() {
                var url = $("#products>.swiper-slide-active>.p-img").attr("data-ulr");
                if(url) {
                    window.location.href=url;
                }
            });
        },
        shake:function() {
            W.addEventListener('shake', yao.shake_listener, false);
        },
        unshake:function() {
            W.removeEventListener('shake', yao.shake_listener, false);
        },
        shake_listener:function() {
            var mslide = $("#main-slide>.swiper-slide-active").attr("data-swiper-slide-index");
            if(mslide!=2) {
                return;
            }
            var uslide = $("#products>.swiper-slide-active>.p-img").attr("data-ulr");
            if(uslide) {
                window.location.href=uslide;
            }
        }
    };
	products.proFn();
})
