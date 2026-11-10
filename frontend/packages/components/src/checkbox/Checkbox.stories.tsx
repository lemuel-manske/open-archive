import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "./Checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],

  args: { children: "Receive updates" },
} satisfies Meta<typeof Checkbox>;

type Story = StoryObj<typeof meta>;

const Default: Story = {};

export default meta;

export { Default };
