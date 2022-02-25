import TextField from "./TextField";
import { Story } from "@storybook/react";
import { TextFieldType } from "./TextField.type";

export default {
  component: TextField,
  title: "TextField",
};

const Template: Story<TextFieldType> = (args) => <TextField {...args} />;

export const TextFieldDefault = Template.bind({});

TextFieldDefault.args = {
  type: "text",
  placeholder: "Luna text input",
  label: "Luna",
};
