//getResult('goodsong/index', { openid: openid }, 'songIndexHandler', true); //调此接口可以查询到如下数据
var dataTest={
    "code": 0,
    "actUid": "108719df625a45b980bf55b52965c993",//主活动uuid
    "tm": "2015-05-18 18:13:18",
    "ab": "2015-05-18 09:15:44",//主活动开始时间
    "ae": "2015-05-18 21:18:04",//主活动结束时间
    "as": "",//积分排行顶部文案
    "af": true,//主活动投票表识   结束/未开始/投票次数用完---false         可以投票---true
    "vt": [
        {
            "vu": "88f0224691b146f7af8e531f2df0ed3c",//活动时间段UUID
            "vb": "2015-05-18 17:33:20",
            "ve": "2015-05-18 17:37:20",
            "vf": false,//活动时间段投票表识  不能投票（false）
            "vtr": [
                {
                    "au": "df2d1b3e45954bae99d0f3aa696f6a1a",//选项uuid
                    "ai": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/resources/images/f66af8813a994b5eac5366cc57406e58/2015/05/18/021c703110ce4f7cb44bb7bc162606ef.png",
                    "an": "张三",
                    "vn": 3,//获得票数
                    "ad": "",
                    "uv": false //选项投票表识   不能投票（false）
                },
                {
                    "au": "52097a2515d74cbd87e38bcde4ddfe7f",
                    "ai": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/resources/images/f66af8813a994b5eac5366cc57406e58/2015/05/18/b42ff8aca1fc49439de9132b45775bec.png",
                    "an": "李四",
                    "vn": 1,
                    "ad": "",
                    "uv": true
                },
                {
                    "au": "a810a63021754e15b6be35ad389081e5",
                    "ai": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/resources/images/f66af8813a994b5eac5366cc57406e58/2015/05/18/a22c6cb4622c4a9296f33653dde189c1.png",
                    "an": "王小燕",
                    "vn": 2,
                    "ad": "",
                    "uv": true
                },
                {
                    "au": "8ce83a095c2849769415aca457e00841",
                    "ai": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/resources/images/f66af8813a994b5eac5366cc57406e58/2015/05/18/008b7676bb954c2599aadb0880407450.png",
                    "an": "李利",
                    "vn": 1,
                    "ad": "",
                    "uv": true
                },
                {
                    "au": "d3942877a69143d2be1dfc888a5301ab",
                    "ai": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/resources/images/f66af8813a994b5eac5366cc57406e58/2015/05/18/2c55d83b852644d0b4b55b5a6875d840.png",
                    "an": "孟杰",
                    "vn": 1,
                    "ad": "",
                    "uv": true
                },
                {
                    "au": "57ee3d5dc45b4873bd0b2dcded767486",
                    "ai": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/resources/images/f66af8813a994b5eac5366cc57406e58/2015/05/18/883ff69298084caba14afd5f4d6318b6.png",
                    "an": "周五",
                    "vn": 1,
                    "ad": "",
                    "uv": true
                }
            ]
        },
        {
            "vu": "8713201ce4704631a251eee528e23287",
            "vb": "2015-05-18 17:38:45",
            "ve": "2015-05-18 17:45:45",
            "vf": false,
            "vtr": [
                {
                    "au": "df2d1b3e45954bae99d0f3aa696f6a1a",
                    "ai": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/resources/images/f66af8813a994b5eac5366cc57406e58/2015/05/18/021c703110ce4f7cb44bb7bc162606ef.png",
                    "an": "张三",
                    "vn": 3,
                    "ad": "",
                    "uv": false
                },
                {
                    "au": "52097a2515d74cbd87e38bcde4ddfe7f",
                    "ai": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/resources/images/f66af8813a994b5eac5366cc57406e58/2015/05/18/b42ff8aca1fc49439de9132b45775bec.png",
                    "an": "李四",
                    "vn": 1,
                    "ad": "",
                    "uv": true
                },
                {
                    "au": "a810a63021754e15b6be35ad389081e5",
                    "ai": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/resources/images/f66af8813a994b5eac5366cc57406e58/2015/05/18/a22c6cb4622c4a9296f33653dde189c1.png",
                    "an": "王小燕",
                    "vn": 2,
                    "ad": "",
                    "uv": true
                },
                {
                    "au": "8ce83a095c2849769415aca457e00841",
                    "ai": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/resources/images/f66af8813a994b5eac5366cc57406e58/2015/05/18/008b7676bb954c2599aadb0880407450.png",
                    "an": "李利",
                    "vn": 1,
                    "ad": "",
                    "uv": true
                },
                {
                    "au": "d3942877a69143d2be1dfc888a5301ab",
                    "ai": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/resources/images/f66af8813a994b5eac5366cc57406e58/2015/05/18/2c55d83b852644d0b4b55b5a6875d840.png",
                    "an": "孟杰",
                    "vn": 1,
                    "ad": "",
                    "uv": true
                },
                {
                    "au": "57ee3d5dc45b4873bd0b2dcded767486",
                    "ai": "http://yaotv-test.oss-cn-shenzhen.aliyuncs.com/resources/images/f66af8813a994b5eac5366cc57406e58/2015/05/18/883ff69298084caba14afd5f4d6318b6.png",
                    "an": "周五",
                    "vn": 1,
                    "ad": "",
                    "uv": true
                }
            ]
        }
    ]
};

var rankData = {
    "code": 0,
    "jo": true,
    "iv": 100,
    "rank": 1,
    "top10": [
        {
            "hi": "",
            "n": "帅哥1",
            "rk": 1,
            "in": 100
        },
        {
            "hi": "",
            "n": "帅哥2",
            "rk": 2,
            "in": 100
        },
        {
            "hi": "",
            "n": "帅哥3",
            "rk": 3,
            "in": 100
        },
        {
            "hi": "",
            "n": "帅哥4",
            "rk": 4,
            "in": 100
        },
        {
            "hi": "",
            "n": "帅哥5",
            "rk": 5,
            "in": 100
        },
        {
            "hi": "",
            "n": "帅哥6",
            "rk": 6,
            "in": 100
        },
        {
            "hi": "",
            "n": "帅哥7",
            "rk": 7,
            "in": 100
        },
        {
            "hi": "",
            "n": "帅哥8",
            "rk": 8,
            "in": 100
        },
        {
            "hi": "",
            "n": "帅哥9",
            "rk": 9,
            "in": 100
        },
        {
            "hi": "",
            "n": "帅哥10",
            "rk": 10,
            "in": 100
        }
    ]
};