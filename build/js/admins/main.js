const Store = require("electron-store")
const electron = require("electron")
const { Notification } = electron.remote
const path = require("path")

// Admin login session
const RombaxStore = new Store()
const AdminData = RombaxStore.get("AdminData")

// Root/App root folder
const ROOT_PATH = path.join(__dirname, "../../../")

// Databases
const Model = require(ROOT_PATH + "databases/Model")

// Helpers
const RombaxFiles = require(ROOT_PATH + "helpers/Files")
const RombaxCalendar = require(ROOT_PATH + "helpers/Calendar")

// Get application settings
let APP_SETTINGS = null
RombaxFiles.readFile({
    file : "app.config.json",
    callback : _contents =>
    {
        if(_contents == false) return console.log("ERROR | app.config.json")
        APP_SETTINGS = JSON.parse(_contents)
    }
})

// Date & Time
let jam = "", menit ="", detik = "", hari = "", tanggal = "", bulan = "", tahun = ""
function reloadCalendar()
{
    RombaxCalendar("Jam",(getJam)=>jam=getJam)
    RombaxCalendar("Menit",(getMenit)=>menit=getMenit)
    RombaxCalendar("Detik",(getDetik)=>detik=getDetik)
    RombaxCalendar("Hari",(getHari)=>hari=getHari)
    RombaxCalendar("Tanggal",(getTanggal)=>tanggal=getTanggal)
    RombaxCalendar("Bulan",(getBulan)=>bulan=getBulan)
    RombaxCalendar("Tahun",(getTahun)=>tahun=getTahun)
}

// Temporary update data
let UpdateAdminData = {
    photo: "",
    old_photo: "",
    name: "",
    old_name: ""
}

