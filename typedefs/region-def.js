const { gql } = require('apollo-server');


const typeDefs = gql `
	type Region {
        _id: String!
        name: String!
        capital: String!
        leader: String!
        parentRegion: String!
        owner: String!
        subregions: [String]
        landmarks: [String]
    }
    extend type Query {
        getAllRegions: [Region]
        getRegionById(_id: String!): Region 
    }
    extend type Mutation{
        addMap(region: RegionInput!): String
		addRegion(region: RegionInput!, _id: String!, index: Int!): String
        deleteMap(_id: String!): Boolean
        editMapName(_id: String!, name: String!): String
        deleteRegion(_id: String!): Boolean
        updateRegion(_id: String!, field: String!, value: String!): String
        addLandmark(_id: String!, name: String!): String
        deleteLandmark(_id: String!, name: String!): Boolean
        editLandmark(_id: String!, newLandmark: String!, prevLandmark: String!): String
        editParentRegion(_id: String!, newParentRegion: String!) : Boolean
        sortRegion(_id: String!, field: String!): String
    }
    input RegionInput{
        _id: String
        name: String
        capital: String
        leader: String
        parentRegion: String
        owner: String
        subregions: [String]
        landmarks: [String]
    }
`;

module.exports = { typeDefs: typeDefs }