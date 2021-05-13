import React from 'react';
import LandmarkEntry from '../LandmarkEntry/LandmarkEntry';
import './LandmarksList.css';

const LandmarksList = (props) => {

    return(
        <div id='landmarks-list'>
            {
            props.landmarks &&
            props.landmarks.map(landmark => (
                <LandmarkEntry
                    key={landmark}
                    landmark={landmark}
                    activeRegionLandmarks={props.activeLandmarks}
                    deleteLandmark={props.deleteLandmark}
                    showDelete={props.showDelete}
                    editLandmark={props.editLandmark}
                />)
                )
            }
        </div>
    );
}

export default LandmarksList;