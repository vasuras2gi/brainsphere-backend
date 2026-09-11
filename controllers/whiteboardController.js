// const Whiteboard = require("../models/Whiteboard");
import Whiteboard from "../models/Whiteboard.js";

export const createWhiteboard = async (req, res) => {
  try {
    const { title, data, debate } = req.body;

    const board = await Whiteboard.create({
      title,
      data,
      debate,
      createdBy: req.user._id
    });

    res.status(201).json(board);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWhiteboards = async (req, res) => {
  try {
    const boards = await Whiteboard.find({ createdBy: req.user._id });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateWhiteboard = async (req, res) => {
  try {
    const board = await Whiteboard.findById(req.params.id);

    if (!board)
      return res.status(404).json({ message: "Not found" });

    board.data = req.body.data;
    await board.save();

    res.json(board);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
