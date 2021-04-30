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

    return(
        <div className="map-entry">
            <WRow>
                <WCol size="6">
                    {
                        editingMapName ? 
                        <WInput 
                        wType="filled"
                        barAnimation="border-highlight"
                        hoverAnimation="solid"
                        defaultValue={props.name}
                        onBlur={handleEditMapName}
                        className="map-name-input"
                        >
                        </WInput>
                 : <span class="map-name">{props.name}</span>
                    }
                </WCol>
                <WCol size="6">
                    <span onClick={() => {toggleEditingMapName(!editingMapName)}}class="material-icons edit-button">edit</span>
                    <span onClick={handleDeleteMap}class="material-icons delete-button">delete</span>
                </WCol>
            </WRow>
        </div>
    )
}

export default MapEntry;