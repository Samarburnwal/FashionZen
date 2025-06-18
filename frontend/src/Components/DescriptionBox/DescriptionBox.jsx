import React from 'react';
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Reviews (122)</div>
        </div>

        <div className="descriptionbox-description">
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, et veniam! Quo officiis provident nemo molestias pariatur, impedit architecto eius omnis, perferendis praesentium nostrum error debitis voluptate dolore temporibus sapiente.
            </p>

            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam, vel nisi! Ducimus vel asperiores dolorum est minus, hic labore ab officiis iste tenetur beatae laudantium voluptatibus aliquam mollitia fugiat distinctio.
            </p>
        </div>
    </div>
  )
}

export default DescriptionBox