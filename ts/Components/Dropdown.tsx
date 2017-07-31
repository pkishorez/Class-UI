import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {spring, Motion} from 'react-motion';
import {SAnim} from '../Helper/Animation';

export interface IProps {
	button: string,
	push?: "left"|"right"
};
export interface IState {
	active: boolean
};

export class Dropdown extends React.Component<IProps, IState> {
	static defaultProps = {
		push: "right"
	};
	constructor() {
		super();
		this.state = {
			active: false
		};
		this.toggle = this.toggle.bind(this);
		this.dismiss = this.dismiss.bind(this);
		window.addEventListener("click", this.dismiss);
	}

	componentWillUnmount() {
		window.removeEventListener("click", this.dismiss);
	}

	dismiss() {
		this.setState({
			active: false
		});
	}
	toggle(e: any) {
		this.setState({
			active: !this.state.active
		});
		e.stopPropagation();
	}
	render() {
		return <div className={"dropdown push-"+this.props.push}>
			<div className={("button "+(this.state.active?"active":""))} onClick={this.toggle}>{this.props.button}</div>

			<SAnim show={this.state.active}>
				<ul onClick={(e)=>e.stopPropagation()}>
					{this.props.children}
				</ul>
			</SAnim>
		</div>;
	}
}