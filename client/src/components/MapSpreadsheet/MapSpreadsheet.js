import React, {useState} from 'react';
import './MapSpreadsheet.css';
import {WRow, WCol, WButton} from 'wt-frontend';
import RegionEntry from '../RegionEntry/RegionEntry';
import RegionViewer from '../RegionViewer/RegionViewer';
import {Switch, Route} from 'react-router-dom';

const MapSpreadsheet = (props) => {

    const [showRegionViewer, toggleShowRegionViewer] = useState(false);

    const whiteColor = {
        color: "white",
        fontSize: "2rem",
        marginRight: "0.5%"
    }

    const handleAddRegion = () => {
        props.addRegion();
    }

    const goHome = () => {
        props.setActiveMap();
    }

    const returnToParentRegion = () => {
        props.setActiveMap(props.map.parentRegion);
    }

    const marginTop = {
        marginTop: "2.3%"
    }

    const marginTop2 = {
        marginTop: "1.4%"
    }

    if(showRegionViewer && props.map){
        props.history.push("/viewer/" + props.map._id);
    }

    return(
        <div id="map-spreadsheet">
            <div id="regionName"><span style={whiteColor}>Region Name: </span><span id="nameOfRegion">{props.map.name}</span></div>
            <WRow>
                <WCol id="controls" size='2'>
                    <WButton 
                        onClick={goHome}
                        color="primary"
                        shape="pill"
                    >
                        <span className="material-icons">home</span>
                    </WButton>
                    <WButton 
                        onClick={handleAddRegion}
                        color="primary"
                        shape="pill"
                    >
                        <span className="material-icons">add</span>
                    </WButton>
                    <WButton 
                        onClick={returnToParentRegion}
                        color="primary"
                        shape="pill"
                    >
                        <span className="material-icons">arrow_back</span>
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
                        showRegionViewer={toggleShowRegionViewer}
                    />
                    )
                )
            }
        </div>
    );
}

export default MapSpreadsheet;