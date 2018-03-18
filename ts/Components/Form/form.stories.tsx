import * as React from 'react';

import { storiesOf } from '@storybook/react';
import {ClassUI} from 'classui/index';
import { Flash } from 'classui/Components';
import { MD } from 'classui/Helper/MarkDown';
import { Form, Text, Select, Radio, Checkbox } from 'classui/Components/Form';

let components = storiesOf('Components', module);


components.add("Form", ()=>{
	return <><MD>{`
## Forms		
`}
</MD>

<Form>
	<Text name="hello" defaultValue="Kishore is a good boy.">Enter Name</Text>
	<Text name="hello" type="password" defaultValue="Kishore is a good boy.">Enter Name</Text>
	<Text name="hello" type="area" defaultValue="Kishore is a good boy.">Enter Name</Text>
	<Select options={["Kishore", "Charan"]} name="name"></Select>
	<Select options={["Kishore", "Charan"]} nonEditable name="name"></Select>
	<Radio values={[{
		label: "Male",
		value: "male"
	}, {
		label: "Femaile",
		value: "female"
	}]} name="Gender"></Radio>
	<Checkbox name="agree">I Agree to terms and Conditions.</Checkbox>
</Form>


</>;
})