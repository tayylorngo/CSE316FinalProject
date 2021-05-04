import React from 'react';
import {WRow, WCol} from 'wt-frontend';
import './LandmarkEntry.css';

const LandmarkEntry = (props) => {
    return(
        <div className='landmark'>
            <WRow>
                <WCol size='12'>
                    {props.landmark}
                </WCol>
            </WRow>
        </div>
    );
}

export default LandmarkEntry;