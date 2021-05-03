import React from 'react';
import './Welcome.css';

const Welcome = () => {
    return(
        <div>
            <img id="globe-pic" src='https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Terrestrial_globe.svg/1200px-Terrestrial_globe.svg.png'></img>
            <div id="welcome">
                Welcome to the World Data Mapper
            </div>
        </div>
    )
}

export default Welcome;