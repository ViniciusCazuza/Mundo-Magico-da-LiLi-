import React from 'react';
import { motion, HTMLMotionProps, Spring } from 'framer-motion';

/**
 * Skill 2: Maestro de Física de Mola
 * Speciality: Micro-interações Dinâmicas (Squash & Stretch)
 */

type MotionPreset = 'bounce' | 'elastic' | 'smooth' | 'snappy';

interface MotionWrapperProps extends HTMLMotionProps<'div'> {
    preset?: MotionPreset;
    hoverScale?: number;
    tapScale?: number;
}

const presets: Record<MotionPreset, Spring> = {
    bounce: { type: 'spring', stiffness: 400, damping: 10 },
    elastic: { type: 'spring', stiffness: 200, damping: 5 },
    smooth: { type: 'spring', stiffness: 100, damping: 30 },
    snappy: { type: 'spring', stiffness: 500, damping: 25 },
};

export const MotionWrapper: React.FC<MotionWrapperProps> = ({
    children,
    preset = 'snappy',
    hoverScale = 1.05,
    tapScale = 0.95,
    ...props
}) => {
    return (
        <motion.div
            whileHover={{ scale: hoverScale }}
            whileTap={{ scale: tapScale }}
            transition={presets[preset]}
            {...props}
        >
            {children}
        </motion.div>
    );
};
