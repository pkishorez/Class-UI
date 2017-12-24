import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as classNames from 'classnames';
import { Layout, Section } from './Layout';
import * as _ from 'lodash';
import { Menu } from './Menu';

export interface IProps {
	hoverable?: boolean

	headerItems: string[],
	sortableItems?: string[]
	defaultGroup?: string
	groupableItems?: string[]

	data: any[],
	rowOnClick?: (rowdata: any)=>void
	columnUI?: {
		[id: string]: (value: any)=>any
	}
};
export interface IState {
	sort: {
		by: string
		order: "asc"|"desc"
	}
	group: {
		by?: string
		value?: any
	}
};

export class Table extends React.Component<IProps, IState> {
	static defaultProps: Partial<IProps> = {
		hoverable: false,
		sortableItems: [],
		groupableItems: []
	};

	constructor(props: IProps, context: any) {
		super(props, context);

		this.state = {
			sort: {by: "", order: "asc"},
			group: {
				by: props.defaultGroup,
				value: undefined
			}
		};
		this.groupBy = this.groupBy.bind(this);
		this.getItemsByCriteria = this.getItemsByCriteria.bind(this);
		this.sortBy = this.sortBy.bind(this);
	}

	getItemsByCriteria(): any[] {
		let data = this.props.data;
		if (this.state.sort.by!=""){
			let sortBy = (row: any)=>_.isString(row[this.state.sort.by])?row[this.state.sort.by].toLowerCase():row[this.state.sort.by];
			data = _.orderBy(data, 
				[sortBy],
			this.state.sort.order);
		}
		if (this.state.group.by && this.state.group.value) {
			data = _.groupBy(data, this.state.group.by)[this.state.group.value];
		}
		return data;
	}
	groupBy(item?: string, value?: string) {
		this.setState({
			group: {
				by: item,
				value
			}
		});
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

		let data = this.getItemsByCriteria();

		let bodyItems = data.map((row: any, i)=>{
			return <tr onClick={()=>this.props.rowOnClick?this.props.rowOnClick(row):null} key={i}>{
				this.props.headerItems.map((item, i)=>{
					if (this.props.columnUI && this.props.columnUI[item]) {
						return <td key={item}>{this.props.columnUI[item](row)}</td>;
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
				<Layout gutter={20}>
					<Section remain>{item}</Section>
					<Section style={{width: 30, textAlign: 'right'}}>
						{_.includes(this.props.sortableItems, item)?<i className={
							(sort.by==item)?"fa fa-sort-amount-"+sort.order:"fa fa-unsorted"}></i>
						:null}
					</Section>
					<Section>
						{_.includes(this.props.groupableItems, item)?
							<i className="fa fa-reorder button" onClick={(e)=>{
								this.groupBy(item);
								e.stopPropagation();
							}}></i>
						:null}
					</Section>
				</Layout>
			</th>;
		});

		let cls = classNames("table", {
			hoverable: this.props.hoverable
		});

		
		let groupItems = this.state.group.by?<Menu header={_.capitalize(this.state.group.by)}>
			{[undefined, ...Object.keys(_.groupBy(this.props.data, this.state.group.by))].map((item)=>{
				let cls = classNames("item", {
					active: this.state.group.value==item
				});
				return <div className={cls} style={{minWidth: 150}} onClick={()=>{
					this.state.group.by?this.groupBy(this.state.group.by, item):null;
				}}>{item?item:"All"}</div>;
			})}
		</Menu>:null;

		let dataTable = <table className={cls}>
			<THead>
				{headerItems}
			</THead>
			<TBody>
				{bodyItems}
			</TBody>
		</table>;
		return this.state.group.by?<Layout gutter={20} align="start">
			<Section>{groupItems}</Section>
			<Section remain>{dataTable}</Section>
		</Layout>:dataTable;
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