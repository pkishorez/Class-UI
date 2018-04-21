import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Layout, Section } from './Layout';
import * as _ from 'lodash';
import { Menu, MItem } from './Menu';
import { cx, styled } from 'classui/Emotion';

export interface IProps {
	hoverable?: boolean

	rowSelectable?: boolean
	onSelect?: (elems: any[])=>void

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
	selected: any[]
};

let ETable = styled('table')`
	display: table;
	background-color: white;
	border-collapse: collapse;
	border-spacing: 0;
	width: 100%;

	> thead {
		> tr {
			font-weight: 900;

			> th {
				cursor: pointer;
				opacity: 0.7;
				text-transform: capitalize;
				&:hover {
					background-color: rgba(0,0,0,0.01);
					opacity: 1;
				}
			}
		}
	}

	&.hoverable {
		> tbody {
			> tr:hover{
				background-color: rgb(245, 245, 245);
			}
		}
	}

	> tbody {
		tr{
			@include transition(all 0.3s);
		}
		> tr.active {
			&:hover, & {
				background-color: map-get($theme, color);
				color: white;	
			}
		}
	}
	> thead, > tbody {
		> tr {
			border-bottom: 1px solid #CACACA;
			text-align: left;

			> td, >th {
				padding: 7px 17px;
			}
		}
	}
`;

export class Table extends React.Component<IProps, IState> {
	static defaultProps: Partial<IProps> = {
		hoverable: false,
		sortableItems: [],
		groupableItems: [],
		rowSelectable: false
	};

	constructor(props: IProps, context: any) {
		super(props, context);

		this.state = {
			sort: {by: "", order: "asc"},
			group: {
				by: props.defaultGroup,
				value: undefined
			},
			selected: []
		};
		this.groupBy = this.groupBy.bind(this);
		this.getItems = this.getItems.bind(this);
		this.sortBy = this.sortBy.bind(this);
	}

	getItems(): any[] {
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
		if (!_.isArray(data))
			data = [];
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
	selectRow(row: any) {
		let toggle = (arr: any[], elem: any)=>{
			let index = _.findIndex(arr, (e: any)=>_.isEqual(e, elem));
			if (index!=-1) {
				return arr.filter(e=>!_.isEqual(e, elem));
			}
			return [...arr,elem];
		}
		let selectedElems = toggle(this.state.selected, row);
		this.setState({
			selected: selectedElems
		});
		this.props.onSelect && this.props.onSelect(selectedElems);
	}
	render() {

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
		let bodyItems = this.getItems().map((row: any, i)=>{
			return <tr className={(_.findIndex(this.state.selected, e=>_.isEqual(e, row))!=-1)?"active":""}
			onClick={()=>{
				this.props.rowOnClick?this.props.rowOnClick(row):null;
				if (this.props.rowSelectable) {
					this.selectRow(row);
				}
			}} key={i}>{
				this.props.headerItems.map((item, i)=>{
					if (this.props.columnUI && this.props.columnUI[item]) {
						return <td key={item}>{this.props.columnUI[item](row)}</td>;
					}
					return <td key={item}>{row[item]}</td>
				})
			}</tr>;
		});

		
		let groupMenu = this.state.group.by?<Menu header={_.capitalize(this.state.group.by)}>
			{[undefined, ...Object.keys(_.groupBy(this.props.data, this.state.group.by))].map((item)=>{
				return <MItem key={item?item:Math.random()+""} active={this.state.group.value==item}
					style={{minWidth: 150}} onClick={()=>{
					this.state.group.by?this.groupBy(this.state.group.by, item):null;
				}}>{item?item:"All"}</MItem>;
			})}
		</Menu>:null;

		let dataTable = <ETable className={cx({
			hoverable: this.props.hoverable
		})}>
			<THead>
				{headerItems}
			</THead>
			<TBody>
				{bodyItems}
			</TBody>
		</ETable>;
		return this.state.group.by?<Layout gutter={20} align="flex-start">
			<Section>{groupMenu}</Section>
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