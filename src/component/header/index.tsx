import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { FiLogOut, FiUser } from 'react-icons/fi';
import useWindowDimensions from '@/utils/getWindowDimensions';
import styles from '@/styles/Header.module.scss';

interface HeaderProps {
	moviesGeneratedCount: MoviesGeneratedCountType;
};

type UserType = {
	user_name: string;
	user_avatar: string;
};

export type MoviesGeneratedCountType = {
	countMovies: number;
	maxMovies: number;
};

export default function Header({ moviesGeneratedCount }: HeaderProps) {
	const { status, data: session } = useSession();

	// Set user object with name and avatar from session
	const user: UserType = {
		user_name: session?.user?.name?.split(' ')[0]!,
		user_avatar: session?.user?.image!
	}

	const { width } = useWindowDimensions();

	const renderMobileHeader = () => {
		return (
			<header className={styles.header}>
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
								{
									status == 'authenticated' ? (
										<Image
											src={user.user_avatar}
											alt="Logo"
											fill={true}
										/>
									) : (
										<div>
											<div className={styles.defaultAvatar}>
												<FiUser size={24} />
											</div>
										</div>
									)
								}
							</div>
							<FiLogOut size={24} onClick={() => signOut()} />
						</div>
					</div>

					<div className={styles.countMoviesContainer}>
						<span>Você já emojizou</span>
						<span className={styles.countMoviesText}>
							{moviesGeneratedCount.countMovies || 0} de {moviesGeneratedCount.maxMovies || 3} filmes
						</span>
					</div>
				</div>
			</header>
		);
	};

	const renderDesktopHeader = () => {
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
						{moviesGeneratedCount.countMovies || 0} de {moviesGeneratedCount.maxMovies || 3} filmes
					</span>
				</div>

				<div className={styles.userInfo}>
					<div>
						{
							status == 'authenticated' ? (
								<Image
									src={user.user_avatar}
									alt="Logo"
									fill={true}
								/>
							) : (
								<div>
									<div className={styles.defaultAvatar}>
										<FiUser size={24} />
									</div>
								</div>
							)
						}
					</div>
					<FiLogOut size={24} onClick={() => signOut()} />
				</div>
			</header>
		);
	};
	
	return width! <= 426 ? renderMobileHeader() : renderDesktopHeader();
}