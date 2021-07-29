import Slider from '@antv/g2/lib/chart/controller/slider';

class mobileSlider extends Slider {
   // 修改minText，maxText 显示逻辑，移动端不需要显示
    getMinMaxText(){
        return {
            minText: '',
            maxText: '',
          }
    }
}

export default mobileSlider