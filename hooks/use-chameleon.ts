import { useState, useCallback } from "react";
import { useAnimation } from "framer-motion";

export const useChameleonTransition = () => {
    const controls = useAnimation();
    const [isTransforming, setIsTransforming] = useState(false);

    const triggerTransformation = useCallback(async (callback: () => Promise<void> | void) => {
        if (isTransforming) return;
        setIsTransforming(true);

        // 1. Vibrate (The "Charge Up")
        await controls.start({
            x: [0, -3, 3, -3, 3, 0],
            transition: { duration: 0.4, ease: "easeInOut" },
        });

        // 2. Blur & Flip Out
        await controls.start({
            filter: "blur(12px)",
            opacity: 0.5,
            rotateY: 90,
            scale: 0.95,
            transition: { duration: 0.3, ease: "easeIn" },
        });

        // 3. Execute the actual data change (passed via callback)
        await callback();

        // 4. Flip In & Clarify
        await controls.start({
            filter: "blur(0px)",
            opacity: 1,
            rotateY: 0,
            scale: 1,
            transition: { duration: 0.4, ease: "easeOut" },
        });

        setIsTransforming(false);
    }, [controls, isTransforming]);

    return { controls, triggerTransformation, isTransforming };
};