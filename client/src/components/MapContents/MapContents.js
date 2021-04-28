import React from 'react';
import './MapContents.css';
import {WRow, WCol, WButton} from 'wt-frontend';
import MapsList from '../MapsList/MapsList';

const MapContents = (props) => {

    const handleAddMap = () => {
        props.addMap("Untitled");
    } 

    return(
        <div id="map-contents">
            <WRow>
                <WCol size="12">
                    <h1>Your Maps</h1>
                </WCol>
            </WRow>
            <WRow>
                <WCol size="6" className="map-list-col">
                    <MapsList maps={props.maps} />
                </WCol>
                <WCol size="6" className="map-list-col">
                    <img src="https://i.pinimg.com/originals/ea/43/aa/ea43aa960e4f41d083204c24af2743cc.png"></img>
                    <WButton 
                            color="primary"
                            hoverAnimation="lighten"
                            clickAnimation="ripple-light"
                            onClick={handleAddMap}
                            id="add-map-button"
                    > 
                    ADD NEW MAP 
                    </WButton>
                </WCol>
            </WRow>
        </div>
    )
}

export default MapContents;