import React from 'react';
import valveOpen1 from '../../assets/valveOpen1.png';
import valveClosed1 from '../../assets/valveClosed1.png';
import valveTransition1 from '../../assets/valveTransition1.png';
import Image from 'next/image';

type ValveIconProps = {
    size?: number;
    state: 'Open' | 'Closed' | 'Transition';
};

export const ValveIcon1: React.FC<ValveIconProps> = ({ size = 40, state = 'Open' }) => {
    let valveEL;
    switch (state) {
        case 'Open':
            valveEL = valveOpen1;
            break;
        case 'Closed':
            valveEL = valveClosed1;
            break;
        case 'Transition':
            valveEL = valveTransition1;
            break;
        default:
            valveEL = valveClosed1;
            break;
    }

    return <Image src={valveEL} alt='pump' width={size} height={size} />;
}