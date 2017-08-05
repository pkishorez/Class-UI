import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ClassUI} from '../ClassUI';
import {NavBar, NavbarRemain} from '../Navbar';
import {Content} from '../Content';
import {Form} from '../Components/Form';
import {Text} from '../Components/Form/Text';
import {Formlayout} from '../Components/Formlayout';
import {TextField} from '../Components/Formlayout/TextField';
import {Checkbox} from '../Components/Form/Checkbox';
import {Flash} from '../Components/Flash';
import {Dropdown} from '../Components/Dropdown';
import {Layout, Section} from '../Components/Layout';
import {MediaQuery} from '../Helper/MediaQuery';
import {SideMenu, Item} from '../Components/SideMenu';

ReactDOM.render(<ClassUI contentWidth={980}>
	<NavBar logo="Alumnies">
		<NavbarRemain />
		<div className="button stretch">Kittu</div>
		<Dropdown button="Settings" push="left">
			<li>Kishore</li>
			<li>Kishore</li>
			<li>Kishore</li>
		</Dropdown>
	</NavBar>
	<Content>
		<MediaQuery media="screen and (min-width: 500px)">
			<Layout gutter={15} c_props= {{card: true}} justify="start" align="start" mediaNoMatch={{
				direction: "column",
				c_props: {
					width: "100%"
				},
				gutter: 10,
				margin: 0
			}}>
				<Section width={150} card={false}>
					<SideMenu header="Actions">
						<Item>Kishore</Item>
						<Item>Kittu</Item>
						<Item>Hello</Item>
					</SideMenu>
				</Section>
				<Section remain >
					<h1>H1 Content</h1>
					<h2>H2 Content</h2>
					<h3>H3 Content</h3>
					<div className="button">This is a button</div>
					<h3>H4 Content</h3>
					<h5>H5 Content</h5>
					<h6>H6 Content</h6>
				</Section>
				<Section width={250} >Section1</Section>
			</Layout>
		</MediaQuery>
	</Content>
	</ClassUI>,
	document.getElementById('app')
);

Flash.flash((dismiss: Function)=>{
	return <Formlayout label="Personal Details" onSubmit={()=>{dismiss();}}>
		<TextField name="Kishore" autoFocus>Name</TextField>
		<TextField name="father_name">Father's Name</TextField>
		<TextField name="mother_name">Mother's Name</TextField>
		<Checkbox name="Accept">Kishore</Checkbox>
		<input type="submit" />
</Formlayout>});