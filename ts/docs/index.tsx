import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ClassUI} from '../ClassUI';
import {Content} from '../Content';
import {NavBar, NavbarRemain} from '../Navbar';
import {BrowserRouter as Router} from 'react-router-dom';
import {Dropdown} from '../Components/Dropdown';
import {Demo1} from './Demo1';
import {Demo2} from './Demo2';
import { Feedback } from '../Components/Feedback';
import { Table } from '../Components/Table';
import { Layout, Section } from '../Components/Layout';
import { Flash } from '../Components/Flash';
import { Formlayout } from '../Components/Formlayout/index';
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

ReactDOM.render(<Router >
		<ClassUI contentWidth={1024} fullHeight>
			<NavBar logo="Class-UI" fixed>
				<NavbarRemain />
				<Dropdown button="Playground" push="left">
					<li>Typescript</li>
					<li>Canvas2D</li>
					<li>Demo</li>
				</Dropdown>
				<Dropdown button="This is a very big task button" buttonMaxWidth={100} push="left">
				<li onClick={()=>Feedback.show("Hello World. :)", "success")} className="noTextWrap">My Tasks this is a very big text</li>
				<li onClick={()=>Feedback.show("Hello World.", "error")}>Manage Tasks</li>
				<li>Dashboard (TODO)</li>
				</Dropdown>
				<Dropdown button="tasks" push="left">
					<li>My Tasks</li>
					<li>Manage Tasks</li>
					<li>Dashboard (TODO)</li>
				</Dropdown>
				<div className="button">Kittu</div>
			</NavBar>
			<Content>
				<div style={{alignSelf: "center", margin: "auto"}}>
					<Page1/>
				</div>
			</Content>
		</ClassUI>
	</Router>,
	document.getElementById('app')
);