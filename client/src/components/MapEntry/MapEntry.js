import React from 'react';
import './MapEntry.css';
import { WRow, WCol } from 'wt-frontend';

const MapEntry = (props) => {

    let mapName = props.name;

    const handleDeleteMap = () => {
        props.setShowDelete(props.id);
    } 

    return(
        <div className="map-entry">
            <WRow>
                <WCol size="6">
                    <span class="map-name">{mapName}</span>
                </WCol>
                <WCol size="6">
                    <span onClick={() => {console.log("YO")}}class="material-icons edit-button">edit</span>
                    <span onClick={handleDeleteMap}class="material-icons delete-button">delete</span>
                </WCol>
            </WRow>
        </div>
    )
}

export default MapEntry;