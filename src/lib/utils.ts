import { stringToBytes } from "@scure/base";

export const HARDENED_OFFSET: number = 0x80000000;

interface TruncateProps {
	value: string;
	firstCharCount?: number;
	endCharCount?: number;
	dotCount?: number;
}

export const truncateString = ({
	value,
	firstCharCount = value.length,
	endCharCount = 0,
	dotCount = 3,
}: TruncateProps) => {
	const shouldTruncate = value.length > firstCharCount + endCharCount;
	if (!shouldTruncate) return value;

	const firstPortion = value.slice(0, firstCharCount);
	const endPortion = value.slice(-endCharCount);
	const dots = ".".repeat(dotCount);

	return `${firstPortion}${dots}${endPortion}`;
};

export const pathToArray = (derivationPath: string): number[] => {
	const segments = derivationPath.split("/").slice(1);
	return segments.map((segment) => {
		const isHardened = segment.endsWith("'");
		const index = Number.parseInt(segment, 10);
		if (isHardened) {
			return HARDENED_OFFSET + index;
		}
		return index;
	});
};

export const arrayToPath = (derivationPath: number[]): string => {
	return [
		"m",
		...derivationPath.map((index) => {
			const isHardened = index >= HARDENED_OFFSET;
			if (isHardened) {
				return `${index - HARDENED_OFFSET}'`;
			}
			return index;
		}),
	].join("/");
};
