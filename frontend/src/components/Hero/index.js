import React from 'react';

import Abhisit from './abhisit.gif';
import Chatchart from './chatchart.gif';
import Paiboon from './paiboon.gif';
import Prayut from './prayut.gif';
import Sudarat from './sudarat.gif';
import Thanathorn from './thanathorn.gif';

const heroes = {
  abhisit: Abhisit,
  chatchart: Chatchart,
  paiboon: Paiboon,
  prayut: Prayut,
  sudarat: Sudarat,
  thanathorn: Thanathorn,
};

const Hero = (props) => {
  if (!props.name || !heroes[props.name]) return null;
  return (
    <img src={heroes[props.name]} alt="อีโร่" width={props.play ? "80px" : "160px"} height={props.play ? "120px" : "240px"} />
  );
};

export default Hero;
