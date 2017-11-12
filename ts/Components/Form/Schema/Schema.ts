import * as _ from 'lodash';
import * as AJV from 'ajv';
import {IJSONSchema} from './JSONSchema';

export let Schema = {
	validate(schema: IJSONSchema, data: any) {
		let ajv = new AJV();
		var validate = ajv.compile(schema);
		let valid = validate(data);
		if (!valid) {
			return _.map(validate.errors, "message").join(".");
		}
		return null;
	},
	validatePartial(schema: IJSONSchema, data: any): any {
		let errors = null;
		if (schema.type=="object") {
			for (let key in data) {
				if (schema.properties && schema.properties[key]) {
					errors = this.validatePartial(schema.properties[key], data[key]);
					if (errors) {
						return errors;
					}
				}
				else {
					return `Key ${key} not present.`;
				}
			}
			return null
		}
		return this.validate(schema, data);
	}
}