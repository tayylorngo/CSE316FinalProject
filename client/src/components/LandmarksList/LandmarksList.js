import React from 'react';
import LandmarkEntry from '../LandmarkEntry/LandmarkEntry';
import './LandmarksList.css';
import {WInput} from 'wt-frontend';

const LandmarksList = (props) => {

    return(
        <div id='landmarks-list'>
            {
            props.landmarks &&
            props.landmarks.map(landmark => (
                <LandmarkEntry
                    landmark={landmark}
                    activeRegionLandmarks={props.activeLandmarks}
                    deleteLandmark={props.deleteLandmark}
                    showDelete={props.showDelete}
                />)
                )
            }
        </div>
    );
}

export default LandmarksList;