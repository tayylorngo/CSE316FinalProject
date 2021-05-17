import React from 'react';
import './Welcome.css';
import {Redirect} from 'react-router-dom';

const Welcome = (props) => {

    if(props.user){
        return <Redirect to='/maps'/>
    }

    let src = 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Terrestrial_globe.svg/1200px-Terrestrial_globe.svg.png'

    return(
        <div>
            <img id="globe-pic" src={src} alt='globe'></img>
            <div id="welcome">
                Welcome to the World Data Mapper
            </div>
        </div>
    )
}

export default Welcome;