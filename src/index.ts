import { OpenAI } from "openai";

export interface ISmartGPTConfig {
  model?: "gpt-3.5-turbo" | "gpt-4";
  apiKey?: string;
  plugins?: any[];
}

export interface IQueryOptions {
  input?: string;
  messages?: {
    role: "system" | "assistant" | "user";
    content: string;
  }[];
  onPlugin?: (name: string, input: any, response: any) => Promise<void> | void;
  onMessages?: (
    messages: {
      role: "system" | "assistant" | "user";
      content: string;
    }[],
  ) => Promise<void> | void;
}

export interface ISmartGPTPlugin {
  name: string;
  description: string;
  handle(input: any): Promise<string> | string;
}

export const defineSmartGPTPlugin = (plugin: ISmartGPTPlugin) => {
  return plugin;
};

export class SmartGPT {
  #model: "gpt-3.5-turbo" | "gpt-4";
  #apiKey: string;
  #openai: OpenAI;
  #plugins: any[];

  constructor(config: ISmartGPTConfig = {}) {
    this.#model = config.model || "gpt-3.5-turbo";
    this.#plugins = config.plugins || [];

    if (config.apiKey) {
      this.#apiKey = config.apiKey;
    } else if (typeof process !== "undefined" && process.env.OPENAI_API_KEY) {
      this.#apiKey = process.env.OPENAI_API_KEY;
    } else {
      throw new Error("You must provide an OpenAI API key");
    }

    this.#openai = new OpenAI({
      apiKey: this.#apiKey,
    });
  }

  #getPluginSystemMessage(): string | undefined {
    if (this.#plugins.length === 0) {
      return undefined;
    }

    const prompt = [
      `You are ChatGPT which is a large language model by OpenAI trained on data til now which is ${new Date().toString()}. You are capable of solve any kind of problem by using tools mentioned below.\n`,
      "You MUST use a tool that may be helpful in answering the user's original question, the tools available are:",
      "---",
    ];

    for (const plugin of this.#plugins) {
      prompt.push(`${plugin.name}: ${plugin.description}`);
    }

    prompt.push(
      "---\n",
      "The way you use these tools is by writing the entire response strctly in the following format without any other text (DON'T include the curly brackets, starting with exactly three dots, tool id MUST be followed a colon):\n",
      "```",
      "...{tool id, must be one of calculator,request_get,github_stars_count,xkcd_comic,screenshot}",
      "{The input to the tool}\n",
      ":::tool_output:::",
      "{the output of the tool, won't be visible to the user}",
      "```\n",
      "Correct example:\n",
      "```",
      "...search:",
      "2024 best book politics",
      "```\n\n",
      "Rules you always follow:",
      "Your answer must be original, concise, accurate, and helpful.",
      "If you need to run a tool, run it immediately, don't ask the user to wait or confirm, don't say \"let me check\", just run the tool.",
      "No explaination unless specified",
      "You will use the tool output to determine whether to use another tool to fulfill the request or to answer the user immediately.",
    );

    return prompt.join("\n");
  }

  async query(options: IQueryOptions): Promise<string> {
    const pluginsPrompt = this.#getPluginSystemMessage();
    options.messages = options.messages || [];

    if (options.input) {
      options.messages.push({
        role: "user",
        content: options.input,
      });
    }

    const messages = [...options.messages];

    if (pluginsPrompt) {
      messages.unshift({
        role: "system",
        content: pluginsPrompt,
      });
    }

    const response = await this.#openai.chat.completions.create({
      model: this.#model,
      messages,
      stop: ":::tool_output:::",
    });

    const message = response.choices[0].message.content || "";

    if (message.startsWith("...")) {
      const parts = message.slice(3).split(":");
      const pluginName = parts[0];
      const pluginInput = parts[1];

      const plugin = this.#plugins.find((p) => p.name === pluginName);

      if (plugin) {
        const pluginResponse = await plugin.handle(pluginInput);

        if (options.onPlugin) {
          options.onPlugin(pluginName, pluginInput, pluginResponse);
        }

        return await this.query({
          messages: [
            ...(options.messages || []),
            {
              role: "system",
              content: `${message}\n\n:::tool_output:::\n${pluginResponse}\n\n:::tool_output:::\n`,
            },
          ],
          onPlugin: options.onPlugin,
          onMessages: options.onMessages,
        });
      }
    }

    if (options.onMessages) {
      await options.onMessages([
        ...options.messages,
        {
          role: "assistant",
          content: message,
        },
      ]);
    }

    return message;
  }
}
