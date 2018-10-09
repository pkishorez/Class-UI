import * as _ from "lodash";
import * as React from "react";
import { Button } from "../Components";
import { Anim } from "../Helper/Anim";
import { ClassUI } from "../index";

export class App extends React.Component {
	state = {
		users: [
			"Kishore",
			"User1",
			"User2",
			"User5",
			"User6"
		]
	}
	render() {
		return (
			<ClassUI theme="iiitfb" fullHeight>
				{/* <NavBar>
					
				</NavBar> */}
				<h2>Test</h2>
				<Button
						onClick={() => {
							this.forceUpdate();
						}}
					>
						Button
					</Button>
				<div style={{ maxHeight: 100 }}>
					<Anim
						style={{
							maxWidth: 100,
							margin: "auto",
							backgroundColor: "white"
						}}
					>
						{
							(this.state.users)
							.map(user => (
								<div
									style={{
										padding: 10,
										backgroundColor: "green",
										color: "white",
										margin: 10
									}}
									onClick={()=>this.setState({
										users: this.state.users.filter(u=>u!==user)
									})}
									key={user}
								>
									{user}
								</div>
							))}
					</Anim>
				</div>
			</ClassUI>
		);
	}
}
