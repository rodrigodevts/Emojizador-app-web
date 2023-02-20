import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import { getSession, signIn } from 'next-auth/react';

import Loading from '@/component/loading';
import WordTypist from '@/component/word_typist';

import { FaGoogle } from 'react-icons/fa';
import banner from '../../../public/banner.png';
import styles from '@/styles/SignIn.module.scss';

const words_typist = ['Venha se divertir no emojizador.', 'Adivinha qual o filme:🧙🏻‍♂️💍?', 'Duvido você acertar agora:👨👴🚗🕒?'];

export default function Login() {
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		try {
			setLoading(true);
			signIn();
			setLoading(false);
		} catch (err) {
			setLoading(false);
			console.log(err);
		}
	};
	
	return (
		<>
			<Head>
				<title>Login - Emojize seu filme preferido</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/icon.ico" />
			</Head>
			<header className={styles.header}>
				<Image
					src="./Logo.svg"
					width={168}
					height={32}
					alt="Logo"
				/>
			</header>
			<main className={styles.main}>
				<div className={styles.sigIn}>
					<div className={styles.title}>
						<h1>
							<WordTypist
								words={words_typist}
							/>
						</h1>
						<p>Utilize sua conta Google (Gmail) para se conectar</p>
					</div>
					<button
						className={styles.signInButton}
						onClick={handleSubmit}
						disabled={loading}
					>
						{loading ? (
							<Loading />
						) : (
							<>
								<FaGoogle size={18} color="#FFF" />
								Entrar com uma conta Google
							</>
						)
					}
					</button>
				</div>
				<Image
					className={styles.banner}
					src={banner}
					alt="Emojis"
					data-aos="fade-left"
					data-aos-anchor="#example-anchor"
					data-aos-offset="500"
					data-aos-duration="500"
				/>
			</main>
		</>
	)
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const session = await getSession(context);

	if (session) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			}
		}
	}

	return {
		props: {}
	}
}