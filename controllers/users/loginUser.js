const selectUserByEmailQuery = require("../../bbdd/queries/users/selectUserByEmailQuery");
const { generateError } = require("../../helpers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw generateError("Missing data", 400);
    }

    //Tratamos de obtener al usuario con el mail que venga en el body
    const user = await selectUserByEmailQuery(email);

    //Comprobamos si la contrasena es valida
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw generateError("Password incorrect", 401);
    }

    //Creamos un objeto con la info del token
    const tokenInfo = {
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      photo: user.photo,
      bio: user.bio,
    };

    //Creamos el token
    const token = jwt.sign(tokenInfo, process.env.SECRET, {
      expiresIn: "15d",
    });

    res.status(200).send({
      data: {
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = loginUser;
