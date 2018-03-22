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
	validate(data: any) {
		let valid = this._validate(data);
		if (!valid) {
			return _.map(this._validate.errors, "message").join(".");
		}
		return null;
	}
	static validate(schema: IJSONSchema, data: any) {
		let ajv = new AJV({
			allErrors: true,
			useDefaults: true,
			coerceTypes: true,
			removeAdditional: true
		});
		var validate = ajv.compile(schema);
		let valid = validate(data);
		if (!valid) {
			return _.map(validate.errors, "message").join(".");
		}
		return null;
	}
}