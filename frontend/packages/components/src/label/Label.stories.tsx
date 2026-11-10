import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect } from "storybook/test";

import { Label } from "./Label";
import { LabelSize } from "./options";

const meta = {
  title: "Components/Label",
  component: Label,
  tags: ["autodocs"],

  args: {
    children: "Collection name",
    htmlFor: "collection-name",
    size: LabelSize.MEDIUM,
  },

  argTypes: {
    size: { control: "select", options: Object.values(LabelSize) },
  },

  render: (args) => (
    <div className="story-field">
      <Label {...args} />

      <input id={args.htmlFor} name="collection" type="text" />
    </div>
  ),
} satisfies Meta<typeof Label>;

type Story = StoryObj<typeof meta>;

const Medium: Story = {};

const Small: Story = {
  args: { size: LabelSize.SMALL },
};

const Large: Story = {
  args: { size: LabelSize.LARGE },
};

const AssociatedField: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole("textbox", { name: "Collection name" });

    await userEvent.click(canvas.getByText("Collection name"));

    await expect(input).toHaveFocus();
  },
};

export default meta;

export { Medium, Small, Large, AssociatedField };
