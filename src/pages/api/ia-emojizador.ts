import type { NextApiRequest, NextApiResponse } from 'next';
import { fauna } from '@/services/fauna';
import { query } from 'faunadb';
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
  movieEmojizado: string;
  movieName: string;
  created_at: string;
  user_id: string;
}

type User = {
  name: string;
  email: string;
  imagem: string;
  maxMovies: number;
  countMovies: number;
  created_at: string;
};

type ApiResponseType = {
  movieGenerated?: Data;
  countMovies?: number;
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponseType>
) {
  const { user, prompt, movieName } = req.body;

  const user_id = user['@ref'].id;

  try {
    const { countMovies, maxMovies } = await fauna.query<User>(
      query.Select(
        "data",
        query.Get(
          query.Ref(query.Collection('users'), user_id),
        )
      )
    );

    if (countMovies >= maxMovies) {
      return res.status(403).json({
        message: 'insufficient credits',
        countMovies,
      });
    }

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.8,
      max_tokens: 60,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stop: ["\n"],
    });

    const data: Data = {
      usage: response.data.usage,
      movieName,
      movieEmojizado: String(response.data.choices[0].text),
      created_at: new Date().toString(),
      user_id,
    };

    if (data?.movieEmojizado || (data?.usage?.prompt_tokens || data?.usage?.prompt_tokens! > 0)) {
      console.log('nome: ', movieName);
      const movieNameNotExists = await fauna.query(
        query.If(
          query.Not(
            query.Exists(
              query.Match(
                query.Index('movie_emoji_by_movieName'),
                movieName,
              ),
            ),
          ),
          query.Create(
            query.Collection("movies_emoji"), {
            data,
          },
          ),
          null,
        ),
      );
      
      // Se retornar o objeto criado, é por que não encontrou com nome igual
      if (!movieNameNotExists) {
        return res.status(403).json({
          message: 'movie name already exists',
          countMovies,
        });
      }

      await fauna.query(
        query.Update(
          query.Ref(query.Collection('users'), user_id),
          {
            data: {
              countMovies: countMovies + 1,
            },
          },
        ),
      );

      return res.status(200).json({
        movieGenerated: data,
        countMovies,
        message: 'successful emoji name',
      });
    };
  } catch (err) {
    console.log('Erro in generate emoji: ', err);
    return res.status(400).json({
      message: `Erro in generate emoji`,
    });
  };
};
