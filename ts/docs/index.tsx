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

ReactDOM.render(<Router >
		<ClassUI contentWidth={1024}>
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
			<Content fullHeight>
			<Page1/>
					<div style={{backgroundColor: 'white', padding: 10}}>
					<h1>H1 Content</h1>
					<h2>H2 Content</h2>
					<h3>H3 Content</h3>
					<h4>H4 Content</h4>
					<h5>H5 Content</h5>
					<h6>H6 Content</h6>
					<hr />
					<h1>Badges</h1>
					<Layout gutter={20}>
						<Section clsName="badge success">Success</Section>
						<Section clsName="badge error">Error</Section>
						<Section clsName="badge grey">Grey</Section>
						<Section clsName="badge sunflower">Sun Flower</Section>
						<Section clsName="badge carrot">Carrot</Section>
					</Layout>
					<hr />
					<h1>Table :</h1>
<Table rowSelectable hoverable sortableItems={["name", "age"]} headerItems={["name", "age", "status"]} data={[{
	name: "kishore",
	age: 25,
	status: "success"
}, {
	name: "Kittu",
	age: 25,
	status: "error"
}, {
	name: "Sage",
	age: 50,
	status: "grey"
}
]} columnUI={{
	"status": (data)=>{
		return <div className={"badge inline-block "+data.status}>{data.status}</div>;
	}
}}>
</Table>
					<div className="button" onClick={()=>Flash.flash((dismiss: Function)=>{
						return <Formlayout cls="card-4" label="Personal Details" style={{width: 250}} default={{
							details: {
								name: "Kishore"
							},
							name: "Kittu",
							agree: true,
							gender: "male",
							option: "hello"
						}} schema={{
							type: "object",
							properties: {
								details: {
									type: "object",
									properties: {
										name: {
											type: "string",
											minLength: 5,
											maxLength: 5
										},
										email: {
											type: "string",
											format: "email"
										}	
									},
									required: ["name", "email"]
								}
							},
							required: ["details"]
						}} onSubmit={(data: any)=>{console.log(data);}}>
							<TextField name="details.name" label="Name *" autoFocus>Name</TextField>
							<TextField label="Father's Name" name="father_name">Father's Name</TextField>
							<TextField label="Email ID" name="details.email">Email ID</TextField>
							<TextField label="Mother's Name" name="mother_name">Mother's Name</TextField>
							<div>
							<Checkbox inline name="agree">Male</Checkbox>
							<Checkbox inline name="gendr">Female</Checkbox>
							</div>
							<Radio inline name="gender" values={[{label: "Male", value: "male"}, {label: "Female", value: "female"}]}></Radio>
							<Select top
								options={["kishore", "kittu", "hello", "Kishore1", "Kittu2", "Hello2"]}
								name="option"></Select>
							<input type="submit" />
							<div className="button" onClick={()=>{
								Drawer.open(()=>{
									return <div className="button">Hey man, cool :)</div>
								})
							}}>Drawer</div>
						</Formlayout>;
					}, false, false, false, "card-5")}>This is a button</div>
				</div>
				<div className="button primary">This is primary button.</div>
			</Content>
		</ClassUI>
	</Router>,
	document.getElementById('app')
);