import Typography from "./Typography";
import { TypographyType } from "./Typography.type";
import { Story } from "@storybook/react";

export default {
  component: Typography,
  title: "Typography",
};

const Template = (args: TypographyType) => <Typography {...args} />;

export const TypographyDefault: Story<TypographyType> = Template.bind({});
TypographyDefault.args = {
  variant: "body1",
  children: "Hello world",
};
