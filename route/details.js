const express = require("express");
const pool = require("../pool");

const router = express.Router();

router.get("/",(req,res)=>{
    let $pid = req.query.pid;
    let output = {
        pic:[],
        info:[],
        medal:[],
        saying:[],
        saying_len:[],
        reco:[],
        emoji:[]
    };
    //获取图片信息
        let i_sql = "SELECT pname,auther,avatar,auther_info,good,visiter,pic_info,date_time,kind FROM poco_details_info WHERE pid=?";
        pool.query(i_sql,[$pid],(err,info)=>{
            if(err) throw err;
            output.info=info;
    //获取大小图片
        let p_sql = "SELECT cid,small_pic,big_pic FROM poco_details_pic WHERE pid = ?";
        pool.query(p_sql,[$pid],(err,pic)=>{
            if (err) throw err;
            output.pic = pic;
    //获取勋章
        let m_sql = "SELECT medal FROM poco_details_medal WHERE pid = ?";
        pool.query(m_sql,[$pid],(err,medal)=>{
        if (err) throw err;
        output.medal = medal;
    //获取评论长度
        let sl_sql = "SELECT ssid FROM poco_saying WHERE pid=? ";
        pool.query(sl_sql,[$pid],(err,saying_len)=>{
        if(err) throw err;
        output.saying_len = saying_len;
    //获取评论排序并分页查询
        let pno = req.query.pno;
        let $pageSize =parseInt( req.query.pageSize);
        let $pno = parseInt((pno-1)*$pageSize)
        let s_sql = "SELECT ssid,say_content,sayer,say_date_time,say_avatar FROM poco_saying WHERE pid=? ORDER BY say_date_time DESC LIMIT ?,?";
        pool.query(s_sql,[$pid,$pno,$pageSize],(err,saying)=>{
        if(err) throw err;
        output.saying = saying;
    //获取推荐图片
        let r_sql="SELECT rid,img,human,size,good,head,see_man FROM poco_reco WHERE good!=0 ORDER BY see_man"
        pool.query(r_sql,[],(err,reco)=>{
        if (err) throw err;
         output.reco=reco;
    //获取表情包
        let e_sql="SELECT eid,e_pic,title FROM poco_emoji ";
        pool.query(e_sql,[],(err,emoji)=>{
        if(err) throw err;
        output.emoji=emoji;
             //传输回前端           
        res.send(output);
                        })
                      })
                   }) 
                })
            })
        })
    })
})
//接收发送评论
    router.post("/comment",(req,res)=>{
    let e_sql="SELECT eid,e_pic,title FROM poco_emoji ";
                        pool.query(e_sql,[],(err,emoji)=>{
                            if(err) throw err;
    let $pid = req.body.pid;
    let $content = req.body.content;
    let $len = parseInt(req.body.len);
    //转化表情包
    //设置正则表达式
    let patt1 = /\[[A-Za-z0-9]+\]/g;
    let patt2 = /\[[A-Za-z0-9]+\]/;
    //使用match（）方法检索指定的值,返回数组
    let content = $content.match(patt1);
    //如果检索到指定的值就执行
    if(content){
        //在content里执行循环
        for(let i = 0; i<content.length;i++){
            //在数据库获取的全部emoji里循环
            for(let j = 0; j<$len;j++){
                //如果数据库里有和content里相同的值，就获取数据库里该值所在的列的图片地址e_pic
                if(`[${emoji[j].title}]`== content[i]){
                    var src=emoji[j].e_pic;
                    break;
                }
            }
            //使用replace将$content中的与正则表达式相符的数据替换为图片
            $content =  $content.replace(patt2,`<img src="${src}">`)
        }
    }
    //转化表情包结束
     let $uname = req.session.uname;
     let $avatar = req.session.avatar;
        let com_sql = "INSERT INTO poco_saying VALUES(NULL,?,?,default,now(),default)";
        pid = parseInt($pid);
        pool.query(com_sql,[$pid,$content,$uname,$avatar],(err,result)=>{
            if(err) throw err;
            res.send({code:1,msg:"评论成功"})
           
        })
    })})
//接收点赞数
    router.post("/good",(req,res)=>{
        let $good = req.body.content;
        let $pid = req.body.pid;
        let good_sql="UPDATE poco_details_info SET good=? WHERE pid=?";
        pool.query(good_sql,[$good,$pid],(err,very)=>{
            if(err) throw err;
            res.send({code:2,msg:"点赞成功"})
            })
    })
//接收推荐图片点赞数
    router.post("/other",(req,res)=>{
        let $good = req.body.content;
        let $rid = req.body.rid;
        let good_sql="UPDATE poco_reco SET good=? WHERE rid=?";
        pool.query(good_sql,[$good,$rid],(err,other)=>{
            if(err) throw err;
            res.send({code:3,msg:"点赞成功"})
        })
    })







module.exports = router