import type { Meta, StoryObj } from "@storybook/react-vite";

import { Textarea } from "./Textarea";

import { TextareaSize } from "./options";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  tags: ["autodocs"],

  args: { "aria-label": "Notes", placeholder: "Add notes" },

  argTypes: { size: { control: "select", options: Object.values(TextareaSize) } },
} satisfies Meta<typeof Textarea>;

type Story = StoryObj<typeof meta>;

const Default: Story = {};

export default meta;

export { Default };
