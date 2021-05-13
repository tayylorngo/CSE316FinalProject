import React, {useState} from 'react';
import {WRow, WCol, WButton, WInput} from 'wt-frontend';
import './LandmarkEntry.css';

const LandmarkEntry = (props) => {

    const [editingLandmark, toggleEditingLandmark] = useState(false);

    const deleteLandmark = () => {
        props.showDelete(props.landmark);
        // props.deleteLandmark(props.landmark);
    }

    const editLandmark = (e) => {
        props.editLandmark(e.target.value, props.landmark);
        toggleEditingLandmark(false);
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
                            <WButton className='edit-landmark-button' onClick={() => toggleEditingLandmark(!editingLandmark)}>
                                <span className='material-icons'>edit</span>
                            </WButton> : <br/>
                    }
                </WCol>
                <WCol size='10' className='landmark-col'>
                    {
                        !editingLandmark ? <span className='landmark-name'>{props.landmark}</span>
                        : 
                        <WInput
                            className='landmark-input'
                            defaultValue={props.landmark}
                            onBlur={editLandmark}
                            autoFocus
                        >
                        </WInput>
                    }
                </WCol>
            </WRow>
        </div>
    );
}

export default LandmarkEntry;