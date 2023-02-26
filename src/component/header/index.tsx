import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { FiLogOut } from 'react-icons/fi';
import type { CountMoviesGeneratedType } from '@/pages';
import { useWindowDimensions } from '@/utils/getWindowDimensions';
import styles from '@/styles/Header.module.scss';

interface HeaderProps {
	countMoviesGenerated: CountMoviesGeneratedType;
	user_avatar: string;
}

export default function Header({ countMoviesGenerated, user_avatar }: HeaderProps) {

	const { width } = useWindowDimensions();
	
	return (
		<header className={styles.header}>

			{
				width! <= 426 ? (
					<div className={styles.headerMobile}>
						<div className={styles.headerTopMobile}>
							<Image
								src="./Logo.svg"
								width={168}
								height={32}
								alt="Logo"
							/>
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
						</div>

						<div className={styles.countMoviesContainer}>
							<span>Você já emojizou</span>
							<span className={styles.countMoviesText}>
								{countMoviesGenerated.countMovies || 0} de {countMoviesGenerated.maxMovies || 3} filmes
							</span>
						</div>
					</div>	
				) : (
					<>
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
					</>	
				)
			}
		</header>
	)
}