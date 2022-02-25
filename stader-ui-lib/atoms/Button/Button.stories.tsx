import Button from "./Button";
import { ButtonType } from "./Button.type";
import { Story } from "@storybook/react";

export default {
  component: Button,
  title: "Button",
};

const Template = (args: ButtonType) => <Button {...args}>Hello world</Button>;

export const ButtonOutlined: Story<ButtonType> = Template.bind({});
ButtonOutlined.args = {
  variant: "outlined",
};

export const ButtonSolid: Story<ButtonType> = Template.bind({});
ButtonSolid.args = {
  variant: "solid",
};

export const ButtonLarge: Story<ButtonType> = Template.bind({});
ButtonLarge.args = {
  size: "large",
};

export const ButtonLargeDisabled: Story<ButtonType> = Template.bind({});
ButtonLargeDisabled.args = {
  size: "large",
  disabled: true,
};

export const ButtonSolidLarge: Story<ButtonType> = Template.bind({});
ButtonSolidLarge.args = {
  variant: "solid",
  size: "large",
};

export const ButtonOutlinedLargeFullWidth: Story<ButtonType> = Template.bind(
  {}
);
ButtonOutlinedLargeFullWidth.args = {
  size: "large",
  fullWidth: true,
};

export const ButtonBlock: Story<ButtonType> = Template.bind({});
ButtonBlock.args = {
  variant: "block",
};

export const ButtonBlockSmall: Story<ButtonType> = Template.bind({});
ButtonBlockSmall.args = {
  variant: "block",
  size: "small",
};
