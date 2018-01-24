/**
获取配置开关接口:

请求地址：
http://test.holdfun.cn/portal/twoSessions/friends/config

参数信息：无

响应信息：
Callback：callbackTwoSessionsFriendsConfigHandler
cs	Comment switch：“评论区域”开关：0不可见、1可见。
fs	Filter switch：筛选按钮“，开关：0不可见、1可见。筛选包括：0-查看全部/1-TOP10提案/2-TOP10议案
 */
var callbackTwoSessionsFriendsConfigHandlerData = {
	cs: 1,
	fs: 1
};

/**
 * 
获取话题列表接口:

请求地址：
http://test.holdfun.cn/portal/twoSessions/friends/topics/list?ft=0&page=1&ps=10

参数信息：
fs	Filter type：0：查看全部、1：TOP10提案、2：TOP10议案
page	页码 默认1
ps	每页数量 默认10

返回信息：
Callback：callbackTwoSessionsFriendsTopicsHandler

code	0 成功  1失败	
message	描述信息	
items	主题信息	
	uid	主题uuid
	t	主题名称
	p	评论人昵称
	a	评论人头像地址
	ims	图片地址，多个按英文逗号隔开
	vis	视频地址，多个视频用英文逗号隔开
	vos	音频地址，多个音频用英文逗号隔开
	pc	点赞数
	cc	评论数
 * 
 * 
 */
var callbackTwoSessionsFriendsTopicsHandlerData = {
	code: 0,
	message: '',
	items: [
	   {
		   	uid: '111111',
			t: '11111体育不仅仅是为了拿金牌，还有更更深层的内涵。',
			p: '姚明',
			a: './images/avatar.jpg',
			ims: 'http://cdn.holdfun.cn/cctv/images/1.jpg,http://cdn.holdfun.cn/cctv/images/2.jpg,http://cdn.holdfun.cn/cctv/images/3.jpg,http://cdn.holdfun.cn/cctv/images/4.jpg,http://cdn.holdfun.cn/cctv/images/5.jpg,http://cdn.holdfun.cn/cctv/images/6.jpg,http://cdn.holdfun.cn/cctv/images/7.jpg,http://cdn.holdfun.cn/cctv/images/8.jpg,http://cdn.holdfun.cn/cctv/images/9.jpg',
			pc: 5000,
			cc: 2000,
			comments: [
				{
					uid: '111111',
					na: 'steven',
					co: '竞技体育的基础应该源于热爱！',
					pna: ''
				},
				{
					uid: '222222',
					na: 'jobs',
					co: '只注重金牌的时代已经翻篇了。',
					pna: ''
				},
				{
					uid: '444444',
					na: '姚明',
					co: '我已经备好相关提案，请大家一定支持。',
					pna: 'jobs'
				},
				{
					uid: '555555',
					na: '姚明',
					co: '我已经备好相关提案，请大家一定支持。',
					pna: 'jobs'
				}     
			]
	   },
	   {
		   	uid: '222222',
			t: '22222体育不仅仅是为了拿金牌，还有更更深层的内涵。',
			p: '姚明',
			a: './images/avatar.jpg',
			ims: 'http://cdn.holdfun.cn/cctv/images/1.jpg,http://cdn.holdfun.cn/cctv/images/2.jpg',
			pc: 5000,
			cc: 2000,
			comments: [
				{
					uid: '111111',
					na: 'steven',
					co: '竞技体育的基础应该源于热爱！',
					pna: ''
				},
				{
					uid: '222222',
					na: 'jobs',
					co: '只注重金牌的时代已经翻篇了。',
					pna: ''
				},
				{
					uid: '333333',
					na: '姚明',
					co: '我已经备好相关提案，请大家一定支持。',
					pna: 'jobs'
				},
				{
					uid: '444444',
					na: '姚明',
					co: '我已经备好相关提案，请大家一定支持。',
					pna: 'jobs'
				}  
			]
	   },
	   {
		   	uid: '333333',
			t: '33333体育不仅仅是为了拿金牌，还有更更深层的内涵。',
			p: '姚明',
			a: './images/avatar.jpg',
			ims: 'http://cdn.holdfun.cn/cctv/images/1.jpg,http://cdn.holdfun.cn/cctv/images/2.jpg,http://cdn.holdfun.cn/cctv/images/3.jpg,http://cdn.holdfun.cn/cctv/images/4.jpg',
			pc: 5000,
			cc: 2000,
			comments: [
				{
					uid: '111111',
					na: 'steven',
					co: '竞技体育的基础应该源于热爱！',
					pna: ''
				},
				{
					uid: '222222',
					na: 'jobs',
					co: '只注重金牌的时代已经翻篇了。',
					pna: ''
				},
				{
					uid: '333333',
					na: '姚明',
					co: '我已经备好相关提案，请大家一定支持。',
					pna: 'jobs'
				}   
			]
	   },
	   {
		   	uid: '444444',
			t: '44444体育不仅仅是为了拿金牌，还有更更深层的内涵。',
			p: '姚明',
			a: './images/avatar.jpg',
			ims: 'http://cdn.holdfun.cn/cctv/images/1.jpg',
			pc: 5000,
			cc: 2000,
			comments: [
				{
					uid: '111111',
					na: 'steven',
					co: '竞技体育的基础应该源于热爱！',
					pna: ''
				},
				{
					uid: '222222',
					na: 'jobs',
					co: '只注重金牌的时代已经翻篇了。',
					pna: ''
				}   
			]
	   },
	   {
		   	uid: '555555',
			t: '555555体育不仅仅是为了拿金牌，还有更更深层的内涵。',
			p: '姚明',
			a: './images/avatar.jpg',
			ims: 'http://cdn.holdfun.cn/cctv/images/9.jpg',
			pc: 5000,
			cc: 2000,
			comments: [
				{
					uid: '111111',
					na: 'steven',
					co: '竞技体育的基础应该源于热爱！',
					pna: ''
				} 
			]
	   }
	]
};


