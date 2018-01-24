//定义百分点接口对像_BFD
window["_BFD"] = window["_BFD"] || {};
//基础方法
_BFD.addEvent=function(a,b,c){if(a.addEventListener){a.addEventListener(b,c,false)}else{if(a.attachEvent){a.attachEvent("on"+b,function(){c.call(a)})}else{a["on"+b]=c}}};_BFD.removeEvent=function(a,b,c){if(a.removeEventListener){a.removeEventListener(b,c,false)}else{if(a.detachEvent){a.detachEvent("on"+b,function(){c.call(a)})}else{a["on"+b]=null}}};_BFD.createElement=function(d,a){var c=document.createElement(d);if(a){for(var b in a){if(a.hasOwnProperty(b)){if(b==="class"||b==="className"){c.className=a[b]}else{if(b==="style"){c.style.cssText=a[b]}else{c.setAttribute(b,a[b])}}}}}return c};_BFD.loadScript=function(a,b){setTimeout(function(){var c=_BFD.createElement("script",{src:a,type:"text/javascript"});if(c.readyState){_BFD.addEvent(c,"readystatechange",function(){if(c.readyState==="loaded"||c.readyState==="complete"){if(b){b()}_BFD.removeEvent(c,"readystatechange",arguments.callee)}})}else{_BFD.addEvent(c,"load",function(){if(b){b()}_BFD.removeEvent(c,"load",arguments.callee)})}document.getElementsByTagName("head")[0].appendChild(c)},0)};_BFD.getByAttribute=function(g,h,a){var b=[],a=(a)?a:document,e=a.getElementsByTagName("*"),d=new RegExp("\\b"+h+"\\b","i");for(var c=0;c<e.length;c++){var f=e[c];if(g==="className"||g==="class"){if(d.test(f.className)){b.push(f)}}else{if(f.getAttribute(g)===h){b.push(f)}}}return b};_BFD.getByClass=function(b,a){return _BFD.getByAttribute("className",b,a)};_BFD.getById=function(a){if(typeof a==="string"&&!!a){return document.getElementById(a)}};_BFD.loadCss=function(a){var b=_BFD.createElement("link",{href:a,rel:"stylesheet",type:"text/css"});document.getElementsByTagName("head")[0].appendChild(b)};_BFD.insertAfter=function(d,c){var b=c.parentNode;if(b.lastChild==c){b.appendChild(d)}else{var a=c.nextElementSibling||c.nextSibling;b.insertBefore(d,a)}};

