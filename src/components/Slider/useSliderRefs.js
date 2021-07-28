import { useRef } from 'react';
const useSliderRefs = () => {
    const startRef = useRef(0);
    const endRef = useRef(1);
    const preDeltaXRef = useRef(0);
    const preZoomRef = useRef(1)
    return [startRef, endRef, preDeltaXRef, preZoomRef]
}

export default useSliderRefs;