import { FormElement, IValue } from "classui/Components/Form/FormElement";
import { IJSONSchema } from "classui/Components/Form/Schema";
import { css, cx } from "classui/Emotion";
import * as React from "react";

export interface ITextProps {
	name: string;
	type?: "text" | "password" | "area" | "number";
	autoFocus?: boolean;
	schema?: IJSONSchema;
	children?: string;
	style?: React.CSSProperties;
	className?: string;
	defaultValue?: string;
	onChange?: (value: IValue) => void;
}

export interface ITextState {
	value?: string;
}

export class Text extends FormElement<ITextProps, ITextState> {
	static defaultProps = {
		autoFocus: false,
		type: "text"
	};
	private input: HTMLInputElement | HTMLTextAreaElement | null = null;

	constructor(props: ITextProps) {
		super(props);
		this.state = {
			value: this.props.defaultValue
		};
		this.validate = this.validate.bind(this);
		this.onChange = this.onChange.bind(this);
	}
	Render() {
		const props = {
			autoComplete: this.props.name,
			autoFocus: this.props.autoFocus,
			className: cx(
				css`
					width: 100%;
					border-bottom: 2px solid grey;
					padding: 5px 0px 3px 0px;
					&:focus {
						border-bottom: 2px solid black;
					}
				`,
				this.props.className
			),
			style: this.props.style,
			name: this.props.name,
			onChange: this.onChange,
			placeholder: this.props.children,
			ref: (ref: any) => (this.input = ref),
			spellCheck: false,
			value: this.state.value ? this.state.value : ""
		};
		return this.props.type === "area" ? (
			<textarea {...props} />
		) : (
			<input type={this.props.type} {...props} />
		);
	}

	public validate(focusOnError?: boolean) {
		const value = this.getValue();
		if (value.error) {
			focusOnError && this.input && this.input.focus();
		}
		this.props.onChange && this.props.onChange(value);
	}

	private onChange(e: any) {
		const value = e.target.value;
		this.setState(
			{
				value: value === "" ? undefined : value
			},
			this.validate
		);
	}
}
