import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ClassUI from 'classui/ClassUI';
import NavBar from 'classui/Components/Navbar';
import Content from 'classui/Components/Content';

ReactDOM.render(<ClassUI contentWidth={1024}>
			<NavBar logo="Alumnies">
			</NavBar>
			<Content>
				<h2>Hello Class-UI</h2>
			</Content>
	</ClassUI>,
	document.getElementById('app')
);