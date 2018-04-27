import * as React from 'react';

import { storiesOf } from '@storybook/react';
import {ClassUI} from 'classui/index';
import { TextField } from 'classui/Components';
import { MD } from 'classui/Helper/MarkDown';
import { Form, Text, Select, Radio, Checkbox } from 'classui/Components/Form';
import { Submit } from 'classui/Components/Form/Submit';

let components = storiesOf('Components', module);


components.add("Form", ()=>{
	return <><MD>{`
## Forms		
`}
</MD>

<Form schema={{
	type: "object",
	properties: {
		name: {
			type: "string"
		},
		password: {
			type: "string",
			minLength: 5
		},
		age: {
			type: "number",
			min: 15,
			max: 30
		},
		gender: {
			enum: ["male", "female"]
		},
		class: {
			enum: ["Hello", "Hey"]
		},
		agree: {
			const: true
		}
	},
	required: ["name", "password", "age", "gender", "class"]
}}>
	<Text name="name" defaultValue="Kishore is a good boy.">Enter Name</Text>
	<TextField name="password" type="password">Enter password.</TextField>
	<TextField name="age" type="number" defaultValue="Kishore is a good boy.">Age</TextField>
	<Select options={["Hello", "Hey", "HOw are you?"]} name="class"></Select>
	<Select label="Hey" options={["Kishore", "Charan"]} nonEditable name="hey"></Select>
	<Radio values={[{
		label: "Male",
		value: "male"
	}, {
		label: "Femaile",
		value: "female"
	}]} name="gender"></Radio>
	<Checkbox name="agree">I Agree to terms and Conditions.</Checkbox>
	<Submit/>
</Form>


</>;
})