const {
  findOne,
  insertOne,
  findOneAndUpdate,
  findOneAndDelete
} = require("../mongo/operations");

const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.find = async (req, res) => {
  const result = await findOne("users", { _id: req.params.id });
  res.status(200).send(result);
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).send("Email is required");
    }

    if (!password) {
      return res.status(400).send("Password is required");
    }

    const existingUser = await findOne("users", { email });

    if (existingUser) {
      return res.status(409).json({ text: "User already exists. Please login" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await insertOne("users", {
      email: email.toLowerCase(),
      password: encryptedPassword
    });

    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h"
      }
    );

    user.token = token;
    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ text: 'Something went wrong' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).send("Email is required");
    }

    if (!password) {
      return res.status(400).send("Password is required");
    }

    const user = await findOne("users", { email });

    if (user && (await bcrypt.compare(password, user.password))) {
      user.token = jwt.sign(
        { _id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h"
        }
      );

      console.log('returning new token:', user.token);
      return res.status(200).json({ token: user.token });
    }

    res.status(400).json({ text: "Invalid Credentials" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ text: 'Something went wrong' });
  }
};

exports.logout = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      // nothing to do
      return res.sendStatus();
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ text: 'Something went wrong' });
  }
};

exports.update = async (req, res) => {
  const result = await findOneAndUpdate(
    "users",
    { _id: req.params.id },
    { $set: req.body }
  );

  return res.status(200).send(result);
};

exports.delete = async (req, res) => {
  const result = await findOneAndDelete("users", {
    _id: ObjectId(req.params.id)
  });
  console.log(result);
  return res.status(200).send(result);
};

exports.findKeybinds = async (req, res) => {
  const result = await findOne("users", { _id: req.params.id });

  return res.status(200).send(result);
};

exports.updateKeybinds = async (req, res) => {
  const result = await findOneAndUpdate(
    "users",
    { _id: req.params.id },
    { $set: req.body }
  );

  return res.status(200).send(result);
};