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
	}
}