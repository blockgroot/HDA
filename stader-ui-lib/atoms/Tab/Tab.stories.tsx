import { Tab } from "./Tab";
import { Story } from "@storybook/react";
import { TabType } from "./Tab.type";

export default {
  component: Tab,
  title: "Tab",
};

const Template: Story<TabType> = (args) => <Tab {...args} />;

export const TabActive: Story<TabType> = Template.bind({});
TabActive.args = {
  active: true,
  label: "Active Tab",
  value: 0,
};
