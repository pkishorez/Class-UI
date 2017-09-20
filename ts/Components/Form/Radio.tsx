import * as React from 'react';
import * as ReactDOM from 'react-dom';

export let Radio = (props: any) => {
	return <label className="radio">
		<input type="radio"/>
		<div className="fake">•</div>
		{props.children}
	</label>;
};