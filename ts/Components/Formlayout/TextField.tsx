import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Text, ITextProps} from '../Form/Text';
import {FormHOC} from '../Form';

export interface IProps extends ITextProps {
	children: string,
	name: string
};

class _TextField extends React.Component<IProps, {}> {
	render() {
		return <label className="formelement">
			<div className="label">{this.props.children}</div>
			<Text {...this.props}></Text>
		</label>;
	}
};

export let TextField: React.ComponentClass<IProps> = FormHOC(_TextField);