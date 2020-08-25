//node-requset请求包
const request = require("request")
//引入mysql连接池
const { mysqlPool } = require("./mysqlconnection")
/**
 * @description 增添关注的基金信息
 * @msg 收到的消息
 * @name 发送人
 */
async function addFund(msg, name) {
    let returnMsg = "发送命令可执行特殊操作：\n获取该基金当天的信息,示例：基金 基金号\n关注基金，示例：关注基金 基金号\n关注基金的话，我会在每天2点半发送该基金信息给你"
    //关注基金
    if (msg.indexOf("关注") != -1) {
        let fundCode = msg.replace("关注基金 ", '')
        await getFundInfo(fundCode).then((res) => {
            // console.log(res)
             getUserInfo(name)
        }).catch((err) => {
            // console.log(err)
            returnMsg=err
        })
    } else {

    }
    //  await mysqlPool(querySql).then((res)=>{
    //      console.log(res)
    //  }).catch((err)=>{
    //      console.log(err)
    //  })

    return returnMsg
}

//获取基金信息
function getFundInfo(code) {
    return new Promise((resolve, reject) => {
        let url = `https://api.doctorxiong.club/v1/fund?code=${code}`
        request(url, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                let res = JSON.parse(body)
                if (res.data) {
                    resolve(res.data)
                } else {
                    let msg = `请输入正确的基金号`
                    reject(msg)
                }
            } else {
                let msg = `请输入正确的基金号`
                reject(msg)
            }
        })
    })
}

//获取数据用户信息
async function getUserInfo(name){
    let querySql = `select * from fund_info where objectName = '${name}'`
    await mysqlPool(querySql).then((res)=>{
        console.log(res)
    }).catch((err)=>{
        console.log(err)
    })
}

module.exports = {
    addFund
}