import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Text} from '../Form/Text';
import {FormHOC} from '../Form';

export interface IProps {
	children: string,
	name: string
};

class _TextField extends React.Component<IProps, {}> {
	render() {
		return <label className="formelement">
			<div className="label">{this.props.children}</div>
			<Text name={this.props.name}></Text>
		</label>;
	}
};

export let TextField = FormHOC(_TextField);