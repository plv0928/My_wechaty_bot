var {colorConversion} = require("./colour")

//node-requset请求包
const request = require("request")
//请求参数解码
const urlencode = require("urlencode")
//引入wechaty中message
const { Message } = require("wechaty")
//引入配置文件
const config = require("./config")
//定义机器人名称
const name = config.name
//引入管理群组列表
const {roomList} = config.room
//引入菜单
const {meun} =config

/** 
 * 封装消息监听回调
*/
module.exports=bot=>{
    return async function onMessage(msg){
        //判断消息是否来自自己，直接return
        // console.log(msg.type())
        if(msg.self()) return
        //判断此消息类型是否为文本
        if(msg.type() == Message.Type.Text){
            //判断消息类型是否来自群聊
            if(msg.room()){
                //获取群聊
                const room = await msg.room()
                //收到消息并提到本机器人
                if(await msg.mentionSelf()){
                    //获取本机器人名称
                    let self = await msg.to()
                    self = "@" +self.name()
                    //获取消息内容
                    let sendText =msg.text().replace(self,"")
                    //请求青云客机器人接口回复
                    let res =await requestRobot(sendText)
                    //返回消息，并@来自某人
                    room.say(res,msg.from())
                    return
                }
                //没有提到自己的信息进行忽略
            }else{
                //私人信息
                //判断回复是自定义关键字 当前为“加群”
                if(await isAddRoom(msg)) return
                //回复信息是锁管理的群聊名
                if(await isRoomName(bot,msg)) return
                //请求机器人聊天接口
                // let res =await requestRobot(msg.text())
                //返回聊天接口内容
                // await msg.say(res)
            }
        }else{
            console.log("消息不是文本")
        }
        
    }
}

/**
 *@description 回复信息是关键字“加群”处理函数 
 * @param {object} msg 消息对象
 * @return { Promise} true-是 false-不是
 */
async function isAddRoom(msg){
    // console.log(msg)
    //处理关键字“加群，菜单,颜色”
    if(msg.text()=="加群"){
        let roomListName = Object.keys(roomList)
        let info = `${name}当前管理群聊有${roomListName.length}个，回复群聊名即可加入哦\n\n`
        roomListName.map(v=>{
            info +="[" + v + "]"+"\n"
        })
        msg.say(info)
        return true
    }else if(msg.text()=="菜单"){
        let _meun =meun
        let _meuninfo=`${name}当前功能有${_meun.length}个，回复对应功能即可查看相应的功能哦\n\n`
        _meun.map(v=>{
            _meuninfo +="[" + v +"]"+"\n"
        })
        msg.say(_meuninfo)
        return true
    }else if(msg.text().indexOf("颜色")!= -1){
        let colorRes= await colorConversion(msg.text())
        await msg.say(colorRes)
        return true
    }
    return false
}
/**
 * @description 回复信息是所在管理的群聊名，处理函数
 *  @param {object} bot 实例对象
 * @param {object} msg 消息对象
 * @return {Promise} true-是群聊 ，false-不是群聊
 */
async function isRoomName(bot,msg){
    //回复信息为管理的群聊名
    if(Object.keys(roomList).some(v=>v==msg.text())){
        //通过群聊Id获取到改群聊实例
        const room = await bot.Room.find({id:roomList[msg.text()]})
        //判断是否在房间中， 在就提示用户已在房间并结束
        if(await room.has(msg.from())){
            await msg.say("您已经在房间中了")
            return true
        }
        //发送群邀请
        await room.add(msg.from())
        // await msg.say("已经发动群邀请")
        return true 
    }
    return false
}


/**
 * 封装机器人自动回复请求接口，处理函数
 * @description 机器人请求接口，处理航华
 * @param {string} info 发送文字
 * @return {Promise} 相应内容
 */
function requestRobot(info) {
    return new Promise((resolve, reject) => {
        // let url = `https://open.drea.cc/bbsapi/chat/get?keyWord=${urlencode(info)}`
        //接入青云客智能聊天
        let url = `http://api.qingyunke.com/api.php?key=free&appid=0&msg=${urlencode(info)}`
        request(url, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                
                let res = JSON.parse(body)
                // console.log(res)
                if(res.result==0){
                    let send =res.content
                    //  将机器人的名称替换成为自己的机器人名
                    // send = send.replace(/Smile/g, name)
                    send=send.replace(/{br}/g,'\n')
                    send=`${send}`
                    resolve(send)
                }else{
                    resolve("没事别老@我，我还以为是爱情来了")
                }
            } else {
                resolve("你在说什么，我脑子有点短路！")
            }
        })
    })
}