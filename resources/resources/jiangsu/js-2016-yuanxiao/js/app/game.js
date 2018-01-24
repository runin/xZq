; (function (w, $) { 
   
   /***********游戏对象***********/
   {
     w.Game =function(){
        this.score =0;//用户得到的分数
        this.maxScore =0;//最大分数
        this.gameTime =10;//游戏时间 10秒
        this.dowmCorps = [];//下落物体集合
        this.getScoreCallBack=null;//获得的积分
    };
    Game.prototype.init =function(){
        this.initParm();
        this.initMove();
    };
    Game.prototype.initParm =function(){
         this.stage_main = $("#stage_main");//总容器
         this.renderer = PIXI.autoDetectRenderer($(window).width(), $(window).height());//渲染器
         this.stage =  new PIXI.Container();//分容器
    };
    Game.prototype.initMove=function(){
           this.setBg();//设置背景
           this.pop();//设置弹框pop
           this.initBucket();//初始化爆米花桶
           this.downCountFn();//游戏倒计时
           this.stage_main.append(this.renderer.view);//所有东西放到容器下
    };
    Game.prototype.setBg =function(){//画背景
       this.stage_main.css({width:this.renderer.width,height:this.renderer.height});
       this.background = PIXI.Sprite.fromImage('http://yaotv.qq.com/shake_tv/auto2/2016/02/24fhrcyiktg69bg/bg-game.jpg');
       this.background.width = this.renderer.width;
       this.background.height = this.renderer.height;
       this.stage.addChild(this.background);

       this.bottom = PIXI.Sprite.fromImage('http://yaotv.qq.com/shake_tv/auto2/2016/02/24fhrcyiktg69bg/bg-game-bottom.png');
       this.bottom.width = this.renderer.width;
       this.bottom.height = this.renderer.width / 640 * 182;
       this.bottom.position.x = 0;
       this.bottom.position.y = this.renderer.height;
       this.bottom.anchor.x = 0;
       this.bottom.anchor.y = 1;
       this.stage.addChild(this.bottom);
    };
    Game.prototype.pop =function(){//开始的时候弹出文字

       this.popIcon = PIXI.Texture.fromImage('./images/icon-1.png');
       this.popdude1 = new PIXI.Sprite(this.popIcon);
       this.popdude1.scale.set(0.1);
       this.popdude1.anchor.x = 0.5;
       this.popdude1.anchor.y = 0.5;
       this.popdude1.position.x = this.renderer.width/2;
       this.popdude1.position.y = this.renderer.height*0.2;
       this.stage.addChild(this.popdude1);

       this.popIcon = PIXI.Texture.fromImage('./images/icon-2.png');
       this.popdude2 = new PIXI.Sprite(this.popIcon);
       this.popdude2.scale.set(0.1);
       this.popdude2.anchor.x = 0.5;
       this.popdude2.anchor.y = 0.5;
       this.popdude2.position.x = this.renderer.width/2;
       this.popdude2.position.y = this.renderer.height*0.2;
       this.stage.addChild(this.popdude2);

       this.popIcon = PIXI.Texture.fromImage('./images/icon-3.png');
       this.popdude3 = new PIXI.Sprite(this.popIcon);
       this.popdude3.scale.set(0.1);
       this.popdude3.anchor.x = 0.5;
       this.popdude3.anchor.y = 0.5;
       this.popdude3.position.x = this.renderer.width/2;
       this.popdude3.position.y = this.renderer.height*0.2;
       this.stage.addChild(this.popdude3);
    };
    Game.prototype.initBucket =function(){
        this.Bucket = new Bucket(this);
    };
    Game.prototype.initCorps =function(){
       this.setEachCorpsNum(this);
       this.Corps = new Corps(this).getCorps();
        
    };
    Game.prototype.setEachCorpsNum =function(that){//根据最大分值计算每个物体的数量
          this.noCloud ={ name:"noCloud", count:1,url:"images/icon-game-tangyuan1.png",rotation:0.01,speed:6,score:1,percent:0.4,setCount:function(){ this.count = Math.ceil(that.maxScore*this.percent/this.score) } };//没有表情的云
          this.bigCloud={ name:"bigCloud", count:1,url:"images/icon-game-tangyuan2.png",rotation:0.01,speed:5,score:1 ,percent:0.3,setCount:function(){ this.count = Math.ceil(that.maxScore*this.percent/this.score)}};//大云
          this.smallCloud={ name:"smallCloud", count:1,url:"images/icon-game-tangyuan3.png",rotation:0.01,speed:6,score:1,percent:0.2,setCount:function(){ this.count = Math.ceil(that.maxScore*this.percent/this.score) }};//小云
          this.emptyCloud={ name:"emptyCloud", count:1,url:"images/empty.png",rotation:0.01,speed:6,score:1,percent:0.2,setCount:function(){ this.count = Math.ceil(that.maxScore*this.percent/this.score) }};//小云
          this.mcCloud ={ name:"mcCloud", count:1,url:"images/icon-game-tangyuan4.png",rotation:0.01,speed:7,score:1 ,percent:0.1,setCount:function(){ this.count = Math.ceil(that.maxScore*this.percent/this.score)}};//mc 云
          this.boom ={ name:"boom", count:1,url:"images/icon-boom.png",rotation:0.01,speed:8,score:-5 ,percent:0.3,setCount:function(){ this.count = -(Math.ceil(that.maxScore*this.percent/this.score))}};//便便，扣分的

          if(this.maxScore<=99){
              this.noCloud.count =46;  //没有表情的云朵
              this.bigCloud.count = 4; //大云朵
              this.smallCloud.count =4;//小云朵
              this.mcCloud.count=1;   //mc云朵
          }else if(this.maxScore<=199){
              this.noCloud.count =24;  //没有表情的云朵
              this.bigCloud.count = 13; //大云朵
              this.smallCloud.count =14;//小云朵
              this.mcCloud.count=4;   //mc云朵
          }else if(this.maxScore<=299){
              this.noCloud.count =9;  //没有表情的云朵
              this.bigCloud.count = 17; //大云朵
              this.smallCloud.count =17;//小云朵
              this.mcCloud.count=12;   //mc云朵
          }else if(this.maxScore>299){
              this.noCloud.count =7;  //没有表情的云朵
              this.bigCloud.count = 16; //大云朵
              this.smallCloud.count =16;//小云朵
              this.mcCloud.count=16;   //mc云朵
          }
          this.boom.setCount();

          var that =this;
          function setSpeed(){
              var h = $(window).height();
              that.noCloud.speed =that.noCloud.speed*h/568;  //没有表情的云朵
              that.bigCloud.speed = that.bigCloud.speed*h/568; //大云朵
              that.smallCloud.speed =that.smallCloud.speed*h/568;//小云朵
              that.mcCloud.speed=that.mcCloud.speed*h/568;   //mc云朵
              that.boom.speed=that.boom.speed*h/568;
          };
          setSpeed();
         
    };
     Game.prototype.reStart =function(obj){
         this.stage_main.empty();
         this.isEnd =false;
         this.pCount =null;
         this.score =0;//用户得到的分数
         this.maxScore =0;//最大分数
         this.gameTime =10;//游戏时间 10秒
         this.dowmCorps = [];//下落物体集合
         this.getScoreCallBack=null;//获得的积分
         this.popdude1.visible =false;
         this.popdude2.visible =false;
         this.popdude3.visible =false;
         this.Corps =[];
         this.Bucket =[];
         this.renderer =null;
         this.stage =null;
         this.BucketDude =null;
         this.background =null;
         this.noCloud =null;//没有表情的云
         this.bigCloud=null;///大云
         this.smallCloud=null;///小云
         this.mcCloud =null;///mc 云
         this.boom =null;///便便，扣分的
         this.popIcon =null;
         this.popdude1 =null;
         this.popdude2 =null;
         this.popdude3 =null;
         this.downContainer =null;
         this.downCount =null;
         this.downText =null;
         window.corpsItem  =null;
         window.GameDownCount&& clearInterval(window.GameDownCount);
         this.start(obj||this.object);
     };
    Game.prototype.start =function(object){//开始游戏
    
         var that =this;
         this.object =$.extend({
            maxScore:199,
            getScoreCallBack:null
         },object||{});
         $.extend(this,object);
         this.gameTimeTemp =this.gameTime;
         var allHeight = $(window).height();//总高度
         var allWidth =$(window).width();
         this.init();
         this.initCorps();//掉落物初始化
         function popdudeAnimate(){//pop文字的动画
              if(that.pCount>0.1) return;
              if(!that.pCount) that.pCount=0.001;
              that.pCount+=0.0007;
              
              if(that.pCount > 0 && that.pCount < 0.03){
                that.popdude3.visible = true;
                that.popdude3.scale.set(that.pCount * 20);  
              }else if(that.pCount >= 0.03 && that.pCount < 0.06){
                that.popdude3.visible = false;
                that.popdude2.visible = true;
                that.popdude2.scale.set((that.pCount - 0.03) * 20);  
              }else if(that.pCount >= 0.06 && that.pCount < 0.09){
                that.popdude2.visible = false;
                that.popdude1.visible = true;
                that.popdude1.scale.set((that.pCount - 0.06) * 20); 
              }

              if(that.pCount>=0.1){
                downCountAnimate();
                setTimeout(function(){
                    that.popdude1.visible =false;
                },300);
              }
         };
          {//动态加上云朵
             var addCorpsNum =1;
             var lastCorps =null;
             function downCountAnimate(){
                     window.GameDownCount = setInterval(function(){
                        var item =RandomCorps();
                        if(item!=false){
                            EachArr.push(item);
                            lastCorps = item;
                            addCorpsNum++;
                        }else{ 
                        if((addCorpsNum==that.Corps.length-1)&&(lastCorps.dude.position.y>allHeight)){
                            var tag =true;
                            for(var i=EachArr.length-20;i<EachArr.length;i++){
                                if(EachArr[i].dude.position.y<allHeight){
                                    tag=false;
                                }
                            }
                            if(tag){
                              that.end();
                            }
                        }
                      }   
                     },300);
             }
        }
        {//掉落物的功能模块
            window.CorpsObj =  getRandomCorps();
            var RandomCorps = CorpsObj.getCorps;
            var EachArr =[];
            EachArr.push(RandomCorps());

           function getRandomCorps(){//取出随机不重复掉落物
            var arrRandom=[];
            var min =0;
            var max = that.Corps.length-1;
            function random(min,max){
                return Math.floor(min+Math.random()*(max-min));
            }

            return {  getCorps: function(){
                    var randomIndex = random(min,max);
                    var tag = false;
                    var l =  that.Corps.length;
                    while(l>0){
                        l--;
                        if(arrRandom.indexOf(randomIndex) ==-1){
                            tag =true;
                            arrRandom.push(randomIndex);
                            break;
                        }else{
                            randomIndex = random(min,max);
                        }
                    }
                    if(tag){
                        return that.Corps[randomIndex];
                    }else{
                        return false;
                    }    
            },clear:function(){
               arrRandom=null;
                
            }
            
           }


         
          };
           function getEachArr(){
            var arr =[];
            that.perSecondLen = that.Corps.length%that.gameTimeTemp==0?that.Corps.length/that.gameTimeTemp:(that.Corps.length/that.gameTimeTemp+1); 
               for(var i=0;i< that.perSecondLen;i++){
                  var item =RandomCorps();
                  if(item!=false){
                     arr.push(RandomCorps());
                  }
               }
               return arr;
         };
           function corpsAnimate(){//云朵动画
            if(that.popdude1.visible==false){
               for(var i=0;i<EachArr.length;i++){
                   if((!EachArr[i])||EachArr[i].isCompleter==true){
                       continue;
                   }
                   EachArr[i].dude.position.y +=  EachArr[i].speed;
                   EachArr[i].dude.rotation +=EachArr[i].rotation;
                   if(window.smallCorpsSpecial){
                         that.Bucket.removeChild();
                         for(var k=0;k<window.smallCorpsSpecial.length;k++){
                            var sm= smallCorpsSpecial[k];
                             sm.setPlace();
                             sm.dude.rotation+=sm.rotation;
                             sm.dude.visible = true;
                         }
                   }
                   EachArr[i].calculateTarget(function(ishit,target){
                        if(ishit&&!target.ishit){//表示命中
                           target.ishit =true;//标记已经命中
                           if(target.classify.name=="boom"){//命中炸弹
                              target.setSpecialEffects(function(){
                                    
                                    that.end();    
                              });
                              return;
                           }
                           target.dude.visible =false;//隐藏
                           if(that.score==0){
                              that.Bucket.addChild();
                           }
                           that.score +=  target.classify.score;//累加分数
                           
                           if(that.score<10){
                               that.downText.text = "x 0" + that.score;
                           }else{
                               that.downText.text = "x " + that.score;
                           }
                           if(that.score>99){
                             that.downText.position.x = allWidth - 63;
                           }
                           if(that.getScoreCallBack){
                              that.getScoreCallBack(that.score);
                           }
                        }else{
                        }
                    });
                   if(EachArr[i].dude.position.y>allHeight){
                      EachArr[i].dude.visible =false;
                      EachArr[i].isCompleter = true;
                  
                   }
               }
            }
         };
        } 
         that.isEnd =false;

         function animate() {
              if(that.isEnd) {
                return;
              }
              popdudeAnimate();
              corpsAnimate();
              window.game_re = requestAnimationFrame(animate);
              that.renderer.render(that.stage);//重新渲染
         };
        animate();//开始

        
        object&&object.callBack&&object.callBack(that);//回调函数
    };
    Game.prototype.end =function(object){//结束游戏
          
          this.isEnd =true;
          for(var i=0;i<this.Corps.length;i++){
              this.Corps[i].dude.visible =false;
          }
          this.Corps =[];
          if(object&&object.getScoreCallBack){
             object.getScoreCallBack(this.score);
          };
         this.endCallBack && this.endCallBack(this.score);
         window.GameDownCount && clearInterval(window.GameDownCount);
         window.cancelAnimationFrame(window.game_re);
         window.smallCorpsSpecial =null;
         window.CorpsObj.clear();
    };
    Game.prototype.getScore =function(){//获取游戏
         return this.score;
    };
    Game.prototype.downCountFn = function(){
             
              this.downContainer = new PIXI.Container();
              var d_bg = PIXI.Texture.fromImage('images/icon-game-count.png');
              this.downCount = new PIXI.Sprite(d_bg);
              this.downCount.scale.set(0.8);
              this.downCount.position.x = 10;
              this.downCount.position.y = 10;
              this.downCount.anchor.x = 0;
              this.downCount.anchor.y = 0;
              this.downContainer.addChild(this.downCount);
   
              this.downText = new PIXI.Text("x 0"+this.score);
              this.downText.style.align ="center";
              this.downText.style.stroke = "#fdee9e";
              this.downText.style.fill = "#fdee9e";
              
              this.downText.width=90;
              this.downText.height =40;
              this.downText.scale.set(0.7);
              this.downText.position.x = 58;
              this.downText.position.y = 20;
              this.downText.anchor.x = 0;
              this.downText.anchor.y = 0;
              this.downContainer.addChild(this.downText);
              this.stage.addChild(this.downContainer);
    };
   }
   /***********游戏对象结束***********/


  /***********下落的物体/***********/
   {
       function Corps(that){
            function random(min,max){
                return Math.floor(min+Math.random()*(max-min));
            }
          this.itemArr =[];
          window.corpsItem  =  function(that,url,classify,isHide){
              this.classify = classify;
              this.speed= classify.speed+Math.random()*2;
              var r = classify.rotation+(Math.random()/100);
              if(random(0,10)%2==0){
                 r =-r;
              }else{
                
              }
              this.rotation =r;
              this.tt = PIXI.Texture.fromImage(url);
              this.dude = new PIXI.Sprite(this.tt);
              if(isHide){
                 this.dude.visible =false;
              }
              this.px=random(40,$(window).width()-40);
              this.py=-100;
              this.dude.scale.set(0.7);
              this.dude.position.x = this.px;
              this.dude.position.y = this.py;
              this.dude.anchor.x = 0.5;
              this.dude.anchor.y = 0.5;
              that.stage.addChild(this.dude);
          };
          corpsItem.prototype.calculateTarget =function(fn){//计算是否命中
                    var width = that.BucketDude.width;
                    var height =  that.BucketDude.height;
                    var width2 = this.dude.width;
                    var b_x  =that.BucketDude.x;
                    var b_y  =that.BucketDude.y;
                    var t_x =  this.dude.position.x;
                    var t_y =  this.dude.position.y;
                    var dis_x_right = b_x + width/2;
                    var dis_x_left = b_x -width/2;
                    if(t_y<0){ return;};
                    if(t_x<dis_x_right&&t_x>dis_x_left&& Math.abs(t_y-(b_y-height/2))<5){
                        fn&&fn(true,this);
                    }
          };

         corpsItem.prototype.setSpecialEffects =function(fn){//爆炸特效
            for(var i=0;i<that.Corps.length;i++){
              that.Corps[i].dude.visible =false;
              that.Corps[i].ishit =true;
            }
            window.smallCorpsSpecial=[];//爆炸散开的云朵
            for(var i=0,len=30;i<len;i++){
              var item = new corpsItem(that,that.emptyCloud.url,that.smallCloud,true);
                 item.dude.position.x = that.BucketDude.position.x;
                 item.dude.position.y = that.BucketDude.position.y;
                 var randomNum = Math.random();
                 var r = (randomNum > .3) ? 5 * Math.random() : 5;
                 item.angle = 2 * Math.PI * Math.random();
                 item.dx = r * Math.sin(item.angle);
                 item.dy = r * Math.cos(item.angle) - 4;
                 item.setPlace =function(){
                    this.dude.position.x+=this.dx/3.5;
                    this.dude.position.y+=this.dy/3.5;
                 };
              smallCorpsSpecial.push(item);  
            }
             setTimeout(function(){
                 fn&&fn();
             },1000);
          };

          for(var i=0,len=that.bigCloud.count;i<len;i++){
              this.itemArr.push(new corpsItem(that,that.bigCloud.url,that.bigCloud));
          }
          for(i=0,len=that.smallCloud.count;i<len;i++){
               this.itemArr.push(new corpsItem(that,that.smallCloud.url,that.smallCloud));  
          }
          for(i=0,len=that.boom.count;i<len;i++){
               this.itemArr.push(new corpsItem(that,that.boom.url,that.boom));   
          }
          for(i=0,len=that.noCloud.count;i<len;i++){
               this.itemArr.push(new corpsItem(that,that.noCloud.url,that.noCloud));     
          }
          for(i=0,len=that.mcCloud.count;i<len;i++){
               this.itemArr.push(new corpsItem(that,that.mcCloud.url,that.mcCloud));     
          }
       };
      Corps.prototype.getCorps =function(){
          return this.itemArr;
      };




    }
  /***********下落的物体结束***********/


   /***********爆米花桶***********/
   {
      function Bucket(that){
           var this_Bucket =this;
           var  loader =  PIXI.loader.add('images/icon-bag.png').load(function(){
                this_Bucket.Bucket = PIXI.Texture.fromImage('images/icon-bag.png');
                that.BucketDude = new PIXI.Sprite(this_Bucket.Bucket);
                that.BucketDude.scale.set(0.6);
                that.BucketDude.anchor.x = 0.5;
                that.BucketDude.anchor.y = 0.5;
                that.BucketDude.position.x = that.renderer.width/2;
                that.BucketDude.position.y = that.renderer.height-that.BucketDude.height/2-5;
                that.stage.addChild(that.BucketDude);
                this_Bucket.BucketDude= that.BucketDude;
                this_Bucket.dragging(that);
                loader.resources['images/icon-bag.png'] =null;
            });

      };
      Bucket.prototype.getBucket =function(){
          return this.BucketDude;
      };
      Bucket.prototype.dragging =function(that){//桶拖动
        that.BucketDude.interactive = true;
        that.BucketDude.buttonMode = true;
        that.BucketDude.on('mousedown', onDragStart).on('touchstart', onDragStart)
        .on('mouseup', onDragEnd)
        .on('mouseupoutside', onDragEnd)
        .on('touchend', onDragEnd)
        .on('touchendoutside', onDragEnd)
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove);
        function onDragStart(event){
            this.data = event.data;
            this.dragging = true;
        };
        function onDragEnd(){
            this.dragging = false;
            this.data = null;
        };
        function onDragMove(){
            if (this.dragging){
                var newPosition = this.data.getLocalPosition(this.parent);
                var x = newPosition.x;
                if(x<that.BucketDude.width/2){
                   x=that.BucketDude.width/2;
                }
                if(x> that.renderer.width - that.BucketDude.width/2){
                  x = that.renderer.width - that.BucketDude.width/2;
                }
                this.position.x = x;

            }
        }
      };
      Bucket.prototype.addChild =function(){
              var sm = PIXI.Texture.fromImage('images/icon-pop-small.png');
              var sms = new PIXI.Sprite(sm);
              sms.scale.set(1.5);
              sms.anchor.x = 0;
              sms.anchor.y = 0;
              sms.position.x =  - this.BucketDude.width+50;
              sms.position.y =  - this.BucketDude.height;
              this.sms = sms;
              this.BucketDude.addChild(this.sms);

              var sm = PIXI.Texture.fromImage('images/icon-pop-small.png');
              var sms = new PIXI.Sprite(sm);
              sms.scale.set(1.5);
              sms.anchor.x = 0;
              sms.anchor.y = 0;
              sms.position.x =  - this.BucketDude.width+100;
              sms.position.y =  - this.BucketDude.height;
              this.sms2 =sms;
              this.BucketDude.addChild(this.sms2);

              var sm = PIXI.Texture.fromImage('images/icon-bag.png');
              var sms = new PIXI.Sprite(sm);
              sms.anchor.x = 0.5;
              sms.anchor.y = 0.5;
              this.sms3 =sms;
              this.BucketDude.addChild(this.sms3);
              
        };
         Bucket.prototype.removeChild =function(){
              
              this.BucketDude.removeChildren();
             
         }

   }
   /***********爆米花桶结束***********/
  
})(window,Zepto);