function getHtmlFontSize() {

    // 获取当前根标签html的font-size大小
    const htmlFontSize = document.documentElement.style.fontSize;
    // 截取htmlFontSize的数字部分
    const htmlFontSizeNum = htmlFontSize.slice(0, htmlFontSize.indexOf('px'));
    var htmlFontSizeNumber = Number(htmlFontSizeNum);
    return htmlFontSizeNumber;
}


export default getHtmlFontSize;