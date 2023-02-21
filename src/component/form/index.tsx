import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { CustomSessionProps } from "@/pages";
import Loading from "@/component/loading";
import { api } from "@/services/api";
import styles from '@/styles/Form.module.scss';

type DataResponseType = {
	movieGenerated?: {
		movieEmojizado: string;
	};
	countMovies?: number;
	message: string;
}

interface FormProps {
	isLoading: boolean;
	setLoading: (isLoading: boolean) => void;
	setIsError: (isError: boolean) => void;
	setErrorMessage: (message: string) => void;
	listMoviesGenerated: () => void;
}

export default function Form({
	isLoading,  
	setLoading,
	setIsError,
	setErrorMessage,
	listMoviesGenerated,
}: FormProps) {
	const [movieName, setMovieName] = useState('');
	const { data: session } = useSession();
	const customSession = session as CustomSessionProps | null; 

	const getErrorMessage = (error: string): string => {
		switch (error) {
			case 'insufficient credits':
				return 'Infelizmente meu orçamento é limitado, você só pode emojizar 3 filmes! 😭😭😭😭';
			case 'movie name already exists':
				return 'Você já emojizou esse, que tal tentar outro filme? 😉';
			default:
				return "Eita, deu erro! Pode enviar um print no meu instagram? @rodrigo.dev.json"
		}
	}

	const handleSubmit = async (event: FormEvent): Promise<void> => {
		event.preventDefault();

		if (!session) {
			return;
		}

		if (customSession?.userActive) {
			const message = `Convert movie titles into emoji.\n\n${movieName}:`;
			setLoading(true);
			try {
				const { data } = await api.post<DataResponseType>('/ia-emojizador', {
					prompt: message,
					movieName,
					user: customSession?.userActive
				});

				if (data.movieGenerated?.movieEmojizado) {
					listMoviesGenerated();
					setLoading(false);
					setIsError(false);
					setErrorMessage('');
					return;
				}

				setIsError(true);
				setLoading(false);
			} catch (err: any) {
				setIsError(true);
				setLoading(false);
				setErrorMessage(getErrorMessage(err.response.data.message));
			}
		}
	}
	
	return (
		<form className={styles.input} onSubmit={handleSubmit}>
			<input
				type="text"
				placeholder='Digite o nome do filme'
				maxLength={40}
				onChange={(event) => setMovieName(event.target.value)}
				value={movieName}
			/>
			<button type="submit" id="submit-button">
				{
					isLoading ? (
						<Loading />
					) : 'Emojizar'
				}
			</button>
		</form>
	)
}