/* ===================================================================== ###
......................................
......................................
......................................
   <=( Files Helper )=>
......................................
......................................
......................................
*/
const fs          = require("fs")
const path        = require("path")
const removeFile  = require("find-remove")

module.exports = 
{
    /* ======= | GET ALL FILES & FOLDER INSIDE SOME DIRECTORY | ======= */
    getInsideDir : TARGET =>
    {
        fs.readdir(path.join(__dirname, "../" + TARGET.data), (error, files) => ! error ? TARGET.callback(files) : TARGET.callback(error))
    },

    /* ======= | REMOVE ALL FILES | ======= */
    emptyDir : TARGET =>
    {
        if(TARGET.filter) {
            removeFile(path.join(__dirname, "../" + TARGET.target), {dir: "*", files: "*.*", ignore : TARGET.filter})
        }
        else {
            removeFile(path.join(__dirname, "../" + TARGET), {dir: "*", files: "*.*"})
        }
    },

    /* ======= | CHECK DIRECTORY/ FILES | ======= */
    checkDir : directory =>
    {
        if(fs.existsSync(path.join(__dirname, "../" + directory))) return true
        else return false
    },

    /* ======= | MAKE DIRECTORY | ======= */
    makeDir : directory => fs.mkdirSync(path.join(__dirname, "../" + directory)),

    /* ======= | COPY FILE | ======= */
    copyFile : REQUEST => fs.copyFile(REQUEST.target, path.join(__dirname, "../" + REQUEST.destination), error => REQUEST.callback(error)),

    /* ======= | RENAME FILE | ======= */
    renameFile : REQUEST => fs.rename(path.join(__dirname, "../" + REQUEST.target), path.join(__dirname, "../" + REQUEST.destination), error => REQUEST.callback(error)),

    /* ======= | DELETE FILE | ======= */
    deleteFile : REQUEST => fs.unlink(path.join(__dirname, "../" + REQUEST.target), error => REQUEST.callback(error)),
    
    /* ======= | DELETE FOLDER | ======= */
    deleteFolder : REQUEST => fs.rmdirSync(path.join(__dirname, "../" + REQUEST.target), {recursive : true}, error => REQUEST.callback(error)),

    /* ======= | WRITE INTO A FILE | ======= */
    writeFile : REQUEST => 
    {
        fs.writeFile(path.resolve(__dirname, "../" + REQUEST.file), REQUEST.contents, error => REQUEST.callback(error))
    },

    /* ======= | READ A FILE | ======= */
    readFile : REQUEST => fs.readFile(path.join(__dirname, "../" + REQUEST.file), "utf8", (error, data) => ! error ? REQUEST.callback(data) : REQUEST.callback(false))
}