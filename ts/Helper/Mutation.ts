import get from "lodash-es/get";
import set from "lodash-es/set";
import isArray from "lodash-es/isArray";
import isObject from "lodash-es/isObject";

export type IPatch = (
	| {
			mutationType: "extend";
	  }
	| {
			mutationType: "paginate";
			operation: "insertAt" | "insertBefore" | "insertAfter" | "deleteAt";
			ref: {
				key?: string;
				value: any;
			};
	  }
	| {
			mutationType: "update";
	  }) & { path: string; value: any };
export const update = (mainObj: any, { path, value, ...patch }: IPatch) => {
	const target = get(mainObj, path);
	if (!target) {
		throw new Error(`Value not present at path specified. ${path}`);
	}
	switch (patch.mutationType) {
		case "paginate": {
			if (!isArray(target)) {
				return new Error("Array expected");
			}
			switch (patch.operation) {
				case "deleteAt": {
				}
				case "insertAfter": {
				}
				case "insertAt": {
				}
				case "insertBefore": {
				}
			}
		}
		case "extend": {
			if (!isObject(target)) {
				return new Error("Extend only works on Object.");
			}
			const result = set(mainObj, path, Object.assign({}, target, value));
			return result;
		}
		case "update": {
			const result = set(mainObj, path, value);
			return result;
		}
	}
};
