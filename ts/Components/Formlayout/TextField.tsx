import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Text, ITextProps} from '../Form/Text';
import {FormHOC} from '../Form';
import {SAnim} from '../../Helper/Animation';
import * as classNames from 'classnames';

export interface IProps extends ITextProps {
	children: string,
	name: string
};

class _TextField extends React.Component<IProps, {error: null|string}> {
	constructor() {
		super();
		this.state = {
			error: null
		};
	}
	render() {
		let cls = classNames("formelement", {
			"error": this.state.error?true:false
		});
		return <label className={cls}>
			<div className="label">{this.props.children}</div>
			<div className="error">{this.state.error}</div>
			<Text report={(json:any)=>{this.setState({error: json.error})}} {...this.props}>Enter {this.props.children}</Text>
		</label>;
	}
};

export let TextField: React.ComponentClass<IProps> = FormHOC(_TextField);