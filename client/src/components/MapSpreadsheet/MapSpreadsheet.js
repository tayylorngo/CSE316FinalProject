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

    return(
        <div id="map-spreadsheet">
            <div id="regionName"><span style={whiteColor}>Region Name: </span><span style={blueColor}>{props.map.name}</span></div>
            <WRow>
                <WCol>
                    <WButton onClick={handleAddRegion}>
                        ADD REGION
                    </WButton>
                </WCol>
            </WRow>
            <WRow>
                <WCol size="2" className="table-heading">
                    Name
                </WCol>
                <WCol size="2" className="table-heading">
                    Capital
                </WCol>
                <WCol size="2" className="table-heading">
                    Leader
                </WCol>
                <WCol size="2" className="table-heading">
                    Flag
                </WCol>
                <WCol size="4" className="table-heading">
                    Landmarks
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