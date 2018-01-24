/**
code	0成功  1失败		
message	描述信息		
bm	背景图片		
pst	播放开始时间		
pet	播放结束时间		
cut	当前系统时间		
qitems	所有题目		
	quid	题目uuid	
	qt	题目	
	qst	开始时间	
	qet	结束时间	
	ruid	正确项uuid	
	qcode	  0答错 1答对 2未答题	
	    aitems	所有选项	
		auid	选项uuid
		at	选项名称
 */
var callbackYiguanInfoData = {
    "code": 0,
    "bm": "http://192.168.0.23/yn-bao/images/comment-bg.jpg",
    "pst": "2015-04-08 00:00:00",
    "pet": "2015-04-08 23:59:00",
    "cut": "2015-04-08 10:00:00",
    "qitems": [
        {
            "quid": "20150126dab14756b16e24dd159b2d01",
            "qt": "《神探包青天》里的朱一品是由谁扮演的？QQQQQQQ",
            "qst": "2015-04-08 10:00:00",
            "qet": "2015-04-08 10:00:20",
            "ruid": "dab14756b16e24dd159b2d0201501263",
            "qcode": 2,
            "aitems": [
                {
                    "auid": "dab14756b16e24dd159b2d0201501262",
                    "at": "郑凯"
                },
                {
                    "auid": "dab14756b16e24dd159b2d0201501263",
                    "at": "陈郝"
                },
                {
                    "auid": "dab14756b16e24dd159b2d0201501264",
                    "at": "南中京"
                }
            ]
        },
        {
            "quid": "20150126dab14756b16e24dd159b2d02",
            "qt": "《神探包青天》里的朱一品是由谁扮演的？2222",
            "qst": "2015-04-08 10:02:00",
            "qet": "2015-04-08 10:03:00",
            "ruid": "dab14756b16e24dd159b2d0201501264",
            "qcode": 2,
            "aitems": [
                {
                    "auid": "dab14756b16e24dd159b2d0201501263",
                    "at": "郑凯"
                },
                {
                    "auid": "dab14756b16e24dd159b2d0201501264",
                    "at": "陈郝"
                },
                {
                    "auid": "dab14756b16e24dd159b2d0201501265",
                    "at": "南中京"
                }
            ]
        },
        {
            "quid": "20150126dab14756b16e24dd159b2d03",
            "qt": "《神探包青天》里的朱一品是由谁扮演的？3333",
            "qst": "2015-04-08 10:04:00",
            "qet": "2015-04-08 10:05:00",
            "ruid": "dab14756b16e24dd159b2d0201501265",
            "qcode": 2,
            "aitems": [
                {
                    "auid": "dab14756b16e24dd159b2d0201501264",
                    "at": "郑凯"
                },
                {
                    "auid": "dab14756b16e24dd159b2d0201501265",
                    "at": "陈郝"
                },
                {
                    "auid": "dab14756b16e24dd159b2d0201501266",
                    "at": "南中京"
                }
            ]
        },
        {
            "quid": "20150126dab14756b16e24dd159b2d04",
            "qt": "《神探包青天》里的朱一品是由谁扮演的？4444",
            "qst": "2015-04-08 10:06:00",
            "qet": "2015-04-08 10:07:00",
            "ruid": "dab14756b16e24dd159b2d0201501266",
            "qcode": 2,
            "aitems": [
                {
                    "auid": "dab14756b16e24dd159b2d0201501265",
                    "at": "郑凯"
                },
                {
                    "auid": "dab14756b16e24dd159b2d0201501266",
                    "at": "陈郝"
                },
                {
                    "auid": "dab14756b16e24dd159b2d0201501267",
                    "at": "南中京"
                }
            ]
        },
        {
            "quid": "20150126dab14756b16e24dd159b2d05",
            "qt": "《神探包青天》里的朱一品是由谁扮演的？5555",
            "qst": "2015-04-08 10:08:00",
            "qet": "2015-04-08 10:09:00",
            "ruid": "dab14756b16e24dd159b2d0201501267",
            "qcode": 2,
            "aitems": [
                {
                    "auid": "dab14756b16e24dd159b2d0201501266",
                    "at": "郑凯"
                },
                {
                    "auid": "dab14756b16e24dd159b2d0201501267",
                    "at": "陈郝"
                },
                {
                    "auid": "dab14756b16e24dd159b2d0201501268",
                    "at": "南中京"
                }
            ]
        }
    ]
};
/**
 * 	Code	0成功   1失败	
	Message	描述信息	
	rs	    0答错1 答对	
 */
