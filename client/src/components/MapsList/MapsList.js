import React from 'react';
import './MapsList.css';

const MapsList = (props) => {

    const handleAddMap = (e) => {
        props.addMap(e.target.value);
    } 

    return(
        <div>
            <h1>
                Add Map
            </h1>
            <input onBlur={handleAddMap}>
            
            </input>

        </div>
    )
}

export default MapsList;