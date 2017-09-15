import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface IProps {
	children: {
		id: string|number,
		[key: string]: any
	}[]
};
export interface IState {};

export class Table extends React.Component<IProps, IState> {
	render() {
		return <table className="table card-1">
			<thead>
				<tr>{
					Object.keys(this.props.children[0]).map((key, i)=>{
						return <th key={i}>{key}</th>;
					})
				}</tr>
			</thead>
			<tbody>{
				this.props.children.map((row)=>{
					return <tr key={row.id}>{
						Object.keys(row).map((key)=>{
							return <td key={key}>{row[key]}</td>
						})
					}</tr>;
				})
			}</tbody>
		</table>;
	}
}