import React from 'react';
import './MapSpreadsheet.css';
import {WRow, WCol} from 'wt-frontend';

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


    return(
        <div id="map-spreadsheet">
            <div id="regionName"><span style={whiteColor}>Region Name: </span><span style={blueColor}>{props.map.name}</span></div>
            <WRow>
                <WCol size="2">
                    Name
                </WCol>
                <WCol size="2">
                    Capital
                </WCol>
                <WCol size="2">
                    Leader
                </WCol>
                <WCol size="2">
                    Flag
                </WCol>
                <WCol size="4">
                    Landmarks
                </WCol>
            </WRow>
        </div>
    );
}

export default MapSpreadsheet;