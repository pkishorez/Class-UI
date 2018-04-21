import * as _ from 'lodash';
import * as AJV from 'ajv';
import {IJSONSchema} from './JSONSchema';

export class Schema {
	private _validate: AJV.ValidateFunction;
	private schema: IJSONSchema;
	constructor(schema: IJSONSchema) {
		this.schema = schema;
		let ajv = new AJV({
			allErrors: true,
			useDefaults: true,
			coerceTypes: true,
			removeAdditional: true
		});
		let validate = ajv.compile(schema);

		this._validate = validate;
	}
	getSchema(key: string) {
		let jschema_key = "properties."+key.replace(/\./g, ".properties.");
		return _.get(this.schema, jschema_key);
	}
	validate(data: any) {
		let valid = this._validate(data);
		if (!valid) {
			return _.map(this._validate.errors, "message").join(".");
		}
		return null;
	}
	static getSchema(schema: IJSONSchema, key: string) {
		return new Schema(schema).getSchema(key);
	}
	static validate(schema: IJSONSchema, data: any) {
		return new Schema(schema).validate(data);
	}
}