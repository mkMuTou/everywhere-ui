/**
 * Rem 适配核心函数：动态设置根字体大小
 * - PC 端（≥768px）：1rem = 16px（默认浏览器基准）
 * - 平板端（≥576px <768px）：1rem = 12px
 * - 移动端（<576px）：1rem = 10px 或按屏幕宽度/37.5 计算（适配 375px 设计稿）
 */
export function initRem() {
    /** 监听窗口大小变化，重新计算 Rem 基准 */
    function calcRem() {
        const docEl = document.documentElement;
        const screenWidth = docEl.clientWidth;

        // 定义不同设备的 Rem 基准
        let remBase = 16; // PC 端默认 16px
        if (screenWidth < 768 && screenWidth >= 576) {
            remBase = 12; // 平板端
        } else if (screenWidth < 576) {
            // 移动端：可选固定 10px 或自适应（设计稿 375px → 1rem=10px）
            remBase = screenWidth / 37.5; // 自适应模式（推荐）
            // remBase = 10; // 固定模式
        }

        // 设置根字体大小
        docEl.style.fontSize = `${remBase}px`;
        // 存储基准值到全局，方便组件使用
        docEl.setAttribute("data-rem-base", remBase.toString());
    }

    // 初始化计算
    calcRem();
    // 窗口大小变化时重新计算（防抖）
    window.addEventListener("resize", debounce(calcRem, 200));
    // 页面旋转时重新计算
    window.addEventListener("orientationchange", calcRem);
}

/**
 * 防抖函数（避免频繁触发 Resize）
 */
export const debounce = (fn: Function, delay = 200) => {
    let timer: NodeJS.Timeout | null = null;
    return (...args: any[]) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
};

/**
 * 获取当前 Rem 基准值
 */
export function getRemBase(): number {
    const remBase = document.documentElement.getAttribute("data-rem-base");
    return remBase ? Number(remBase) : 16;
}

/**
 * px 转 rem 工具函数（方便组件内计算）
 */
export function px2rem(px: number): string {
    const remBase = getRemBase();
    return `${px / remBase}rem`;
}
