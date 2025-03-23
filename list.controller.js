import Product from "../models/need.model.js";

export const getlist = async (req, res) => {
	try {
		const needs = await need.find({ _id: { $in: req.user.listItems } });

		const listItems = needs.map((need) => {
			const item = req.user.listItems.find((listItem) => listItem.id === need.id);
			return { ...need.toJSON(), quantity: item.quantity };
		});

		res.json(listItems);
	} catch (error) {
		console.log("Error in getlistneeds controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addTolist = async (req, res) => {
	try {
		const { needId } = req.body;
		const user = req.user;

		const existingItem = user.listItems.find((item) => item.id === needId);
		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			user.listItems.push(needId);
		}

		await user.save();
		res.json(user.listItems);
	} catch (error) {
		console.log("Error in addTolist controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const removeAllFromlist = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;
		if (!productId) {
			user.cartItems = [];
		} else {
			user.cartItems = user.cartItems.filter((item) => item.id !== productId);
		}
		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateQuantity = async (req, res) => {
	try {
		const { id: needId } = req.params;
		const { quantity } = req.body;
		const user = req.user;
		const existingItem = user.listItems.find((item) => item.id === needId);

		if (existingItem) {
			if (quantity === 0) {
				user.listItems = user.listItems.filter((item) => item.id !== needId);
				await user.save();
				return res.json(user.listItems);
			}

			existingItem.quantity = quantity;
			await user.save();
			res.json(user.listItems);
		} else {
			res.status(404).json({ message: "Service not found" });
		}
	} catch (error) {
		console.log("Error in updateQuantity controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};