import * as _ from 'lodash';

export type _ICommonSchema = {
	defaultValue?: string
};

export type _ILenghtSchema = {
	minLength?: number
	maxLength?: number
	length?: number
}
export type IString = _ICommonSchema & _ILenghtSchema & {
	type: "string"
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

export type IPropSchema = IString | IEmail | INumber | IList;

export interface ISchema {
	[id: string]: IPropSchema
}

export interface ISchemaPopulate {
	include: string[]
	exclude: string[]
}

export let PropSchema = {
	validate(schema: IPropSchema | undefined, value: string) {
		if (!schema){
			return null;
		}
		switch(schema.type)
		{
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
			let validation = PropSchema.validate(schema[key], data[key]);
			if (validation) {
				errors.push(validation);
			}
		});
		if (errors.length!=0)
			return errors;
		return null;
	},
	populate(schema: ISchema, populateSchema: ISchemaPopulate, data: any) {
		let keys = Object.keys(schema);
		let diff = _.difference(_.union(populateSchema.exclude, populateSchema.include), keys);
		diff.map((key)=>{
			console.error(`key ${key} not present in the schema : `, schema);
		});

		if (populateSchema.include) {
			return _.pick(data, populateSchema.include);
		}
		else {
			return _.omit(data, populateSchema.exclude);
		}
	}
}