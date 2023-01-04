require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const isAuth = require("./middlewares/isAuth");

const app = express();

//MW Leer body
app.use(express.json());

//MW LEER FORM DATA
app.use(fileUpload());

//MW Morgan
app.use(morgan("dev"));

/**
 * ###############################
 * ## Controladores Users       ##
 * ###############################
 */
const { newUser, loginUser, editUser } = require("./controllers/users/index");

//Ruta para nuevo usuario
app.post("/users", newUser);

//Ruta para login de usuario
app.get("/users/login", loginUser);

//Ruta para editar usuario
app.put("/users/edit", isAuth, editUser);

/**
 * ###############################
 * ## Controladores Files       ##
 * ###############################
 */
const {
  newFile,
  listFiles,
  getFile,
  removeFile,
  createFolder,
} = require("./controllers/files/index");

//Ruta para subir un archivo
app.post("/files", isAuth, newFile);

//Ruta para listar todos los archivos de un usuario
app.get("/files", isAuth, listFiles);

//Ruta para descargar un archivo
app.get("/files/:idFile", isAuth, getFile);

//Ruta para descargar archivo en folder
app.get("/files/:folder/:idFile", isAuth, getFile);

//Ruta para borrar archivo en raiz
app.delete("/files/:idFile/", isAuth, removeFile);

//Ruta para crear una carpeta
app.post("/files/newfolder", isAuth, createFolder);

/**
 * ###############################
 * ##     MW Error / 404        ##
 * ###############################
 */

//MW ERROR
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send({
    status: "Error",
    message: err.message,
  });
});
//MW 404
app.use((req, res) => {
  res.status(404).send({
    message: "Invalid Path",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening at ${process.env.PORT}`);
});
