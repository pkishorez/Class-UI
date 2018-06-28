import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ClassUI } from '../ClassUI';
import { NavBar, NavbarRemain } from '../Navbar';
import { Dropdown, DItem } from '../Components/Dropdown';
import { Button } from '../Components/Button';
import { Layout, Section } from '../Components/Layout';
import { Overlay } from '../Overlay';
import { css } from 'classui/Emotion';
import { MAnim, HAnim } from 'classui/Helper/Animation';
import _ = require('lodash');
import { Anim } from 'classui/Helper/Anim';

class App extends React.Component<any, any> {
	constructor(props: any, context: any) {
		super(props, context);
		this.state = {
			children: []
		}
	}
	generate = () => {
		this.setState({
			children: _.uniq(_.times(5).map(()=>_.random(1,10)))
		});
	}
	render() {
		return <ClassUI theme="fb" fullHeight EnableRouting>
			<Layout remain column align="center" justify="center">
				<Section>
					<NavBar card="2" logo="Class-UI" dummy className={css`
							position: fixed;
						`} width={1024}>
						<NavbarRemain />
						<Dropdown button="tasks" push="left">
							<DItem disable>My Tasks</DItem>
							<DItem active>Manage Tasks</DItem>
							<DItem onClick={() => {
								ClassUI.setTheme("flat");
							}}>Dashboard (TODO)</DItem>
						</Dropdown>
						<Button active={true} to="/page" onClick={() => {
							Overlay.feedback("Hello Dude", "error");
						}}>Kittu</Button>
						<Button>Kittu</Button>
					</NavBar>
				</Section>
				{/* <Section>
						<div style={{
							margin: "auto",
							maxWidth: 900
						}}>
							<CropHelper minWidth={50} minHeight={50} imgsrc="/assets/pic.jpg">
								<img draggable={false} src="/assets/pic.jpg"/>
							</CropHelper>
						</div>
					</Section> */}
				<Section>
				<Button onClick={this.generate}>Randomize {JSON.stringify(this.state.children)}</Button>
				{/* <HAnim>
					{this.state.children.map((c: any)=>
						<h1 style={{padding: 20,backgroundColor: "green", color: "white", textAlign: "center", fontSize: 20}} key={c}>
							{c}
						</h1>
					)}
				</HAnim> */}
				<Anim>
					{this.state.children.map((c: any)=>
						<div style={{marginBottom: 20, padding: 20,backgroundColor: "green", color: "white", textAlign: "center", fontSize: 20}} key={c}>
							{c}
						</div>
					)}
				</Anim>
				{/* <MAnim data={[{
						data: "Hello Kishore",
						id: 1
					// }, {
					// 	data: "Kittu",
					// 	id: 2
					// }, {
					// 	data: "Helelo",
					// 	id: 3
					}]} childRenderer={(data)=>{
						return <h1 style={{padding: 50, backgroundColor: "green", color: "white"}}>
							{data.data}
						</h1>
					}}/> */}
				</Section>
			</Layout>
		</ClassUI>;
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('app')
);