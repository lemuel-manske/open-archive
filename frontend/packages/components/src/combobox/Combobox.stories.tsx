import type { Meta, StoryObj } from "@storybook/react-vite";

import { Combobox } from "./Combobox";

import { ComboboxAppearance, ComboboxSize } from "./options";

const meta = {
  title: "Components/Combobox",
  component: Combobox,
  tags: ["autodocs"],

  args: {
    "aria-label": "Site",
    defaultValue: "public",

    children: (
      <>
        <Combobox.Option value="public">Página pública (sem login)</Combobox.Option>

        <Combobox.Option value="example">example.org</Combobox.Option>

        <Combobox.Option value="library">library.example.org</Combobox.Option>
      </>
    ),
  },

  argTypes: {
    size: { control: "select", options: Object.values(ComboboxSize) },

    appearance: { control: "select", options: Object.values(ComboboxAppearance) },

    children: { control: false },
  },
} satisfies Meta<typeof Combobox>;

type Story = StoryObj<typeof meta>;

const Default: Story = {};

const Native: Story = { args: { appearance: ComboboxAppearance.NATIVE } };

const Disabled: Story = { args: { disabled: true } };

export default meta;

export { Default, Native, Disabled };