/**
获取话题详情信息接口: 

请求地址：
http://test.holdfun.cn/portal/twoSessions/friends/topics/detail?uid=XXX

参数信息：
uid	话题uuid

返回信息：
Callback：callbackTwoSessionsFriendsTopicsDetailHandler

code	0 成功  1失败
message	描述信息
uid	主题uuid
t	主题名称
p	评论人昵称
a	评论人头像地址
ims	图片地址，多个按英文逗号隔开
vis	视频地址，多个视频用英文逗号隔开
vos	音频地址，多个音频用英文逗号隔开
pc	点赞数
cc	评论数
*/

var callbackTwoSessionsFriendsTopicsDetailHandlerData = {
		code: 0,
		message: '',
		uid: '555555',
		t: '555555体育不仅仅是为了拿金牌，还有更更深层的内涵。',
		p: '姚明',
		a: './images/avatar.jpg',
		ims: 'http://cdn.holdfun.cn/cctv/images/1.jpg,http://cdn.holdfun.cn/cctv/images/2.jpg,http://cdn.holdfun.cn/cctv/images/3.jpg,http://cdn.holdfun.cn/cctv/images/4.jpg,http://cdn.holdfun.cn/cctv/images/5.jpg,http://cdn.holdfun.cn/cctv/images/6.jpg,http://cdn.holdfun.cn/cctv/images/7.jpg,http://cdn.holdfun.cn/cctv/images/8.jpg,http://cdn.holdfun.cn/cctv/images/9.jpg',
		pc: 5000,
		cc: 2000
};

/** 
话题点赞接口:
请求地址：
http://test.holdfun.cn/portal/twoSessions/friends/topics/praise?uid=XXX&op=XXX

参数信息：
uid	话题uuid
op	摇一摇openid

返回信息：
Callback：callbackTwoSessionsFriendsTopicsPraiseHandler

code	0 成功  1失败
message	描述信息
pc	无论成功失败，均返回当前话题最新的点赞数量

 */
var callbackTwoSessionsFriendsTopicsPraiseHandlerData = {
	code: 0,
	message: '',
	pc: 111
};

/**
获取话题评论接口：

请求地址：
http://test.holdfun.cn/portal/comments/twoSessions/friend/topics?anyUid=XXXX&page=1&ps=10

参数信息：
uid	话题uuid
page	页码 默认1
ps	每页数量 默认10

返回信息：
Callback：callbackCommentsTwoSessionsHandler

code	0成功 1失败
message	说明
items	评论集合
	uid	评论uuid
	na	评论人昵称
	co	内容
	pna	被评论人的昵称,如果没有，说明就是直接评论话题
	
 */
var callbackCommentsTwoSessionsHandlerData = {
		code: 0,
		message: '',	
		items: [
			{
				uid: '111111',
				na: 'steven',
				co: '竞技体育的基础应该源于热爱！',
				pna: ''
			},
			{
				uid: '222222',
				na: 'jobs',
				co: '只注重金牌的时代已经翻篇了。',
				pna: ''
			},
			{
				uid: '333333',
				na: '姚明',
				co: '我已经备好相关提案，请大家一定支持。',
				pna: 'jobs'
			},
			{
				uid: '444444',
				na: '姚明',
				co: '我已经备好相关提案，请大家一定支持。',
				pna: 'jobs'
			},
			{
				uid: '555555',
				na: '姚明',
				co: '我已经备好相关提案，请大家一定支持。',
				pna: 'jobs'
			},
			{
				uid: '666666',
				na: '姚明',
				co: '我已经备好相关提案，请大家一定支持。',
				pna: 'jobs'
			},
			{
				uid: '777777',
				na: '姚明',
				co: '我已经备好相关提案，请大家一定支持。',
				pna: 'jobs'
			},
			{
				uid: '888888',
				na: '姚明',
				co: '我已经备好相关提案，请大家一定支持。',
				pna: 'jobs'
			},
			{
				uid: '999999',
				na: '姚明',
				co: '我已经备好相关提案，请大家一定支持。',
				pna: 'jobs'
			},
			{
				uid: '101010',
				na: '姚明',
				co: '我已经备好相关提案，请大家一定支持。',
				pna: 'jobs'
			}
		]
			
};

/**
保存评论接口：

请求地址：
http://test.holdfun.cn/portal/comments/save?co=XXX&op=XXX&tid=XXX&ty=XXX&pa=XXX&nickname=xxx&headimgurl=XX

请求参数：
co	评论内容，需要utf-8编码
op	摇一摇openid
tid	评论的主题uuid（当ty=2可不填）
ty	类型：1、话题评论 2、独立评论 3、辩论赛主题评论 4、辩论赛正反评论
pa	父评论的uuid（不填,说明是自主发表的评论）
nickname	昵称。非必填
headimgurl	头像，非必填

返回信息：
Callback：callbackCommentsSave

code	0成功 1失败
uid	当前新增评论的uuid
 
 */

var callbackCommentsSaveData = {
	code: 0,
	uid: '11111'
};