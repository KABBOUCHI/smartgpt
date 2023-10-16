# smartgpt



## Usage

Install package:

```sh
# npm
npm install smartgpt

# yarn
yarn add smartgpt

# pnpm
pnpm install smartgpt

# bun
bun install smartgpt
```

Import:

```js
// ESM
import {} from "smartgpt";

// CommonJS
const {} = require("smartgpt");
```

Usage:

```js
const gpt = new SmartGPT({
    plugins: [
    defineSmartGPTPlugin({
        name: "search",
        description:
        "Useful for getting the accurate result of a math expression. The input to this tool should be a valid mathematical expression that could be executed by modern JavaScript runtime",
        handle: async (input) => {
        return await Promise.resolve("ETH price is $420");
        },
    }),
    ],
});

await gpt.query({
    input: "What is the price of ETH?",
});
```

## Development

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

## License

Made with 💛

Published under [MIT License](./LICENSE).