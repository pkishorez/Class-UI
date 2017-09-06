import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as propTypes from 'prop-types';

export interface IProps {
	name: string
	options: string[]
	children?: any
};

export class Select extends React.Component<IProps, any> {
	private select: HTMLSelectElement | null;
	constructor() {
		super();
		this.send = this.send.bind(this);
		this.change = this.change.bind(this);
	}

	static contextTypes = {
		send_value: propTypes.func,
		delete_value: propTypes.func
	}

	send(value: string) {
		if (this.context.send_value){
			this.context.send_value({
				key: this.props.name,
				value
			});
		}
	}
	change(e: React.ChangeEvent<HTMLSelectElement>)
	{
		this.send(e.target.value);
	}
	componentDidMount() {
		if (this.select) {
			this.send(this.select.value);
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
		return <select name={this.props.name} onChange={this.change} ref={(ref)=>{this.select = ref;}}>
			{this.props.options.map((option)=>{
				return <option key={option} value={option}>{option}</option>
			})}
		</select>;
	}
};