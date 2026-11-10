import type { Preview } from "@storybook/react-vite";

import "@openarchive/design-tokens/styles.css";

import "./storybook.css";

const preview: Preview = {
  decorators: [
    (Story, context) => (
      <div className="storybook-theme" data-ui-theme="archive" data-brand={context.globals.brand}>
        <Story />
      </div>
    ),
  ],

  globalTypes: {
    brand: {
      description: "Component theme",

      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "archive", title: "OpenArquive" },
          { value: "library", title: "Library" },
        ],
      },
    },
  },

  initialGlobals: {
    brand: "archive",
  },

  parameters: {
    layout: "padded",

    a11y: {
      test: "error",

      options: {
        runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"],
      },
    },
  },
};

export default preview;
