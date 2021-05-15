import Logo 							from '../navbar/Logo';
import Login 							from '../modals/Login';
import Delete 							from '../modals/Delete';
import CreateAccount 					from '../modals/CreateAccount';
import NavbarOptions 					from '../navbar/NavbarOptions';
import * as mutations 					from '../../cache/mutations';
import { GET_DB_REGIONS }				from '../../cache/queries';
import React, { useState } 				from 'react';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain } from 'wt-frontend';
import UpdateAccount from '../modals/UpdateAccount';
import Welcome from '../Welcome/Welcome';
import MapContents from '../MapContents/MapContents';
import MapSpreadsheet from '../MapSpreadsheet/MapSpreadsheet';
import RegionViewer from '../RegionViewer/RegionViewer';
import './Homescreen.css';
import {Route, useHistory, Switch, Redirect} from 'react-router-dom';
import AddNewMap from '../modals/AddNewMap';

const Homescreen = (props) => {

	const keyCombination = (e, callback) => {
		if(e.key === 'z' && e.ctrlKey) {
			if(props.tps.hasTransactionToUndo()) {
				tpsUndo();
			}
		}
		else if (e.key === 'y' && e.ctrlKey) { 
			if(props.tps.hasTransactionToRedo()) {
				tpsRedo();
			}
		}
	}
	document.onkeydown = keyCombination;

	const auth = props.user === null ? false : true;

	let todolists 	= [];
	let regions = [];
	let maps = [];

	const [mapToBeDeleted, setMapToBeDeleted] = useState({});

	const [activeList, setActiveList] 		= useState({});
	const [showDelete, toggleShowDelete] 	= useState(false);
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
	const [showNewMap, toggleShowNewMap] 	= useState(false);

	const [canUndo, setCanUndo] = useState(props.tps.hasTransactionToUndo());
	const [canRedo, setCanRedo] = useState(props.tps.hasTransactionToRedo());

	const[showUpdate, toggleShowUpdate] = useState(false);

	const { loading, error, data, refetch } = useQuery(GET_DB_REGIONS);

	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { 
		for(let region of data.getAllRegions) {
			regions.push(region);
			if(region.parentRegion === "none"){
				maps.push(region);
			}
		}
	}


	const loadTodoList = (list) => {
		props.tps.clearAllTransactions();
		setCanUndo(props.tps.hasTransactionToUndo());
		setCanRedo(props.tps.hasTransactionToRedo());
		setActiveList(list);
	}


	const loadMapToBeDeleted = (map) => {
		setMapToBeDeleted(map);
	}

	const mutationOptions = {
		refetchQueries: [{ query: GET_DB_REGIONS }], 
		awaitRefetchQueries: true,
		// onCompleted: () => reloadMap()
	}

	const [AddMap] 					= useMutation(mutations.ADD_MAP, mutationOptions);
	const [DeleteMap]				= useMutation(mutations.DELETE_MAP, mutationOptions);
	const [EditMapName]				= useMutation(mutations.EDIT_MAP_NAME, mutationOptions);

	const tpsUndo = async () => {
		const ret = await props.tps.undoTransaction();
		if(ret) {
			setCanUndo(props.tps.hasTransactionToUndo());
			setCanRedo(props.tps.hasTransactionToRedo());
		}
	}

	const tpsRedo = async () => {
		const ret = await props.tps.doTransaction();
		if(ret) {
			setCanUndo(props.tps.hasTransactionToUndo());
			setCanRedo(props.tps.hasTransactionToRedo());
		}
	}

	const addNewMap = async (name) => {
		let map = {
			_id: '',
			name: name,
			owner: props.user._id,
			capital: "none",
			leader: "none",
			parentRegion: "none",
			subregions: [],
			landmarks: []
		}
		const { data } = await AddMap({variables: {region: map}, refetchQueries: [{query: GET_DB_REGIONS}]});
		if(data){
			console.log(data);
		}
	}

	const deleteMap = async (_id) => {
		await DeleteMap({variables: {_id: _id}, refetchQueries: [{query: GET_DB_REGIONS}]});
		loadMapToBeDeleted({});
	}

	const editMapName = async (_id, name) => {
		console.log(_id);
		await EditMapName({variables: {_id: _id, name: name}, refetchQueries: [{query: GET_DB_REGIONS}]});
	}

	const handleSetActiveMap = (_id) => {
		history.push('/maps/' + _id);
	}

	const handleSetMapToBeDeleted = (_id) => {
		const selectedMap = maps.find(map => map._id === _id);
		loadMapToBeDeleted(selectedMap);
	}

	const setShowLogin = () => {
		toggleShowDelete(false);
		toggleShowCreate(false);
		toggleShowUpdate(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleShowDelete(false);
		toggleShowLogin(false);
		toggleShowUpdate(false);
		toggleShowCreate(!showCreate);
	};

	const setShowDelete = (id) => {
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowUpdate(false);
		toggleShowDelete(!showDelete);
		handleSetMapToBeDeleted(id);
	};

	const setShowNewMap = () => {
		toggleShowDelete(false);
		toggleShowLogin(false);
		toggleShowUpdate(false);
		toggleShowNewMap(!showNewMap);
	};

	const setShowUpdate = () => {
		toggleShowDelete(false);
		toggleShowLogin(false);
		toggleShowCreate(false);
		toggleShowUpdate(!showUpdate);
	}
	
	const history = useHistory();

	return (
		<WLayout wLayout="header">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' history={history} />
						</WNavItem>
					</ul>
					<ul>
						<NavbarOptions
							fetchUser={props.fetchUser} 	auth={auth} 
							setShowCreate={setShowCreate} 	setShowLogin={setShowLogin}
							setShowUpdate={setShowUpdate}
							reloadMaps={refetch} 			setActiveList={loadTodoList}
							user={props.user}
							history={history}
							regions={regions}
						/>
					</ul>
				</WNavbar>
			</WLHeader>

			<WLMain id="main-page">
				{
					showDelete && (<Delete deleteMap={deleteMap} setShowDelete={setShowDelete} activeMap={mapToBeDeleted} />)
				}

				{
					showLogin && (<Login fetchUser={props.fetchUser} reloadMaps={refetch}setShowLogin={setShowLogin} history={history}/>)
				}

				{
					showCreate && (<CreateAccount fetchUser={props.fetchUser} setShowCreate={setShowCreate} />)
				}

				{
					showUpdate && (<UpdateAccount fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} user={props.user} />)
				}

				{
					showNewMap && (<AddNewMap fetchUser={props.fetchUser} addNewMap={addNewMap} setShowNewMap={setShowNewMap} user={props.user} />)
				}
			</WLMain>

				<Switch>
					<Redirect exact from="/" to={ {pathname: "/home"} } />
					<Route exact path="/home" render={() => 
						<WLMain id="main-page">
						 	<Welcome
								user={props.user}
							 />
						</WLMain>
					}/>
					<Route exact path="/maps" render={() =>
						<WLMain id="main-page">
							<MapContents
								addMap={addNewMap} 
								maps={maps} 
								setShowDelete={setShowDelete}
								setShowNewMap={setShowNewMap} 
								editMapName={editMapName}
								handleSetActive={handleSetActiveMap}
								user={props.user}
								/>
						</WLMain>
					} />
					<Route path="/maps/:id" render={() =>
						<WLMain id="main-page">
							<MapSpreadsheet
								history={history}
								user={props.user}
								tps={props.tps}
							/> 	
						</WLMain>
					}/>
					<Route exact path='/viewer/:id' render={() => 
                        <WLMain id="main-page">
							<RegionViewer
								tps={props.tps}
								history={history}
        					/>    	
						</WLMain>
                	}/>
				</Switch>
		</WLayout>
	);
};

export default Homescreen;