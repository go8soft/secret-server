const config = require('./config')
process.env.NODE_ENV = 'develop'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const express = require('express')
const app = express()
const http = require('http').Server(app)
const bodyParser = require('body-parser')
const pg = require('pg')
const crypto = require('crypto')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Request-Headers', '*')
  res.setHeader('Content-Type', 'application/json')
  next()
})

http.listen(config.port, '0.0.0.0', () => console.log(`Server running on ${config.port}...`))

const secretRouter = express.Router()
const itemRouter = express.Router({ mergeParams: true })
secretRouter.use('/secret', itemRouter)
app.use('/api', secretRouter)

itemRouter.route('/:hash').get(async (req, res) => {
  let db
  let out

  try {
    db = new pg.Client(config.dbConnStr)
    db.connect()

    const result = await db.query(`update secrets 
      set remaining_views = remaining_views - 1
      where remaining_views >= 1 and expires_at >= now() and hash = $1
      returning *`, [req.params.hash])

    if (result.rows.length === 1) {
      out = {
        hash: result.rows[0].hash,
        secretText: result.rows[0].secret_text,
        createdAt: result.rows[0].created_at,
        expiresAt: result.rows[0].expires_at,
        remainingViews: result.rows[0].remaining_views
      }
    }
  } catch (err) {
    console.log(err)
  } finally {
    if (db) await db.end()
  }

  if (out) {
    res.send(out)
  } else {
    res.status(404).send()
  }
})

itemRouter.route('/').post(async (req, res) => {
  let db
  let out

  try {
    db = new pg.Client(config.dbConnStr)
    db.connect()

    const result = await db.query(`insert into secrets 
      (hash, secret_text, expires_at, remaining_views)
      values ($1, $2, now() + $3 * interval '1 min', $4)
      returning *`,
    [crypto.randomBytes(15).toString('hex'),
      req.body.secret,
      req.body.expireAfter,
      req.body.expireAfterViews])

    if (result.rows.length === 1) {
      out = {
        hash: result.rows[0].hash,
        secretText: result.rows[0].secret_text,
        createdAt: result.rows[0].created_at,
        expiresAt: result.rows[0].expires_at,
        remainingViews: result.rows[0].remaining_views
      }
    }
  } catch (err) {
    console.log(err)
  } finally {
    if (db) await db.end()
  }

  if (out) {
    res.send(out)
  } else {
    res.status(409).send()
  }
})
