import React from 'react';
import './RegionEntry.css';
import {WRow, WCol} from 'wt-frontend';

const RegionEntry = (props) => {


    return(
        <div>
            <WRow>
            <WCol size="2">
                    {props.entry.name}
                </WCol>
                <WCol size="2">
                    {props.entry.capital}
                </WCol>
                <WCol size="2">
                    {props.entry.leader}
                </WCol>
                <WCol size="2">
                    {props.entry._id}
                </WCol>
                <WCol size="4">
                    {props.entry.landmarks}
                </WCol>
            </WRow>
        </div>
    )
}

export default RegionEntry;