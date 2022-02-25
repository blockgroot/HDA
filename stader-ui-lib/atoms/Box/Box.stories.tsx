import { BoxProps } from "./Box.type";
import { Story } from "@storybook/react";
import Box from "./Box";

export default {
  component: Box,
  title: "Box",
};

const Template = (args: BoxProps) => <Box {...args} />;

export const BoxDefault: Story<BoxProps> = Template.bind({});
BoxDefault.args = {
  noShadow: false,
  noPadding: false,
};
