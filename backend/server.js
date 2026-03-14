const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const sqlite3 = require("sqlite3").verbose()

const app = express()

app.use(cors())
app.use(bodyParser.json())

const db = new sqlite3.Database("./inventory.db")

db.serialize(()=>{

db.run(`
CREATE TABLE IF NOT EXISTS products(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
cost INTEGER,
stock INTEGER
)
`)

})

app.get("/api/products",(req,res)=>{
db.all("SELECT * FROM products",(err,rows)=>{
res.json(rows)
})
})

app.post("/api/products",(req,res)=>{

const {name,cost,stock} = req.body

db.run(
"INSERT INTO products(name,cost,stock) VALUES(?,?,?)",
[name,cost,stock],
function(){
res.json({id:this.lastID})
})

})

app.listen(5000,()=>{
console.log("Server running on port 5000")
})