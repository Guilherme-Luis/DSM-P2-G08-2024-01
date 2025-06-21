import React from 'react';
import { Carousel } from 'flowbite-react';

import banner1 from '../assets/paisagem/banner1.png';
import banner2 from '../assets/paisagem/banner2.png';
import banner3 from '../assets/paisagem/banner3.png';

const MyCarousel = () => (
  <div className="h-56 md:h-96 bg-bg-sky-500/10">
    <Carousel>
      <img src={banner1} alt="Banner 1" />
      <img src={banner2} alt="Banner 2" />
      <img src={banner3} alt="Banner 3" />
    </Carousel>
  </div>
);

export default MyCarousel;
