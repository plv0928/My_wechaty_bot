const {Wechaty} =require("wechaty")//wechaty核心包
const {PuppetPadplus} =require("wechaty-puppet-padplus")//padplus协议包
const config =require("./config")



//初始化bot
const bot = new Wechaty({
    puppet:new PuppetPadplus({
        token:config.token
    }),
    name:config.name
})

//初始化监听事件
const onScan =require("./onScan")
const onRoomJoin =require("./onRoomJoin")
const onMessage =require('./onMessage')
const onFriendShip = require('./onFriendShip')

//初始化定时任务
const {myCronJob} =require("./cron")

bot
    .on("scan",onScan)//机器人需要扫描二维码时监听
    .on("room-join",onRoomJoin)//加入房间监听
    .on("message",onMessage(bot))//消息监听
    .on("friendship",onFriendShip)//好友添加监听
    .on("login",(user=>{
        console.log(`用户${user}登录成功`)
        myCronJob(bot)
    }))
    .start()
