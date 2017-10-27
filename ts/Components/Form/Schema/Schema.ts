import * as _ from 'lodash';
import {PropSchema} from './PropSchema';
import {ISchema, IPropSchema, ISchemaPopulate} from './interface';

export let Schema = {
	validate(schema: ISchema, data: any) {
		let keys = Object.keys(schema);
		let errors: string[] = [];
		keys.map((key)=>{
			// Check if the key is nested schema
			if (!PropSchema.isProperty(schema[key] as IPropSchema)) {
				// This is ISchema.
				let nerrors = Schema.validate(schema[key] as ISchema, data[key]);
				errors = errors.concat(nerrors?nerrors:[]);
			}
			// Skip optional keys.
			if ((schema[key] as IPropSchema).$optional) {
				if (!data[key]) {
					return;
				}
			}
			let validation = PropSchema.validate(schema[key] as IPropSchema, data[key]);
			if (validation) {
				errors.push(validation);
			}
		});
		if (errors.length!=0)
			return errors;
		return null;
	},

	// Cannot populate nested props.
	populate(populateSchema: ISchemaPopulate, data: any) {
		let keys = Object.keys(populateSchema.schema);
		let diff = _.difference(_.union(populateSchema.exclude, populateSchema.include), keys);
		diff.map((key)=>{
			console.error(`key ${key} not present in the schema : `, populateSchema.schema);
		});

		if (populateSchema.include) {
			data = _.pick(data, populateSchema.include);
		}
		else if (populateSchema.exclude) {
			data = _.omit(data, populateSchema.exclude);
		}
		// Set default values to fields that do not contain value.
		data = _populate(populateSchema.schema, data);
		
		function _populate(schema: ISchema, data: any) {
			for (let key in schema) {
				if (PropSchema.isProperty(schema[key] as IPropSchema)) {
					data[key] = PropSchema.populate((schema[key] as IPropSchema), data[key]);				
				}
				else {
					data = _populate((schema[key] as ISchema), data[key]);
				}
			}
			return data;
		}
		return data;
	}
}