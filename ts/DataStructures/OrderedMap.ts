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
		let inited = this.init(orderedMap);
		if (typeof inited=="string") {
			console.error("VERY SERIOUS ERROR !!!", inited);
			return this;
		}
		this.orderedMap = inited;
		this.Tschema = schema;
	}

	performAction(action: IOrderedMapAction<T>): IOrderedMapAction<T> | string {
		switch(action.type) {
			case "INIT": {
				if (action.state) {
					let init = this.init(action.state);
					if (typeof init == "string") {
						return init;
					}
					this.orderedMap = init;
				}
				else {
					action.state = this.orderedMap;
				}
				break;
			}
			case "ADD": {
				let new_id = this.add(action.value, action._id);
				if (typeof new_id=="string") {
					action._id = new_id;
				}
				else {
					return new_id.error;
				}
				break;
			}
			case "DELETE": {
				let del = this.del(action._id);
				if (typeof del=="string") {
					return del;
				}
				this.orderedMap = del;
				break;
			}
			case "MODIFY": {
				let modified = this.modify(action._id, action.value);
				if (typeof modified=="string") {
					return modified;
				}
				this.orderedMap = modified;
				break;
			}
			case "REORDER": {
				let reordered = this.reorder(action.order);
				if (typeof reordered=="string") {
					return reordered;
				}
				this.orderedMap = reordered;
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

	init(orderedMap: IOrderedMap<T>): IOrderedMap<T> | string {
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
		return "Integrity failure. DATASTRUCTURE ERROR!!!";
	}

	add(value: T, _id = v4()): string|{error: string} {
		// START VALIDATION
		let error = Schema.validate(this.Tschema, value);
		if (error) {
			return {error};
		}
		// END OF VALIDATION

		if (this.orderedMap.map[_id]) {
			return {error: "Record with id: "+_id+" already present"};
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

	del(map_id: string): IOrderedMap<T> | string {
		let filtered = this.orderedMap.order.filter(id=>map_id!=id);
		if (_.isEqual(filtered, this.orderedMap.order)) {
			return "Couldn't find record with id : "+map_id;
		}
		this.orderedMap = {
			...this.orderedMap,
			map: _.pick(this.orderedMap.map as any, filtered),
			order: filtered
		}
		return this.orderedMap;
	}

	modify(map_id: string, value: Partial<T>): IOrderedMap<T> | string {
		value = {
			...this.orderedMap.map[map_id] as any,
			...value as any
		};
		// START VALIDATE SCHEMA
		let error = Schema.validate(this.Tschema, value);
		if (error) {
			return error;
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
			return this.orderedMap;
		}
		else {
			return "No record found to modify the value.";
		}
	}

	reorder(order: string[]): IOrderedMap<T> | string {
		if (_.isEqual(_.sortBy(order), _.sortBy(this.orderedMap.order))) {
			this.orderedMap = {
				...this.orderedMap,
				order
			};
		}
		else {
			return "ORDER MISMATCH!!!";
		}
		return this.orderedMap;
	}
}