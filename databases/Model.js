const Datastore = require("nedb")
const path = require("path")
const fs = require("fs")
let db = null

function loadDB(_db)
{
    if( ! fs.existsSync(path.join(__dirname, _db.replace(".db",""))))
    {
        fs.mkdirSync(path.join(__dirname, _db.replace(".db","")))
    }
    db = new Datastore({filename : path.join(__dirname, _db.replace(".db","") +"/"+ _db)})
    db.loadDatabase()
}

module.exports = 
{
    insert : _req =>
    {
        loadDB(_req.db)
        db.insert(_req.data, (error, data) => error ? _req.callback(false) : _req.callback(data))
    },
    getall : _req =>
    {
        loadDB(_req.db)
        db.find({}).exec((error, data) => error ? _req.callback(false) : _req.callback(data))
    },
    getone : _req =>
    {
        loadDB(_req.db)
    },
    update : _req => 
    {
        loadDB(_req.db)
    },
    remove : _req => 
    {
        loadDB(_req.db)
        db.remove(_req.data, {}, (error, data) => ! error ? _req.callback(data) : _req.callback(false))
    },
    search : _req => 
    {
        loadDB(_req.db)
        db.find(_req.data, (error, data) => ! error ? _req.callback(data) : _req.callback(false))
    },
}