//加载百分点标准jsapi
_BFD.loadScript(('https:' == document.location.protocol?'https://ssl-static':'http://static')+'.baifendian.com/api/2.0/bcore.min.js',function(){
	//全局变量
	var _core = new $Core(function(){});
	var Tools = $Core.tools.Tools;
    //定义客户标识cid
	_core.options.cid = _BFD.client_id;
    //标识是数据来源区分pc、wap、ios、android
    _core.options.d_s = "pc";
    //uid没有时取sid的值
	if(typeof(_core.options.uid) == 'undefined' || _core.options.uid == '' || _core.options.uid == '0' || _core.options.uid == null) {
		_core.options.uid = _core.options.sid;
	}
	
	_BFD.PageView=function(param_p_p, param_p_s, param_p_t, param_uid, param_adCode, param_cat_id, param_cat_name, param_cb, param_lt, param_media_cookie, param_openID, param_p_id, param_page_type, param_ptime, param_unionID ){
		var params = new $Core.inputs.PageView();
		
        params.p_p = param_p_p;
        
        params.p_s = param_p_s;
        
        params.p_t = param_p_t;
        
        
		if(typeof(param_uid) == 'undefined' || param_uid == '' || param_uid == '0' || param_uid == null)
        	_core.options.uid = _core.options.sid;
		else
			_core.options.uid = param_uid;
		
        
        params.adCode = param_adCode;
        
        params.cat_id = param_cat_id;
        
        params.cat_name = param_cat_name;
        
        params.cb = param_cb;
        
        params.lt = param_lt;
        
        params.media_cookie = param_media_cookie;
        
        params.openID = param_openID;
        
        params.p_id = param_p_id;
        
        params.page_type = param_page_type;
        
        params.ptime = param_ptime;
        
        params.unionID = param_unionID;
        
		_core.send(params);
	}
    
	_BFD.AddUser=function(param_uid, param_user_id, param_adCode, param_address, param_cardID, param_mobile, param_p_t, param_page_type, param_sex ){
		var params = new $Core.inputs.AddUser();
		
        
		if(typeof(param_uid) == 'undefined' || param_uid == '' || param_uid == '0' || param_uid == null)
        	_core.options.uid = _core.options.sid;
		else
			_core.options.uid = param_uid;
		
        
        params.user_id = param_user_id;
        
        params.adCode = param_adCode;
        
        params.address = param_address;
        
        params.cardID = param_cardID;
        
        params.mobile = param_mobile;
        
        params.p_t = param_p_t;
        
        params.page_type = param_page_type;
        
        params.sex = param_sex;
        
		_core.send(params);
	}
    
	_BFD.Pay=function(param_lst, param_ord, param_total, param_uid, param_openID, param_p_t, param_unionID ){
		var params = new $Core.inputs.Pay();
		
        params.lst = param_lst;
        
        params.ord = param_ord;
        
        params.total = param_total;
        
        
		if(typeof(param_uid) == 'undefined' || param_uid == '' || param_uid == '0' || param_uid == null)
        	_core.options.uid = _core.options.sid;
		else
			_core.options.uid = param_uid;
		
        
        params.openID = param_openID;
        
        params.p_t = param_p_t;
        
        params.unionID = param_unionID;
        
		_core.send(params);
	}
    
	_BFD.AddItem=function(param_iid, param_addr, param_attr, param_author, param_bc, param_brd, param_brd_id, param_buycnt, param_cat, param_cat_id, param_city_info, param_clr, param_cmp, param_coord, param_data, param_description, param_dis, param_etm, param_exp, param_gdr, param_gds_typ, param_grp, param_gsid, param_img, param_loc, param_memp, param_mktp, param_mtl, param_name, param_pattern, param_place, param_pp, param_prc, param_prc_s, param_rate, param_ratecnt, param_season, param_seller_lnk, param_seller_nm, param_seller_no, param_simg, param_ssk, param_stk, param_stkcnt, param_stm, param_sty, param_style_1, param_subtitle, param_sz, param_tag, param_typ, param_url, param_usage, param_vipp, param_wt ){
		var params = new $Core.inputs.AddItem();
		
        params.iid = param_iid;
        
        params.addr = param_addr;
        
        params.attr = param_attr;
        
        params.author = param_author;
        
        params.bc = param_bc;
        
        params.brd = param_brd;
        
        params.brd_id = param_brd_id;
        
        params.buycnt = param_buycnt;
        
        params.cat = param_cat;
        
        params.cat_id = param_cat_id;
        
        params.city_info = param_city_info;
        
        params.clr = param_clr;
        
        params.cmp = param_cmp;
        
        params.coord = param_coord;
        
        params.data = param_data;
        
        params.description = param_description;
        
        params.dis = param_dis;
        
        params.etm = param_etm;
        
        params.exp = param_exp;
        
        params.gdr = param_gdr;
        
        params.gds_typ = param_gds_typ;
        
        params.grp = param_grp;
        
        params.gsid = param_gsid;
        
        params.img = param_img;
        
        params.loc = param_loc;
        
        params.memp = param_memp;
        
        params.mktp = param_mktp;
        
        params.mtl = param_mtl;
        
        params.name = param_name;
        
        params.pattern = param_pattern;
        
        params.place = param_place;
        
        params.pp = param_pp;
        
        params.prc = param_prc;
        
        params.prc_s = param_prc_s;
        
        params.rate = param_rate;
        
        params.ratecnt = param_ratecnt;
        
        params.season = param_season;
        
        params.seller_lnk = param_seller_lnk;
        
        params.seller_nm = param_seller_nm;
        
        params.seller_no = param_seller_no;
        
        params.simg = param_simg;
        
        params.ssk = param_ssk;
        
        params.stk = param_stk;
        
        params.stkcnt = param_stkcnt;
        
        params.stm = param_stm;
        
        params.sty = param_sty;
        
        params.style_1 = param_style_1;
        
        params.subtitle = param_subtitle;
        
        params.sz = param_sz;
        
        params.tag = param_tag;
        
        params.typ = param_typ;
        
        params.url = param_url;
        
        params.usage = param_usage;
        
        params.vipp = param_vipp;
        
        params.wt = param_wt;
        
		_core.send(params);
	}
    
});