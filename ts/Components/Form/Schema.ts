import * as _ from 'lodash';

export type _ICommonSchema = {
	$defaultValue?: string
	$optional?: boolean
};

export type _ILenghtSchema = {
	$minLength?: number
	$maxLength?: number
	$length?: number
}
export type IString = _ICommonSchema & _ILenghtSchema & {
	$type: "string"
};

export type IAny = _ICommonSchema & {
	$type: "any"
};

export type IEmail = _ICommonSchema & _ILenghtSchema & {
	$type: "email"
};

export type INumber = _ICommonSchema & _ILenghtSchema & {
	$type: "number"
	$min?: number
	$max?: number
}

export type IList = _ICommonSchema & {
	$type: "list"
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