import mitt from './mitt';
export function OpenMessage(type="success",text="成功",time=1000){
     mitt.emit("OpenMessage",{
         type:type,
         text:text,
         time:time
     })
 }
export function OpenMessageDialog(text="删除",time=1000){
    mitt.emit("OpenMessageDialog",{
        text:text,
        time:time
    })
}
export function OpenMessageInput(text="删除",time=1000){
    mitt.emit("OpenMessageInput",{
        text:text,
        time:time
    })
}
export function OpenDeleteMsg(text="删除",time=1000){
    mitt.emit("OpenDeleteMsg",{
        text:text,
        time:time
    })
}

/* * 创建一个Canvas Loading动画
* @param {HTMLCanvasElement} canvas - 要渲染动画的canvas元素
* @param {Object} [options] - 配置选项
* @param {string} [options.color='#3498db'] - 动画颜色
* @param {number} [options.radius=20] - 动画半径
* @param {number} [options.lineWidth=5] - 线条宽度
* @param {number} [options.speed=1.5] - 旋转速度
* @returns {Object} 包含start和stop方法的对象
*/
export function createCanvasLoading(canvas, options = {}) {
    // 合并默认选项
    const config = {
        color: options.color || '#3498db',
        radius: options.radius || 25,
        lineWidth: options.lineWidth || 5,
        speed: options.speed || 1.5,
        ...options
    };

    const ctx = canvas.getContext('2d');
    let animationId = null;
    let angle = 0;
    let isRunning = false;

    // 设置canvas尺寸（如果未设置）
    if (!canvas.width || !canvas.height) {
        canvas.width = (config.radius + config.lineWidth) * 2;
        canvas.height = (config.radius + config.lineWidth) * 2;
    }

    function draw() {
        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 计算中心点
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // 绘制背景圆
        ctx.beginPath();
        ctx.arc(centerX, centerY, config.radius, 0, Math.PI * 2, false);
        ctx.strokeStyle = `${config.color}20`; // 半透明背景
        ctx.lineWidth = config.lineWidth;
        ctx.stroke();

        // 绘制前景弧线
        ctx.beginPath();
        const startAngle = angle;
        const endAngle = angle + Math.PI * 1.5; // 270度的弧
        ctx.arc(centerX, centerY, config.radius, startAngle, endAngle, false);
        ctx.strokeStyle = config.color;
        ctx.lineWidth = config.lineWidth;
        ctx.stroke();

        // 更新角度
        angle += 0.05 * config.speed;
        if (angle > Math.PI * 2) {
            angle = 0;
        }

        // 继续动画循环
        if (isRunning) {
            animationId = requestAnimationFrame(draw);
        }
    }

    return {
        /**
         * 开始动画
         */
        start() {
            if (!isRunning) {
                isRunning = true;
                draw();
            }
        },

        /**
         * 停止动画
         */
        stop() {
            isRunning = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            // 清除画布
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        },

        /**
         * 检查动画是否正在运行
         * @returns {boolean}
         */
        isRunning() {
            return isRunning;
        }
    };
}