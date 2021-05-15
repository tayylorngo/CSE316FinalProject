import { gql } from "@apollo/client";

export const GET_DB_USER = gql`
	query GetDBUser {
		getCurrentUser {
			_id
			name
			email
		}
	}
`;

export const GET_DB_REGIONS = gql`
	query GetDBRegions {
		getAllRegions{
			_id
			name
			capital
			leader
			parentRegion
			owner
			subregions
			landmarks
		}
	}
`;
