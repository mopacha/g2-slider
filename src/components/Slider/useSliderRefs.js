import { useRef } from 'react';

const useSliderRefs = () => {
    const startRef = useRef(0);
    const endRef = useRef(null);
    const preDeltaXRef = useRef(0);
    const preZoomRef = useRef(1)
    const baseRateRef = useRef(null);
    return { startRef, endRef, preDeltaXRef, preZoomRef, baseRateRef }
}

export default useSliderRefs;