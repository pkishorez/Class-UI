import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ClassUI from './ts/ClassUI';

ReactDOM.render(<ClassUI contentWidth={1024}>
			<h2>Hello Class-UI</h2>
	</ClassUI>,
	document.getElementById('app')
);