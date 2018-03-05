import {v4} from 'uuid';
import * as _ from 'lodash';
import {Schema, IJSONSchema} from '../Components/Form/Schema';

export interface IOrderedMap<T>{
	map: {
		[id: string]: T
	},
	order: string[]
	hidden?: string[]
}

export type IOrderedMapAction<T> = {
	type: "INIT"
	state: IOrderedMap<T>
} | {
	type: "ADD"
	_id?: string
	value: T
} | {
	type: "MODIFY"
	_id: string
	value: Partial<T>
} | {
	type: "DELETE"
	_id: string
} | {
	type: "REORDER"
	order: string[]
} | {
	type: "HIDDEN"
	hidden: string[]
};

export class OrderedMap<T> {
	private orderedMap: IOrderedMap<T> = {map: {}, order: []};
	private Tschema: IJSONSchema;
	constructor(orderedMap: IOrderedMap<T>, schema: IJSONSchema = {}) {
		this.init(orderedMap);
		this.Tschema = schema;
	}

	performAction(action: IOrderedMapAction<T>): IOrderedMapAction<T> | string {
		switch(action.type) {
			case "INIT": {
				this.init(action.state);
				break;
			}
			case "ADD": {
				if (!action._id){
					console.error("Action ID should be provided to add.");
					break;
				}
				this.add(action.value, action._id);
				break;
			}
			case "DELETE": {
				this.del(action._id);
				break;
			}
			case "MODIFY": {
				this.modify(action._id, action.value);
				break;
			}
			case "REORDER": {
				this.reorder(action.order);
				break;
			}
			case "HIDDEN": {
				this.orderedMap = {
					...this.orderedMap,
					hidden: action.hidden
				};
				break;
			}
		}
		return action;
	}

	getState() {
		return this.orderedMap;
	}

	toString() {
		return JSON.stringify(this.orderedMap);
	}

	init(orderedMap: IOrderedMap<T>) {
		// Integrity check to make sure all keys in map are present in order.
		let mapKeys = Object.keys(orderedMap.map);
		let order = orderedMap.order;

		// Combine mapkeys not present in order to order.
		order = _.union(order, mapKeys);

		// Remove order keys that are not present in map.
		order = _.difference(order, _.xor(order, mapKeys));

		this.orderedMap = {
			...orderedMap,
			order,
			hidden: orderedMap.hidden?_.intersection(orderedMap.hidden, mapKeys):[]
		}
	}

	add(value: T, _id: string) {
		// START VALIDATION
		let error = Schema.validate(this.Tschema, value);
		if (error) {
			console.error(error);
			return;
		}
		if (this.orderedMap.map[_id]) {
			console.error("Record with id: "+_id+" already present");
			return;
		}
		this.orderedMap = {
			...this.orderedMap,
			map: {
				...this.orderedMap.map,
				[_id]: value
			},
			order: [
				...this.orderedMap.order,
				_id
			]
		};
	}

	del(map_id: string) {
		if (!this.orderedMap.map[map_id]) {
			console.error("Couldn't find record with id : "+map_id);
			return;
		}
		this.orderedMap = {
			...this.orderedMap,
			map: _.omit(this.orderedMap.map, map_id),
			order: _.difference(this.orderedMap.order, [map_id]),
			hidden: _.difference(this.orderedMap.hidden, [map_id])
		};
	}

	modify(map_id: string, value: Partial<T>) {
		value = {
			...this.orderedMap.map[map_id] as any,
			...value as any
		};
		// START VALIDATE SCHEMA
		let error = Schema.validate(this.Tschema, value);
		if (error) {
			console.error(error);
			return;
		}
		// END OF VALIDATE SCHEMA
		if (this.orderedMap.map[map_id]) {
			this.orderedMap = {
				...this.orderedMap,
				map: {
					...this.orderedMap.map,
					[map_id]: value as any
				}
			}
		}
		else
			console.error("No record found to modify the value.");
	}

	reorder(order: string[]) {
		if (_.isEqual(_.sortBy(order), _.sortBy(this.orderedMap.order))) {
			this.orderedMap = {
				...this.orderedMap,
				order
			};
		}
		else {
			console.error("ORDER MISMATCH!!!");
		}
	}
}