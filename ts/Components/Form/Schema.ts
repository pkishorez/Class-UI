import * as _ from 'lodash';

export type _ICommonSchema = {
	defaultValue?: string
	optional?: boolean
};

export type _ILenghtSchema = {
	minLength?: number
	maxLength?: number
	length?: number
}
export type IString = _ICommonSchema & _ILenghtSchema & {
	type: "string"
};

export type IAny = _ICommonSchema & {
	type: "any"
};

export type IEmail = _ICommonSchema & _ILenghtSchema & {
	type: "email"
};

export type INumber = _ICommonSchema & _ILenghtSchema & {
	type: "number"
	min?: number
	max?: number
}

export type IList = _ICommonSchema & {
	type: "list"
	values: string[]
}

export type IPropSchema = IString | IEmail | INumber | IList | IAny;

export interface ISchema {
	[id: string]: IPropSchema | ISchema
}

export interface ISchemaPopulate {
	schema: ISchema
	include?: string[]
	exclude?: string[]
}

export let PropSchema = {
	validate(schema: IPropSchema | undefined, value: string) {
		if (!schema){
			return null;
		}
		switch(schema.type)
		{
			case "any": {
				return null;
			}
			case "string":
			case "email":
			case "number": {
				if ((schema.length && value.length!=schema.length)) {
					return `Length should be ${schema.length}`;
				}
				if ((schema.maxLength && value.length>schema.maxLength) || (schema.minLength && value.length<schema.minLength)) {
					return `Len should be b/w : (${schema.minLength?schema.minLength:0} and ${schema.maxLength?schema.maxLength:'any'})`;
				}
				break;
			}
		}
		switch(schema.type)
		{
			case "string": {
				break;
			}
			case "email": {
				let emailRegEx = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				if (!emailRegEx.test(value)){
					return "Invalid Email address";
				}
				break;
			}
			case "number": {
				if (isNaN(parseInt(value))) {
					return "Invalid number :(";
				}
				if ((schema.max && parseInt(value)>schema.max) || (schema.min && parseInt(value)<schema.min)) {
					return `Number should be b/w : (${schema.min?schema.min:0} and ${schema.max?schema.max:'any'})`;
				}
				break;
			}
			case "list": {
				if (schema.values && !_.includes(schema.values, value)) {
					return `Value should be in list (${schema.values})`;
				}
				break;
			}
		}
		return null;	
	}
}

export let Schema = {
	validate(schema: ISchema, data: any) {
		let keys = Object.keys(schema);
		let errors: string[] = [];
		keys.map((key)=>{
			// Skip optional keys.
			if (schema[key] && (schema[key] as IPropSchema).optional) {
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
		for (let key in populateSchema.schema) {
			if (!data[key]) {
				data[key] = (populateSchema.schema[key] as IPropSchema).defaultValue;
			}
		}
		return data;
	}
}