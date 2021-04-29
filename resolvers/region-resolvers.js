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
			const { _id, region, index } = args;
			const regionId = new ObjectId(_id);
			const found = await Region.findOne({_id: regionId});
			if(!found) return ('Region not found');
			if(region._id === '') region._id = objectId;
			let subregions = found.subregions;
			if(index < 0) subregions.push(region);
			else subregions.splice(index, 0, region);
			
			const updated = await Region.updateOne({_id: regionId}, { subregions: subregions });

			if(updated) return (region._id)
			else return ('Could not add region');
		},
		deleteMap: async(_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const deleted = await Region.deleteOne({_id: objectId});
			return "YO";
		}
	}
}