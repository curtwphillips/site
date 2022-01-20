const {
  findOne,
  insertOne,
  findOneAndUpdate,
  findOneAndDelete
} = require("../mongo/operations");

const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// todo: use cache
const tokens = [];

// const { userSchema } = require("./schemas/user");
// const { validate } = require("./schemas/validate");

exports.find = async (req, res) => {
  const result = await findOne("users", { _id: req.params.id });
  res.status(200).send(result);
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      console.log('missing email:', req.body);
      return res.status(400).send("Email is required");
    }

    if (!password) {
      console.log('missing password:', req.body);
      return res.status(400).send("Password is required");
    }

    const existingUser = await findOne("users", { email });

    if (existingUser) {
      console.log('existingUser:', existingUser)
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
      console.log('missing email:', req.body);
      return res.status(400).send("Email is required");
    }

    if (!password) {
      console.log('missing password:', req.body);
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

      const newVal = { token: user.token, user };
      const index = tokens.findIndex((val) => val.user.email === email);
      if (index > -1) {
        tokens[index] = newVal;
      } else {
        tokens.push(newVal);
      }

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
      console.log('missing token:', req.body);
      return res.sendStatus();
    }

    // remove token from memory (todo: use cache)
    const index = tokens.findIndex((val) => val.token === token);
    if (index > -1) {
      tokens.splice(index, 1);
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