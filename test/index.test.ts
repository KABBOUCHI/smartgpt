import { it, describe, expect } from "vitest";
import { SmartGPT, defineSmartGPTPlugin } from "../src";

describe("smartgpt", () => {
  it("can define plugin", async () => {
    const gpt = new SmartGPT({
      plugins: [
        defineSmartGPTPlugin({
          name: "search",
          description:
            "a search engine. useful for when you need to answer questions about current events. input should be a search query.",
          handle: async () => {
            return await Promise.resolve("ETH price is $420");
          },
        }),
        defineSmartGPTPlugin({
          name: "calculator",
          description:
            "Useful for getting the accurate result of a math expression. The input to this tool should be a valid mathematical expression that could be executed by modern JavaScript runtime",
          handle: (input: string) => {
            // eslint-disable-next-line no-eval
            return eval(input);
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

    const response2 = await gpt.query({
      input: "What is the price of ETH? and add 7$ to it",
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

    console.log({ response2 });
    expect(response2).toContain("427");
  });
});
