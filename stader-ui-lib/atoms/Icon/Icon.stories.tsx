import { IconType } from "./Icon.type";
import Icon from "./Icon";
import { Story } from "@storybook/react";

export default {
  title: "Icon",
  component: Icon,
};

const Template: Story<IconType> = (args: IconType) => <Icon {...args} />;

export const IconDefault: Story<IconType> = Template.bind({});
IconDefault.args = {
  name: "clipboard",
};
