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
