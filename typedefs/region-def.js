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