import { User } from "../../DB/models/index.js";

const handleError = (res, err) => {
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    const messages = err.errors?.length
      ? err.errors.map((e) => e.message)
      : [err.message];
    return res.status(400).json({ message: "Validation error", errors: messages });
  }
  return res.status(500).json({ message: "Server error", error: err.message });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: "Email already exists." });

    const user = User.build({ name, email, password, role });
    await user.save();

    return res.status(201).json({ message: "User added successfully." });
  } catch (err) {
    return handleError(res, err);
  }
};

export const createOrUpdateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body; // extra fields (e.g. age) are ignored
    await User.upsert(
      { id: req.params.id, name, email, password, role },
      { validate: false }
    );
    return res.status(200).json({ message: "User created or updated successfully" });
  } catch (err) {
    return handleError(res, err);
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.query.email },
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ message: "no user found" });
    return res.status(200).json({ user });
  } catch (err) {
    return handleError(res, err);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["role", "password"] },
    });
    if (!user) return res.status(404).json({ message: "no user found" });
    return res.status(200).json(user);
  } catch (err) {
    return handleError(res, err);
  }
};
