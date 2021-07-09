const electron = require("electron")
const path = require("path")
const url = require("url")

let Root = null // Main window
const {app, BrowserWindow, Menu, ipcMain} = electron

// Production | Development
process.env.NODE_ENV = app.isPackaged ? "production" : "development" // Set production

// Window loader
function loadWindow(title, width, height, frame = true)
{
    const window = new BrowserWindow({
        webPreferences : {
            nodeIntegration         : true,
            contextIsolation        : true,
            worldSafeExecuteJavaScript : true,
            nodeIntegrationInWorker : true,
            enableRemoteModule      : true,
            preload     : path.join(__dirname, "/build/js/preload.js")
        },
        height      : height,
        width       : width,
        title       : title,
        frame       : frame, // Disable Close & Minimize buton
        resizable   : false,
        // icon        : path.join(__dirname, "./assets/icons/" + icon_path)
    })
    return window
}

// Menu template
const mainMenuTemplate = []
function setMainMenuTemplate()
{
    mainMenuTemplate.push({
        label   : "DevTools",
        submenu : [
            {
                label       : "Tolge DevTools",
                accelerator : process.platform == "darwin" ? "Command+I" : "Ctrl+I",
                click(item, focusedWindow) 
                {
                    focusedWindow.toggleDevTools()
                }
            },
            {
                role : "reload"
            }
        ]
    })
    return mainMenuTemplate
}

// Autoreload in Development
if(process.env.NODE_ENV === "development")
{
    require("electron-reload")(__dirname, {electron : "/usr/local/bin/electron", ignored : [/node_modules|[/\\]\./, /databases|[/\\]\./]})
}

// Entry Point
app.whenReady().then(() =>
{
    Root = loadWindow("ROMBAX FAMILY", 1008, 675, false)

    if (BrowserWindow.getAllWindows().length > 0)
    {
        Root.loadURL(url.format({
            pathname    : path.join(__dirname, "/build/index.html"),
            protocol    : "file:",
            slashes     : true
        }))
    }
    // Insert menu template
    if(process.env.NODE_ENV === "production")
    {
        Menu.setApplicationMenu(null)
    }
    else {
        Menu.setApplicationMenu(Menu.buildFromTemplate(setMainMenuTemplate()))
    }
    Root.on("closed", () => closeApp())
})

function closeApp()
{
    Root = null
    app.quit()
}
function reloadApp()
{
    app.relaunch()
    app.quit()
}
function minimizeApp()
{
    Root.minimize()
}

app.on("window-all-closed", () => closeApp())

ipcMain.on("app:quit", () => closeApp())
ipcMain.on("app:reload", () => reloadApp())
ipcMain.on("app:minimize", () => minimizeApp())