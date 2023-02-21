import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import { Session } from 'next-auth';

import Card from '@/component/card';
import Loading from '@/component/loading';
import Form from '@/component/form';
import Header from '@/component/header';

import { api } from '@/services/api';

import styles from '@/styles/Home.module.scss';
import ErrorMessage from '@/component/error-message';

type MoviesEmojizadosType = {
  data: {
    movieName: string;
    movieEmojizado?: string;
  }
};

type UserType = {
  user_name: string;
  user_avatar: string;
}

export type CountMoviesGeneratedType = {
  countMovies: number;
  maxMovies: number;
}

export interface CustomSessionProps extends Session {
  userActive: object | null;
}

export default function Home() {
  const [ loading, setLoading ] = useState(false);
  const [ isLoadingData, setIsLoadingData ] = useState(false);
  const [ isError, setIsError ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState('');
  const [ countMoviesGenerated, setCountMoviesGenerated ] = useState<CountMoviesGeneratedType>({
    countMovies: 0,
    maxMovies: 3,
  });
  const [moviesEmojizados, setMoviesEmojizados] = useState<MoviesEmojizadosType[]>([]);

  const { data: session } = useSession();

  // Added new typing for the session to return the userActive
  // property added in the nextAuth callback return
  const userSession = session as CustomSessionProps | null;
  
  // Set user object with name and avatar from session
  const user: UserType = {
    user_name: userSession?.user?.name?.split(' ')[0]!,
    user_avatar: userSession?.user?.image!
  }

  const fetchMovies = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const response = await api.post('/movies-emojis', {
        user: userSession?.userActive
      });
      setCountMoviesGenerated({
        countMovies: response.data.countMovies,
        maxMovies: response.data.maxMovies
      });
      setMoviesEmojizados(response.data.movies.data);
    } catch (error) {
      setIsError(true);
      setErrorMessage('Ocorreu um erro ao buscar os filmes emojizados!');
    } finally {
      setIsLoadingData(false);
    }
  }, [userSession]);

  useEffect(() => {
    fetchMovies();
  }, [userSession]);

  return (
    <>
      <Head>
        <title>Emojize seu filme preferido</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.ico" />
      </Head>
      <main className={styles.main}>
        <Header
          countMoviesGenerated={countMoviesGenerated}
          user_avatar={user.user_avatar}
        />
        <h2 className={styles.title}>
          Olá <span>{user.user_name},</span> <br />
          Digite o nome do seu filme preferido
          e veja a mágica acontecer
        </h2>

        <Form
          listMoviesGenerated={fetchMovies}
          isLoading={loading}
          setErrorMessage={setErrorMessage}
          setIsError={setIsError}
          setLoading={setLoading}
        />

        {
          isError && <ErrorMessage message={errorMessage} />
        }

        <div className={styles.divider} />

          {
            isLoadingData ? (
              <div className={styles.isLoadingData}>
                <Loading />
              </div>
          ) : (
              <div className={styles.list}>
                {
                  moviesEmojizados.map(({ data }) => (
                    <Card key={data.movieName} movieName={data.movieName} movieEmoji={data.movieEmojizado} />
                  ))
                }
              </div>
            )
          }
      </main>
    </>
  )
};


export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  };
}
