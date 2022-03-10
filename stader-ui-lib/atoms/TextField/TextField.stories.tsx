import TextField from "./TextField";
import { Story } from "@storybook/react";
import { TextFieldType } from "./TextField.type";
import { NATIVE_TOKEN_LABEL } from "@constants/constants";

export default {
  component: TextField,
  title: "TextField",
};

const Template: Story<TextFieldType> = (args) => <TextField {...args} />;

export const TextFieldDefault = Template.bind({});

TextFieldDefault.args = {
  type: "text",
  placeholder: `${NATIVE_TOKEN_LABEL} text input`,
  label: `${NATIVE_TOKEN_LABEL}`,
};
