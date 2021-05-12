import React from 'react';
import './RegionEntry.css';
import {WRow, WCol, WButton} from 'wt-frontend';

const RegionEntry = (props) => {

    const openNewRegion = () => {
        props.handleSetActiveMap(props.entry._id);
    }

    const openRegionViewer = () => {
        props.history.push("/viewer/" + props.activeRegion._id);
    }

    const handleDelete = () => {
        props.handleDeleteRegion(props.entry._id);
    }

    return(
        <div>
            <WRow>
                <WCol size="2" className="tableEntry subregion-name">
                    <div className="entry-name">
                        <span className='deleteButton'>
                            <button onClick={handleDelete}>
                                X
                            </button>
                        </span>
                        <span className="region-name" onClick={openNewRegion}> 
                            {props.entry.name}
                        </span>
                    </div>
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
                <WCol size="4" className="tableEntry landmarks" onClick={openRegionViewer}>
                    <div className="entry-name">{props.entry.landmarks}</div>
                </WCol>
            </WRow>
        </div>
    )
}

export default RegionEntry;