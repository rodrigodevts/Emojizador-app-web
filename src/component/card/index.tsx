import { FiCopy } from 'react-icons/fi';
import styles from '@/styles/Card.module.scss';

interface CardProps {
	movieName: string;
	movieEmoji?: string;
}

const Card = ({ movieName, movieEmoji }: CardProps) => {
	return (
		<div className={styles.card}>
			<span className={styles.movieName}>{movieName}</span>
			<span className={styles.movieEmoji}>{movieEmoji}</span>
			<button className={styles.copyEmoji}>
				<FiCopy size={43} />
			</button>
		</div>
	)
}

export default Card;