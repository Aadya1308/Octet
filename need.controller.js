import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import need from "../models/need.model.js";

export const getAllneed = async (req, res) => {
	try {
		const needs = await need.find({}); // find all products
		res.json({ needs });
	} catch (error) {
		console.log("Error in getAllneeds controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getFeaturedneeds = async (req, res) => {
	try {
		let featuredneeds = await redis.get("featured_needs");
		if (featuredneeds) {
			return res.json(JSON.parse(featuredneeds));
		}
		featuredneeds = await need.find({ isFeatured: true }).lean();

		if (!featuredneeds) {
			return res.status(404).json({ message: "No featured needs found" });
		}

		await redis.set("featured_needs", JSON.stringify(featuredneeds));

		res.json(featuredProducts);
	} catch (error) {
		console.log("Error in getFeaturedneeds controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createneed = async (req, res) => {
	try {
		const { name, description, price, image, category } = req.body;

		let cloudinaryResponse = null;

		if (image) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "needs" });
		}

		const need = await need.create({
			name,
			description,
			price,
			image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
			category,
		});

		res.status(201).json(need);
	} catch (error) {
		console.log("Error in createneed controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteneed = async (req, res) => {
	try {
		const need = await need.findById(req.params.id);

		if (!need) {
			return res.status(404).json({ message: "need not found" });
		}

		if (next.image) {
			const publicId = need.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`needs/${publicId}`);
				console.log("deleted image from cloduinary");
			} catch (error) {
				console.log("error deleting image from cloduinary", error);
			}
		}

		await need.findByIdAndDelete(req.params.id);

		res.json({ message: "need deleted successfully" });
	} catch (error) {
		console.log("Error in deleteneed controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getRecommendedneeds = async (req, res) => {
	try {
		const needs = await need.aggregate([
			{
				$sample: { size: 4 },
			},
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					image: 1
				},
			},
		]);

		res.json(needs);
	} catch (error) {
		console.log("Error in getRecommendedneeds controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getneedsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const needs = await need.find({ category });
		res.json({ needs });
	} catch (error) {
		console.log("Error in getneedsByState controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const toggleFeaturedneeds = async (req, res) => {
	try {
		const need = await need.findById(req.params.id);
		if (need) {
			need.isFeatured = !need.isFeatured;
			const updatedneed = await need.save();
			await updateFeaturedneedsCache();
			res.json(updatedneed);
		} else {
			res.status(404).json({ message: "need not found" });
		}
	} catch (error) {
		console.log("Error in toggleFeaturedneed controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

async function updateFeaturedneedsCache() {
	try {
		const featuredneeds = await need.find({ isFeatured: true }).lean();
		await redis.set("featured_needs", JSON.stringify(featuredneeds));
	} catch (error) {
		console.log("error in update cache function");
	}
}