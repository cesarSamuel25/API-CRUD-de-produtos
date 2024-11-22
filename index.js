const express = require('express');
const bodyparser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express()
app.use(bodyparser.json())

//URL DE CONEXAO
const url = 'mongodb+srv://samuelscesar:086251sa@cluster-samuel.hdfkp.mongodb.net/';
const client = new MongoClient(url);

//DADOS DO BANCO DE DADOS
const dbName = 'OAT'
const collectionName = 'Produtos'

//CREATE /produto/inserir/v1
app.post('/produto/inserir/v1', async (req, res) => {
  const body = req.body
  console.log(body)

  try {
    await client.connect()
    console.log("Conectado ao servidor MongoDB")

    const db = client.db(dbName)
    const collection = db.collection(collectionName)

    var novoProduto = {
      Descricao: body.produto,
      DataDeCadastro: new Date(),
      UltimaDataDeAlteração: new Date(),
      Quantidade: body.quantidade
    }

    const resultado = await collection.insertOne(novoProduto)
    console.log('Produto inserido com sucesso!')
    console.log(novoProduto)
    
    const jsonProduto = JSON.stringify(novoProduto, null, 2);
    res.send(jsonProduto)
  }

  catch (err) {
    console.log('Erro ao inserir produto', err)
    return 'Erro ao inseir produto'
  }

  finally{
    await client.close()
    console.log("Conexão ao servidor MongoDB Encerrada!")
  }
})

//READ /produto/listar/v1
app.get('/produto/listar/v1', async (req, res) => {
  try {
    await client.connect()
    console.log("Conectado ao servidor MongoDB")

    const db = client.db(dbName)
    const collection = db.collection(collectionName)

    const produtos = await collection.find({}).toArray()

    let arrayProdutos = []

    for (let i = 0; i < produtos.length; i++){
      arrayProdutos[i] = produtos[i]

      console.log("Produtos encontradas:")
      console.log(arrayProdutos)
    }

    const jsonProdutos = JSON.stringify(arrayProdutos, null, 2)
    res.send(jsonProdutos)

  } catch (err) {
    console.log('Erro ao consultar produtos', err)
    return 'Erro ao consultar produtos'   
    
  } finally {
    await client.close()
    console.log("Conexão ao servidor MongoDB Encerrada!")
  }
})

//UPDATE /produto/alterar/v1

app.post('/produto/alterar/v1', async (req, res) => {
  const body = req.body
  console.log(body)

  try{
    await client.connect()
    console.log("Coectado ao servidor MongoDB")

    const db = client.db(dbName)

    const collection = db.collection(collectionName)

    var produto = {
      Descricao: body.produto,
      UltimaDataDeAlteração: new Date(),
      Quantidade: body.quantidade
    }

    const filtro = { _id: new ObjectId(body._id) }
    console.log(filtro)

    const novosValores = { '$set': produto }
    console.log(novosValores)

    const resultado = await collection.updateOne(filtro, novosValores);
    console.log(`Quantidade de registros alterados: ${resultado.matchedCount}`)

    if (resultado.matchedCount === 0) {
      console.log('Nenhum produto encontrado com O ID fornecida.')
    } else{
      console.log('Poduto alterado com sucesso.')
    }

    const jsonProdutos = JSON.stringify(produto, null, 2)
    res.send(jsonProdutos)

  } catch(err) {
    console.error("Erro ao atualizar o produto", err)
    return "Erro ao atualizar o produto"
  } finally{
    await client.close()
    console.log("Conexão com o servidor MongoDB encerrada!")
  }
})

//DELETE /produto/remover/v1
app.post('/produto/remover/v1', async (req, res) => {
  const body = req.body
  console.log(body)

  try {
    await client.connect()
    console.log('Conectado ao servidor MongoDB')

    const db = client.db(dbName)
    const collection = db.collection(collectionName)

    const filtro = { _id: new ObjectId(body._id)}
    console.log(filtro)

    const resultado = await collection.deleteOne(filtro);
    console.log(`Quantidade de registros removidos ${resultado.deletedCount}`)
    console.log(resultado)

    if(resultado.deletedCount === 0){
      console.log("Nenhum produto encontrado com o ID fornecido")
      res.send(`Nenhuma tarefa encontrada com o ID fornecido. ID: ${body._id}`)
    } else {
      console.log("Produto removido com sucesso!")
      res.send(`Produto removido com sucesso! ID: ${body._id}`)
    }

  } catch (err) {
    console.error("Erro ao remover o produto.", err)
    return "Erro ao remover o produto."

  } finally {
    await client.close()
    console.log("Conexão com o servidor MongoDB encerrada!")
  }
})

app.listen(2024, () => {console.log('SERVIDOR ABERTO!')})