import {IPropSchema} from './interface';
import * as _ from 'lodash';

export let PropSchema = {
	isProperty(schema: IPropSchema) {
		if (typeof schema.$type=="string") {
			return true;
		}
		return false;
	},
	validate(schema: IPropSchema | undefined, value: string) {
		if (!schema){
			return null;
		}
		switch(schema.$type)
		{
			case "any": {
				return null;
			}
			case "string":
			case "email":
			case "number": {
				if ((schema.$length && value.length!=schema.$length)) {
					return `Length should be ${schema.$length}`;
				}
				if ((schema.$maxLength && value.length>schema.$maxLength) || (schema.$minLength && value.length<schema.$minLength)) {
					return `Len should be b/w : (${schema.$minLength?schema.$minLength:0} and ${schema.$maxLength?schema.$maxLength:'any'})`;
				}
				break;
			}
		}
		switch(schema.$type)
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
				let num = parseFloat(value);
				if (isNaN(num)) {
					return "Invalid number :(";
				}
				if ((schema.$max && num>schema.$max) || (schema.$min && num<schema.$min)) {
					return `Number should be b/w : (${schema.$min?schema.$min:0} and ${schema.$max?schema.$max:'any'})`;
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
	},
	populate(schema: IPropSchema, value?: string) {
		if (!value) {
			if (schema.$defaultValue) {
				value = schema.$defaultValue;
			}
			else {
				return undefined;
			}
		}
		switch(schema.$type) {
			case "number": {
				let num = parseFloat(value);
				if (isNaN(num)) {
					console.error("Number type should be a valid number.", schema, value);
					return value;
				}
				return num;
			}
		}
		return value;
	}
}