// Import module for preload.js file
const self = module.exports =
{
    reloadData : () => 
    {
        // Action | Close btn
        const adminActionCloseBtn = document.getElementsByClassName("cancel-btn")[0]
        adminActionCloseBtn.addEventListener("click", () => self.removeAdminAction())

        // Photo preview | Close btn
        const closePhotoPreviewBtn = document.getElementsByClassName("cancel-admin-photo")[0]
        closePhotoPreviewBtn.addEventListener("click", () => self.removeAdminPhoto())

        // Search | Open
        const openSearchBtn = document.getElementById("search-btn")
        openSearchBtn.addEventListener("click", () => self.openSearchBox())
        // Search | Close
        const closeSearchBtn = document.getElementsByClassName("search-admin-close")[0]
        closeSearchBtn.addEventListener("click", () => {
            self.removeSearchBox()
            setTimeout(() => self.reloadData(), 300)
        })

        // New admin | Add photo btn
        const newAdminPhotoPreviewBtn = document.getElementsByClassName("new-admin-photo-preview-btn")[0]
        newAdminPhotoPreviewBtn.addEventListener("click", () => self.pickImage("New"))
        // New admin | Save btn
        const newAdminFormSaveBtn = document.getElementsByClassName("new-admin-form-save-btn")[0]
        newAdminFormSaveBtn.addEventListener("click", () => self.newAdmin())
        // New admin | Cancel btn
        const newAdminFormCancelBtn = document.getElementsByClassName("new-admin-form-cancel-btn")[0]
        newAdminFormCancelBtn.addEventListener("click", () => self.removeNewAdminForm())

        // Update admin-name listener
        const updateAdminName = document.querySelector(".update-admin-form .admin-name")
        updateAdminName.addEventListener("keyup", () => 
        {
            if (updateAdminName.value != "") 
            {
                UpdateAdminData.name = updateAdminName.value.toLowerCase()
                if (UpdateAdminData.name.match(/\s/g)) 
                {
                    const matchSpace = UpdateAdminData.name.match(/\s/g)
                    for (let matches = 0; matches < matchSpace.length; matches++) 
                    {
                        UpdateAdminData.name = UpdateAdminData.name.replace(/\s/g, "-")
                    }
                }
            }
        })
        // Update | Save
        const updateAdminFormSaveBtn = document.getElementsByClassName("update-admin-form-save-btn")[0]
        updateAdminFormSaveBtn.addEventListener("click", () => self.updateData())
        // Update | Close
        const updateAdminFormCloseBtn = document.getElementsByClassName("update-admin-form-cancel-btn")[0]
        updateAdminFormCloseBtn.addEventListener("click", () => self.removeUpdateAdminForm())
        // Update | Photo preview btn
        const updateAdminFormPhotoPreviewBtn = document.getElementsByClassName("update-admin-photo-preview-btn")[0]
        updateAdminFormPhotoPreviewBtn.addEventListener("click", () => self.pickImage("Update"))

        // Load admin-data from database
        Model.getall({
            db : "admins.db",
            callback : admin_data =>
            {
                // All admins data
                const admins = admin_data

                // Total admin
                const total_admin = document.getElementById("total-admin")
                total_admin.innerHTML = admins.length

                const adminsContainer = document.getElementsByClassName("admin-item-container")[0]
                adminsContainer.innerHTML = ""

                if(admins.length > 0)
                {
                    for(let y in admins)
                    {
                        const admin = admins[y]

                        const dataTableRow = document.createElement("tr")

                        for (let z in admin) 
                        {
                            if (z != "ADM_Pass" && z != "ADM_Timestamp") 
                            {
                                const tableData = document.createElement("td")
                                if (z != "_id") 
                                {
                                    if (z == "ADM_Photo") 
                                    {
                                        const td_photo_link = document.createElement("a")
                                        td_photo_link.classList.add("photo-link")
                                        td_photo_link.innerHTML = "Lihat"
                                        td_photo_link.addEventListener("click", () => self.viewAdminPhoto(`${admins[y].ADM_Phone}`,`${admins[y].ADM_Fullname}`,`${admins[y].ADM_Photo}`))
                                        tableData.innerHTML = ""
                                        tableData.appendChild(td_photo_link)
                                    }
                                    else {
                                        tableData.innerHTML = admin[z]
                                    }

                                    tableData.classList.add(`td-${z.replace("ADM_", "").toLowerCase()}`)

                                    if (z == "ADM_Fullname") 
                                    {
                                        tableData.addEventListener("click", () => self.openAdminAction(admin))
                                        admin.ADM_Fullname.length > 38 ? tableData.setAttribute("title", admin.ADM_Fullname) : null
                                        tableData.innerHTML = admin.ADM_Fullname.substring(0, 38)
                                    }

                                    if (z == "ADM_Address") {
                                        admin.ADM_Address.length > 19 ? tableData.setAttribute("title", admin.ADM_Address) : null
                                        tableData.innerHTML = admin.ADM_Address.substring(0, 19)
                                    }
                                }
                                else {
                                    tableData.innerHTML = parseInt(y) + 1
                                    tableData.classList.add("td-number")
                                }
                                dataTableRow.appendChild(tableData)
                            }
                        }
                        adminsContainer.appendChild(dataTableRow)
                    }
                }
                else {
                    adminsContainer.style.padding = "10px"
            
                    const emptyData = document.createElement("p")
                    emptyData.innerHTML = "Belum ada admin."
                    adminsContainer.appendChild(emptyData)
                }
            }
        })
    },
    searchData : _key =>
    {
        const _req = {
            data : {
                ADM_Fullname : new RegExp(_key, "g")
            }
        }
        Model.search({
            db : "admins.db",
            data : _req.data,
            callback : _searchReasult => 
            {
                // All admins data
                const admins = _searchReasult

                // Total admin
                const total_admin = document.getElementById("total-admin")
                total_admin.innerHTML = admins.length

                const adminsContainer = document.getElementsByClassName("admin-item-container")[0]
                adminsContainer.innerHTML = ""

                if(admins.length > 0)
                {
                    for(let y in admins)
                    {
                        const admin = admins[y]

                        const dataTableRow = document.createElement("tr")

                        for (let z in admin) 
                        {
                            if (z != "ADM_Pass" && z != "ADM_Timestamp") 
                            {
                                const tableData = document.createElement("td")
                                if (z != "_id") 
                                {
                                    if (z == "ADM_Photo") 
                                    {
                                        const td_photo_link = document.createElement("a")
                                        td_photo_link.classList.add("photo-link")
                                        td_photo_link.innerHTML = "Lihat"
                                        td_photo_link.addEventListener("click", () => AdminModule.viewAdminPhoto(`${admins[y].ADM_Phone}`,`${admins[y].ADM_Fullname}`,`${admins[y].ADM_Photo}`))
                                        tableData.innerHTML = ""
                                        tableData.appendChild(td_photo_link)
                                    }
                                    else {
                                        tableData.innerHTML = admin[z]
                                    }

                                    tableData.classList.add(`td-${z.replace("ADM_", "").toLowerCase()}`)

                                    if (z == "ADM_Fullname") 
                                    {
                                        tableData.addEventListener("click", () =>
                                        {
                                            console.log(admin)
                                        })
                                        admin.ADM_Fullname.length > 38 ? tableData.setAttribute("title", admin.ADM_Fullname) : null
                                        tableData.innerHTML = admin.ADM_Fullname.substring(0, 38)
                                    }

                                    if (z == "ADM_Address") {
                                        admin.ADM_Address.length > 19 ? tableData.setAttribute("title", admin.ADM_Address) : null
                                        tableData.innerHTML = admin.ADM_Address.substring(0, 19)
                                    }
                                }
                                else {
                                    tableData.innerHTML = parseInt(y) + 1
                                    tableData.classList.add("td-number")
                                }
                                dataTableRow.appendChild(tableData)
                            }
                        }
                        adminsContainer.appendChild(dataTableRow)
                    }
                }
                else {
                    adminsContainer.style.padding = "10px"
            
                    const emptyData = document.createElement("p")
                    emptyData.innerHTML = "Admin tidak ditemukan."
                    adminsContainer.appendChild(emptyData)
                }
            }
        })
    },
    viewAdminPhoto : (Admin_Phone, Admin_Fullname, Admin_Photo) =>
    {
        const adminPhotoContainer = document.getElementsByClassName("admin-photo-container")[0]
        adminPhotoContainer.classList.add("admin-photo-container-active")

        const adminPhoto = document.getElementsByClassName("admin-photo")[0]
        adminPhoto.classList.add("admin-photo-active")

        const cancelAdminPhoto = document.getElementsByClassName("cancel-admin-photo")[0]

        const adminPhotoInfoContainer = document.getElementsByClassName("admin-photo-info-container")[0]

        const adminPhotoInfoHead = document.getElementsByClassName("admin-photo-info-head")[0]
        adminPhotoInfoHead.innerHTML = Admin_Fullname

        const adminPhotoInfoDetail = document.getElementsByClassName("admin-photo-info-detail")[0]
        adminPhotoInfoDetail.innerHTML = Admin_Phone

        setTimeout(() => {
            adminPhotoInfoContainer.classList.add("admin-photo-info-container-active")
            adminPhoto.style.backgroundImage = `url(${ROOT_PATH + "build/img/admins/" + Admin_Photo})`
            cancelAdminPhoto.classList.add("cancel-admin-photo-active")
        }, 500)
    },
    removeAdminPhoto : () =>
    {
        const adminPhotoContainer = document.getElementsByClassName("admin-photo-container")[0]
        adminPhotoContainer.classList.remove("admin-photo-container-active")

        const adminPhoto = document.getElementsByClassName("admin-photo")[0]
        adminPhoto.classList.remove("admin-photo-active")
        adminPhoto.style.backgroundImage = "none"

        const cancelAdminPhoto = document.getElementsByClassName("cancel-admin-photo")[0]
        cancelAdminPhoto.classList.remove("cancel-admin-photo-active")

        const adminPhotoInfoContainer = document.getElementsByClassName("admin-photo-info-container")[0]
        adminPhotoInfoContainer.classList.remove("admin-photo-info-container-active")

        const adminPhotoInfoHead = document.getElementsByClassName("admin-photo-info-head")[0]
        adminPhotoInfoHead.innerHTML = ""

        const adminPhotoInfoDetail = document.getElementsByClassName("admin-photo-info-detail")[0]
        adminPhotoInfoDetail.innerHTML = ""
    },
    openSearchBox : () => 
    {
        const searchBox = document.getElementsByClassName("search-admin-box")[0]
        searchBox.classList.add("search-admin-box-active")

        const searchInput = document.getElementsByClassName("search-input")[0]
        setInterval(() => searchInput.focus(), 300)
    },
    removeSearchBox : () =>
    {
        const searchBox = document.getElementsByClassName("search-admin-box")[0]
        searchBox.classList.remove("search-admin-box-active")

        const searchInput = document.getElementsByClassName("search-input")[0]
        searchInput.value = null
    },
    openAdminAction : (_admin) =>
    {
        const adminAction = document.getElementsByClassName("admin-action")[0]
        adminAction.classList.add("admin-action-active")

        const updateAdmBtn = document.getElementsByClassName("update-btn")[0]
        const deleteAdmBtn = document.getElementsByClassName("delete-btn")[0]
        // const cancelAdmBtn = document.getElementsByClassName("cancel-btn")[0]

        const admin = _admin

        const adminName = document.getElementsByClassName("action-admin-name")[0]
        adminName.innerHTML = admin.ADM_Fullname

        const adminPhone = document.getElementsByClassName("action-admin-phone")[0]
        adminPhone.innerHTML = admin.ADM_Phone

        const actionPhoto = document.getElementsByClassName("action-photo")[0]
        actionPhoto.style.backgroundImage = `url(${ROOT_PATH + "build/img/admins/" + admin.ADM_Photo})`

        if (admin.ADM_Email !== APP_SETTINGS.author.email) {
            updateAdmBtn.addEventListener("click", () => self.openUpdateAdminForm(admin))
            deleteAdmBtn.addEventListener("click", () => self.deleteData(admin))
        }

        // Set action box animation
        const adminActionBox = document.getElementsByClassName("action-box-container")[0]
        adminActionBox.classList.add("action-box-container-active")
    },
    removeAdminAction : () => 
    {
        const adminAction = document.getElementsByClassName("admin-action")[0]
        adminAction.classList.remove("admin-action-active")

        const adminName = document.querySelector(".action-admin-name")
        adminName.innerHTML = ""

        const phone = document.querySelector(".action-admin-phone")
        phone.innerHTML = ""

        const actionPhoto = document.querySelector(".action-photo")
        actionPhoto.style.backgroundImage = "none"

        const updateAdmBtn = document.querySelector(".update-btn")
        updateAdmBtn.setAttribute("onclick", null)

        const deleteAdmBtn = document.querySelector(".delete-btn")
        deleteAdmBtn.setAttribute("onclick", null)

        // Remove action box animation
        const adminActionBox = document.getElementsByClassName("action-box-container")[0]
        adminActionBox.classList.remove("action-box-container-active")
    },
    insertData : _data => 
    {
        // 
    },
    openUpdateAdminForm : (_admin) => 
    {
        self.removeAdminAction() // remove actionbox first

        const updateAdminForm = document.getElementsByClassName("update-admin-form")[0]
        updateAdminForm.classList.add("update-admin-form-active")

        const adminData = _admin

        const updateAdminId = document.querySelector(".update-admin-form .admin-id")
        updateAdminId.value = adminData._id

        const updateAdminName = document.querySelector(".update-admin-form .admin-name")
        updateAdminName.value = adminData.ADM_Fullname

        const updateAdminEmail = document.querySelector(".update-admin-form .admin-email")
        updateAdminEmail.value = adminData.ADM_Email

        const updateAdminPass = document.querySelector(".update-admin-form .admin-pass")
        updateAdminPass.value = adminData.ADM_Pass

        const updateAdminAddress = document.querySelector(".update-admin-form .admin-address")
        updateAdminAddress.value = adminData.ADM_Address

        const updateAdminTimestamp = document.querySelector(".update-admin-form .admin-timestamp")
        updateAdminTimestamp.value = adminData.ADM_Timestamp

        const updateAdminPhone = document.querySelector(".update-admin-form .admin-phone")
        updateAdminPhone.value = adminData.ADM_Phone

        const updateAdminPhotoPreviewBtn = document.querySelector(".update-admin-photo-preview-btn")
        updateAdminPhotoPreviewBtn.classList.add("update-admin-photo-preview-btn-active")
        updateAdminPhotoPreviewBtn.innerHTML = "Ubah Foto"

        const updateAdminPhotoPreview = document.querySelector(".update-admin-photo-preview")
        updateAdminPhotoPreview.classList.add("update-admin-photo-preview-active")
        updateAdminPhotoPreview.style.backgroundImage = `url(${ROOT_PATH + "build/img/admins/" + adminData.ADM_Photo})`

        // Set old data
        UpdateAdminData.old_name = adminData.ADM_Fullname
        UpdateAdminData.old_photo = adminData.ADM_Photo
    },
    removeUpdateAdminForm : () => 
    {
        const updateAdminForm = document.getElementsByClassName("update-admin-form")[0]
        updateAdminForm.classList.remove("update-admin-form-active")

        const updateAdminId = document.querySelector(".update-admin-form .admin-id")
        updateAdminId.value = null

        const updateAdminName = document.querySelector(".update-admin-form .admin-name")
        updateAdminName.value = null

        const updateAdminEmail = document.querySelector(".update-admin-form .admin-email")
        updateAdminEmail.value = null

        const updateAdminPass = document.querySelector(".update-admin-form .admin-pass")
        updateAdminPass.value = null

        const updateAdminAddress = document.querySelector(".update-admin-form .admin-address")
        updateAdminAddress.value = null

        const updateAdminTimestamp = document.querySelector(".update-admin-form .admin-timestamp")
        updateAdminTimestamp.value = null

        const updateAdminPhone = document.querySelector(".update-admin-form .admin-phone")
        updateAdminPhone.value = null

        const updateAdminPhotoPreviewBtn = document.querySelector(".update-admin-photo-preview-btn")
        updateAdminPhotoPreviewBtn.classList.remove("update-admin-photo-preview-btn-active")

        const updateAdminPhotoPreview = document.querySelector(".update-admin-photo-preview")
        updateAdminPhotoPreview.classList.remove("update-admin-photo-preview-active")
        updateAdminPhotoPreview.style.backgroundImage = "none"
    },
    updateData : () =>
    {
        const adminID = document.querySelector(".update-admin-form .admin-id")
        const adminName = document.querySelector(".update-admin-form .admin-name")
        const adminEmail = document.querySelector(".update-admin-form .admin-email")
        const adminPass = document.querySelector(".update-admin-form .admin-pass")
        const adminPhone = document.querySelector(".update-admin-form .admin-phone")
        const adminAddress = document.querySelector(".update-admin-form .admin-address")
        const adminTimestamp = document.querySelector(".update-admin-form .admin-timestamp")

        if (
            adminName.value != ""
            &&
            adminEmail.value != ""
            &&
            adminPass.value != ""
            &&
            adminPhone.value != ""
            &&
            adminAddress.value != ""
        ) {
            if (RombaxString.emailValidation(adminEmail.value)) 
            {
                let Data = {
                    _id: adminID.value,
                    ADM_Fullname: RombaxString.upperCase(adminName.value),
                    ADM_Email: adminEmail.value,
                    ADM_Pass: RombaxString.hashedPassword(adminPass.value) ? adminPass.value : RombaxString.makePassword(adminPass.value),
                    ADM_Phone: adminPhone.value,
                    ADM_Address: RombaxString.upperCase(adminAddress.value),
                    ADM_Timestamp: adminTimestamp.value
                }

                reloadCalendar() // Reload calendar first for clock

                if (UpdateAdminData.photo != "") 
                {
                    // Empty tmp dir first ...
                    RombaxFiles.emptyDir("build/img/admins_tmp")

                    // Hapus foto lama
                    if (UpdateAdminData.old_photo != "admin-rombax.png") 
                    {
                        if (RombaxFiles.checkDir(`build/img/admins/${UpdateAdminData.old_photo}`) == true) 
                        {
                            RombaxFiles.deleteFile({
                                target: `build/img/admins/${UpdateAdminData.old_photo}`,
                                callback: error => 
                                {
                                    if (error) 
                                    {
                                        new Notification({title : "Ubah Admin", body : "Gagal menghapus foto lama"}).show()
                                    }
                                }
                            })
                        }
                    }

                    // Set photo name
                    UpdateAdminData.name = adminName.value.toLowerCase()
                    if (UpdateAdminData.name.match(/\s/g)) 
                    {
                        const matchSpace = UpdateAdminData.name.match(/\s/g)
                        for (let matches = 0; matches < matchSpace.length; matches++) {
                            UpdateAdminData.name = UpdateAdminData.name.replace(/\s/g, "-")
                        }
                    }

                    const photoName = UpdateAdminData.photo.split("/").pop()
                    const photoExt = path.extname(photoName)

                    const photo = {
                        target: UpdateAdminData.photo,
                        newName: jam + "-" + menit + "-" + detik + "-" + hari + "-" + tanggal + "-" + bulan + "-" + tahun + "-" + UpdateAdminData.name + photoExt
                    }

                    // Upload new admin photo ...
                    RombaxFiles.copyFile({
                        target: photo.target,
                        destination: `build/img/admins/${photo.newName}`,
                        callback: error => 
                        {
                            if (!error) 
                            {
                                Data = Object.assign({}, Data, { ADM_Photo: photo.newName })

                                AdminDatabase.update({
                                    id: { _id: Data._id },
                                    data: Data,
                                    callback: response => 
                                    {
                                        if (response) 
                                        {
                                            new Notification({title : "Ubah Admin", body : "Admin diubah"}).show()

                                            self.removeUpdateAdminForm()
                                            setTimeout(() => self.reloadData(), 300)
                                        }
                                    }
                                })
                            }
                            else {
                                new Notification({title : "Ubah Admin", body : "Gagal mengunggah foto"}).show()
                            }
                        }
                    })
                }
                else {
                    if (adminName.value != UpdateAdminData.old_name) 
                    {
                        UpdateAdminData.old_name = adminName.value

                        if (UpdateAdminData.old_name.match(/\s/g)) 
                        {
                            const matchSpace = UpdateAdminData.old_name.match(/\s/g)
                            for (let matches = 0; matches < matchSpace.length; matches++) 
                            {
                                UpdateAdminData.old_name = UpdateAdminData.old_name.replace(/\s/g, "-")
                            }
                        }

                        // Ubah nama foto lama
                        if (UpdateAdminData.old_photo == "admin-rombax.png")
                        {
                            Data = Object.assign({}, Data, { ADM_Photo: UpdateAdminData.old_photo })

                            AdminDatabase.update({
                                id: { _id: Data._id },
                                data: Data,
                                callback: response => 
                                {
                                    if (response) 
                                    {
                                        new Notification({title : "Ubah Admin", body : "Admin diubah"}).show()

                                        self.removeUpdateAdminForm()
                                        setTimeout(() => self.reloadData(), 300)
                                    }
                                }
                            })
                        }
                        else {
                            // Check first ...
                            if (RombaxFiles.checkDir(`build/img/admins/${UpdateAdminData.old_photo}`) == true) {
                                const photoName = jam + "-" + menit + "-" + detik + "-" + hari + "-" + tanggal + "-" + bulan + "-" + tahun + "-" + UpdateAdminData.old_name.toLowerCase()
                                const photoExt = path.extname(UpdateAdminData.old_photo)

                                RombaxFiles.renameFile({
                                    target: `build/img/admins/${UpdateAdminData.old_photo}`,
                                    destination: `build/img/admins/${photoName + photoExt}`,
                                    callback: error => {
                                        if (!error) {
                                            Data = Object.assign({}, Data, { ADM_Photo: photoName + photoExt })

                                            AdminDatabase.update({
                                                id: { _id: Data._id },
                                                data: Data,
                                                callback: response => 
                                                {
                                                    if (response) 
                                                    {
                                                        new Notification({title : "Ubah Admin", body : "Admin diubah"}).show()

                                                        self.removeUpdateAdminForm()
                                                        setTimeout(() => self.reloadData(), 300)
                                                    }
                                                }
                                            })
                                        }
                                        else {
                                            new Notification({title : "Ubah Admin", body : "Gagal merubah nama foto"}).show()
                                        }
                                    }
                                })
                            }
                        }
                    }
                    else {
                        Data = Object.assign({}, Data, { ADM_Photo: UpdateAdminData.old_photo })

                        AdminDatabase.update({
                            id: { _id: Data._id },
                            data: Data,
                            callback: response => 
                            {
                                if (response) {
                                    new Notification({title : "Ubah Admin", body : "Admin diubah"}).show()

                                    self.removeUpdateAdminForm()
                                    setTimeout(() => self.reloadData(), 300)
                                }
                            }
                        })
                    }
                }
            }
            else new Notification({title : "Ubah Admin", body : "Format email salah"}).show()
        }
    },
    deleteData : _admin =>
    {
        if(AdminData) {
            if (_admin.ADM_Email !== AdminData.ADM_Email) 
            {
                // Hapus foto
                if (_admin.ADM_Photo != "admin-rombax.png") 
                {
                    if (RombaxFiles.checkDir(`build/img/admins/${_admin.ADM_Photo}`) == true) 
                    {
                        RombaxFiles.deleteFile({
                            target: `build/img/admins/${_admin.ADM_Photo}`,
                            callback: error => 
                            {
                                if (error) 
                                {
                                    new Notification({title : "Hapus Admin", body : "Gagal menghapus foto"}).show()
                                }
                            }
                        })
                    }
                }
                Model.remove({
                    db : "admins.db",
                    data: { _id: _admin._id },
                    callback: response => 
                    {
                        if (response == false) 
                        {
                            new Notification({title : "Hapus Admin", body : "Gagal menghapus admin"}).show()
                        }
                        else {
                            new Notification({title : "Hapus Admin", body : "Admin terhapus"}).show()
                        }

                        self.removeAdminAction()
                        setTimeout(() => self.reloadData(), 300)
                    }
                })
            }
            else {
                new Notification({title : "Hapus Admin", body : "Akun ini sedang digunakan"}).show()
            }
        }
        else {
            new Notification({title : "Hapus Admin", body : "Kamu belum login"}).show()
        }
    },
    pickImage(_form = null) 
    {
        // Empty tmp dir first ...
        RombaxFiles.emptyDir("build/img/admins_tmp")

        // Importing dialog module using remote
        const { remote } = electron
        const dialog = remote.dialog

        // Defining a Global file path Variable to store
        // user-selected file
        global.filepath = undefined

        reloadCalendar() // Reload calendar first for clock

        // If the platform is 'win32' or 'Linux'
        if (process.platform !== 'darwin') 
        {
            // Resolves to a Promise<Object>
            dialog.showOpenDialog({
                title: 'Pilih foto admin',
                defaultPath: require("os").homedir(),
                buttonLabel: 'Upload',
                filters: [
                    {
                        name: 'Image Files',
                        extensions: ['png', 'jpg', 'jpeg', 'gif']
                    },],
                // Specifying the File Selector Property
                properties: ['openFile']
            })
            .then(file => 
            {
                if ( ! file.canceled) 
                {
                    global.filepath = file.filePaths[0].toString()

                    const photoExt = path.extname(global.filepath.split("/").pop())

                    let adminName = _form == "New" ?
                        document.querySelector(".new-admin-form .admin-name")
                        :
                        document.querySelector(".update-admin-form .admin-name")
                    adminName = adminName.value.replace(/\s/g, "-").toLowerCase()

                    if (adminName == "" && adminName.length < 1) 
                    {
                        showWarningMessage({title: "Admin Baru", message: "Silahkan tulis nama admin", autoclose:true})
                    }
                    else {
                        // Upload new tmp photo
                        RombaxFiles.copyFile({
                            target: global.filepath,
                            destination: `build/img/admins_tmp/${jam + "-" + menit + "-" + detik + "-" + hari + "-" + tanggal + "-" + bulan + "-" + tahun + "-" + adminName + photoExt}`,
                            callback: error =>
                            {
                                if ( ! error) 
                                {
                                    let photoPreview = ""
                                    let pickImageBtn = ""

                                    if (_form === "New") { // New product photo
                                        NewAdminData.photo = global.filepath
                                        photoPreview = document.getElementsByClassName("new-admin-photo-preview")[0]
                                        photoPreview.classList.add("new-admin-photo-preview-active")
                                        photoPreview.style.backgroundImage = null
                                        pickImageBtn = document.getElementsByClassName("new-admin-photo-preview-btn")[0]
                                        pickImageBtn.classList.add("new-admin-photo-preview-btn-active")
                                    }
                                    if (_form === "Update") { // Update product photo
                                        UpdateAdminData.photo = global.filepath
                                        photoPreview = document.getElementsByClassName("update-admin-photo-preview")[0]
                                        photoPreview.classList.add("update-admin-photo-preview-active")
                                        photoPreview.style.backgroundImage = null
                                        pickImageBtn = document.getElementsByClassName("update-admin-photo-preview-btn")[0]
                                        pickImageBtn.classList.add("update-admin-photo-preview-btn-active")
                                    }

                                    const tmp_photo = ROOT_PATH + `build/img/admins_tmp/${jam + "-" + menit + "-" + detik + "-" + hari + "-" + tanggal + "-" + bulan + "-" + tahun + "-" + adminName + photoExt}`
                                    setTimeout(() => photoPreview.style.backgroundImage = `url(${tmp_photo})`, 1000)

                                    photoPreview.style.backgroundSize = "cover"
                                    pickImageBtn.innerHTML = "Ubah Foto"
                                }
                            }
                        })
                    }
                }
            })
        }
    }
}