import React from 'react';
import {WRow, WCol, WButton} from 'wt-frontend';
import './LandmarkEntry.css';

const LandmarkEntry = (props) => {

    const deleteLandmark = () => {
        props.deleteLandmark(props.landmark);
    }

    return(
        <div>
            <WRow className='landmark'>
                <WCol size='1'>
                    {
                        props.activeRegionLandmarks.includes(props.landmark) ?
                            <WButton className='delete-landmark-button' onClick={deleteLandmark}>
                                <span className='material-icons'>close</span>
                            </WButton> : 
                            <WButton className='hidden-button'>
                                <span className='material-icons'>close</span>
                            </WButton>
                    }
                </WCol>
                <WCol size='1'>
                    {
                        props.activeRegionLandmarks.includes(props.landmark) ?
                            <WButton className='edit-landmark-button'>
                                <span className='material-icons'>edit</span>
                            </WButton> : <br/>
                    }
                </WCol>
                <WCol size='10' className='landmark-col'>
                    <span className='landmark-name'>{props.landmark}</span>
                </WCol>
            </WRow>
        </div>
    );
}

export default LandmarkEntry;