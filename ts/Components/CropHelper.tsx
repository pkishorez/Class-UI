import * as React from 'react';
import { styled, css } from 'classui/Emotion';
import _ = require('lodash');

const ECropper = styled('div')`
	position: relative;
	user-select: none;
	overflow: hidden;
`;
const EDummy = styled('div')`
	position: absolute;
	top: 0px;
	left: 0px;
	opacity: 0.1;
`;
const EClip = styled('div')`
	transition: all 0.2s ease;
`;

const EMarker = styled('div')`
	background-color: black;
	opacity: 0.5;
	border-radius: 50%;
	width: 20px;
	height: 20px;
	position: absolute;
	top: 0px;
	left: 0px;
	transition: all 0.2s ease;
	&:hover {
		opacity: 0.1;
	}
`;

interface ICropHelperProps {
	imgsrc?: string
	step?: number
	minWidth?: number
	minHeight?: number
}
interface ICropHelperState {
	cropMarker?: keyof(ICropHelperState["markers"])
	markers: {
		m1: {x: number, y: number}
		m2: {x: number, y: number}
	}
}

export class CropHelper extends React.Component<ICropHelperProps, ICropHelperState> {
	_moving = false;
	_cropping = false;
	step = 1;

	_coords = {
		current: {x: 0,y: 0},
		save: {x: 0, y: 0}
	}
	minWidth: number;
	minHeight: number;

	private ref: HTMLDivElement | null = null;
	private animFrame?: number;

	constructor(props: ICropHelperProps, context: any) {
		super(props, context);
		this.state = {
			markers: {
				m1: {x: 100, y: 100},
				m2: {x: 200, y: 200}
			}
		}
		this.minHeight = this.props.minHeight || 0;
		this.minWidth = this.props.minWidth || 0;

		this.step = this.props.step || this.step;
		this.mouseMove = this.mouseMove.bind(this);
		this.mouseUp = this.mouseUp.bind(this);
		this.crop = _.throttle(this.crop.bind(this), 100);
		this.move = _.throttle(this.move.bind(this), 100);
		this.moveStart = this.moveStart.bind(this);
		this.reqFrame = this.reqFrame.bind(this);

		window.addEventListener("mousemove", this.mouseMove);
		window.addEventListener("touchmove", e=>this.mouseMove);
		window.addEventListener("mouseup", this.mouseUp);
		requestAnimationFrame(this.reqFrame);
	}
	reqFrame() {
		this.move();
		this.crop();
		this.animFrame = requestAnimationFrame(this.reqFrame);
	}
	componentDidMount() {
		this.forceUpdate();
	}
	componentWillUnmount() {
		this.animFrame && cancelAnimationFrame(this.animFrame);
	}
	mouseUp(e: MouseEvent) {
		this._cropping = false;
		this._moving = false;
	}
	mouseMove(e: any) {
		let x = e.touches && e.touches[0].pageX;
		let y = e.touches && e.touches[0].pageY;
		this._coords.current = {
			x: x?x:e.pageX,
			y: y?y:e.pageY
		};
	}

	crop() {
		if ((!this.ref) || (!this._cropping) || !this.state.cropMarker) {
			return;
		}
		console.log("Cropping");
		let dRect = this.ref.getBoundingClientRect();
		let top = dRect.top + window.scrollY;
		let left = dRect.left + window.scrollX;

		let dX = this._coords.current.x - this._coords.save.x;
		let dY = this._coords.current.y - this._coords.save.y;

		let {m1, m2} = this.state.markers;
		let x=0,y=0;
		if (this.state.cropMarker=="m1") {
			// change marker position along with width and height of crop.
			x=m1.x;
			y=m1.y;
			x = x+dX;
			y = y+dY;
			x = Math.min(x, m2.x-this.minWidth);
			y = Math.min(y, m2.y-this.minHeight);
			x = Math.max(x,0);
			y = Math.max(y,0);

			// Update X and Y Position.
			this.setState({
				markers: {
					...this.state.markers,
					m1: {
						x,
						y
					}
				}
			});
		}
		else if (this.state.cropMarker=="m2") {
			// Change width and height of crop.
			x=m2.x;
			y=m2.y;
			x = x+dX;
			y = y+dY;
			x = Math.max(x, m1.x);
			y = Math.max(y, m1.y);
			x = Math.min(x, dRect.width);
			y = Math.min(y, dRect.height);

			// Update X and Y Position.
			this.setState({
				markers: {
					...this.state.markers,
					m2: {
						x,
						y
					}
				}
			})
		}
		else {
			return;
		}
		this._coords.save = {
			x: x+left,
			y: y+top
		};
	}
	getCropCoords() {
		const width = this.ref?this.ref.getBoundingClientRect().width:0;
		const height = this.ref?this.ref.getBoundingClientRect().height:0;

		let {m1, m2} = this.state.markers;

		return {
			left: Math.min(m1.x, m2.x),
			top: Math.min(m1.y, m2.y),
			right: width - Math.max(m1.x, m2.x),
			bottom: height - Math.max(m1.y, m2.y)
		}
	}
	move() {
		if (!this.ref || !this._moving) {
			return;
		}
		let dX = this._coords.current.x - this._coords.save.x;
		let dY = this._coords.current.y - this._coords.save.y;
		
		this.setState({
			markers: Object.keys(this.state.markers).reduce((r: any, key: any)=>{
				let x = (this.state.markers as any)[key].x + dX;
				let y = (this.state.markers as any)[key].y + dY;

				return {
					...r,
					[key]: {
						x,
						y
					}
				}
			}, {})
		})
		this._coords.save = {
			...this._coords.current
		};
	}

	dragStart(key: keyof(ICropHelperState["markers"])) {
		this._cropping = true;
		this._moving = false;
		this._coords.save = {...this._coords.current};
		this.setState({
			cropMarker: key
		});
	}
	moveStart(e: React.MouseEvent<HTMLDivElement>) {
		if (this._cropping)
			return;
		this._moving = true;
		this._coords.save = {...this._coords.current};
	}
	render() {
		const markers = this.state.markers;
		const crop = this.getCropCoords();

		const children = this.props.imgsrc?
			<img src={this.props.imgsrc} className={css`
				display: block;
			`} draggable={false} onLoad={()=>{
				this.forceUpdate();
			}} />:this.props.children;

		return (
			<ECropper innerRef={r=>{
				this.ref=r;
			}}>
				<EDummy>{children}</EDummy>
				<EClip style={{
					clipPath: `inset(${crop.top}px ${crop.right}px ${crop.bottom}px ${crop.left}px)`
				}} onMouseDown={this.moveStart}>
					{children}
				</EClip>
				<EMarker onMouseDown={()=>{
					this.dragStart("m1");
				}} style={{top: markers.m1.y-10, left: markers.m1.x-10}}/>
				<EMarker onMouseDown={()=>{
					this.dragStart("m2");
				}} style={{top: markers.m2.y-10, left: markers.m2.x-10}}/>
			</ECropper>
		);
	}
}