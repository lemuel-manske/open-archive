import type { Meta, StoryObj } from "@storybook/react-vite";

import { useArgs } from "storybook/preview-api";

import { Dialog } from "./Dialog";

import type { DialogProps } from "./types";

import { Button } from "../button/Button";

import { Text } from "../text/Text";

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],

  args: {
    title: "Review changes",
    open: false,
    onOpenChange: () => {},
    children: <Text>Review your changes before continuing.</Text>,
  },
} satisfies Meta<typeof Dialog>;

type Story = StoryObj<typeof meta>;

function DialogExample() {
  const [args, updateArgs] = useArgs<DialogProps>();

  return (
    <>
      <Button onClick={() => updateArgs({ open: true })}>Review changes</Button>

      <Dialog {...args} onOpenChange={(open) => updateArgs({ open })} />
    </>
  );
}

const Default: Story = { render: DialogExample };

export default meta;

export { Default };
