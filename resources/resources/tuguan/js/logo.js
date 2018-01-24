
var logoList = [{
    id: 1,
    name: "cctv1",
    img: "./images/cctv1.png",
},{
    id: 2,
    name: "cctv7",
    img: "./images/cctv7.png",
},{
    id: 3,
    name: "cctv13",
    img: "./images/cctv13.png",
},{
    id: 4,
    name: "北京卫视",
    img: "./images/bj_satellite.png",
},{
    id: 5,
    name: "广东卫视",
    img: "./images/gd_satellite.png",
},{
    id: 6,
    name: "安徽卫视",
    img: "./images/ah_satellite.png",
},{
    id: 7,
    name: "辽宁卫视",
    img: "./images/ln_shopping.png",
},{
    id: 8,
    name: "甘肃卫视",
    img: "./images/gs_satellite.png",
},{
    id: 9,
    name: "江苏卫视",
    img: "./images/js_satellite.png",
},{
    id: 10,
    name: "云南卫视",
    img: "./images/yn_satellite.png",
},{
    id: 11,
    name: "旅游卫视",
    img: "./images/tourism_satellite.png",
},{
    id: 12,
    name: "东南卫视",
    img: "./images/fj_television.png",
},{
    id: 13,
    name: "河北卫视",
    img: "./images/hb_satellite.png",
},{
    id: 14,
    name: "海峡卫视",
    img: "./images/hx_television.png",
},{
    id: 15,
    name: "南方卫视",
    img: "./images/nf_satellite.png",
},{
    id: 16,
    name: "深圳卫视",
    img: "./images/sz_satellite.png",
},{
    id: 17,
    name: "吉林卫视",
    img: "./images/jl_satellite.png",
},{
    id: 18,
    name: "陕西广播电视台",
    img: "./images/sx_satellite.png",
},{
    id: 19,
    name: "福建广播电视台",
    img: "./images/fj_television.png",
},{
    id: 20,
    name: "天津广播电视台",
    img: "./images/tjgb_television.png",
},{
    id: 21,
    name: "成都电视台",
    img: "./images/cd_television.png",
},{
    id: 22,
    name: "沈阳电视台",
    img: "./images/sy_television.png",
},{
    id: 23,
    name: "黑龙江电视台",
    img: "./images/hlj_television.png",
},{
    id: 24,
    name: "西安广播电视台",
    img: "./images/xagb_television.png",
},{
    id: 25,
    name: "合肥广播电视台",
    img: "./images/hfgb_television.png",
},{
    id: 26,
    name: "江西广播电视台",
    img: "./images/jx_satellite02.png",
},{
    id: 27,
    name: "广西电视台",
    img: "./images/gx_satellite.png",
},{
    id: 28,
    name: "广州电视台",
    img: "./images/gzgb_satellite.png",
},{
    id: 29,
    name: "南昌电视台",
    img: "./images/nc_satellite.png",
},{
    id: 30,
    name: "海南广播电视台",
    img: "./images/hngb_satellite.png",
},{
    id: 31,
    name: "福建广播影视集团",
    img: "./images/fj_fing.png",
},{
    id: 32,
    name: "辽宁购物频道",
    img: "./images/ln_shopping.png",
},{
    id: 33,
    name: "深圳体育频道",
    img: "./images/sz_satellite.png",
}] 


$(function() {
	var t = simpleTpl();
	var television = {
		liHtml: function(img, name) {
			t._('<li>')
			t._('<img src="'+img+'" />')
			t._('<p>'+name+'</p>')
			t._('</li>')
		},
		logoFn:function() {
			var that = this,
			    logoN = Math.ceil(logoList.length/9),
			    lastN = logoList.length%9,
			    l;
			for(var i=0; i<logoN; i++){
				l=i*9;
				t._('<div class="swiper-slide">')
				t._('<div class="hzjg-title"><img src="images/hzjg.png" /></div>')
				t._('<ul>')
				if(i<logoN-1) {
					for(var k=l; k<9*(i+1); k++) {
						that.liHtml(logoList[k].img, logoList[k].name);
					}	
				}else {
					if(lastN==0){
						for(var k=l; k<9*(i+1); k++) {
							that.liHtml(logoList[k].img, logoList[k].name);
						}
					}else {
						for(var k=l; k<9*i+lastN; k++) {
							that.liHtml(logoList[k].img, logoList[k].name);
						}
					}
				}
				t._('</ul>')
				t._('</div>')
			}
			$("#television-logo").append(t.toString());
		}
	};
	television.logoFn();
})
