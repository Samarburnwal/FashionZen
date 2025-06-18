import React from 'react';
import './Hero.css'
import heroHand from '../Assets/hand_icon.png'
import arrow from '../Assets/arrow.png'
import hero from '../Assets/hero_image.png'

const Hero = () => {
  return (
    <div className='hero'>
        <div className="hero-left">
            <h2>New Arrivals Only</h2>
            <div>
                <div className="hero-hand-icon">
                    <p>New</p>
                    <img src={heroHand} alt="" />
                </div>
                <p>Collections</p>
                <p>for everyone</p>
            </div>
            <button className='hero-latest-btn'>
                <div>Latest Collection</div>
                <img src={arrow} alt="" />
            </button>    
        </div>
        <div className="hero-right">
            <img src={hero} alt="" />
        </div>
    </div>
    
  )
}

export default Hero;