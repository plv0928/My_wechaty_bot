module.exports={
    //自己申请的ipad协议token
    token:"puppet_padplus_ddc93c98cd34ff37",
    //机器人名称
    name:"工具人_小茹",
    //管理的群列表
    room:{
        roomList:{
            //群名称
            // e.g==>web圈:"***********@chatroom"
        },
        //加入房间回复
        roomJoinReply:'你好，欢迎加入'
    },
    //私人微信号
    personal:{
        //好友验证自动通过关键字
        addFriendKeywords:["加群","前端","工具人"],
        //是否开启加群
        addRoom:true
    },
    //菜单
    meun:["加群","天气","颜色","笑话","提醒"],
    //数据库配
    mysqlConfig:{
        database:'wechaty_bot',//数据库名
        user:'plv',//用户名
        password:'plv.0928',//密码
        host:'localhost',//主机名称
        port:3306,//mysql端口号
    }
}