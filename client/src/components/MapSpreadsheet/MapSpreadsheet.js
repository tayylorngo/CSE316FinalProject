import React, {useState} from 'react';
import './MapSpreadsheet.css';
import {WRow, WCol, WButton} from 'wt-frontend';
import RegionEntry from '../RegionEntry/RegionEntry';
import RegionViewer from '../RegionViewer/RegionViewer';

const MapSpreadsheet = (props) => {

    const [showRegionViewer, toggleShowRegionViewer] = useState(false);

    const handleShowRegionViewer = () =>{
        toggleShowRegionViewer(!showRegionViewer);
    }

    const whiteColor = {
        color: "white",
        fontSize: "2rem",
        marginRight: "0.5%"
    }

    const blueColor = {
        color: "lightblue",
        fontSize: "2rem",
        fontWeight: "bold",
        cursor: "pointer"
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
        showRegionViewer ? 
        <RegionViewer
            map={props.map}
            toggleShowRegionViewer={handleShowRegionViewer}
        />                
        :
        <div id="map-spreadsheet">
            <div id="regionName"><span style={whiteColor}>Region Name: </span><span onClick={toggleShowRegionViewer}style={blueColor}>{props.map.name}</span></div>
            <WRow>
                <WCol id="controls">
                    <WButton 
                        onClick={handleAddRegion}
                        color="primary"
                        shape="pill"
                    >
                        <span class="material-icons">home</span>
                    </WButton>
                    <WButton 
                        onClick={handleAddRegion}
                        color="primary"
                        shape="pill"
                    >
                        <span class="material-icons">add</span>
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
                        handleSetActiveMap={props.setActiveMap}
                    />
                    )
                )
            }
        </div>
    );
}

export default MapSpreadsheet;