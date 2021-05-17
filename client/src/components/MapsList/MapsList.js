import React from 'react';
import './MapsList.css';
import MapEntry from '../MapEntry/MapEntry';

const MapsList = (props) => {
    return(
        <>
        {
            props.maps && 
            props.maps.slice(0).reverse().map(entry => (
                <MapEntry
                    key={entry._id}
                    id={entry._id}
                    name={entry.name}
                    editMapName={props.editMapName}    
                    setShowDelete={props.setShowDelete}
                    handleSetActive={props.handleSetActive}
                    toggleActiveRegion={props.toggleActiveRegion}            
                />
                )
            )
        }
        </>
    )
}

export default MapsList;