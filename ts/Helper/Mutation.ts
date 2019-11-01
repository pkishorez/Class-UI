import get from "lodash-es/get";
import set from "lodash-es/set";
import isArray from "lodash-es/isArray";
import isObject from "lodash-es/isObject";

export type IPatch =
	| {
			mutationType: "extend";
			path: string;
			value: any;
	  }
	| {
			mutationType: "paginate";
			path: string;
			operation: IArrayPatch;
	  }
	| {
			mutationType: "update";
			path: string;
			value: any;
	  };
export const update = (mainObj: any, { path, ...patch }: IPatch) => {
	switch (patch.mutationType) {
		case "paginate": {
			const target = get(mainObj, path, []);
			if (!isArray(target)) {
				throw new Error("Array expected");
			}
			return set(mainObj, path, updateArr(target, patch.operation));
		}
		case "extend": {
			const target = get(mainObj, path, {});
			if (!isObject(target)) {
				return new Error("Extend only works on Object.");
			}
			const result = set(
				mainObj,
				path,
				Object.assign({}, target, patch.value)
			);
			return result;
		}
		case "update": {
			if (mainObj === undefined) {
				return patch.value;
			}
			const result = set(mainObj, path, patch.value);
			return result;
		}
	}
};

type IArrayPatch =
	| {
			type: "deleteAtIndex";
			index: number;
	  }
	| {
			type: "delete";
			ref: { key?: string; value: any };
	  }
	| {
			type: "insertAfter";
			ref: { key?: string; value: any };
			value: any;
	  }
	| {
			type: "insertBefore";
			ref: { key: string; value: any };
			value: any;
	  };
const updateArr = (arr: any[] = [], patch: IArrayPatch) => {
	switch (patch.type) {
		case "deleteAtIndex": {
			if (patch.index === -1) return arr;
			arr.splice(patch.index, 1);
			return [...arr];
		}
		case "delete": {
			const { key, value } = patch.ref;
			return arr.filter(v => (key ? get(v, key) : v) !== value);
		}
		case "insertAfter": {
			const { key, value } = patch.ref;
			const index = arr.findIndex(v => (key ? get(v, key) : v) === value);
			console.log("INSERT AFTER : ", arr, index, patch);
			if (index === -1) {
				return arr;
			}
			// insert after.
			arr.splice(index + 1, 0, patch.value);
			console.log("INSERT AFTER : ", arr, index, patch);
			return [...arr];
		}
		case "insertBefore": {
			const { key, value } = patch.ref;
			const index = arr.findIndex(v => get(v, key) === value);
			if (index === -1) {
				return arr;
			}
			arr.splice(index, 0, patch.value);
			return [...arr];
		}
	}
};
