import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
import { Layout, Section } from './Layout';
import {IOrderedMap} from '../DataStructures/OrderedMap';

export interface IProps {
	orderedMap: IOrderedMap<any>

	onClick?: (id: string)=>void
	canDelete?: boolean
	onDelete?: (id: string)=>void
	onOrderChange?: (order: string[])=>void
};

export class OrderedMapList extends React.Component<IProps> {
	static defaultProps: Partial<IProps> = {
		canDelete: true
	}
	constructor(props: IProps, context: any) {
		super(props, context);
		this.moveDown = this.moveDown.bind(this);
		this.moveUp = this.moveUp.bind(this);
	}
	private moveDown(index: number) {
		let order = _.cloneDeep(this.props.orderedMap.order);
		let temp = order[index];
		order[index] = order[index+1];
		order[index+1] = temp;
		if (this.props.onOrderChange) {
			this.props.onOrderChange(order);
		}
	}
	private moveUp(index: number) {
		let order = _.cloneDeep(this.props.orderedMap.order);
		let temp = order[index];
		order[index] = order[index-1];
		order[index-1] = temp;
		if (this.props.onOrderChange) {
			this.props.onOrderChange(order);
		}
	}
	render() {
		let order = this.props.orderedMap.order.map((item_id, i)=>{
			let index = i;
			let mappedItem = this.props.orderedMap.map[item_id];
			let up = <span className="button" style={{
				visibility: (index!=0)?"visible":"hidden"
			}} onClick={(e)=>{this.moveUp(index); e.stopPropagation()}}><i className="fa fa-long-arrow-up"></i></span>;

			let down = <span className="button" style={{
				visibility: (index!=this.props.orderedMap.order.length-1)?"visible":"hidden"
			}} onClick={(e)=>{this.moveDown(index); e.stopPropagation()}}>
				<i className="fa fa-long-arrow-down"></i>
			</span>;

			return <div className="item" onClick={(e)=>{
				this.props.onClick?this.props.onClick(item_id):null;
			}}>
				<Layout key={item_id} align="center" style={{height: 30}}>
					<Section>
						{mappedItem.title}
					</Section>
					<Section remain />
					<Section>
						{up}
						{down}
						{this.props.canDelete?<span style={{marginLeft: 10}} className="button primary" onClick={(e)=>{
							this.props.onDelete?this.props.onDelete(item_id):null
							e.stopPropagation();
						}}>
							<i className="fa fa-trash"></i>
						</span>:null}
					</Section>
				</Layout>
			</div>
		})
		return <div className="sidemenu">
			{order}
		</div>;
	}
}