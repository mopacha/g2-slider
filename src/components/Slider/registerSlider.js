
import { registerComponentController } from '@antv/g2';
import Gestrue from '@antv/g2/lib/chart/controller/gesture';
import { debounce } from 'lodash';

registerComponentController('gesture', Gestrue);

const registerSlider = ({ data, refs }) => {
  const { startRef, endRef, originX, originZoom, baseRateRef, chartRef } = refs;
  // 以10条作为基准
  const BASE_LEN = 10;
  //默认一些缩略轴配置
  const defaultSliderOptions = {
    smooth: true,
    handlerStyle: {
      width: 0,
      height: 0,
      fill: 'red',
    }
  };

  let baseRate = 1
  if (data.length > BASE_LEN) {
    baseRate = BASE_LEN / data.length
    baseRate = Math.floor(baseRate * 1000) / 1000
    baseRateRef.current = baseRate
  };

  startRef.current = 0.000
  endRef.current = baseRate
  // 开启缩略轴组件
  chartRef.current.option('slider', {
    start: 0,
    end: baseRate,
    ...defaultSliderOptions
  });

  // 更新缩略轴
  const updateSlider = (reRenderChart, chart) => {
    chart.option('slider', {
      start: startRef.current,
      end: endRef.current,
      ...defaultSliderOptions
    });
    reRenderChart && chart.render();
  }

  const updateChart = debounce((ev, chart) => {
    const { points, direction, deltaX, deltaY, target, currentTarget } = ev;
    const { cfg } = currentTarget
    const moveX = deltaX - originX.current // 每次移动的像素 
    const canvasHeight = cfg.height // canvas 宽度
    //setText(`y:${points[0].y}`);
    const maxX = canvasHeight - 40 // 最大滑动区域，目的是排除缩略轴区域
    const intervalMoveRaate = 0.005 // 每次移动的百分比
    const movexRate = moveX > 0 ? intervalMoveRaate : -intervalMoveRaate

    if (moveX > 2) {
      // 右移
      if (endRef.current + movexRate < 1) {
        originX.current = deltaX // 更新手势当前已经移动的像素
        // 没有移动到终点的时候才改变start 和end
        startRef.current = startRef.current + movexRate
        endRef.current = endRef.current + movexRate
      } else {
        return
      }
    } else if (moveX < -2) {
      // 左移
      if (startRef.current + movexRate > 0) {
        originX.current = deltaX // 更新手势当前已经移动的像素
        // 左移没超过
        startRef.current = startRef.current + movexRate
        endRef.current = endRef.current + movexRate
      } else {
        return
      }
    }
    startRef.current = Math.floor(startRef.current * 1000) / 1000
    endRef.current = Math.floor(endRef.current * 1000) / 1000
    window.requestAnimationFrame(() => updateSlider(points[0].y < maxX, chart));
  }, 0)

  const zoomChart = debounce((ev, chart) => {
    const { points, zoom, currentTarget } = ev;
    const { cfg } = currentTarget
    const canvasHeight = cfg.height // canvas 宽度
    const maxX = canvasHeight - 40 // 最大滑动区域，目的是排除缩略轴区域
    const currentZoom = zoom - originZoom.current // 每次缩放的比例 , 用于判断缩小还是放大
    const zoomMoveRate = 0.005 // 每次缩放的百分比

    //setText(`currentZoom:${currentZoom}`);
    if (currentZoom > 0) {
      // 放大，数量变少， start 不变，end 变小
      if (endRef.current - zoomMoveRate > 0) {
        endRef.current = endRef.current - zoomMoveRate
        originZoom.current = zoom
      } else {
        return
      }
    } else {
      // 缩小，数量变多, start 不变，end 变大，但end 不会超过1
      if (endRef.current + zoomMoveRate <= 1) {
        endRef.current = endRef.current + zoomMoveRate
        originZoom.current = zoom
      } else {
        return
      }
    }
    window.requestAnimationFrame(() => updateSlider(points[0].y < maxX, chart));
  }, 0)

  // 滑动
  chartRef.current.on('pan', (ev) => {

    updateChart(ev, chartRef.current)
  });
  // 缩放
  chartRef.current.on('pinch', (ev) => {
    zoomChart(ev, chartRef.current)
  });

  console.log('3 registerSlider')

  return chartRef.current
}


export default registerSlider