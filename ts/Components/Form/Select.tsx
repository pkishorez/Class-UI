import * as _ from "lodash";
import * as React from "react";
import { css, cx, IThemeColors, styled } from "../../Emotion";
import { SAnim } from "../../Helper/Animation";
import { BaseComponentProps, IBaseComponentProps } from "../Base";
import { FormElement } from "./FormElement";

export interface IProps extends IBaseComponentProps {
	name: string;
	options: (string | number)[];
	inline?: boolean;
	width?: number | string;
	children?: any;
	label?: string;
	top?: boolean;
	nonEditable?: boolean;
	defaultValue?: string;
}

export interface IState {
	hover: number;
	showSuggestions: boolean;
	suggestions: IProps["options"];
	error: boolean;
}

const ESelect = styled("label")`
	cursor: pointer;
	border: 1px solid #c4c4c4;
	&.error {
		border: 1px solid red;
	}
	display: flex;
	align-items: center;
	&:hover {
		background-color: #f4f4f4;
	}
`;
const ESuggestions = styled("ul")`
	position: absolute;
	background-color: white;
	max-height: 300px;
	overflow: auto;
	box-shadow: 0px 0px 3px grey;
`;
const ESuggestionItem = styled("li")`
	display: block;
	cursor: pointer;
	padding: 7px 10px;
	> .highlight {
		color: green;
		font-weight: 900;
	}
	&.active {
		background-color: inherit;
		color: ${(p: IThemeColors) => p.theme.color};
		cursor: default;
	}
	&:hover {
		background-color: ${(p: IThemeColors) => p.theme.color};
		color: ${(p: IThemeColors) => p.theme.contrast};
		> .highlight {
			color: ${(p: IThemeColors) => p.theme.contrast};
		}
	}
`;

