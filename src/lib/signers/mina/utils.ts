import { Field, Scalar, Signature } from "o1js";

export const legacySignatureConverter = (signature: {
	field: string;
	scalar: string;
}) =>
	Signature.fromObject({
		r: Field.from(signature.field),
		s: Scalar.fromJSON(signature.scalar),
	});
