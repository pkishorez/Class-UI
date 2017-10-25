import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ClassUI} from '../ClassUI';
import {NavBar, NavbarRemain} from '../Navbar';
import {BrowserRouter as Router} from 'react-router-dom';
import {Demo1} from './Demo1';
import {Demo2} from './Demo2';

ReactDOM.render(<Router >
		<ClassUI contentWidth={1024} offline>
			<NavBar logo="Class-UI">
				<NavbarRemain />
				<div className="button">Kittu</div>
			</NavBar>
				<Demo1 />
				<Demo2 />
		</ClassUI>
	</Router>,
	document.getElementById('app')
);