import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ClassUI} from '../ClassUI';
import {NavBar, NavbarRemain} from '../Navbar';
import {Demo1} from './Demo1';
import {Demo2} from './Demo2';

ReactDOM.render(<ClassUI contentWidth={1024}>
	<NavBar logo="Class-UI">
		<NavbarRemain />
		<div className="button">Kittu</div>
	</NavBar>
		<Demo1 />
		<Demo2 />
	</ClassUI>,
	document.getElementById('app')
);