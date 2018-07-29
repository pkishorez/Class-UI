import * as AJV from "ajv";
import { IJSONSchema } from "classui/Components/Form/Schema/JSONSchema";
import * as _ from "lodash";

export class Schema {
	static getSchema(schema: IJSONSchema, key: string) {
		return new Schema(schema).getSchema(key);
	}
	static validate(schema: IJSONSchema, data: any) {
		return new Schema(schema).validate(data);
	}

	private _validate: AJV.ValidateFunction;
	private schema: IJSONSchema;
	constructor(schema: IJSONSchema, options?: AJV.Options) {
		this.schema = schema;
		const ajv = new AJV({
			allErrors: true,
			coerceTypes: true,
			removeAdditional: true,
			useDefaults: true,
			...options
		});
		const validate = ajv.compile(schema);

		this._validate = validate;
	}

	getSchema(key: string) {
		const jschema_key = "properties." + key.replace(/\./g, ".properties.");
		return _.get(this.schema, jschema_key);
	}
	validate(data: any) {
		const valid = this._validate(data);
		if (!valid) {
			return _.map(this._validate.errors, "message").join(".");
		}
		return null;
	}
}
