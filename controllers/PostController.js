const PostModel = require("../models/Post");

const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId,
    });
    const post = await doc.save();
    res.send(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "couldn't create post", error });
  }
};

const getAll = async (req, res) => {
  try {
    const post = await PostModel.find().populate("user").exec();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "couldn't get all posts",
      error,
    });
  }
};

const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      { $inc: { viewsCount: 1 } },
      { returnDocument: "after" },
      (error, doc) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: "couldn't get post",
            error,
          });
        }
        if (!doc) {
          return res.status(404).json({ message: "couldn't find post" });
        }
        res.json(doc);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "couldn't get post",
      error,
    });
  }
};

const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    PostModel.findOneAndRemove(
      {
        _id: postId,
      },
      (error, doc) => {
        if (error) {
          console.log(error);
          return res.status(500).json({
            message: "couldn't delete post",
            error,
          });
        }
        if (!doc) {
          return res.status(404).json({ message: "couldn't find post" });
        }
        res.json(doc);
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "couldn't delete post",
      error,
    });
  }
};

const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
        user: req.userId,
      }
    );
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "couldn't update post",
      error,
    });
  }
};

module.exports = {
  create,
  getOne,
  getAll,
  remove,
  update,
};
