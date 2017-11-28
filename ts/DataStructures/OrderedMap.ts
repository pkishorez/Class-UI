import {v4} from 'uuid';
import * as _ from 'lodash';
import {Schema, IJSONSchema} from '../Components/Form/Schema';

export interface IOrderedMap<T>{
	map: {
		[id: string]: T
	},
	order: string[]
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
};

export class OrderedMap<T> {
	private orderedMap: IOrderedMap<T>;
	private Tschema: IJSONSchema;
	constructor(orderedMap: IOrderedMap<T>, schema: IJSONSchema = {}) {
		if (!orderedMap) {
			orderedMap = {map: {}, order: []};
		}
		this.orderedMap = this.init(orderedMap);
		this.Tschema = schema;
	}

	performAction(action: IOrderedMapAction<T>): IOrderedMapAction<T> {
		switch(action.type) {
			case "INIT": {
				if (action.state) {
					this.orderedMap = this.init(action.state);					
				}
				else {
					action.state = this.orderedMap;
				}
				break;
			}
			case "ADD": {
				let new_id = this.add(action.value, action._id);
				if (new_id) {
					action._id = new_id;
				}
				break;
			}
			case "DELETE": {
				this.orderedMap = this.del(action._id);
				break;
			}
			case "MODIFY": {
				this.orderedMap = this.modify(action._id, action.value);
				break;
			}
			case "REORDER": {
				this.orderedMap = this.reorder(action.order);
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

	init(orderedMap: IOrderedMap<T>): IOrderedMap<T> {
		// Integrity check to make sure all keys in map are present in order.
		let mapKeys = _.sortBy(Object.keys(orderedMap.map));
		let order = _.sortBy(orderedMap.order);

		if (_.isEqual(mapKeys, order)) {
			// INTEGRITY IS Good :)
			if (_.isEqual(orderedMap, this.orderedMap)) {
				// NO CHANGE.
				return this.orderedMap;
			}
			return orderedMap;
		}
		// Operation rejected. Integrity failure.
		return this.orderedMap;
	}

	add(value: T, _id = v4()): string|null {
		// START VALIDATION
		let error = Schema.validate(this.Tschema, value);
		if (error) {
			console.error(error);
			return null;
		}
		// END OF VALIDATION

		if (this.orderedMap.map[_id]) {
			return null;
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
		return _id;
	}

	del(map_id: string): IOrderedMap<T> {
		let filtered = this.orderedMap.order.filter(id=>map_id!=id);
		if (_.isEqual(filtered, this.orderedMap.order)) {
			return this.orderedMap;
		}
		this.orderedMap = {
			...this.orderedMap,
			map: _.pick(this.orderedMap.map as any, filtered),
			order: filtered
		}
		return this.orderedMap;
	}

	modify(map_id: string, value: Partial<T>): IOrderedMap<T> {
		value = {
			...this.orderedMap.map[map_id] as any,
			...value as any
		};
		// START VALIDATE SCHEMA
		let error = Schema.validate(this.Tschema, value);
		if (error) {
			console.error(error);
			return this.orderedMap;
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
		return this.orderedMap;
	}

	reorder(order: string[]): IOrderedMap<T> {
		if (_.isEqual(_.sortBy(order), _.sortBy(this.orderedMap.order))) {
			this.orderedMap = {
				...this.orderedMap,
				order
			};
		}
		else {
			console.error("NOT EQUAL ORDER", order.sort(), this.orderedMap.order.sort());
		}
		return this.orderedMap;
	}
}