import Slider from '@antv/g2/lib/chart/controller/slider';
import { isNil, isEmpty } from '@antv/util';

class mobileSlider extends Slider {
    // 修改minText，maxText 显示逻辑，移动端不需要显示
    getMinMaxText() {
        return {
            minText: '',
            maxText: '',
        }
    }
    render() {
        this.option = this.view.getOptions().slider;
        const { start, end } = this.getSliderCfg();
        if (isNil(this.start)) {
            this.start = start;
            this.end = end;
        }
        const { data: viewData } = this.view.getOptions();
        if (this.option && !isEmpty(viewData)) {
            if (this.slider) {
                // exist, update
                this.slider = this.updateSlider();
            } else {
                // not exist, create
                this.slider = this.createSlider();
                // 取消缩略轴滑动
                this.slider.component.onMouseMove = (e) => { e.preventDefault() };
            }
        } else {
            if (this.slider) {
                // exist, destroy
                this.slider.component.destroy();
                this.slider = undefined;
            } else {
                // do nothing
            }
        }
    }
}

export default mobileSlider