import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { FiLogOut } from 'react-icons/fi';
import type { CountMoviesGeneratedType } from '@/pages';
import styles from '@/styles/Header.module.scss';

interface HeaderProps {
	countMoviesGenerated: CountMoviesGeneratedType;
	user_avatar: string;
}

export default function Header({ countMoviesGenerated, user_avatar }: HeaderProps) {
	return (
		<header className={styles.header}>
			<Image
				src="./Logo.svg"
				width={168}
				height={32}
				alt="Logo"
			/>

			<div className={styles.countMoviesContainer}>
				<span>Você já emojizou</span>
				<span className={styles.countMoviesText}>
					{countMoviesGenerated.countMovies || 0} de {countMoviesGenerated.maxMovies || 3} filmes
				</span>
			</div>

			<div className={styles.userInfo}>
				<div>
					<Image
						src={user_avatar}
						alt="Logo"
						fill={true}
					/>
				</div>
				<FiLogOut size={24} onClick={() => signOut()} />
			</div>
		</header>
	)
}