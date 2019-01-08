$(function(){  
    $(".header").load("header2.html");
    $(".footer").load("footer.html");
        $.ajax({
            url:"http://127.0.0.1:3000/index",
            type:"get",
        dataType:"json"
        }).then(function(res){
            //解构
            let {recommend,two_p,two_m,carousel,hot,other}=res;
// 推荐
            let rec = "";
            for(let i of recommend){
            let {pid,pic,tip,auther,avatar,good}=i;
            rec+=`<div class="rec_info">
            <a href="http://127.0.0.1:3000/product_details.html?pid=${pid}">
                <div class="tag"><span class="t">${tip}</span></div>
                <img src="${pic}" alt="">
            </a>
            <div class = "auther">
                    <div><a href="zanbala.html"><img src="${avatar}" alt=""></a></div>
                    <div><span>${auther}</span></div>
                    <div><span>👍${good}</span></div>
            </div>
        </div>`
            }
            let $recommend = $(".recommend");
            $recommend.html(rec);

//手机航
        let two_plane = "";
        for(let t of two_p){
        let {pic,pic_info}=t;
        two_plane+=`<div>
        <a href="javascript:;"><img src="${pic}" alt="">
            <div class = "pic_font">
                <div>
                    <span>${pic_info}</span>  
                </div>
            </div>
        </a>
        <div class="fake">
            <p></p>
            <p></p>
            <p></p>
            <p></p>
            <p></p>
            <p></p>
            <p></p>
            <p></p>
            <p></p>
        </div>
    </div>`
        }
        let $plane = $(".plane");
        $plane.append(two_plane);
    //shouji
        let two_mobile= "";
        for(let m of two_m){
        let {pic,pic_info}=m;
        two_mobile+=`<div>
        <a href="javascript:;"><img src="${pic}" alt="">
            <div class = "pic_font">
                <div>
                    <span>${pic_info}</span>  
                </div>
            </div>
        </a>
        <div class="fake">
            <p></p>
            <p></p>
            <p></p>
            <p></p>
            <p></p>
            <p></p>
            <p></p>
            <p></p>
            <p></p>
        </div>
    </div>`
        }
        let $mobile= $(".mobile");
        $mobile.append(two_mobile);
//轮播图
    let car_html = "";
    for(let c of carousel){
    let {pic,pic_info_title,pic_info}=c;
    car_html+=` <div>
    <a href="javascript:;">
    <img src="${pic}" alt="">
    <div>
        <p>${pic_info_title}</p>
        <p>${pic_info}</p>
    </div>
</a></div>`
    }
    let $car = $(".carousel>.carousel_info>.carousel-pic");
    $car.html(car_html);

//热门
    let hot_html = "";
            for(let h of hot){
            let {hname,bg_img,avatar,hot_info}=h;
            hot_html+=`<div>
            <div><img src="${bg_img}" alt=""></div>
            <div><a href="javascript:;"><img src="${avatar}" alt=""><i><img src="img/index/red.png" alt=""></i></a></div>
            <div>
                <div><a href="javascript:;">${hname}</a></div>
                <div><p>${hot_info}</p></div>
            </div>
        </div>`
            }
            let $hot = $(".hot>.hot_auther");
            $hot.html(hot_html);

//其他
        let oth_html = "";
        for(let o of other){
        let {pic,tip,pic_info}=o;
        if(tip == 1){
            tip ="干点啥"
        }else if(tip == 2){
            tip = "游学院"
        }else{
            tip = "外拍"
        }
        oth_html+=`<div>
        <a href="javascript:;">
            <div class="tag"><span class="t">${tip}</span></div>
            <img src="${pic}" alt="">
        </a>
        <div class = "pic_font">
                <div>
                    <span>${pic_info}</span>  
                </div>
            </div>
        </div>`
        }
        let $other = $(".other>div");
        $other.before(oth_html);

        })

    //推荐，滚动事件
let $recommend = $(".recommend");

$(window).on("scroll",
    function(){
        document.body.scrollTop || document.documentElement.scrollTop;
            if($(document).scrollTop()>450){
                $recommend.children("div").addClass("bbq");
            }        
    }
)

//图片浮框
$recommend.on("mouseenter",".rec_info",
    function(){
 $(this).children(".auther").removeClass("rotateOut").addClass("bounce");
})
$recommend.on("mouseleave",".rec_info",function(){
    $(this).children(".auther").removeClass("bounce").addClass("rotateOut");
})


  //轮播图
 let div = $(".carousel-pic");
  let i = 0;
 let datas = [
     {'z-index': 6, opacity: 1, width: 650, height: 370, top: -23, left: 390},//5
     {'z-index': 4, opacity: 0.8, width: 560, height:310, top:4, left: 200},//1
     {'z-index': 3, opacity: 0.1, width: 480, height: 223, top: 48, left: 306},//2
     {'z-index': 2, opacity: 0.1, width: 480, height: 223, top: 48, left:616},//3
     {'z-index': 3, opacity: 0.8, width: 560, height: 310, top: 4, left: 673},//4
 ]
 function move() {
     /*图片分布*/
     for (var i = 0; i < datas.length; i++) {
         var data = datas[i];
        div.children("div").eq(i).css('z-index',data['z-index']);
        div.children("div").eq(i).stop().animate(data, 1200);
     }
 }
 move();
 // // 左右标签
 var leftArrow = $(".carousel>.carousel_info>.arrow>div:first-child");
 var rightArrow =$(".carousel>.carousel_info>.arrow>div:last-child");
 var arrow = $(".carousel>.carousel_info>.arrow>div");
 //左标签事件
 function leftBtn(){
     var last = datas.pop();
     datas.unshift(last);
     move();
  }
  leftArrow.click(
      leftBtn
  );
  //右标签
 rightArrow.click(
     function(){
         var first = datas.shift();
         datas.push(first);
         move()
     }   
 )
 //自动轮播
 var t = setInterval( leftBtn,4000)
 //悬停
 arrow.hover(
     function(){
     clearInterval(t);
 },
     function(){
         clearInterval(t);
        t= setInterval(leftBtn,5000)
     }
 )
 div.hover(
     function(){
         clearInterval(t);
     },
         function(){
             clearInterval(t);
            t= setInterval(leftBtn,5000)    
         }
 )

//侧边框事件
    let $slider = $(".index>section>slider>div:last-child");
    let $pic = $(".index>section>slider>div:first-child>img")
    $(".index>section>slider>div:first-child").click(function(){
      $slider.toggleClass("fade");
      if($slider.hasClass("fade"))
      $pic.attr("src","img/index/arrowgreenleft.png")
      else
      $pic.attr("src","img/index/arrowgreen.png")
  })

//手机航拍  爆炸
    let $fake=$(".two>div>div:last-child>div:first-child>.fake");
    let html="";
    for(let f = 1;f<=9;f++){
        html+=`<p></p>`
    }
    $fake.html(html)

    $(window).on("load",
    function() {
        $(".two>div>div:last-child>div>.fake>p").each(
            function(){
                 var a = $(this).index() % 3 * 96;
                 var b = parseInt($(this).index() / 3) * 96;
                $(this).css(
                {
                    "left":a,
                     "top": b,
                 }
             );
             })
            }  
        )
    $(window).on("scroll",
        function(){
         document.body.scrollTop || document.documentElement.scrollTop;
        if($(document).scrollTop()>1300){
         //加过渡：
         $(".fake p").css("transition","all 1s ease");
         $(".fake").addClass("fei");
        setTimeout(function(){
         //去掉过渡
             $(".fake p").css("transition","none");
             $(".fake").css({"z-index":"-1","border":"0"});
             $(".two>div>div:nth-child(2)>div>div:first-child").css({"z-index":"10",
                 "opacity":"1"
             })
             $(".two>div>div:nth-child(2)>div>a").css({"z-index":"10",
            "opacity":"1"})
             $(".two>div>div:nth-child(2)>div>a>img").css(
             "opacity","1")
         },1000);       
        } }
        )
//热门摄影师
let $hot = $(".hot_auther");
$(window).on("scroll",function(){
    document.body.scrollTop || document.documentElement.scrollTop;
    if($(document).scrollTop()>2700){
        $hot.children("div").css("animation","flash 1s linear forwards")
    }
})
//其他图片浮框
let $other = $(".other");
$(window).on("scroll",
    function(){
        document.body.scrollTop || document.documentElement.scrollTop;
            if($(document).scrollTop()>3050){
							$(".index>section>slider").css("margin-top","-10rem")
                $other.children("div").addClass("rotateDown");
                $other.children("div").children(".pic_font").addClass("ani");
             }else{
						 $(".index>section>slider").css("margin-top","2rem")
						 }

    }
)
//底部二维码

$(".other>div:last-child>div>div").hover(function(){
    $(".other>div:last-child>.bottomErweima>img").toggleClass("scan")
})

})
  