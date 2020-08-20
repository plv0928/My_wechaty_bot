const mysql =require('mysql');//引入mysql组件
const config=require("./config")//引入配置文件
const {database,user,password,host,port}=config.mysqlConfig
/**
 * @description 数据库连接池
 */
async function mysqlPool(sql){
    const pool=mysql.createPool({
       connectionLimit:10,//连接数量 
       host,
       user,
       password,
       database,
       port
    })
    return new Promise(function(resolve,reject){
        pool.query(sql,function(err,results,fields){
            if(err){
                console.log(err)
                reject(err)
            }
            resolve(results)
            // console.log(results)
        })
    })
}

module.exports={
    mysqlPool
}