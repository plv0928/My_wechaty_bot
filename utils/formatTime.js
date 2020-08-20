// 时间格式化函数
function dateFtt(date) {
    var o = {
        "M+": date.getMonth() + 1,                 //月份   
        "d+": date.getDate(),                    //日   
        "h+": date.getHours(),                   //小时   
        "m+": date.getMinutes(),                 //分   
        "s+": date.getSeconds(),                 //秒   
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
        "S": date.getMilliseconds()             //毫秒  
    }
    var fmt={
        "MM":o["M+"],
        "dd":o["d+"],
        "hh":o["h+"],
        "mm":o["m+"],
        "ss":o["s+"]
    }
    return fmt
}

module.exports={
    dateFtt
}