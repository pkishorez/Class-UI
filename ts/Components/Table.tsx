import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';
import { Layout, Section } from './Layout';
import * as _ from 'lodash';

export interface IProps {
	hoverable?: boolean

	headerItems: string[],
	sortableItems?: string[]
	groupableItems?: string[] //Yet to be implemented!!!

	data: any[],
	columnUI?: {
		[id: string]: (value: any)=>any
	}
};
export interface IState {
	sort: {
		by: string
		order: "asc"|"desc"
	}
	groupby: string
};

export class Table extends React.Component<IProps, IState> {
	static defaultProps: Partial<IProps> = {
		hoverable: false
	};

	constructor(props: IProps, context: any) {
		super(props, context);

		this.state = {
			sort: {by: "", order: "asc"},
			groupby: ""
		};
		this.groupBy = this.groupBy.bind(this);
		this.getItemsByCriteria = this.getItemsByCriteria.bind(this);
		this.sortBy = this.sortBy.bind(this);
	}

	getItemsByCriteria(): any[] {
		if (this.state.sort.by!=""){
			let sortBy = (row: any)=>_.isString(row[this.state.sort.by])?row[this.state.sort.by].toLowerCase():row[this.state.sort.by];
			return _.orderBy(this.props.data, 
				[sortBy],
			this.state.sort.order);
		}
		return this.props.data;
	}
	groupBy(key: string) {

	}
	sortBy(key: string) {
		if (_.includes(this.props.sortableItems, key)) {
			let order = "asc" as IState["sort"]["order"];
			if (this.state.sort.by==key) {
				order = this.state.sort.order=="asc"?"desc":"asc";
			}
			this.setState({
				sort: {
					by: key,
					order: order
				}
			});
		}
	}
	render() {
		let cls = classNames("table", {
			hoverable: this.props.hoverable
		});

		let data = this.getItemsByCriteria();

		let bodyItems = data.map((row: any, i)=>{
			return <tr key={i}>{
				this.props.headerItems.map((item, i)=>{
					if (this.props.columnUI && this.props.columnUI[item]) {
						return <td key={item}>{this.props.columnUI[item](row[item])}</td>;
					}
					return <td key={item}>{row[item]}</td>
				})
			}</tr>;
		});

		let headerItems = this.props.headerItems.map((item, i)=>{
			const sort = this.state.sort;
			return <th key={item} onClick={()=>{
				this.sortBy(item);
			}}>
				<Layout>
					<Section remain>{item}</Section>
					<Section style={{width: 30, textAlign: 'right'}}>
						{_.includes(this.props.sortableItems, item)?<i className={
							(sort.by==item)?"fa fa-sort-amount-"+sort.order:"fa fa-unsorted"}></i>
						:null}
					</Section>
				</Layout>
			</th>;
		});

		return <table className={cls}>
			<THead>
				{headerItems}
			</THead>
			<TBody>
				{bodyItems}
			</TBody>
		</table>;
	}
}

let THead = (props: any)=>{
	return <thead>
		<tr>
			{props.children}
		</tr>
	</thead>;
}

let TBody = (props: any)=>{
	return <tbody>
		{props.children}
	</tbody>
};