import { gql } from "@apollo/client";

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			email 
			_id
			name
			password
		}
	}
`;

export const REGISTER = gql`
	mutation Register($email: String!, $password: String!, $name: String!) {
		register(email: $email, password: $password, name: $name) {
			email
			password
			name
		}
	}
`;
export const LOGOUT = gql`
	mutation Logout {
		logout 
	}
`;

export const UPDATE_ACCOUNT = gql`
	mutation Update($email: String!, $password: String!, $name: String!, $_id: String!){
		update(email: $email, password: $password, name: $name, _id: $_id){
			email
			password
			name
		}
	}
`;

export const ADD_MAP = gql`
	mutation AddMap($region: RegionInput!){
		addMap(region: $region)
	}
`;

export const ADD_REGION = gql`
	mutation AddRegion($region: RegionInput!, $_id: String!, $index: Int!){
		addRegion(region: $region, _id: $_id, index: $index)
	}
`;

export const DELETE_REGION = gql`
	mutation DeleteRegion($_id: String!){
		deleteRegion(_id: $_id)
	}
`;

export const DELETE_MAP = gql`
	mutation DeleteMap($_id: String!){
		deleteMap(_id: $_id)
	}
`;

export const UPDATE_REGION = gql`
	mutation UpdateRegion($_id: String!, $field: String!, $value: String!){
		updateRegion(_id: $_id, field: $field, value: $value)
	}
`;

export const EDIT_MAP_NAME = gql`
	mutation EditMapName($_id: String!, $name: String!){
		editMapName(_id: $_id, name: $name)
	}
`;

export const ADD_LANDMARK = gql`
	mutation AddLandmark($_id: String!, $name: String!){
		addLandmark(_id: $_id, name: $name)
	}
`;

export const DELETE_LANDMARK = gql`
	mutation DeleteLandmark($_id: String!, $name: String!){
		deleteLandmark(_id: $_id, name: $name)
	}
`;

export const EDIT_LANDMARK = gql`
	mutation EditLandmark($_id: String!, $newLandmark: String!, $prevLandmark: String!){
		editLandmark(_id: $_id, newLandmark: $newLandmark, prevLandmark: $prevLandmark)
	}
`;

export const EDIT_PARENT_REGION = gql`
	mutation EditParentRegion($_id: String!, $newParentRegion: String!){
		editParentRegion(_id: $_id, newParentRegion: $newParentRegion)
	}
`;

export const SORT_REGION = gql`
	mutation SortRegion($_id: String!, $field: String!){
		sortRegion(_id: $_id, field: $field)
	}
`;

export const SET_SUBREGIONS = gql`
	mutation SetSubregions($_id: String!, $subregions: [String]){
		setSubregions(_id: $_id, subregions: $subregions)
	}
`;