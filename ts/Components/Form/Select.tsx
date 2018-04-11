import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as propTypes from 'prop-types';
import {FormElement} from './FormElement';
import { SAnim } from '../../Helper/Animation';
import * as _ from 'lodash';
import { styled, cx, css } from 'classui/Emotion';
import { Floater } from 'classui/Components/Floater';

export interface IProps {
	name: string
	options: (string|number)[]
	inline?: boolean
	width?: number|string
	children?: any
	label?: string
	top?: boolean
	nonEditable?: boolean
	defaultValue?: string
};

export interface IState {
	showSuggestions: boolean
	error: boolean
}

let ESelect = styled('label')`
	cursor: pointer;
	border: 1px solid #C4C4C4;
	&.error {
		border: 1px solid red;
	}
	display: flex;
	align-items: center;
	&:hover {
		background-color: #F4F4F4;
	}
	margin-bottom: 10px;
`;
let ESuggestions = styled('ul')`
	position: absolute;
	background-color: white;
	max-height: 300px;
	overflow: auto;
	box-shadow: 0px 0px 3px grey;
`;
let ESuggestionItem = styled('li')`
	display: block;
	cursor: pointer;
	padding: 7px 10px;
	&:hover{
		background-color: ${p=>p.theme.color};
		color: white;
	}
	&.active {
		&, &:hover {
			background-color: inherit;
			color: ${p=>p.theme.color};
			cursor: default;
		}
	}
`;

export class Select extends FormElement<IProps, IState> {
	select: HTMLLabelElement | null = null;
	constructor(props: IProps) {
		super(props);
		this.state = {
			value: this.props.defaultValue,
			error: false,
			showSuggestions: true
		};
		this.onChange = this.onChange.bind(this);
		this.suggestions = this.suggestions.bind(this);
		this.getSuggestions = this.getSuggestions.bind(this);
	}

	public validate(focusOnError?: boolean) {
		let error = this.schema?this.schema.validate(this.state.value):null;
		if (error) {
			this.setState({
				error: true
			});
		}
		else {
			this.setState({
				error: false
			});
		}
	}
	componentWillUnmount() {
		Floater.remove();
	}

	private showSuggestions() {
		this.setState({
			showSuggestions: true
		});
		Floater.float(()=>
			<SAnim show={this.state.showSuggestions && (this.getSuggestions().length>0)} animType={this.props.top?"slideTop":"slideBottom"}>
				<ESuggestions className={css`
					position: absolute;
					${this.select?`
						top: ${this.select.getBoundingClientRect().top -2}px;
						left: ${this.select.getBoundingClientRect().left-2}px;
						width: ${this.select.getBoundingClientRect().width}px;
					`: undefined}
				`}>
					{this.props.label?<h3 style={{
						cursor: "default",
						paddingLeft: 10
					}}>{this.props.label}</h3>:undefined}
					{this.getSuggestions().map((option)=>{
						return <ESuggestionItem key={option} className={cx({
								active: option==this.state.value
							})} onClick={()=>{
							this.setState({
								value: option
							}, this.validate);
							this.hideSuggestions();
						}}>{option}</ESuggestionItem>
					})}
				</ESuggestions>
			</SAnim>
		);
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
		this.setState({
			value: e.target.value
		});
	}
	private suggestions(e: React.KeyboardEvent<HTMLInputElement>) {
		// Suggestions and navigating the suggestions logic goes here... TODO
		if (e.key=="ArrowDown") {
			this.showSuggestions();
		}
	}
	private getSuggestions() {
		let options = _.uniq(this.props.options);
		if (this.props.nonEditable) {
			return options;
		}
		return options.filter((option)=>{
			let value = this.state.value?this.state.value:"";
			value = value+"";
			option = option+"";
			if (option.toLowerCase().indexOf(value.toLowerCase())!=-1)
				return option;
		});
	}
	_render() {
		let width = (typeof this.props.width=="string")?this.props.width:this.props.width+"px";
		return <div className={css`
			position: relative;
			${this.props.inline?`display: inline-block;`:undefined}
			${this.props.width?`width: ${width}`:undefined};
		`}>
			<ESelect innerRef={ref=>this.select = ref} className={cx({
				error: this.state.error
			})}>
				<input spellCheck={false} readOnly className={css`
					color: transparent;
					cursor: pointer;
					width: 0;
					text-shadow: 0px 0px 0px #000;
					padding: 10px 5px;
					background-color: inherit;
					flex-grow: 1;
				`} autoComplete={this.props.name} type="text" onClick={()=>{
					this.showSuggestions();
				}} onFocus={()=>{
					this.showSuggestions();
				}} value={this.state.value?this.state.value:""}
					name={this.props.name}
					onKeyDown={this.suggestions}
					onChange={this.onChange}
					onBlur={()=>{
						setTimeout(()=>{
							this.hideSuggestions();
						}, 100);
					}}
				/>
				<i className="fa fa-angle-down" style={{marginRight: 15}}></i>
			</ESelect>
		</div>;
	}
};
