import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Text} from '../Form/Text';

export interface IProps {
	children: string,
	name: string,
	_classui_form_capture?: boolean
	send_value?: Function
};

export class TextField extends React.Component<IProps, {}> {
	static defaultProps = {
		_classui_form_capture: true
	}
	render() {
		return <label className="formelement">
			<div className="label">{this.props.children}</div>
			<Text name={this.props.name} send_value={this.props.send_value}></Text>
		</label>;
	}
};