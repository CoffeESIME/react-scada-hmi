import React from 'react';
import pumpOn from '../../assets/pumpWhite.png';
import pumpOff from '../../assets/pump808080.png';
import pumpTransition from '../../assets/pump93c2e4.png';
import Image from 'next/image';

type MotorIconProps = {
    size?: number;
    state: 'On' | 'Off' | 'Transition';
};

export const MotorIcon: React.FC<MotorIconProps> = ({ size = 90, state = 'On' }) => {
    let pumpEL;
    switch (state) {
        case 'On':
            pumpEL = pumpOn;
            break;
        case 'Off':
            pumpEL = pumpOff;
            break;
        case 'Transition':
            pumpEL = pumpTransition;
            break;
        default:
            pumpEL = pumpOff;
            break;
    }

    return <Image src={pumpEL} alt='pump' width={size} height={size} />;
}
