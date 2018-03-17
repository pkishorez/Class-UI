import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {SAnim} from '../Helper/Animation';
import * as classNames from 'classnames';

export interface IProps {

};

export interface IState {
	content?: any
	type: "success" | "error"
	show: boolean
};

let _instance: Feedback | null = null;
export class Feedback extends React.Component<IProps, IState> {
	static timeout: any = null;
	constructor(props: IProps, context: any) {
		super(props, context);
		this.state = {
			show: false,
			type: "success"
		};
		_instance = this;
		this.hide = this.hide.bind(this);
	}
	componentWillUnmount() {
		_instance = null;
	}
	static show(content: string, type: IState["type"] = "success", timeout: number=2) {
		if (!_instance) {
			console.error("Feedback component not found.");
			return;
		}
		_instance.setState({
			content,
			type,
			show: true
		});
		if (this.timeout) {
			clearTimeout(this.timeout);
			this.timeout = null;
		}
		this.timeout = setTimeout(_instance.hide, timeout*1000);
	}
	hide() {
		this.setState({
			show: false
		});
	}
	render() {
		return <SAnim animType="slideBottom" show={this.state.show}><div className="__feedback">
			<div className={classNames("__card", "_3", "content ", this.state.type)}>{this.state.content}</div>
		</div></SAnim>;
	}
}