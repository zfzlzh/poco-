$(function(){
    //搜索框事件
    let select = $(".select")
    $(".right>div>svg").click(function(){
        select.addClass("hasBlock")
       
    });
  
    select.click(function(e){
        e.stopPropagation();
    })
    //下拉框
    let $downdrop = $(".select>div:first-child>svg");
    let $selected = $(".select>div:first-child");
    let $sel_content = $(".select>div:nth-child(2)");
    let $sel_li = $(".select>div:nth-child(2)>ul>li")
    $selected.click(function(){
        $sel_content.toggleClass("hasBlock");
        if($sel_content.hasClass("hasBlock"))
        $downdrop.html(`<use xlink:href="#icon-plus-select-up"></use>`)
        else
        $downdrop.html(`<use xlink:href="#icon-plus-select-down"></use>`)
    });
    $sel_li.click(function(e){
        let value = $(e.target).html();
        $(".select>div:first-child>span").html(value);
        $sel_content.removeClass("hasBlock");
        $downdrop.html(`<use xlink:href="#icon-plus-select-down"></use>`)
    })
    $(".left>div:nth-child(2)>ul>li").hover(function(){
       $(this).children(".submenu").children("li").toggleClass("fadeMenu")
    })
    // 回到顶部
    let $top = $(".top")
    $(window).on("scroll",
        function(){
            document.body.scrollTop || document.documentElement.scrollTop;
                if($(document).scrollTop()>450){
                    $top.css("display","block")
                 }else{
                    $top.css("display","none")
                 }
        }
    )
    $top.click(function(){
        $("html,body").animate({scrollTop:0},300)
    })
		//登陆更换
				if(sessionStorage.getItem("uname")){
            var uname=sessionStorage.getItem("uname");
						let reg_html = `
								<div id="top-button">
            <h4 class="tab2">欢迎回来，${uname}</h4>
						<h4 class="tab3">注销</h4>
						</div>	`
           $(".reg").html(reg_html)
            $("#top-button>.tab3").on("click",function(){
                sessionStorage.removeItem("uname");
                window.location.href=location.href;
            })
        }else{
            $(".reg").html(`<div class="notLogin"><a href ="login.html">登陆/注册</a></div>`)
        }
})