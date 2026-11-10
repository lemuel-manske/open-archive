import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "./Input";

import { InputSize } from "./options";

const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],

  args: { "aria-label": "Name", placeholder: "Enter your name" },

  argTypes: { size: { control: "select", options: Object.values(InputSize) } },
} satisfies Meta<typeof Input>;

type Story = StoryObj<typeof meta>;

const Default: Story = {};

export default meta;

export { Default };
