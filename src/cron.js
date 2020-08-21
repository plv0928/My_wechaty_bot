const { CronJob } = require("cron")
const { mysqlPool } = require("./mysqlconnection")
const { dateFtt } = require("../utils/formatTime")

/**
 * @description 定时任务
 */
/**
 * 每天凌晨00:00是从数据库获取今天的定时任务
 */
async function myCronJob(bot) {
    await getDayTask(bot)
    await pushFundInfo(bot)
}
//获取当日的定时任务
async function getDayTask(bot) {
    console.log("正在查询今天的定时任务")
    var dailyTasks
    //查询当天任务的sql
    let sql = 'SELECT * FROM calendar where DATE_FORMAT(taskTime,"%y%m%d")=DATE_FORMAT(now(),"%y%m%d")'
    //当机器人上线时查询当天的任务
    dailyTasks = await mysqlPool(sql)
    console.log("查询成功，正在分发定时任务")
    //每天凌晨时重置当天的任务
    new CronJob('00 00 00 * * *', async function () {
        console.log("到凌晨了，要查询今天的任务了")
        dailyTasks = await mysqlPool(sql)
        console.log("查询成功，正在分发定时任务")
        await sendCronTask(bot, dailyTasks)
    }, null, true, 'Asia/Shanghai');
    await sendCronTask(bot, dailyTasks)
}
//发送定时提醒
async function sendCronTask(bot, list) {
    // console.log(list) 
    for (let i = 0; i < list.length; i++) {
        var _time = dateFtt(list[i].taskTime)
        // console.log(_time)
        var cronTime = `${_time.ss} ${_time.mm} ${_time.hh} * * *`
        // console.log(cronTime)
        new CronJob(cronTime, async function () {
        let message=''
            const contactByName = await bot.Contact.find({ name: list[i].objectName })
            if (list[i].objectName == "my") {
                 message = list[i].content
            } else {
                 message = `${list[i].initiateName}给您发了一个提醒，他说：${list[i].content}`
            }
            contactByName.say(message)
        }, null, true, 'Asia/Shanghai')
        // console.log(list[i].taskTime)
    }
}
//每天下午2点半定时推送今天基金信息
async function pushFundInfo(bot){
    let sql = 'SELECT * from fund_info'
    await mysqlPool(sql).then((res)=>{
        console.log("查询需要提示的基金列表")
        console.log(res)
    }).catch((err)=>{
        console.log("基金推送出错"+err)
    })
}
module.exports = {
    myCronJob
}