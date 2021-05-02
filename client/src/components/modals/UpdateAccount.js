import React, { useState } 	from 'react';
import { UPDATE_ACCOUNT }			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';

const UpdateAccount= (props) => {
	const [input, setInput] = useState({ email: '', password: '', name: ''});
	const [loading, toggleLoading] = useState(false);
	const [Update] = useMutation(UPDATE_ACCOUNT);

	
	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

	const handleUpdateAccount = async (e) => {
		for (let field in input) {
			if (!input[field]) {
				alert('All fields must be filled out to register');
				return;
			}
		}
		const { loading, error, data } = await Update({ variables: { ...input, _id: props.user._id } });
		if (loading) { toggleLoading(true) };
		if (error) { return `Error: ${error.message}` };
		if (data) {
			console.log(data)
			toggleLoading(false);
			props.fetchUser();
			props.setShowCreate(false);
		};
	};

	return (
		<WModal className="signup-modal"  cover="true" visible={props.setShowCreate}>
			<WMHeader  className="modal-header" onClose={() => props.setShowCreate(false)}>
				Enter Updated Account Information
			</WMHeader>

			{
				loading ? <div />
					: <WMMain>
							<WRow className="modal-col-gap signup-modal">
								<WCol size="6">
									<WInput 
										className="" onBlur={updateInput} name="name" labelAnimation="up" 
										barAnimation="solid" labelText="Name" wType="outlined" inputType="text" 
										defaultValue={props.user.name}
									/>
								</WCol>
								{/* <WCol size="6">
									<WInput 
										className="" onBlur={updateInput} name="lastName" labelAnimation="up" 
										barAnimation="solid" labelText="Last Name" wType="outlined" inputType="text" 
									/>
								</WCol> */}
							</WRow>

							<div className="modal-spacer">&nbsp;</div>
							<WInput 
								className="modal-input" onBlur={updateInput} name="email" labelAnimation="up" 
								barAnimation="solid" labelText="Email Address" wType="outlined" inputType="text"
								defaultValue={props.user.email} 
							/>
							<div className="modal-spacer">&nbsp;</div>
							<WInput 
								className="modal-input" onBlur={updateInput} name="password" labelAnimation="up" 
								barAnimation="solid" labelText="Password" wType="outlined" inputType="password" 
								defaultValue={props.user.password} 
							/>
					</WMMain>
			}
			<WMFooter>
				<WButton className="modal-button" onClick={handleUpdateAccount} span clickAnimation="ripple-light" hoverAnimation="modal-button" shape="rounded" color="modal-button">
					Submit
				</WButton>
			</WMFooter>
			
		</WModal>
	);
}

export default UpdateAccount;