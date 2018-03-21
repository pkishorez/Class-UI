import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Text, ITextProps} from '../Form/Text';
import {SAnim} from '../../Helper/Animation';
import * as classNames from 'classnames';

export interface IProps extends ITextProps {
	label?: string
	name: string
};

export class TextField extends React.Component<IProps, {error: null|string|undefined}> {
	constructor(props: IProps, context: any) {
		super(props, context);
		this.state = {
			error: undefined
		};
		this.setError=this.setError.bind(this);
	}
	setError(error: string | null)
	{
		this.setState({error});
	}
	render() {
		let cls = classNames("__input_layout", {
			"error": this.state.error?true:false,
			"success": (this.state.error===null)?true:false
		});
		return <label className={cls}>
			{this.props.label?<div className="label">{this.props.label}</div>:null}
			<Text {...this.props} onError={this.setError}>{this.props.children}</Text>
			<div className="error">{this.state.error}</div>
		</label>;
	}
};