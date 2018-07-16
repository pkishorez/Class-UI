import { FormElement } from "classui/Components/Form/FormElement";
import * as React from "react";

export interface IFileProps {
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export class File extends FormElement<IFileProps, {}> {
	validate(focusOnError: boolean) {
		// Do nothing.
	}
	Render() {
		return <input type="file" onChange={this.props.onChange} />;
	}
}
