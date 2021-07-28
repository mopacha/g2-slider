import React, { useRef, useEffect } from 'react';
import { Chart } from '@antv/g2';
import { registerSlider, useSliderRefs } from './Slider'

const Demo = () => {
  const rootRef = useRef(null);
  const sliderRefs = useSliderRefs();

  const data = [
    { year: '2000', sales: 12 },
  ]

  for (let i = 1; i <= 100; i++) {
    data.push({
      year: `${2000 + i}`,
      sales: Math.random() * 12 + i
    })
  }
  useEffect(() => {
    drawChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const drawChart = () => {
    let chart = new Chart({
      container: rootRef.current,
      autoFit: true,
      height: 300,
    });
    chart.data(data)
    chart.animate(false)
    chart.tooltip(false) // 关闭 tooltip
    chart.scale({
      year: { nice: true },
      sales: { nice: true },
    })
    chart.interval().position('year*sales')
      // .size(10)
      .adjust([
        {
          type: 'dodge',
          marginRatio: 1
        }
      ])
    // 根据条件设置柱子宽度
    chart.theme({ styleSheet: { brandColor: '#5B8FF9', paletteQualitative10: ['#5B8FF9', '#61DDAA', '#65789B', '#F6BD16', '#7262fd', '#78D3F8', '#9661BC', '#F6903D', '#008685', '#F08BB4'], paletteQualitative20: ['#5B8FF9', '#CDDDFD', '#61DDAA', '#CDF3E4', '#65789B', '#CED4DE', '#F6BD16', '#FCEBB9', '#7262fd', '#D3CEFD', '#78D3F8', '#D3EEF9', '#9661BC', '#DECFEA', '#F6903D', '#FFE0C7', '#008685', '#BBDEDE', '#F08BB4', '#FFE0ED'] } });

    // 注册可滑动、缩放缩略轴
    chart = registerSlider({
      chart,
      sliderRefs,
      data
    })
    chart.render();
  };
  return (
    <div>
      <div ref={rootRef} style={{ height: '100%' }} />
    </div>
  )
};

export default Demo;