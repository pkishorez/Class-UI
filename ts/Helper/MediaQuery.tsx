import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';

import * as Enquire from 'enquire.js';

export interface IProps {
	media: string,
	children?: React.ReactElement<any>
};
export interface IState {
	matched: boolean
}; 

/**
 * Component to change layout responsively based on requirements.
 * Accepts minWidth and maxWidth without which the layout changes
 * as per the "data-nprops" properties.
 * 
 * data-populate is used for the child elements also to change
 * if layout changes. Only immediate children are allowed for now.
 */
class MediaQuery extends React.Component<IProps, IState> {

	private handler: any = null;
	constructor() {
		super();
		this.state = {
			matched: false
		};
		this.handler = {
			setup: ()=>{
				console.log("SETUP");
			},
			match: () => {
				this.setState({
					matched: true
				});
			},
			unmatch: ()=>{
				this.setState({
					matched: false
				});
			}
		};
	}
	componentWillMount() {
		Enquire.register(this.props.media, this.handler);
	}

    componentWillUnmount() {
		if (this.handler)
			Enquire.unregister(this.props.media, this.handler);
	}

	render() {
		if (React.Children.count(this.props.children)!=1) {
			console.error("MediaQuery should only contain 1 Child.");
		}
		let child: any = this.props.children;
		child = this.state.matched?child:React.cloneElement(child, child.props["medianomatch"]);
		return child;
	}
}

export default MediaQuery;