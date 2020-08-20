const { CronJob } = require("cron")
const {mysqlPool} = require("./mysqlconnection")
const {Contact} = require("wechaty")
const {dateFtt} =require("../utils/formatTime")

/**
 * @description 定时任务
 */
/**
 * 每天凌晨00:00是从数据库获取今天的定时任务
 */
 async function myCronJob(bot){
        let dailyTasks= await getDayTask()
        await sendCronTask(bot,dailyTasks)
    }
//获取当日的定时任务
async function getDayTask(){
        let sql='SELECT * FROM calendar where DATE_FORMAT(taskTime,"%y%m%d")=DATE_FORMAT(now(),"%y%m%d")'
        let res=await mysqlPool(sql)
        return res
}
//发送定时提醒
async function sendCronTask(bot,list){
    for(let i=0;i<list.length;i++){
        var _time =dateFtt(list[i].taskTime)
        // console.log(_time)
        var cronTime=`${_time.ss} ${_time.mm} ${_time.hh} ${_time.dd} ${_time.MM} *`
        // console.log(cronTime)
        var dailyCron = new CronJob(cronTime,function(){
            console.log('11111111111110')
        },null,true,'Asia/Shanghai')
        // console.log(list[i].taskTime)
    }
    // return new CronJob() 
    // console.log(list)
}
module.exports={
    myCronJob
}