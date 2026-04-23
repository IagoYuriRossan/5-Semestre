let express = require("express");
const mongoose = require("mongoose");
let bodyParser = require("body-parser");
let methodOvirride = require("method-override");
let cors = require("cors");

let app = express();
const port = 3000;
//Vincule middlewares
app.use(cors());

// Permite que você use verbos HTTP
app.use(methodOvirride("X-HTTP-Method"));
app.use(methodOvirride("X-HTTP-Method-Override"));
app.use(methodOvirride("X-Method-Override"));
app.use(methodOvirride("_method"));

app.use((req, resp, next) => {
  resp.header("Access-Control-Allow-Origin", "*");
  resp.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const url = "mongodb://localhost:27017/DSM_2026";

mongoose
  .connect(url)
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((e) => console.log(e));

const Us = mongoose.model("Usuario", mongoose.Schema({ name: String }));

app.get("/", async (req, res) => {
  const documentos = await Us.find({});
  res.json(documentos);
});

app.post("/add", async (req, res) => {
  let nome = req.body.name;
    const rec = await new Us({name: nome});
  rec.save();
  res.json({"status": "Adicionado"});
});

app.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  await Us.updateOne({ _id: id }, { name });
  res.json({"status": "Atualizado"});
});

app.delete("/:id", async (req, res) => {
  let i = req.params.id;
  await Us.deleteOne({_id:i});
  res.json({"status": "Deletado"+"id"+ i});
});

app.listen(port, () => console.log("Servidor Iniciado!"));