function suitableViewport(baseValue, viewportWidth) {
  // 获取当前的屏幕宽度
  let innerWidth = window.innerWidth;
  // 计算当前屏幕和要适配屏幕的比例
  let scale = innerWidth / viewportWidth < 1 ? innerWidth / viewportWidth : 1;
  // console.log(scale)
  //用基准值baseValue乘于比例
  let htmlFontSizeOnePxValue = baseValue * scale;
  //获取html的font-size大小
  // console.log(htmlFontSizeOnePxValue);
  const htmlDom = document.documentElement;
  // 设置html的font-size
  htmlDom.style.fontSize = htmlFontSizeOnePxValue + "px";
}

suitableViewport(100, 1920);

window.addEventListener("resize", () => {
  suitableViewport(100, 1920);
});
