import type { Meta, StoryObj } from "@storybook/react-vite";

import { RadioGroup } from "./RadioGroup";

const meta = {
  title: "Components/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],

  args: { label: "Contact method", children: null, defaultValue: "email" },
} satisfies Meta<typeof RadioGroup>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroup.Item value="email">Email</RadioGroup.Item>

      <RadioGroup.Item value="phone">Phone</RadioGroup.Item>
    </RadioGroup>
  ),
};

export default meta;

export { Default };
