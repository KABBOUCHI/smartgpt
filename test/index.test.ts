import { it, describe, expect } from "vitest";
import { SmartGPT, defineSmartGPTPlugin } from "../src";

describe("smartgpt", () => {
  it("can define plugin", async () => {
    const gpt = new SmartGPT({
      plugins: [
        defineSmartGPTPlugin({
          name: "search",
          description:
            "Useful for getting the accurate result of a math expression. The input to this tool should be a valid mathematical expression that could be executed by modern JavaScript runtime",
          handle: async () => {
            return await Promise.resolve("ETH price is $420");
          },
        }),
      ],
    });

    const response = await gpt.query({
      input: "What is the price of ETH?",
      onPlugin: (name, input, response) => {
        console.log({
          name,
          input,
          response,
        });
      },
      onMessages(messages) {
        console.log({ messages });
      },
    });

    console.log({ response });
    expect(response).toContain("420");
  });
});
