const express = require("express");
const pool = require("../pool");

const router = express.Router();

//推荐
router.get("/",(req,res)=>{
    let output={
       recommend:[],
       two_p:[],
       two_m:[],
       carousel:[],
       hot:[],
       other:[]
    };
let r_sql = `SELECT pid,pic,tip,auther,avatar,good FROM poco_index_recommend WHERE good!=0 ORDER BY good DESC`;
pool.query(r_sql,[],(err,result)=>{
    if (err) throw err;
    output.recommend=result;

//手机航拍
    let t_sql = `SELECT pid,pic,pic_info,kind FROM poco_index_two WHERE kind = 1`;
    pool.query(t_sql,[],(err,result)=>{
        if (err) throw err;
       output.two_p=result;  
       let t_sql = `SELECT pid,pic,pic_info,kind FROM poco_index_two WHERE kind = 2`;
    pool.query(t_sql,[],(err,result)=>{
        if (err) throw err;
       output.two_m=result;  
    
//轮播
let c_sql = `SELECT pid,pic,pic_info_title,pic_info FROM poco_index_carousel`;
    pool.query(c_sql,[],(err,result)=>{
        if (err) throw err;
       output.carousel=result;  
   
    //热门
    let h_sql = `SELECT uid,hname,bg_img,avatar,hot_info FROM poco_index_hot`;
    pool.query(h_sql,[],(err,result)=>{
        if (err) throw err;
       output.hot=result;  
    
    //其他
    let o_sql = `SELECT pid,pic,tip,pic_info FROM poco_index_other`;
    pool.query(o_sql,[],(err,result)=>{
        if (err) throw err;
       output.other=result; 
       res.send(output) 
    })
    })
    })
    })
})
})
})


module.exports = router