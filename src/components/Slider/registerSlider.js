import Gestrue from '@antv/g2/lib/chart/controller/gesture';
import { registerComponentController } from '@antv/g2';
import { debounce } from 'lodash';
import mobileSlider from './mobileSlider';
import {
  BASE_LEN,
  DEFAULT_SLIDER_OPTIONS,
  MOVE_INTERVAL_RATE,
  SLIDER_HEIGHT,
  MOVE_MINX_VALID_LENGTH,
  ZOOM_INTERVAL_RATE
} from './constants';
import { formateRatio } from './utils';

// 引入 gestrue 手势组件
registerComponentController('gesture', Gestrue);
// 引入 slider 组件
registerComponentController('slider', mobileSlider);

const registerSlider = ({ data, sliderRefs, chart }) => {
  const [startRef, endRef, preDeltaXRef, preZoomRef] = sliderRefs;
  if (data.length > BASE_LEN) {
    endRef.current = formateRatio(BASE_LEN / data.length);
  }
  // 开启缩略轴组件
  chart.option('slider', {
    start: 0,
    end: endRef.current,
    ...DEFAULT_SLIDER_OPTIONS
  });
  // 更新缩略轴
  const updateSlider = (shouldRender) => {
    chart.option('slider', {
      start: startRef.current,
      end: endRef.current,
      ...DEFAULT_SLIDER_OPTIONS
    });
    // eslint-disable-next-line no-unused-expressions
    shouldRender && chart.render();
  };
  // 滑动更新视图
  const updataOnMove = (ev) => {
    const { points, deltaX, currentTarget } = ev;
    const { cfg } = currentTarget;
    const canvasHeight = cfg.height; // 视图区域的高度
    const moveX = deltaX - preDeltaXRef.current; // 每次移动的像素
    const maxY = canvasHeight - SLIDER_HEIGHT; // y轴最大滑动区域高度，目的是排除缩略轴区域
    if (moveX > MOVE_MINX_VALID_LENGTH && endRef.current + MOVE_INTERVAL_RATE < 1) {
      // 右移 & 没有移动到终点的时候才改变start 和end
      startRef.current += MOVE_INTERVAL_RATE;
      endRef.current += MOVE_INTERVAL_RATE;
      preDeltaXRef.current = deltaX; // 更新手势当前已经移动的像素
    } else if (moveX < -MOVE_MINX_VALID_LENGTH && startRef.current - MOVE_INTERVAL_RATE > 0) {
      // 左移 & 没有超过区域
      startRef.current -= MOVE_INTERVAL_RATE;
      endRef.current -= MOVE_INTERVAL_RATE;
      preDeltaXRef.current = deltaX; // 更新手势当前已经移动的像素
    } else {
      return;
    }
    startRef.current = formateRatio(startRef.current);
    endRef.current = formateRatio(endRef.current);
    window.requestAnimationFrame(() => updateSlider(points[0].y < maxY));
  };
  // 缩放更新视图
  const updateOnZoom = (ev) => {
    const { points, zoom, currentTarget } = ev;
    const { cfg } = currentTarget;
    const canvasHeight = cfg.height; // 视图区域的高度
    const maxY = canvasHeight - SLIDER_HEIGHT; // y轴最大滑动区域高度，目的是排除缩略轴区域
    const currentZoom = zoom - preZoomRef.current; // 每次缩放的比例 , 用于判断缩小还是放大
    if (currentZoom > 0 && endRef.current - ZOOM_INTERVAL_RATE > 0) {
      // 放大，数量变少， start 不变，end 变小
      endRef.current -= ZOOM_INTERVAL_RATE;
      preZoomRef.current = zoom;
    } else if (endRef.current + ZOOM_INTERVAL_RATE <= 1) {
      // 缩小，数量变多, start 不变，end 变大，但end 不会超过1
      endRef.current += ZOOM_INTERVAL_RATE;
      preZoomRef.current = zoom;
    } else {
      return;
    }
    endRef.current = formateRatio(endRef.current);
    window.requestAnimationFrame(() => updateSlider(points[0].y < maxY));
  };
  // 更新视图
  const updateChart = debounce((ev, type) => {
    if (type === 'pan') {
      updataOnMove(ev);
    } else {
      updateOnZoom(ev);
    }
  }, 0);
  // 滑动
  chart.on('pan', (ev) => {
    updateChart(ev, 'pan');
  });
  // 缩放
  chart.on('pinch', (ev) => {
    updateChart(ev, 'pinch');
  });
  return chart;
};

export default registerSlider;
