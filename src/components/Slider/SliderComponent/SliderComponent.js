import React from 'react'
import * as styles from './SliderComponent.module.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SlideElement from '../SlideElement/SlideElement';
import { getImage } from 'gatsby-plugin-image';
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';

const NextArrow = (props) => {
  return (
    <div className={styles.arrow}>
      <MdArrowForwardIos className={styles.nextArrow} onClick={props.onClick} />
    </div>
  );
}

const PrevArrow = (props) => {
  return (
    <div className={styles.arrow}>
      <MdArrowBackIos className={styles.prevArrow} onClick={props.onClick} />
    </div>
  );
}

const SliderComponent = (props) => {

  const images = props.images.map(picture => getImage(picture));
  const settings = {
    speed: 500,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  }

  return (
    <div>
      <Slider {...settings}>
        {images.map((image, index) => (
          <SlideElement slideImage={image} key={index} allImages={images.length} currentImage={index + 1} />
        ))}
      </Slider>
    </div>
  )
}

export default SliderComponent;