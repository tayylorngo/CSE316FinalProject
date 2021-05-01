import React from 'react';
import './MapSpreadsheet.css';
import {WRow, WCol, WButton} from 'wt-frontend';
import RegionEntry from '../RegionEntry/RegionEntry'

const MapSpreadsheet = (props) => {

    const whiteColor = {
        color: "white",
        fontSize: "1.5rem",
        marginRight: "0.5%"
    }

    const blueColor = {
        color: "lightblue",
        fontSize: "1.5rem",
        fontWeight: "bold"
    }

    const handleAddRegion = () => {
        props.addRegion();
    }

    const marginTop = {
        marginTop: "2.3%"
    }

    const marginTop2 = {
        marginTop: "1.4%"
    }

    return(
        <div id="map-spreadsheet">
            <div id="regionName"><span style={whiteColor}>Region Name: </span><span style={blueColor}>{props.map.name}</span></div>
            <WRow>
                <WCol id="controls">
                    <WButton onClick={handleAddRegion}>
                        ADD REGION
                    </WButton>
                </WCol>
            </WRow>
            <WRow>
                <WCol size="2" className="table-heading">
                    <div style={marginTop}>Name</div>
                </WCol>
                <WCol size="2" className="table-heading">
                <div style={marginTop}>Capital</div>
                </WCol>
                <WCol size="2" className="table-heading">
                <div style={marginTop}>Leader</div>
                </WCol>
                <WCol size="2" className="table-heading">
                <div style={marginTop}>Flag</div>
                </WCol>
                <WCol size="4" className="table-heading">
                <div style={marginTop2}>Landmarks</div>
                </WCol>
            </WRow>
            {
                props.activeSubregions &&
                props.activeSubregions.map(entry => (
                    <RegionEntry
                        key={entry._id}
                        entry={entry}
                    />
                    )
                )
            }
        </div>
    );
}

export default MapSpreadsheet;