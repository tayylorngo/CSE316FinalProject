const ObjectId = require('mongoose').Types.ObjectId;
const Region = require('../models/region-model');
const Sorting = require('../utils/sorting')

// The underscore param, "_", is a wildcard that can represent any value;
// here it is a stand-in for the parent parameter, which can be read about in
// the Apollo Server documentation regarding resolvers

module.exports = {
	Query: {
		getAllRegions: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const regions = await Region.find({owner: _id});
			if(regions) {
				return (regions);
			} 
		},
		getRegionById: async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const regions = await Region.findOne({_id: objectId});
			if(regions) return regions;
			else return ({});
		},
	},
	Mutation: {
		addMap: async(_, args) => {
			const {region} = args;
			const {_id, owner, capital, leader, name, parentRegion, subregions, landmarks} = region;
			const mapId = new ObjectId();
			let newRegion = new Region({
				_id: mapId,
				owner: owner,
				capital: capital,
				leader: leader,
				name: name, 
				parentRegion: parentRegion,
				subregions: subregions, 
				landmarks: landmarks
			});
			const updated = await newRegion.save();
			return "";
		},
		addRegion: async(_, args) => {
			const {region, _id, index } = args;
			const parentRegionId = new ObjectId(_id);
			const found = await Region.findOne({_id: parentRegionId});
			let subregions1 = found.subregions;
			let newId = new ObjectId();
			if(region._id === ''){
				region._id = newId;
			}
			else{
				newId = region._id;
			}
			subregions1.splice(index, 0, newId);
			let {id, owner, capital, leader, name, parentRegion, subregions, landmarks} = region;
			let newRegion = new Region({
				_id: newId,
				owner: owner,
				capital: capital,
				leader: leader,
				name: name, 
				parentRegion: parentRegion,
				subregions: subregions, 
				landmarks: landmarks
			});
			await Region.updateOne({_id: parentRegionId}, {subregions: subregions1});
			const updated = await newRegion.save();
			return String(newId);
		},
		deleteMap: async(_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const deleted = await Region.deleteOne({_id: objectId});
			if(deleted){
				return true;
			}
			else{
				return false;
			}
		},
		deleteRegion: async(_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const found = await Region.findOne({_id: objectId});
			if(found.parentRegion !== 'none'){
				const parentId = new ObjectId(found.parentRegion);
				const foundParent = await Region.findOne({_id: parentId});
				let subregions = foundParent.subregions;
				for(let i = 0; i < subregions.length; i++){
					if(subregions[i] === _id){
						subregions.splice(i, 1);
					}
				}
				await Region.updateOne({_id: parentId}, {subregions: subregions});
			}
			const deleted = await Region.deleteOne({_id: objectId});
			if(deleted){
				return true;
			}
			else{
				return false;
			}
		},
		editMapName: async(_, args) => {
			const {_id, name} = args;
			const objectId = new ObjectId(_id);
			await Region.updateOne({_id: objectId}, {name: name});
			return "YO";
		},
		updateRegion: async(_, args) => {
			const {_id, field, value} = args;
			const objectId = new ObjectId(_id);
			if(field === 'name'){
				await Region.updateOne({_id: objectId}, {name: value});
			}
			else if(field === 'capital'){
				await Region.updateOne({_id: objectId}, {capital: value});
			}
			else if(field === 'leader'){
				await Region.updateOne({_id: objectId}, {leader: value});
			}
			return value;
		},
		addLandmark: async(_, args) => {
			const {_id, name} = args;
			const objectId = new ObjectId(_id);
			const found = await Region.findOne({_id: objectId});
			let landmarks = found.landmarks;
			landmarks.push(name);
			await Region.updateOne({_id: objectId}, {landmarks: landmarks});
			return name;
		},
		deleteLandmark: async(_, args) => {
			const {_id, name} = args;
			const objectId = new ObjectId(_id);
			const found = await Region.findOne({_id: objectId});
			let landmarks = found.landmarks;
			for(let i = 0; i < landmarks.length; i++){
				if(landmarks[i] === name){
					landmarks.splice(i, 1);
				}
			}
			let data = await Region.updateOne({_id: objectId}, {landmarks: landmarks});
			if(data){
				return true;
			}
			else{
				return false;
			}
		},
		editLandmark: async(_, args) => {
			const {_id, newLandmark, prevLandmark} = args;
			const objectId = new ObjectId(_id);
			const found = await Region.findOne({_id: objectId});
			let landmarks = found.landmarks;
			for(let i = 0; i < landmarks.length; i++){
				if(landmarks[i] === prevLandmark){
					landmarks[i] = newLandmark;
				}
			}
			await Region.updateOne({_id: objectId}, {landmarks: landmarks});
			return newLandmark;
		},
		editParentRegion: async(_, args) => {
			const {_id, newParentRegion} = args;
			const objectId = new ObjectId(_id);
			const newParentRegionId = new ObjectId(newParentRegion);

			const found = await Region.findOne({_id: objectId});
			const oldParentId = new ObjectId(found.parentRegion);
			await Region.updateOne({_id: objectId}, {parentRegion: newParentRegionId});

			const foundParentRegion = await Region.findOne({_id: newParentRegionId});
			let subregions = foundParentRegion.subregions;
			subregions = [...subregions, _id];
			await Region.updateOne({_id: foundParentRegion}, {subregions: subregions});

			const foundOldParentRegion = await Region.findOne({_id: oldParentId});
			let oldSubregions = foundOldParentRegion.subregions;
			for(let i = 0; i < oldSubregions.length; i++){
				if(oldSubregions[i] === _id){
					oldSubregions.splice(i, 1);
				}
			}
			await Region.updateOne({_id: foundOldParentRegion}, {subregions: oldSubregions});
			return true;
		},
		sortRegion: async(_, args) => {
			const {_id, field} = args;
			const objectId = new ObjectId(_id);
			const found = await Region.findOne({_id: objectId});
			let subregions = found.subregions;
			let subregionsArr = [];
			for(let i = 0; i < subregions.length; i++){
				let region = await Region.findOne({_id: new ObjectId(subregions[i])});
				if(region !== null)
					subregionsArr.push(region);
			}
			let subregionsArrCopy = [...subregionsArr];
			subregionsArr.sort((a, b) => (String(a[field]).localeCompare(String(b[field]))));
			if(JSON.stringify(subregionsArr) === JSON.stringify(subregionsArrCopy)){
				subregionsArr.sort((a, b) => (String(b[field]).localeCompare(String(a[field]))));
			}
			let newSubregions = [];
			for(subregion of subregionsArr){
				newSubregions.push(String(subregion._id));
			}
			await Region.updateOne({_id: objectId}, {subregions: newSubregions});
			return "";
		},
		setSubregions: async(_, args) => {
			const {_id, subregions} = args;
			await Region.updateOne({_id: new ObjectId(_id)}, {subregions: subregions});
			return "";
		}
	}
}