import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {spring, Motion} from 'react-motion';
import {SAnim} from '../Helper/Animation';

export interface IProps {
	buttonMaxWidth?: number
	button: string,
	push?: "left"|"right"
};
export interface IState {
	active: boolean
};

export class Dropdown extends React.Component<IProps, IState> {
	clickedWithinDropdown = false;
	static defaultProps = {
		push: "right"
	};
	constructor(props: IProps, context: any) {
		super(props, context);
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
		if (this.clickedWithinDropdown) {
			this.clickedWithinDropdown = false;
			return;
		}
		this.setState({
			active: false
		});
	}
	toggle(e: any) {
		this.setState({
			active: !this.state.active
		});
		this.clickedWithinDropdown = true;
	}
	render() {
		return <div className={"dropdown push-"+this.props.push}>
			<div className={("button "+(this.state.active?"active":""))} onClick={this.toggle}>
				<span className="inline-block noTextWrap" style={{
					maxWidth: this.props.buttonMaxWidth
				}}>{this.props.button}</span> <i className="fa fa-angle-down"></i>
			</div>

			<SAnim show={this.state.active}>
				<ul onClick={()=>this.clickedWithinDropdown = true}>
					{this.props.children}
				</ul>
			</SAnim>
		</div>;
	}
}