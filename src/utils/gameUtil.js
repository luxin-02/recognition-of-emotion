export const baseRem = 100;

/**
 * 一些游戏用的的方法
 */
//防抖
export function debounce(fn, wait) {
    let timer = null;
    return function () {
        if (timer !== null) {
            clearTimeout(timer);
        }
        timer = setTimeout(fn, wait);
    }
}


//节流
export function throttle(func, wait) {
    var context, args;
    var previous = 0;

    return function () {
        var now = +new Date();
        context = this;
        args = arguments;
        if (now - previous > wait) {
            func.apply(context, args);
            previous = now;
        }
    }
}

/**
 *  碰撞监测，判断矩形是否碰撞
 * @param {object} rect1
 * @param {number} rect1.x
 * @param {number} rect1.y
 * @param {number} rect1.width
 * @param {number} rect1.height
 * @param {object} rect2
 * @param {number} rect2.x
 * @param {number} rect2.y
 * @param {number} rect2.width
 * @param {number} rect2.height
 */
export function isCollision(rect1, rect2) {
    if (rect1.x <= rect2.x + rect2.width &&
        rect1.x + rect1.width >= rect2.x &&
        rect1.y <= rect2.y + rect2.height &&
        rect1.height + rect1.y >= rect2.y) {
        return true;
    } else {
        return false
    }
}



/**
 *  圆形碰撞监测
 * @param {object} circle1 
 * @param {number} circle1.x 
 * @param {number} circle1.y 
 * @param {number} circle1.radius 
 * @param {object} circle2 
 * @param {number} circle2.x 
 * @param {number} circle2.y 
 * @param {number} circle2.radius 
 */
export function isCircleCollision(circle1, circle2) {
    // console.log(circle1);
    // console.log(circle2)

    let r1 = circle1.radius,
        l1 = circle1.x,
        t1 = circle1.y,
        // 被撞对象的圆偏移量
        r2 = circle2.radius,//园2的半径
        l2 = circle2.x,
        t2 = circle2.y;



    let a = (l1 + r1) - (l2 + r2); // 左偏移量
    let b = (t1 + r1) - (t2 + r2); //上偏移量

    //勾股定理求两个圆的圆心距离
    let c = Math.sqrt(a * a + b * b);

    if (c >= (r1 + r2)) {
        return false;
    } else {
        return true;

    }
}


/**
 *  圆形碰撞监测给定圆心坐标
 * @param {object} circle1 
 * @param {number} circle1.x 
 * @param {number} circle1.y 
 * @param {number} circle1.radius 
 * @param {object} circle2 
 * @param {number} circle2.x 
 * @param {number} circle2.y 
 * @param {number} circle2.radius 
 */
// x1、y1、r1分别为第一个圆的圆心坐标和半径，x2、y2、r2分别为第二个圆的圆心坐标和半径
export function isColliding(circle1, circle2) {
    let distance = Math.sqrt((circle1.x - circle2.x) ** 2 + (circle1.y - circle2.y) ** 2);
    return distance < circle1.radius + circle2.radius;
}



/**
 * 随机生成指定范围
 * @param {number} min 
 * @param {number} max 
 * @returns 
 */

export function getRandom(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}



/**
 * 打乱数组
 * @param {array} arr 
 * @returns 
 */
export function shuffle(arr) {
    let n = arr.length, random;
    while (0 != n) {
        random = (Math.random() * n--) >>> 0; // 无符号右移位运算符向下取整 
        //或者改写成 random = Math.floor(Math.random() * n--)
        [arr[n], arr[random]] = [arr[random], arr[n]] // ES6的解构赋值实现变量互换
    }
    return arr;
}



//rem计算
export function getRem(size) {
    return size / baseRem
}



//定时器promise
export function timeout(delay = 100) {
    return new Promise(resolve => {
        setTimeout(resolve, delay)
    })
};