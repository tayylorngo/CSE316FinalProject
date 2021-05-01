import React from 'react';
import './RegionEntry.css';
import {WRow, WCol} from 'wt-frontend';

const RegionEntry = (props) => {

    return(
        <div>
            <WRow>
                <WCol size="2" className="tableEntry subregion-name">
                    <div className="entry-name">{props.entry.name}</div>
                </WCol>
                <WCol size="2" className="tableEntry capital-name">
                    <div className="entry-name">{props.entry.capital}</div>
                </WCol>
                <WCol size="2" className="tableEntry leader-name">
                    <div className="entry-name">{props.entry.leader}</div>
                </WCol>
                <WCol size="2" className="tableEntry flag">
                    <div className="entry-name">{props.entry._id}</div>
                </WCol>
                <WCol size="4" className="tableEntry landmarks">
                    <div className="entry-name">{props.entry.landmarks}</div>
                </WCol>
            </WRow>
        </div>
    )
}

export default RegionEntry;