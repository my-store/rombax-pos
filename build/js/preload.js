const { ipcRenderer, contextBridge } = require("electron")
const path = require("path")

// Modules
const admins_module = require(path.join(__dirname, "/js/admins/main"))

// Share electron into front-end | React
contextBridge.exposeInMainWorld("electron", 
{
    app : {
        quit : () => ipcRenderer.send("app:quit"),
        minimize : () => ipcRenderer.send("app:minimize")
    },
    notification : {
        send : _msg => ipcRenderer.send("notify", _msg)
    },
    database : {
        getall : _req => eval(_req.db + "_module").reloadData(),
        search : _req => eval(_req.db + "_module").searchData(_req.key),
        insert : _req => eval(_req.db + "_module").insertData(_req.data),
        update : _req => eval(_req.db + "_module").updateData(_req.data),
        delete : _req => eval(_req.db + "_module").deleteData(_req.id),
    }
})