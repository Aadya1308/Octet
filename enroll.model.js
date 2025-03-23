import mongoose from "mongoose";

const enrollSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		needs: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "need",
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					min: 1,
				},
				price: {
					type: Number,
					required: true,
					min: 0,
				},
			},
		],
		stripeSessionId: {
			type: String,
			unique: true,
		},
	},
	{ timestamps: true }
);

const enroll = mongoose.model("Enroll", enrollSchema);

export default enroll;