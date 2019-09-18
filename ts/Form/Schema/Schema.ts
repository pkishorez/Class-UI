import AJV from "ajv";
import ajvErrors from "ajv-errors";
import { get as _get, map as _map } from "lodash-es";
import { IJSONSchema } from "./JSONSchema";
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
			jsonPointers: true,
			$data: true,
			...options
		});
		ajvErrors(ajv);
		const validate = ajv.compile(schema);

		this._validate = validate;
	}

	getSchema(key: string) {
		const jschema_key = "properties." + key.replace(/\./g, ".properties.");
		return _get(this.schema, jschema_key);
	}
	validate(data: any) {
		const valid = this._validate(data);
		if (!valid) {
			return this._validate.errors;
		}
		return null;
	}
}
