import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ClassUI} from '../ClassUI';
import {NavBar, NavbarRemain} from '../Navbar';
import {BrowserRouter as Router} from 'react-router-dom';
import {Dropdown, DItem} from '../Components/Dropdown';
import {Button} from '../Components/Button';
import {Demo1} from './Demo1';
import {Demo2} from './Demo2';
import { Feedback } from '../Components/Feedback';
import { Table } from '../Components/Table';
import { Layout, Section, LSection } from '../Components/Layout';
import { Flash } from '../Components/Flash';
import { TextField } from '../Components/Formlayout/TextField';
import { Select, Checkbox, Radio } from '../Components/Form/index';
import { Drawer } from '../Components/Drawer';
import { Page1 } from './Page1';
import { IJSONSchema } from '../Components/Form/Schema/index';

let S_User: IJSONSchema = {
	type: "object",
	properties: {
		_id: {
			type: "string",
			pattern: "(^N\\d{6}$)|(admin)"
		},
		name: {
			type: "string"
		},
		email: {
			type: "string",
			format: "email"
		},
		password: {
			type: "string",
			minLength: 5
		},
		gender: {
			enum: ["male", "female"]
		},
		batch: {
			enum: ["E1", "E2", "E3", "E4"]
		},
		branch: {
			enum: ["CSE", "MME", "ECE", "MECH", "CHEMICAL"]
		},
		role: {
			enum: ["admin", "student"],
			default: "student"
		}
	},
	required: ["_id", "email", "password", "gender", "batch", "branch"]
};

ReactDOM.render(
	<ClassUI theme="fb" fullHeight EnableRouting>
		<Layout>
			<Section remain>
				<Layout column align="center" justify="center">
					<Section>
						<NavBar logo="Class-UI" dummy className="navbar" width={1024}>
							<NavbarRemain />
							<Dropdown button="tasks" push="left">
								<DItem disable>My Tasks</DItem>
								<DItem active>Manage Tasks</DItem>
								<DItem>Dashboard (TODO)</DItem>
							</Dropdown>
							<Button active={true} to="/page" onClick={()=>{
								Feedback.show("Hello Dude", "error");
							}}>Kittu</Button>
							<Button>Kittu</Button>
						</NavBar>
					</Section>
					<Section style={{width: 1024}}>
						<div>
							<Page1/>
						<h1>Hello World.</h1>
						<h1>Hello World.</h1>
						<h1>Hello World.</h1>
						<h1>Hello World.</h1>
						<h1>Hello World.</h1>
						<h1>Hello World.</h1>
						<h1>Hello World.</h1>
						<h1>Hello World.</h1>
						<h1>Hello World.</h1>
						<h1>Hello World.</h1>
						<h1>Hello World.</h1>
						<h1>Hello World.</h1>
						<h1>Hello World.</h1>
						<h1>Hello World.</h1>
						<h1>Hello World.</h1>
						<h1>Hello World.</h1>
						<h1>Hello World.</h1>
						<h1>Hello World.</h1>
						<h1>Hello World.</h1>
						<h1>Hello World.</h1>
						</div>
					</Section>
				</Layout>
			</Section>
			<Section>
				<div className="onlineList">
					Kishore is a good boy.
				</div>
			</Section>
		</Layout>
	</ClassUI>,
	document.getElementById('app')
);