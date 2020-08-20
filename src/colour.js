// const { Message } = require("wechaty")

/**
 * @description 16进制颜色与rbga颜色互转
 */
async function colorConversion(color) {
    // console.log(111)
    return new Promise((resolve, reject) => {
        // console.log(color)
        let _color = color.replace("颜色", "")
        var message = ''
        const sixRegExp = /^#([0-9a-fA-F]{6})$/;//16进制颜色正则表达式
        const threeRegExp = /^#([0-9a-fA-F]{3})$/;//3位的16进制颜色正则表达式
        const rgbExp = /^(rgb|RGB)/;//rbg颜色正则表达式
        //判断是否是16进制颜色
        if (sixRegExp.test(_color)) {
            const r = parseInt('0x' + _color.slice(1, 3))
            const g = parseInt('0x' + _color.slice(3, 5))
            const b = parseInt('0x' + _color.slice(5, 7))
            message = `rgb(${r},${g},${b})`
        }
        else if (threeRegExp.test(_color)) {
            message = "请输入6位的hex颜色"
        }
        //判断是否是rbga颜色
        else if (rgbExp.test(_color)) {
            let _rgb = _color.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
            let _hex = "#"
            for (let i = 0; i < 3; i++) {
                let hexnumber = Number(_rgb[i]).toString(16)
                if (hexnumber.length < 2) {
                    hexnumber = "0" + hexnumber
                }
                _hex += hexnumber
            }
            message = _hex
            // message=_hex
        }
        //提示正确的本功能用法
        else {
            message = "请输入[颜色#hex]或者[颜色rbg(x,x,x,x)]"
        }
        resolve(message)
    })
}

module.exports = {
    colorConversion
}