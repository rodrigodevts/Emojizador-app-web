import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

type Data = {
  usage?: {
    prompt_tokens: number, 
    completion_tokens: number,
    total_tokens: number,
  };
  text: string;
  created_at: Date;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: req.body.prompt,
    temperature: 0.8,
    max_tokens: 60,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ["\n"],
  });

  const result = {
    usage: response.data.usage,
    text: String(response.data.choices[0].text),
    created_at: new Date(),
  };

  if (result?.text) {
    return res.status(200).json(result);
  }

  throw new Error('Ocorreu um erro ao emojizar seu filme');
}
