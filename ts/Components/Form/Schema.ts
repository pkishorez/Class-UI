import * as _ from 'lodash';

export type IcommonSchema = {

};

export type IString = IcommonSchema & {
	type: "string"
	minLength?: number
	maxLength?: number
};

export type INumber = IcommonSchema & {
	type: "number"
	minLength?: number,
	maxLength?: number
	min?: number
	max?: number
}

export type IList = IcommonSchema & {
	type: "list"
	values: string[]
}

export type IPropSchema = IString | INumber | IList;

export interface ISchema {
	[id: string]: IPropSchema
}

export let Validate = (schema: IPropSchema | undefined, value: string) => {
	if (!schema){
		return null;
	}
	switch(schema.type)
	{
		case "string":
		case "number": {
			if ((schema.maxLength && value.length>schema.maxLength) || (schema.minLength && value.length<schema.minLength)) {
				return `Len : (${schema.minLength?schema.minLength:0} and ${schema.maxLength?schema.maxLength:'any'})`;
			}
			break;
		}
	}
	switch(schema.type)
	{
		case "string": {
			break;
		}
		case "number": {
			if ((schema.max && parseInt(value)>schema.max) || (schema.min && parseInt(value)<schema.min)) {
				return `Number should be in between : (${schema.min?schema.min:0} and ${schema.max?schema.max:'any'})`;
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