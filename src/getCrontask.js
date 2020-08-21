//引入mysql连接池
const { mysqlPool } = require("./mysqlconnection")
//引入时间处理函数
const { dateFtt } = require("../utils/formatTime")
/**
 * 增加提醒任务
 */
async function addCronTask(msg, name, bot) {
    // console.log(name)
    let returnMsg = ""
    let date = getToday()
    // console.log(name)
    let str = msg.split(" ")
    let objectName = str[1]||" "
    const isFriend = await bot.Contact.find({ name: objectName })
    //判断是否提醒自己
    if (objectName == "我" || objectName == "自己") {
        objectName = name
    }
    //判断是否是机器人的好友
    if (isFriend != null) {
        return returnMsg = `${objectName}暂时不是我的好友，\n请把我推荐给他（她），验证消息上填写工具人既可以自动添加我了，啾咪`
    }
    //判断是否设置指定日期任务
    if (str[2] && str[2].indexOf("-") > -1) {
        if (str.length < 4) {
            returnMsg = `提示功能的正确用法\n提醒 需要提醒人的名称 2019-09-10 10:00 工作再忙，也要记得喝水\n每个关键字之间记得加空格哦，切记提示内容不要加空格`
            return returnMsg

        }
        console.log("已经设置指定日期时间任务")
        // date=str[2]
        var time = str[2] + " " + str[3]
        var sql = `INSERT INTO calendar (objectName,initiateName,taskTime,content) VALUES ('${objectName || ""}','${name || ""}','${time || ""}','${str[4] || ""}')`

    } else {
        console.log("已经设置当天任务")
        if (str.length < 3) {
            returnMsg = `提示功能的正确用法\n提醒 需要提醒人的名称 2019-09-10 10:00 工作再忙，也要记得喝水\n每个关键字之间记得加空格哦，切记提示内容不要加空格`
            return returnMsg

        }
        var time = date + str[2]
        var sql = `INSERT INTO calendar (objectName,initiateName,taskTime,content) VALUES ('${objectName || ""}','${name || ""}','${time || ""}','${str[3] || ""}')`
    }
    // console.log(sql)
    await mysqlPool(sql).then((res) => {
        //  console.log(res)
        returnMsg = `本工具人已经把你的提醒牢记在小本本上`
    }).catch((err) => {
        returnMsg = `提示功能的正确用法\n提醒 需要提醒人的名称 2019-09-10 10:00 工作再忙，也要记得喝水\n每个关键字之间记得加空格哦，切记提示内容不要加空格`
    })
    //加入提醒任务sql
    return returnMsg
}
//获取今天日期
function getToday() {
    const date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    return year + "-" + month + "-" + day + " "
}

module.exports = {
    addCronTask
}