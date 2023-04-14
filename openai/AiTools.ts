import * as HttpsProxyAgent from 'https-proxy-agent';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { types } from './types';
import * as _ from 'lodash';
import * as fs from 'fs';
import { mkdirp } from 'mkdirp'

export default class AiTools {
  openai: OpenAIApi;
  axiosRequestConfig: any;

  constructor() {
    const { GPT_KEY, ENV, PROXY } = process.env;

    const axiosConfig = {
      proxy: false,
      httpAgent: HttpsProxyAgent(PROXY),
      httpsAgent: HttpsProxyAgent(PROXY),
    };
    this.axiosRequestConfig = ENV == 'local' ? axiosConfig : {};

    const configuration = new Configuration({
      apiKey: GPT_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async getTypeSettings() {
    return;
  }

  async tpyeChat(message, type = 'any', n = 1) {
    let sysSettings: ChatCompletionRequestMessage[] = [];
    const filePrefix = message.substring(0, 3)

    if (type != 'any') {
      sysSettings = types[type].map((i) => {
        return {
          role: 'system',
          content: i,
        };
      });
    }
    const completion = await this.openai.createChatCompletion(
      {
        model: 'gpt-3.5-turbo',
        messages: [...sysSettings, { role: 'user', content: `关于${message}` }],
        max_tokens: 2048,
        n
      },
      this.axiosRequestConfig,
    );
    
    const dir = 'output';
    const made = mkdirp.sync(dir)

    for(const i in completion.data.choices){
      const choice = completion.data.choices[i];
      const content = _.get(choice,'message.content')
      const fileName = `${dir}/${filePrefix}-${i}.txt`
      fs.writeFileSync(fileName,content);
    }

  }

  async simpleCompl(message) {
    const completion = await this.openai.createCompletion(
      {
        model: 'text-davinci-003',
        prompt: message,
        max_tokens: 2048,
        echo: true,
      },
      this.axiosRequestConfig,
    );
    console.log(completion.data.choices);
  }

  async listModels() {
    const resp = await this.openai.listModels(this.axiosRequestConfig);
    return resp.data.data;
  }
}
