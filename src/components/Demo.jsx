import React, { useRef, useEffect, useState } from 'react';
import { Chart } from '@antv/g2';
import { registerSlider, useSliderRefs } from './Slider'


const Demo = () => {
  const rootRef = useRef(null);
  const chartRef = useRef(null);
  const [text, setText] = useState('');
  const sliderRefs = useSliderRefs();

  const data = [
    { year: '1960', sales: 12 },
    { year: '1961', sales: 8 },
  ];

  for (let i = 1; i < 98; i++) {
    data.push({
      year: `${1961 + i}`,
      sales: Math.random() * 12 + i
    });
  }
  useEffect(() => {
    drawChart();
  }, []);


  const drawChart = () => {
    let chart = new Chart({
      container: rootRef.current,
      autoFit: true,
      height: 300,
    });
    chart.data(data);

    chart.animate(false);
    chart.scale({
      year: { nice: true },
      sales: { nice: true },
    });

    chart.interval().position('year*sales')
      // .size(10)
      .adjust([
        {
          type: 'dodge',
          marginRatio: 1
        }
      ]);
    // 根据条件设置柱子宽度
    chart.theme({ styleSheet: { brandColor: '#5B8FF9', paletteQualitative10: ['#5B8FF9', '#61DDAA', '#65789B', '#F6BD16', '#7262fd', '#78D3F8', '#9661BC', '#F6903D', '#008685', '#F08BB4'], paletteQualitative20: ['#5B8FF9', '#CDDDFD', '#61DDAA', '#CDF3E4', '#65789B', '#CED4DE', '#F6BD16', '#FCEBB9', '#7262fd', '#D3CEFD', '#78D3F8', '#D3EEF9', '#9661BC', '#DECFEA', '#F6903D', '#FFE0C7', '#008685', '#BBDEDE', '#F08BB4', '#FFE0ED'] } });
    chartRef.current = chart

    // console.log('1 chartRef.current::', chartRef.current)

    chart = registerSlider({ data, refs: { chartRef, ...sliderRefs } })

    // chart = chartRef.current

    // console.log('4 chartRef.current::', chartRef.current)
    chart.render();
  };

  return (
    <div>
      {text}
      <div ref={rootRef} style={{ height: '100%' }} />
    </div>
  )
};

export default Demo;