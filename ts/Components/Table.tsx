import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';

export interface IProps {
	hoverable?: boolean
};
export interface IState {};

export class Table extends React.Component<IProps, IState> {
	static defaultProps: Partial<IProps> = {
		hoverable: true
	};
	render() {
		let cls = classNames("table", {
			hoverable: this.props.hoverable
		});
		return <table className={cls}>
			{this.props.children}
		</table>;
	}
}

export let THead = (props: any)=>{
	return <thead>
		<tr>
			{props.children}
		</tr>
	</thead>;
}

export let TBody = (props: any)=>{
	return <tbody>
		{props.children}
	</tbody>
};