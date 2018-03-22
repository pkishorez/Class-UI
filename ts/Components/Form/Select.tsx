import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as propTypes from 'prop-types';
import {FormElement} from './FormElement';
import * as classNames from 'classnames';
import { SAnim } from '../../Helper/Animation';
import * as _ from 'lodash';

export interface IProps {
	name: string
	options: string[]
	children?: any
	top?: boolean
	nonEditable?: boolean
	defaultValue?: string
};

export interface IState {
	showSuggestions: boolean
}
export class Select extends FormElement<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.state = {
			value: this.props.defaultValue,
			showSuggestions: false
		};
		this.onChange = this.onChange.bind(this);
		this.suggestions = this.suggestions.bind(this);
		this.getSuggestions = this.getSuggestions.bind(this);
	}

	public validate(focusOnError?: boolean) {
		// No Validation as of now.
	}

	private onChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (this.props.nonEditable) {
			this.setState({
				showSuggestions: true
			});
			return;
		}
		this.setState({
			value: e.target.value,
			showSuggestions: true
		});
	}
	private suggestions(e: React.KeyboardEvent<HTMLInputElement>) {
		// Suggestions and navigating the suggestions logic goes here... TODO
		if (e.key=="ArrowDown") {
			this.setState({
				showSuggestions: true
			});
		}
	}
	private getSuggestions() {
		let options = _.uniq(this.props.options);
		if (this.props.nonEditable) {
			return options;
		}
		return options.filter((option)=>{
			let value = this.state.value?this.state.value:"";
			if (option.toLowerCase().indexOf(value.toLowerCase())!=-1)
				return option;
		});
	}
	_render() {
		let cls = classNames("__input_select", {
			top: this.props.top,
			editable: !this.props.nonEditable
		})
		return <label className={cls}>
			<input spellCheck={false} autoComplete="off" type="text" onClick={()=>{
				this.setState({
					showSuggestions: true
				})
			}} className="input" onFocus={()=>{
				this.setState({
					showSuggestions: true
				});
			}} value={this.state.value}
				name={this.props.name}
				onKeyDown={this.suggestions}
				onChange={this.onChange}
				onBlur={()=>{
				setTimeout(()=>this.setState({
					showSuggestions: false
				}), 100);
			}}/>
			<SAnim show={this.state.showSuggestions && (this.getSuggestions().length>0)} animType={this.props.top?"slideTop":"slideBottom"}>
				<div className="suggestions">
					{this.getSuggestions().map((option)=>{
						return <span key={option} className={(option==this.state.value)?"active":""} onClick={()=>{
							this.setState({
								value: option,
								showSuggestions: false
							})
						}}>{option}</span>
					})}
				</div>
			</SAnim>
		</label>
	}
};