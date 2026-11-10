import type { Meta, StoryObj } from "@storybook/react-vite";

import { expect, fn } from "storybook/test";

import { Button } from "./Button";
import { ButtonSize, ButtonVariant } from "./options";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],

  args: {
    children: "Archive website",
    size: ButtonSize.MEDIUM,
    variant: ButtonVariant.PRIMARY,
    onClick: fn(),
  },

  argTypes: {
    size: { control: "select", options: Object.values(ButtonSize) },
    variant: { control: "select", options: Object.values(ButtonVariant) },
  },
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof meta>;

const Primary: Story = {
  render: ({ children, ...args }) => (
    <Button {...args}>
      <Button.Label>{children}</Button.Label>
    </Button>
  ),
};

const Secondary: Story = {
  args: { variant: ButtonVariant.SECONDARY },
};

const Tertiary: Story = {
  args: { variant: ButtonVariant.TERTIARY },
};

const Sizes: Story = {
  render: (args) => (
    <div className="story-row">
      {Object.values(ButtonSize).map((size) => (
        <Button {...args} key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

const Disabled: Story = {
  args: { disabled: true, onClick: fn() },

  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole("button", { name: "Archive website" });

    await userEvent.click(button);

    await expect(button).toBeDisabled();

    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

const Keyboard: Story = {
  args: { onClick: fn() },

  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole("button", { name: "Archive website" });

    await userEvent.tab();

    await expect(button).toHaveFocus();

    await userEvent.keyboard("{Enter}");

    await userEvent.keyboard(" ");

    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

const LongLabel: Story = {
  args: {
    children: "Preserve this website and its historical context in your personal collection",
  },
};

const Rebranded: Story = {
  globals: { brand: "library" },
};

const Submit: Story = {
  args: { type: "submit" },

  render: (args) => (
    <form
      aria-label="Example form"
      onSubmit={(event) => {
        event.preventDefault();

        event.currentTarget.dataset.submitted = "true";
      }}
    >
      <div className="story-row">
        <Button {...args} />

        <Button variant={ButtonVariant.TERTIARY}>Cancel</Button>
      </div>
    </form>
  ),
};

export default meta;

export { Primary, Secondary, Tertiary, Sizes, Disabled, Keyboard, LongLabel, Rebranded, Submit };
