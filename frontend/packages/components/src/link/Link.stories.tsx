import type { Meta, StoryObj } from "@storybook/react-vite";

import { Link } from "./Link";

const meta = {
  title: "Components/Link",
  component: Link,
  tags: ["autodocs"],

  args: { children: "Read more", href: "#details" },
} satisfies Meta<typeof Link>;

type Story = StoryObj<typeof meta>;

const Default: Story = {};

export default meta;

export { Default };
