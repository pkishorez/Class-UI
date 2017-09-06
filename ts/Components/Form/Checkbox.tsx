import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as propTypes from 'prop-types';

export interface IProps {
	name: string,
	children: any,
	inline?: boolean
};

export class Checkbox extends React.Component<IProps, any> {
	private checkbox: HTMLInputElement | null;
	constructor() {
		super();
		this.send = this.send.bind(this);
		this.change = this.change.bind(this);
	}

	static contextTypes = {
		send_value: propTypes.func,
		delete_value: propTypes.func
	}

	send(value: boolean) {
		if (this.context.send_value){
			this.context.send_value({
				key: this.props.name,
				value
			});
		}
	}
	change(e: React.ChangeEvent<HTMLInputElement>)
	{
		this.send(e.target.checked);
	}

	componentDidMount() {
		if (this.checkbox) {
			this.send(this.checkbox.checked);
		}
	}

	componentWillUnmount()
	{
		if (this.context.delete_value)
		{
			this.context.delete_value(this.props.name);
		}
	}
	render() {
		return <label className={"checkbox"+(this.props.inline?" inline":"")}>
			<input type="checkbox" ref={(ref)=>{this.checkbox=ref;}} value="true" onChange={this.change} name={this.props.name}/>
			<div className="fake">✔</div>
			{this.props.children}
		</label>;
	}
};