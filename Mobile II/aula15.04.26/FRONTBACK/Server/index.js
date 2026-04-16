const express = require('express');

const port = 3000;
const mongoose = require('mongoose');

let url = 'mongodb://localhost:27017/DSM_2026';
mongoose.connect(url)
  .then(
    () => { console.log('Conectado ao Mongodb') }
  ).catch(
    (e) => {console.log(e)}
  )

//fazer a estrutura coleção, documento(agregado)
  const us = mongoose.model('usuario', mongoose.Schema({name: String}));

let  app = express();

//get
app.get('/', async (req, res) => {
  //fazer mongo exibir do docuemntos(registro)
  const documentos  = await us.find({});
  res.json(documentos);
});

//post
app.post('/add', (req, res) => {
  i = req.params.name;
    res.send('Comando de Inserir' + i);
});

//put
app.put('/update/:id', async (req, res) => {
  let i = req.params.id;
    res.send(`Comando de Atualizar', ${i}`);
});


//delete
app.delete('/delete/:id', async (req, res) => {
  let i = req.params.id;
  
  //comando do mongo
  await us.deleteOne({_id: i});
    res.send(`Comando de Deletar', ${i}`);
});


//iniciando o servidor
app.listen(3000, () => {
  console.log('Executando  servidor');
});