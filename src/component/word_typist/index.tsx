import { useEffect, useState } from "react";

let skipDelay = 200;
let speed = 40;

type WordTypistType = {
	words: Array<string>;
}

export default function WordTypist({ words }: WordTypistType) {
	const [i, setI] = useState(0);
	const [offset, setOffset] = useState(0);
	const [forwards, setForwards] = useState(true);
	const [skipCount, setSkipCount] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			if (forwards) {
				if (offset >= words[i].length) {
					setSkipCount((count) => count + 1);
					if (skipCount === skipDelay) {
						setForwards(false);
						setSkipCount(0);
					}
				}
			} else {
				if (offset === 0) {
					setForwards(true);
					setI((prevI) => (prevI + 1 >= words.length ? 0 : prevI + 1));
				};
			};
			setOffset((prevOffset) => {
				if (skipCount === 0) {
					return forwards ? prevOffset + 1 : prevOffset - 1;
				}
				return prevOffset;
			});
		}, speed);

		return () => clearInterval(interval);
	}, [forwards, i, offset, skipCount]);

	return (
		<>
			{words[i].substring(0, offset)}
		</>
	);
}