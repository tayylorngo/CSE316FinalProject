import React from 'react';
import LandmarkEntry from '../LandmarkEntry/LandmarkEntry';
import './LandmarksList.css';

const LandmarksList = (props) => {

    return(
        <div id='landmarks-list'>
            {
                props.map.landmarks &&
                props.map.landmarks.map(landmark => (
                    <LandmarkEntry
                        landmark={landmark}
                    />
                    )
                )
            }
        </div>
    );
}

export default LandmarksList;