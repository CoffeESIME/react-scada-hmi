import React from 'react';
import valveOpen from '../../assets/valveOpen.png';
import valveClosed from '../../assets/valveClosed.png';
import valveTransition from '../../assets/valveTransition.png';
import Image from 'next/image';

type ValveIconProps = {
  size?: number;
  state: 'Open' | 'Closed' | 'Transition';
  rotation?: number;
};

export const ValveIcon: React.FC<ValveIconProps> = ({
  size = 50,
  state = 'Open',
  rotation,
}) => {
  let valveEL;
  switch (state) {
    case 'Open':
      valveEL = valveOpen;
      break;
    case 'Closed':
      valveEL = valveClosed;
      break;
    case 'Transition':
      valveEL = valveTransition;
      break;
    default:
      valveEL = valveClosed;
      break;
  }

  return (
    <Image
      src={valveEL}
      alt='pump'
      width={size}
      height={size}
      style={{ transform: `rotate(${rotation}deg)` }}
    />
  );
};