export class Select extends FormElement<IProps, IState> {
	inputRef: any = React.createRef();
	_internalClick = false;
	constructor(props: IProps) {
		super(props);
		this.state = {
			error: false,
			hover: -1,
			showSuggestions: false,
			suggestions: this.props.options,
			value: this.props.defaultValue
		};
		this.onChange = this.onChange.bind(this);
		this.suggestions = this.suggestions.bind(this);
		this.getSuggestions = this.getSuggestions.bind(this);
		this.showSuggestions = this.showSuggestions.bind(this);
		this.hideSuggestions = this.hideSuggestions.bind(this);
		window.addEventListener("click", this.windowClick);
	}
	windowClick = () => {
		if (!this._internalClick) {
			// Do not hidesuggestions.
			this.hideSuggestions();
		}
		this._internalClick = false;
	};
	componentWillUnmount() {
		super.componentWillUnmount();
		window.removeEventListener("click", this.windowClick);
	}
	Render() {
		const width =
			typeof this.props.width === "string"
				? this.props.width
				: this.props.width + "px";
		return (
			<div
				{...BaseComponentProps(this.props)}
				className={cx(
					css`
						position: relative;
						margin-bottom: 10px;
						${this.props.inline
							? `display: inline-block;`
							: undefined} ${this.props.width
							? `width: ${width}`
							: undefined};
					`,
					this.props.className
				)}
			>
				<ESelect
					className={cx({
						error: this.state.error
					})}
					onClick={(e: any) => {
						this.inputRef.current.focus();
						// this.showSuggestions();
						// e.stopPropagation();
						// e.preventDefault();
					}}
				>
					<div
						style={{
							padding: 10,
							flexGrow: 1,
							display: this.props.nonEditable ? "block" : "none"
						}}
					>
						{this.props.label}{" "}
						{this.state.value ? (
							<span>
								:{" "}
								<span style={{ fontWeight: 900 }}>
									{this.state.value}
								</span>
							</span>
						) : (
							""
						)}
					</div>
					<input
						ref={this.inputRef}
						spellCheck={false}
						placeholder={this.props.label}
						readOnly={this.props.nonEditable ? true : false}
						className={css`
							color: black;
							${
								this.props.nonEditable
									? `
								opacity: 0;
								position: absolute;
								width: 0px;
								height: 0px;
								padding: 0px;
								margin: 0px;
							`
									: null
							}
							cursor: ${this.props.nonEditable ? "pointer" : "inherit"};
							width: 0;
							text-shadow: 0px 0px 0px #000;
							padding: 10px 7px;
							background-color: inherit;
							flex-grow: 1;
							transition: 0.3s padding;
							&:focus,
							&:hover {
								color: darkgreen;
							}
						`}
						autoComplete="off"
						type="text"
						onClick={() => {
							this._internalClick = true;
							this.showSuggestions();
						}}
						onFocus={() => {
							this.showSuggestions();
						}}
						value={
							this.props.nonEditable
								? this.props.label +
								  (this.state.value
										? ` : ${this.state.value}`
										: "")
								: this.state.value
						}
						name={this.props.name}
						onKeyDown={this.suggestions}
						onChange={this.onChange}
						// onBlur={() => {
						// 	setTimeout(() => {
						// 		this.hideSuggestions();
						// 	}, 1000);
						// }}
					/>
					<Icon style={{ marginRight: 15 }}>expand_more</Icon>
				</ESelect>
				<SAnim
					show={
						this.state.showSuggestions &&
						this.state.suggestions.length > 0
					}
					animType={this.props.top ? "slideTop" : "slideBottom"}
				>
					<ESuggestions
						className={css`
							position: absolute;
							${this.props.top
								? `
						bottom: ${this.props.nonEditable ? "0px" : "100%"};
						top: auto;
					`
								: `
						top: ${this.props.nonEditable ? "0px" : "100%"};
						bottom: auto;
					`} left: 0px;
							width: calc(100%);
							z-index: 1;
							padding: 7px 0px;
						`}
					>
						{this.props.label ? (
							<h3
								style={{
									cursor: "default",
									paddingLeft: 10
								}}
							>
								{this.props.label}
							</h3>
						) : (
							undefined
						)}
						{this.state.suggestions.map((option, i) => {
							return (
								<ESuggestionItem
									key={option}
									className={cx({
										active: option === this.state.value
									})}
									onClick={(e: any) => {
										e.stopPropagation();
										this.setState(
											{
												value: option,
												showSuggestions: false
											},
											this.validate
										);
									}}
								>
									{highlight(option, this.state.value)}
								</ESuggestionItem>
							);
						})}
					</ESuggestions>
				</SAnim>
			</div>
		);
	}
	public validate() {
		const error = this.schema
			? this.schema.validate(this.state.value)
			: null;
		if (error) {
			this.setState({
				error: true
			});
		} else {
			this.setState({
				error: false
			});
		}
	}

	private showSuggestions() {
		this.setState({
			showSuggestions: true
		});
	}
	private hideSuggestions() {
		this.setState({
			showSuggestions: false
		});
	}

	private onChange(e: React.ChangeEvent<HTMLInputElement>) {
		this.showSuggestions();
		if (this.props.nonEditable) {
			return;
		}
		this.setState(
			{
				value: e.target.value,
				suggestions: this.getSuggestions(e.target.value)
			},
			this.validate
		);
	}
	private suggestions(e: React.KeyboardEvent<HTMLInputElement>) {
		// Suggestions and navigating the suggestions logic goes here... TODO

		console.log(e.key);
		if (e.key === "Escape") {
			this.showSuggestions();
		} else if (e.key === "Tab") {
			this.hideSuggestions();
		} else if (e.key === "Enter") {
			this.hideSuggestions();
			e.preventDefault();
		}
	}
	private getSuggestions(val: string) {
		const options = _.uniq(this.props.options);
		if (this.props.nonEditable) {
			return options;
		}
		const suggestions = options.filter(option => {
			let value = val;
			value = value + "";
			option = option + "";
			if (option.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
				return option;
			}
		});
		return suggestions;
	}
}

const highlight = (option: string | number, hLight = "") => {
	option = option + "";
	hLight = hLight + "";
	const index = option.indexOf(hLight);
	if (index === -1) {
		return option;
	}
	return (
		<>
			{option.substring(0, index)}
			<span className="highlight">
				{option.substring(index, index + hLight.length)}
			</span>
			{option.substring(index + hLight.length)}
		</>
	);
};