var callbackYiguanAnswerData = {
	"code": 0,
	"message": "",
	"rs": 1,
	quid: '20150126dab14756b16e24dd159b2d01'
};

/**
Code	-1 错误 0中奖 1 未中奖 
Message	返回说明
puid	抽奖记录uuid
pn	奖品名称
co	数量
pu	奖品单位
des	奖品描述
pt	奖品类型1:实物奖品 2:积分奖品
Pv	积分奖品值 如10
Pi	奖品图片地址
ph	电话号码
rl	用户真实姓名
ad	地址
 */
var callbackYiguanLotteryData = {
	code: 0,
	message: '抽奖次数已用完',
	puid: 'aaaa',
	pn: '金条',
	co: 3,
	pu: '根',
	des: '奖品描述',
	pt: 1,
	pv: 10,
	pi: './images/award4.png',
	ph: 15112505426,
	rl: 'jacky',
	ad: '深圳龙岗坂田'
};

/*
Code	0成功 1失败
 */
var callbackYiguanAwardData = {
	"code":0,
	"message":"操作失败"
};

/**
code	0成功1失败	
jo	True参与过  false未参与过	
iv	积分值	
rank	排名	
items	排行榜（前10名）	
	hm	头像图片
	n	用户名
	rank	排名
 */
var callbackYiguanTranscriptData = {
    "code": 0,
    "jo": true,
    "iv": 100,
    "rank": 1,
    "items": [
        {
            "hm": "http://img0.bdstatic.com/img/image/673ac9e3432b8c73682e932751ff8ebe1409124230.jpg",
            "n": "名字越长越有感觉1",
            "rank": 1
        },
        {
            "hm": "http://img0.bdstatic.com/img/image/673ac9e3432b8c73682e932751ff8ebe1409124230.jpg",
            "n": "名字越长越有感觉2",
            "rank": 2
        },
        {
            "hm": "http://img0.bdstatic.com/img/image/673ac9e3432b8c73682e932751ff8ebe1409124230.jpg",
            "n": "名字越长越有感觉3",
            "rank": 3
        },
        {
            "hm": "http://img0.bdstatic.com/img/image/673ac9e3432b8c73682e932751ff8ebe1409124230.jpg",
            "n": "名字越长越有感觉4",
            "rank": 4
        },
        {
            "hm": "http://img0.bdstatic.com/img/image/673ac9e3432b8c73682e932751ff8ebe1409124230.jpg",
            "n": "名字越长越有感觉5",
            "rank": 5
        },
        {
            "hm": "http://img0.bdstatic.com/img/image/673ac9e3432b8c73682e932751ff8ebe1409124230.jpg",
            "n": "名字越长越有感觉6",
            "rank": 6
        },
        {
            "hm": "http://img0.bdstatic.com/img/image/673ac9e3432b8c73682e932751ff8ebe1409124230.jpg",
            "n": "名字越长越有感觉7",
            "rank": 7
        },
        {
            "hm": "http://img0.bdstatic.com/img/image/673ac9e3432b8c73682e932751ff8ebe1409124230.jpg",
            "n": "名字越长越有感觉8",
            "rank": 8
        },
        {
            "hm": "http://img0.bdstatic.com/img/image/673ac9e3432b8c73682e932751ff8ebe1409124230.jpg",
            "n": "名字越长越有感觉9",
            "rank": 9
        },
        {
            "hm": "http://img0.bdstatic.com/img/image/673ac9e3432b8c73682e932751ff8ebe1409124230.jpg",
            "n": "名字越长越有感觉10",
            "rank": 10
        }
    ]
};


var callbackYiguanCountData = {
	code: 1,
	message: '你的抽奖机会不足'
};