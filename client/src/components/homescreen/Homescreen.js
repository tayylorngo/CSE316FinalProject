import Logo 							from '../navbar/Logo';
import Login 							from '../modals/Login';
import Delete 							from '../modals/Delete';
import MainContents 					from '../main/MainContents';
import CreateAccount 					from '../modals/CreateAccount';
import NavbarOptions 					from '../navbar/NavbarOptions';
import * as mutations 					from '../../cache/mutations';
import SidebarContents 					from '../sidebar/SidebarContents';
import { GET_DB_TODOS } 				from '../../cache/queries';
import { GET_DB_REGIONS }				from '../../cache/queries';
import React, { useEffect, useState } 				from 'react';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import { UpdateListField_Transaction, 
	SortItems_Transaction,
	UpdateListItems_Transaction, 
	ReorderItems_Transaction, 
	EditItem_Transaction } 				from '../../utils/jsTPS';
import UpdateAccount from '../modals/UpdateAccount';
import Welcome from '../Welcome/Welcome';
import MapContents from '../MapContents/MapContents';
import MapSpreadsheet from '../MapSpreadsheet/MapSpreadsheet';
import './Homescreen.css';
import {Route, useHistory, Switch} from 'react-router-dom';

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
	let activeSubregions = [];

	const [activeMap, setActiveMap] 		  = useState({});
	const [mapToBeDeleted, setMapToBeDeleted] = useState({});

	let SidebarData = [];
	const [sortRule, setSortRule] = useState('unsorted'); // 1 is ascending, -1 desc
	const [activeList, setActiveList] 		= useState({});
	const [showDelete, toggleShowDelete] 	= useState(false);
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
	const [canUndo, setCanUndo] = useState(props.tps.hasTransactionToUndo());
	const [canRedo, setCanRedo] = useState(props.tps.hasTransactionToRedo());

	const[showUpdate, toggleShowUpdate] = useState(false);

	const { loading, error, data, refetch } = useQuery(GET_DB_REGIONS);

	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { 
		for(let region of data.getAllRegions) {
			regions.push(region)
			if(region.parentRegion === "none"){
				maps.push(region);
			}
		}
		if(Object.keys(activeMap).length !== 0){
			let subregions = activeMap.subregions;
			subregions.forEach((subregion) => {
				regions.forEach((region) => {
					if(subregion === region._id){
						activeSubregions.push(region);
					}
				});
			});
		}
	}

	// NOTE: might not need to be async
	const reloadList = async () => {
		if (activeList._id) {
			let tempID = activeList._id;
			let list = todolists.find(list => list._id === tempID);
			setActiveList(list);
		}
	}

	const reloadMap = async () => {
		if(activeMap._id){
			let tempID = activeMap._id;
			let map = regions.find(map => map._id === tempID);
			setActiveMap(map);
		}
	}

	const loadTodoList = (list) => {
		props.tps.clearAllTransactions();
		setCanUndo(props.tps.hasTransactionToUndo());
		setCanRedo(props.tps.hasTransactionToRedo());
		setActiveList(list);
	}

	const loadMap = (map) => {
		setActiveMap(map);
	}

	const loadMapToBeDeleted = (map) => {
		setMapToBeDeleted(map);
	}

	const mutationOptions = {
		refetchQueries: [{ query: GET_DB_REGIONS }], 
		awaitRefetchQueries: true,
		onCompleted: () => reloadMap()
	}

	const [ReorderTodoItems] 		= useMutation(mutations.REORDER_ITEMS, mutationOptions);
	const [sortTodoItems] 		= useMutation(mutations.SORT_ITEMS, mutationOptions);
	const [UpdateTodoItemField] 	= useMutation(mutations.UPDATE_ITEM_FIELD, mutationOptions);
	const [UpdateTodolistField] 	= useMutation(mutations.UPDATE_TODOLIST_FIELD, mutationOptions);
	const [DeleteTodoItem] 			= useMutation(mutations.DELETE_ITEM, mutationOptions);
	const [AddTodoItem] 			= useMutation(mutations.ADD_ITEM, mutationOptions);
	const [AddTodolist] 			= useMutation(mutations.ADD_TODOLIST);
	const [DeleteTodolist] 			= useMutation(mutations.DELETE_TODOLIST);

	const [AddMap] 					= useMutation(mutations.ADD_MAP, mutationOptions);
	const [DeleteMap]				= useMutation(mutations.DELETE_MAP, mutationOptions);
	const [AddRegion] 				= useMutation(mutations.ADD_REGION, mutationOptions);
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

	const addRegion = async () => {
		let currMap = activeMap;
		let newRegion = {
			_id: '',
			owner: props.user._id,
			name: "Untitled Region",
			capital: "None",
			leader: "None",
			parentRegion: currMap._id,
			subregions: [],
			landmarks: []
		};
		let index = currMap.subregions.length;
		AddRegion({variables: {region: newRegion, _id: currMap._id, index: index}, refetchQueries: [{query: GET_DB_REGIONS}]});
		// handleSetActiveMap(currMap._id);
	}

	const addItem = async () => {
		let list = activeList;
		const items = list.items;
		const newItem = {
			_id: '',
			description: 'No Description',
			due_date: 'No Date',
			assigned_to: 'No One',
			completed: false
		};
		let opcode = 1;
		let itemID = newItem._id;
		let listID = activeList._id;
		let transaction = new UpdateListItems_Transaction(listID, itemID, newItem, opcode, AddTodoItem, DeleteTodoItem);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};

	const deleteItem = async (item, index) => {
		let listID = activeList._id;
		let itemID = item._id;
		let opcode = 0;
		let itemToDelete = {
			_id: item._id,
			description: item.description,
			due_date: item.due_date,
			assigned_to: item.assigned_to,
			completed: item.completed
		}
		let transaction = new UpdateListItems_Transaction(listID, itemID, itemToDelete, opcode, AddTodoItem, DeleteTodoItem, index);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const editItem = async (itemID, field, value, prev) => {
		let flag = 0;
		if (field === 'completed') flag = 1;
		let listID = activeList._id;
		let transaction = new EditItem_Transaction(listID, itemID, field, prev, value, flag, UpdateTodoItemField);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const reorderItem = async (itemID, dir) => {
		let listID = activeList._id;
		let transaction = new ReorderItems_Transaction(listID, itemID, dir, ReorderTodoItems);
		props.tps.addTransaction(transaction);
		tpsRedo();
	};

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

	const updateListField = async (_id, field, value, prev) => {
		let transaction = new UpdateListField_Transaction(_id, field, prev, value, UpdateTodolistField);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	const handleSetActive = (_id) => {
		const selectedList = todolists.find(todo => todo._id === _id);
		loadTodoList(selectedList);
	};

	const handleSetActiveMap = (_id) => {
		const selectedMap = maps.find(map => map._id === _id);
		loadMap(selectedMap);
	}

	const handleSetActiveRegion = (_id) => {
		let selectedRegion = regions.find(region => region._id === _id);
		if(selectedRegion === undefined) selectedRegion = {}
		loadMap(selectedRegion);
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

	const setShowUpdate = () => {
		toggleShowDelete(false);
		toggleShowLogin(false);
		toggleShowCreate(false);
		toggleShowUpdate(!showUpdate);
	}
	
	const sort = (criteria) => {
		let prevSortRule = sortRule;
		setSortRule(criteria);
		let transaction = new SortItems_Transaction(activeList._id, criteria, prevSortRule, sortTodoItems);
		console.log(transaction)
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const history = useHistory();

	useEffect(() => {
		if(!props.user){
			history.push('/home');
		}
		if(props.user && Object.keys(activeMap).length === 0){
			history.push('/maps');
		}
		if(props.user && Object.keys(activeMap).length !== 0){
			history.push('/maps/' + activeMap._id);
		}
	});

	return (
		<WLayout wLayout="header">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' />
						</WNavItem>
					</ul>
					<ul>
						<NavbarOptions
							fetchUser={props.fetchUser} 	auth={auth} 
							setShowCreate={setShowCreate} 	setShowLogin={setShowLogin}
							setShowUpdate={setShowUpdate}
							reloadMaps={refetch} 			setActiveList={loadTodoList}
							user={props.user}
						/>
					</ul>
				</WNavbar>
			</WLHeader>

			<WLMain id="main-page">
				{
					showDelete && (<Delete deleteMap={deleteMap} setShowDelete={setShowDelete} activeMap={mapToBeDeleted} />)
				}

				{
					showLogin && (<Login fetchUser={props.fetchUser} reloadMaps={refetch}setShowLogin={setShowLogin}/>)
				}

				{
					showCreate && (<CreateAccount fetchUser={props.fetchUser} setShowCreate={setShowCreate} />)
				}

				{
					showUpdate && (<UpdateAccount fetchUser={props.fetchUser} setShowCreate={setShowUpdate} user={props.user} />)
				}
			</WLMain>
				<Switch>
					<Route path="/home" render={() => 
						 <Welcome/>
					}/>
					<Route exact path="/maps" render={() =>
						<WLMain id="main-page">
							<MapContents
								addMap={addNewMap} 
								maps={maps} 
								setShowDelete={setShowDelete} 
								editMapName={editMapName}
								handleSetActive={handleSetActiveMap}
								/>
						</WLMain>
					} />
					<Route path="/maps/:id" render={() =>
						<WLMain id="main-page">
							<MapSpreadsheet
								map={activeMap}
								addRegion={addRegion}
								activeSubregions={activeSubregions}
								setActiveMap={handleSetActiveRegion}
							/> 	
						</WLMain>
					}/>
				</Switch>
		</WLayout>
	);
};

export default Homescreen;