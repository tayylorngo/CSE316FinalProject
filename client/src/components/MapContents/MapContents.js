import React from 'react';
import './MapContents.css';
import {WRow, WCol, WButton} from 'wt-frontend';
import MapsList from '../MapsList/MapsList';
import {Redirect} from 'react-router-dom';

const MapContents = (props) => {

    const handleAddMap = () => {
        props.setShowNewMap();
    }

	if(!props.user){
        return <Redirect to='/home'/>
    }

    return(
        <div id="map-contents">
            <WRow>
                <WCol size="12" id="map-header">
                    <h1 id="map-header-title">Your Maps</h1>
                </WCol>
            </WRow>
            <WRow>
                <WCol size="6" className="map-list-col" id="map-list-col-left">
                    <MapsList 
                        maps={props.maps} 
                        setShowDelete={props.setShowDelete} 
                        editMapName={props.editMapName}
                        handleSetActive={props.handleSetActive}
                    />
                </WCol>
                <WCol size="6" className="map-list-col" id="map-list-col-right">
                    <img src="https://i.pinimg.com/originals/ea/43/aa/ea43aa960e4f41d083204c24af2743cc.png"></img>
                    <WButton 
                            hoverAnimation="lighten"
                            clickAnimation="ripple-light"
                            onClick={handleAddMap}
                            id="add-map-button"
                    > 
                    <h3 id="add-map-button-text">Create New Map</h3> 
                    </WButton>
                </WCol>
            </WRow>
        </div>
    )
}

export default MapContents;