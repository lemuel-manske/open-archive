import type { Meta, StoryObj } from "@storybook/react-vite";

import { Field } from "./Field";

import { Input } from "../input/Input";

const meta = {
  title: "Components/Field",
  component: Field,
  tags: ["autodocs"],

  args: { children: null },
} satisfies Meta<typeof Field>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  render: (args) => (
    <Field {...args}>
      <Field.Label>Name</Field.Label>

      <Field.Control>
        <Input />
      </Field.Control>

      <Field.Description>Use your full name.</Field.Description>
    </Field>
  ),
};

export default meta;

export { Default };
