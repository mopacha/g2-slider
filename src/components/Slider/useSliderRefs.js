import { useRef } from 'react';

const useSliderRefs = () => {
    const startRef = useRef(0);
    const endRef = useRef(null);
    const originX = useRef(0);
    const originZoom = useRef(1)
    const baseRateRef = useRef(null);
    return { startRef, endRef, originX, originZoom, baseRateRef }
}

export default useSliderRefs;