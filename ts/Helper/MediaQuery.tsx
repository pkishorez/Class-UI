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
 */
export class MediaQuery extends React.Component<IProps, IState> {

	private handler: any = null;
	constructor(props: IProps, context: any) {
		super(props, context);
		this.state = {
			matched: false
		};
		this.handler = {
			setup: ()=>{
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
		
		let mProps = _.pick(child.props, Object.keys(child.props["mediaNoMatch"]));
		child = this.state.matched?child:React.cloneElement(child, _.merge(mProps, child.props["mediaNoMatch"]));
		return child;
	}
}