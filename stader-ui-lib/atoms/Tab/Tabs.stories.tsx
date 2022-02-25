import { Tab, Tabs } from "./Tab";
import { TabsType } from "./Tab.type";
import { Story } from "@storybook/react";

export default {
  component: Tabs,
  title: "Tabs",
};

const Template: Story<TabsType> = (args) => (
  <Tabs {...args}>
    <Tab label={"Active"} value={0} />
    <Tab label={"Inactive"} value={1} />
  </Tabs>
);

export const TabsDefault: Story<TabsType> = Template.bind({});
TabsDefault.args = {
  // value: 0,
};
