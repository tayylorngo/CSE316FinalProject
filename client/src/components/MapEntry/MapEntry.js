import React, { useState } from 'react';
import './MapEntry.css';
import { WRow, WCol, WInput } from 'wt-frontend';

const MapEntry = (props) => {

    const [editingMapName, toggleEditingMapName] = useState(false);

    const handleDeleteMap = () => {
        props.setShowDelete(props.id);
    }

    const handleEditMapName = (e) => {
        props.editMapName(props.id, e.target.value);
        toggleEditingMapName(!editingMapName);
    }

    const handleSetActiveMap = async() => {
        props.handleSetActive(props.id);
    }

    const blackColor = {
        color: "black",
        fontSize: "1.15rem"
    }

    return(
        <div className="map-entry">
            <WRow>
                <WCol size="6">
                    {
                        editingMapName ? 
                        <WInput 
                            wType="lined"
                            barAnimation="border-highlight"
                            hoverAnimation="solid"
                            defaultValue={props.name}
                            onBlur={handleEditMapName}
                            style={blackColor}
                            className="map-name-input"
                        >
                        </WInput>
                 : <span className="map-name" onClick={handleSetActiveMap}>{props.name}</span>
                    }
                </WCol>
                <WCol size="6">
                    <span onClick={() => {toggleEditingMapName(!editingMapName)}}className="material-icons edit-button">edit</span>
                    <span onClick={handleDeleteMap}className="material-icons delete-button">delete</span>
                </WCol>
            </WRow>
        </div>
    )
}

export default MapEntry;