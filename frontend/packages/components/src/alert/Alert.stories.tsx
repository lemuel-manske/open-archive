import type { Meta, StoryObj } from "@storybook/react-vite";

import { Alert } from "./Alert";

const meta = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],

  args: { children: "Your changes have been saved." },
} satisfies Meta<typeof Alert>;

type Story = StoryObj<typeof meta>;

const Default: Story = {};

export default meta;

export { Default };
