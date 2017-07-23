import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ClassUI from '../ClassUI';
import NavBar from '../Components/Navbar';
import Content from '../Components/Content';
import {Form} from '../Components/Form';
import {Text} from '../Components/Form/Text';
import {Formlayout} from '../Components/Formlayout';
import {TextField} from '../Components/Formlayout/TextField';
import {Flash} from '../Components/Flash';

ReactDOM.render(<ClassUI contentWidth={1024}>
			<NavBar logo="Alumnies">
			</NavBar>
			<Content>

			</Content>
	</ClassUI>,
	document.getElementById('app')
);

Flash.flash((dismiss: Function)=>{
	console.log("Hello");
	return <Formlayout label="Personal Details" onSubmit={()=>{dismiss();}}>
		<TextField name="name">Name</TextField>
		<TextField name="father_name">Father's Name</TextField>
		<TextField name="mother_name">Mother's Name</TextField>
		<input type="submit" />
</Formlayout>});