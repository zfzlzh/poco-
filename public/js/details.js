
$(function(){
//   引入头
        $(".header").load("header2.html");
//导入数据
        let pid = location.search.slice(5);
        let pno = 1;
        //监听按钮事件
        //监听加载更多按钮点击事件，当点击时页码加1并执行getMore函数
        $(document).on("click",".more",function(){
                pno++;
                getMore(pno,pageSize);
        })
        let pageSize = 7;
        let counter=0;
        $.ajax({
        url:"http://127.0.0.1:3000/details",
        type:"get",
        data:{pid,pno,pageSize},
        dataType:"json"
        })
        .then(function(res){
            let {pic,info,medal,saying,saying_len,reco,emoji}=res;
//信息区
        //作者
            let {pname,auther,avatar,auther_info,good,visiter,pic_info,date_time,kind}=info[0];
           
            $(".pic-auther>div:first-child>img").attr("src",avatar);
            $(".pic-auther>div:nth-child(2)>p:first-child").html(auther);
            $(".pic-auther>div:nth-child(2)>p:last-child").html(auther_info);
        //作品名
            let title_html=` <div>${pname}</div>
            <div>
                <p  title="点赞"><svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-zan1"></use>
              </svg><span>${good}</span></p>
                <p title="评论数"><svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-xinxi"></use>
              </svg><span>${saying_len.length}</span></p>
                <p title="浏览次数"><svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-eye"></use>
              </svg>${visiter}</p>
            </div>`;
            let $title = $(".pic-title");
            $title.html(title_html)
            //点赞
            let $good=$(".pic-title>div:last-child>p:first-child>svg");
            
            $good.on("click",function(){
                let good_num=parseInt(good)+1;
                $.ajax({
                   url:"http://127.0.0.1:3000/details/good",
                   type:"post",
                   data:{"content":good_num,pid},
                   dataType:"json"   
                }).then(function(very){
                        if(!$good.hasClass("check_good")){
                                if(very.code == 2){
                                        $good.addClass("check_good");
                                        $(".pic-title>div:last-child>p:first-child>span").html(good_num)
                                                }
                        }    
                })
            })
        //勋章
            let medal_html ="";
            for(let m of medal){
                let {medal}=m;
                medal_html+=`<p><img src="${medal}"></p>`
            }
            let $medal=$(".pic-medal");
            $medal.html(medal_html)
        //底端信息
            $(".under-info>div:first-child").html(pname);
            $(".under-info>div:nth-child(2)>div:last-child").html(`${visiter}浏览`);
            $(".under-des>div>p:first-child>span").html(date_time);
            $(".under-des>div>p:nth-child(2)>span").html(kind);
            $(".under-info>div:last-child").html(pic_info);
            
//图片区
        //小图列
                let p_html = "";
                for(let p of pic){
                        let {cid,small_pic,big_pic}=p;
                        p_html+=`<li><img src="${small_pic}" data-big="${big_pic}" data-cid="${cid}"></li>`
                }
                let line_pic = $(".line-pic>ul");
                line_pic.html(p_html);
        //大图替换
                let move = 0;
                 let $li = line_pic.children();
                 let $li_img = $(".line-pic>ul>li>img");
                 let $big_pic = $(".big-pic>div>div:first-child>img");
                 let $first_li = line_pic.children().first();
                $first_li.addClass("opa")
                 $li_img.on("click",function (e){
                        
                        if(e.target.nodeName == "IMG"){
                                //获取这个小图里的data-big的值，即大图的src
                            let change = $(e.target).attr("data-big");
                            //给当前的小图框加上class名opa，使其opacity属性变成1
                            $(e.target).parent().addClass("opa").siblings().removeClass("opa")
                            //替换大图的src属性
                           $big_pic.attr("src",change)
                           //点击后更改move的值以及第一个li的ml属性
                           move =parseInt($(e.target).attr("data-cid")) -1;
                           $first_li.css("margin-left",`-${move*150}px`);
                           //更改页码
                           let $id= $(e.target).attr("data-cid");
                        $(".pic_num>div:nth-child(2)").html(`${$id}/${pic.length}`)
                        }
                        boom();
                });
        //大图点击事件
                $big_pic.on("click",function(){
                      $(this).toggleClass("out-pic")
                })
        //左右箭头
                let leftBtn = $(".arrow>div:first-child");
                let rightBtn = $(".arrow>div:last-child");
                leftBtn.addClass("disabled")
                //左箭头
                leftBtn.on("click",function(){
                   let $l_btn = $(this);
                        //如果箭头没有disabled这个属性执行
                    if(!$l_btn.hasClass("disabled")){
                       move--;
                       //li里面下标为move的标签添加class名opa同时移除其他同辈li标签的opa
                       $li.eq(move).addClass("opa").siblings().removeClass("opa");
                       //获取下标为move的li的子辈的data-big的值替换大图
                      let change= $li.eq(move).children().attr("data-big");
                        $big_pic.attr("src",change);
                        //获取下标为move的li的子辈的data-cid的值替换当前图片页码
                        let $id= $li.eq(move).children().attr("data-cid");
                        $(".pic_num>div:nth-child(2)").html(`${$id}/${pic.length}`)
                          //将首个li添加ml属性，使其移动 同时消除右箭头的disabled属性           
                        $first_li.css("margin-left",`-${move*150}px`);
                        rightBtn.removeClass("disabled");
                        boom();
                        //当move为0时，添加disabled属性
                        if(move ==0){
                        $l_btn.addClass("disabled")
                         }
                    }     
                })
                //右箭头 同左箭头
                rightBtn.on("click",function(){
                        
                        let $r_btn = $(this)
                        if(!$r_btn.hasClass("disabled")){
                          move++;
                         $li.eq(move).addClass("opa").siblings().removeClass("opa");

                        let change= $li.eq(move).children().attr("data-big");   
                        $big_pic.attr("src",change)

                        let $id= $li.eq(move).children().attr("data-cid");
                        $(".pic_num>div:nth-child(2)").html(`${$id}/${pic.length}`)
                               
                        $first_li.css("margin-left",`-${move*150}px`);
                        leftBtn.removeClass("disabled");
                        boom();
                        if(pic.length-1== move){
                                $r_btn.addClass("disabled")
                                }
                        } 
                })
        //页码
                 let n=1;
                 $(".pic_num>div:nth-child(2)").html(`${n}/${pic.length}`)
        // 评论总条数
            $(".all-num").html(`${saying_len.length}条评论`)
        
        //发表评论
                let $submit = $(".report>div>button");
                $submit.on("click",function(){
                let $write = $("textarea[name='think']").val();
                let $len = emoji.length;
                //发送请求回后台更新数据库
                $.ajax({
                        url:"http://127.0.0.1:3000/details/comment",
                        type:"post",
                        data:{"content":$write,pid,"len":$len},
                        dataType:"json"
                })
                .then(function(com){
                        if(com.code == 1){
                                $("textarea[name='think']").val("");
                                window.location.reload()
                        }  
                })
                })
        
        //评论区
              let say_html="";
              for(let s of saying){
                let {say_content,sayer,say_date_time,say_avatar}=s;
                say_html+=` <div>
                <div><img src="${say_avatar}" alt=""></div>
                <div class="saying-content">
                    <div><a href="javascript:;">${sayer}</a>
                        <a>${say_date_time}</a></div>
                    <div>${say_content}</div>
                    <div><a href="javascript:;">回复</a>
                        <a href="javascript:;">举报</a></div>
                </div>  
            </div>`
              }
              $(".saying").html(say_html);
              $(".saying>div").addClass("moveIn")
        //为你推荐
              let reco_html="";
              for(let re of reco.slice(0,4)){
                let{rid,img,human,size,good,head,see_man}=re;
                reco_html+=`<div>
                <a href=""> <img src="${img}" alt=""></a>
                 <div>
                     <p>${size}<svg class="icon" aria-hidden="true">
                     <use xlink:href="#icon-yemian"></use>
                   </svg></p>
                     <p> ${see_man}浏览</p>
                 </div>
                 <div class="reco-auther">
                     <div><a href="javascript:;"><img src="${head}" alt=""></a></div>
                     <div><span>${human}</span></div>
                     <div  data-rid="${rid}"><svg class="icon" aria-hidden="true">
                     <use xlink:href="#icon-zan1"></use>
                   </svg><span>${good}</span></div>
                 </div>
             </div>`
              }
              let $reco = $(".reco-pic")
              $reco.html(reco_html)
              //点赞
              let $other_good = $(".reco-auther div:last-child")
              $other_good.on("click",function(){
                      //获取当前框的data-rid值与其子代中点赞框的html内容
                      let $rid=$(this).attr("data-rid");
                      let ggood =$(this).children("span").html()
                      //点击一次数值加1
                let ggood_num=parseInt(ggood)+1;
                //发送请求回后台更新数据库内容
                $.ajax({
                   url:"http://127.0.0.1:3000/details/other",
                   type:"post",
                   data:{"content":ggood_num,"rid":$rid},
                   dataType:"json"   
                }).then((other)=>{
                        //设定条件当点赞图片没有class名check_good时才执行点赞行为并更新点赞数
                        if(!$(this).children("svg").hasClass("check_good")){
                                if(other.code == 3){
                                        $(this).children("svg").addClass("check_good");
                                        $(this).children("span").html(ggood_num)
                                                }
                        }    
                })
              })
        
        //表情包
                let emo_html="";
                for(let emo of emoji){
                        let {e_pic,title}=emo;
                        emo_html+=`<div><img src="${e_pic}" title="${title}"></div>`
                }
                let $emoji=$(".report>div>.emoji>i")
                $emoji.before(emo_html);
                //表情包点击事件进入进出效果
                $(".report>div>div:first-child").on("click",function(){
                        $emoji.parent().removeClass("bye").addClass("suprise")
                })
                $(".report>div>.emoji>i").on("click",function(){
                        $emoji.parent().removeClass("suprise").addClass("bye")
                })
                // 表情包插入
                let $sup =$(".report>div>.emoji>div>img");
                $sup.on("click",function(){
                        //获取该表情包的title的值
                let $owo = $(this).attr("title")
                //将表情包与文本框内容连接并更新文本框内容
              let $o_o= $("textarea[name='think']").val().concat(`[${$owo}]`)
              $("textarea[name='think']").val($o_o)
                })

        //关注
     $(".pic-auther>div:last-child>span").on("click",function(){
        $(".jump").css({"opacity":1,
        "z-index":999
        })
        setTimeout(function(){
                 $(".jump").css({"opacity":0,
                "z-index":-1
                }) 
        },4000)
        if(sayer == "匿名"){
                $(".jump").html("请先登陆")
        }else{
                $(".jump").html("关注成功");
                $(this).html("已关注")   
        }
                })
        });
// 数据导入结束
        //加载更多函数 
        function getMore(offset,size){
                $.ajax({
                url:"http://127.0.0.1:3000/details?pid="+pid+"&pno="+offset+"&pageSize="+size,
                type:"get",
                dataType:"json"      
                }).then(function(res){
                        let {saying}=res;
                        let say_html="";
                        for(let new_s of saying){
                                let {say_content,sayer,say_date_time,say_avatar}=new_s;
                                say_html+=` <div>
                                <div><img src="${say_avatar}" alt=""></div>
                                <div class="saying-content">
                                    <div><a href="javascript:;">${sayer}</a>
                                        <a>${say_date_time}</a></div>
                                    <div>${say_content}</div>
                                    <div><a href="javascript:;">回复</a>
                                        <a href="javascript:;">举报</a></div>
                                </div>  
                            </div>`
                              }
               counter++;
               console.log(counter);
                $(".saying").append(say_html); 
                $(".saying>div").addClass("moveIn")
                let say_len = $(".pic-title>div:nth-child(2)>p:nth-child(2)>span").html()
                let $count_num=parseInt(say_len)/parseInt(pageSize);
                console.log(say_len)
                if(counter>=parseInt($count_num)){
                 $(".more").css("display","none")       
                }
                })
        }
  
//为您推荐效果
        $(window).on("scroll",function(){
                document.body.scrollTop || document.documentElement.scrollTop;
                if($(document).scrollTop()>750){
                $(".reco-pic>div>a>img").css("opacity","1");
                $(".reco-pic>div>div").addClass("anim")
                }
        })


//大图切换效果
        let big_misty = "";
        for(let m = 1;m<=740;m++){
                big_misty +=`<p></p>`
        }
        $(".big-pic>div>.misty").html(big_misty);   
     //切换效果函数
     function boom(){
        $(".big-pic>div>.misty").addClass("fei")
        $(".big-pic>div>.misty>p").css("transition","all .5s ease");
        $(".big-pic>div>.misty").css("z-index","999")
       let time = setTimeout(function(){
                $(".big-pic>div>.misty>p").css("transition","none");
                $(".big-pic>div>.misty").css({"opacity":"1","z-index":"-1"});
                $(".big-pic>div>.misty").removeClass("fei")
        },500)   
              
     }
    
          


})





