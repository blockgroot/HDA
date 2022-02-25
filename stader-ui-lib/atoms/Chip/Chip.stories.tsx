import Chip from "./Chip";
import { ChipType } from "./Chip.type";
import { Story } from "@storybook/react";

export default {
  component: Chip,
  title: "Chip",
};

const Templates = (args: ChipType) => <Chip {...args} />;
export const ChipDefault: Story<ChipType> = Templates.bind({});

ChipDefault.args = {
  label: "Chip",
};
