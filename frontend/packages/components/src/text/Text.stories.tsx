import type { Meta, StoryObj } from "@storybook/react-vite";

import { Text } from "./Text";

import { TextSize } from "./options";

const meta = {
  title: "Components/Text",
  component: Text,
  tags: ["autodocs"],

  args: { children: "A paragraph of supporting information." },

  argTypes: { size: { control: "select", options: Object.values(TextSize) } },
} satisfies Meta<typeof Text>;

type Story = StoryObj<typeof meta>;

const Default: Story = {};

export default meta;

export { Default };
