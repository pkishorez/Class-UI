import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ClassUI} from '../ClassUI';
import {NavBar, NavbarRemain} from '../Navbar';
import {BrowserRouter as Router} from 'react-router-dom';
import {Dropdown, DItem} from '../Components/Dropdown';
import {Button} from '../Components/Button';
import {Demo1} from './Demo1';
import {Demo2} from './Demo2';
import { Table } from '../Components/Table';
import { Layout, Section } from '../Components/Layout';
import { Overlay } from '../Overlay';
import { TextField } from '../Components/Formlayout/TextField';
import { Select, Checkbox, Radio } from '../Components/Form/index';
import { Page1 } from './Page1';
import { IJSONSchema } from '../Components/Form/Schema/index';
import { Schema } from 'classui/Components/Form/Schema/Schema';
import { css } from 'classui/Emotion';
import { CropHelper } from 'classui/Components/CropHelper';


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
		cnfPassword: {
			type: "string",
			constant: {
				$data: "1/password"
			}
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
	required: ["_id", "email", "password", "cnfPassword", "gender", "batch", "branch"]
};

ReactDOM.render(
	<ClassUI theme="fb" fullHeight EnableRouting>
			<Layout remain column align="center" justify="center">
				<Section>
					<NavBar card="2" logo="Class-UI" dummy className={css`
						position: fixed;
					`} width={1024}>
						<NavbarRemain />
						<Dropdown button="tasks" push="left">
							<DItem disable>My Tasks</DItem>
							<DItem active>Manage Tasks</DItem>
							<DItem onClick={()=>{
								ClassUI.setTheme("flat");
							}}>Dashboard (TODO)</DItem>
						</Dropdown>
						<Button active={true} to="/page" onClick={()=>{
							Overlay.feedback("Hello Dude", "error");
						}}>Kittu</Button>
						<Button>Kittu</Button>
					</NavBar>
					
				</Section>
				<Section>
					<div>
						<Page1/>
					</div>
				</Section>
				<Section>
					<div style={{
						margin: "auto",
						maxWidth: 900
					}}>
						<CropHelper minWidth={50} minHeight={50} imgsrc="/assets/pic.jpg">
							<img draggable={false} src="/assets/pic.jpg"/>
						</CropHelper>
					</div>
				</Section>
			</Layout>
	</ClassUI>,
	document.getElementById('app')
);