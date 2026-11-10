import type { Meta, StoryObj } from "@storybook/react-vite";

import { Spinner } from "./Spinner";

import { SpinnerSize } from "./options";

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  tags: ["autodocs"],

  args: { label: "Loading results" },

  argTypes: { size: { control: "select", options: Object.values(SpinnerSize) } },
} satisfies Meta<typeof Spinner>;

type Story = StoryObj<typeof meta>;

const Default: Story = {};

export default meta;

export { Default };
