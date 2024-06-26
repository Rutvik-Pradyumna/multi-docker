const keys = require("./keys")

// express app setup
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(bodyParser.json())

// postgress client setup
const {Pool} = require('pg')
const pgClient = new Pool({
    user : keys.pgUser,
    host : keys.pgHost,
    database : keys.pgDatabase,
    password : keys.pgPassword,
    port : keys.pgPort
})

pgClient.on("connect", (client) => {
    client
      .query("CREATE TABLE IF NOT EXISTS values (number INT)")
      .catch((err) => console.error(err));
  })

// redis client setup
const redis = require('redis')
const redisClient = redis.createClient({
    host : keys.redisHost,
    port : keys.redisPort,
    retry_strategy : () => 1000
})
const redisPublisher = redisClient.duplicate()

// express route handlers
app.get('/', (req,res) => {
    res.send("hi")
})
// returns all indices that are submitted to our app
app.get('/values/all', async (req,res) => {
    const values = await pgClient.query("SELECT * FROM VALUES")
    res.send(values.rows)
})
// retrieve all values that are requested by all users from redis
app.get('/values/current', async(req, res) => {
    redisClient.hgetall('values', (err,values) => {
        res.send(values)
    })
})
// asking an index value by user
app.post('/values', async(req,res) => {
    const index = req.body.index
    if(parseInt(index)>40){
        return res.status(422).send("index too high")
    }
    redisClient.hset('values',index,'Nothing yet!')
    // sending msg to worker process
    redisPublisher.publish('insert',index)
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index])
    res.send({working : true})
})

app.listen(5000, err => {
    console.log('listening...')
})