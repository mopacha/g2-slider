export const BASE_LEN = 10 // 以10条作为基准
export const DEFAULT_SLIDER_OPTIONS = { //默认一些缩略轴配置
    smooth: true,
    handlerStyle: {
        width: 0,
        height: 0,
        fill: 'red',
    }
}
export const MOVE_INTERVAL_RATE = 0.005 // 每次移动的比率，根据数量量多少计算效果不好，这里写死
export const SLIDER_HEIGHT = 40 // 缩略轴高度
export const MOVE_MINX_VALID_LENGTH = 2 // 最小有效移动宽度
export const ZOOM_INTERVAL_RATE = 0.005 // 每次放大和缩放的比率