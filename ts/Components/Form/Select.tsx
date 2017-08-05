import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface IProps {
	name: string,
	send_value?: (value: any)=>any
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

	send(value: string) {
		if (this.props.send_value){
			this.props.send_value({
				name: this.props.name,
				value
			});
		}
	}
	change(e: React.ChangeEvent<HTMLSelectElement>)
	{
		console.log("Changed", e.target.value);
		this.send(e.target.value);
	}
	componentDidMount() {
		if (this.select) {
			this.send(this.select.value);
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