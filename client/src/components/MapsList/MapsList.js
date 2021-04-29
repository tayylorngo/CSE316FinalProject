import React from 'react';
import './MapsList.css';
import MapEntry from '../MapEntry/MapEntry';

const MapsList = (props) => {
    return(
        <>
        {
            props.maps && 
            props.maps.map(entry => (
                <MapEntry
                    key={entry._id}
                    id={entry._id}
                    name={entry.name}    
                    setShowDelete={props.setShowDelete}            
                />
                )
            )
        }
        </>
    )
}

export default MapsList;