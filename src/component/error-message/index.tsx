import styles from '@/styles/ErrorMessage.module.scss';

interface ErrorMessageProps {
	message: string;
}

export default function ErrorMessage({
	message
}: ErrorMessageProps) {
	return (
		<div className={styles.error}>
			<p>
				{message}
			</p>
		</div>
	)
}