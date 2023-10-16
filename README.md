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
            description: "a search engine. useful for when you need to answer questions about current events. input should be a search query.",
            handle: (input) => {
                return "ETH price is $69,420";
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