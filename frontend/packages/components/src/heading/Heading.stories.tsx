import type { Meta, StoryObj } from "@storybook/react-vite";

import { Heading } from "./Heading";

import { HeadingSize, HeadingWeight } from "./options";

const meta = {
  title: "Components/Heading",
  component: Heading,
  tags: ["autodocs"],

  args: { children: "Section heading", level: 2 },

  argTypes: {
    size: { control: "select", options: Object.values(HeadingSize) },

    weight: { control: "select", options: Object.values(HeadingWeight) },
  },
} satisfies Meta<typeof Heading>;

type Story = StoryObj<typeof meta>;

const Default: Story = {};

const Semibold: Story = {
  args: {
    children: "A web muda. Suas capturas permanecem.",
    size: HeadingSize.LARGE,
    weight: HeadingWeight.SEMIBOLD,
  },
};

export default meta;

export { Default, Semibold };
