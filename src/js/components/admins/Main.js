import React, { Component } from "react"

export default class Main extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {}
    }
    componentDidMount()
    {
        // Get all admins
        electron.database.getall({db : "admins"})
    }
    render() {
        return(
            <main className="admin-page">
                <div className="pages">
                    <div className="page-head">
                        <h1 className="page-title">Admin <span id="total-admin"></span></h1>
                        <div className="page-menu">
                            <a id="add-btn" onClick={_e => _e.preventDefault()} className="page-menu-items">Tambahkan</a>
                            <a id="search-btn" onClick={_e => _e.preventDefault()} className="page-menu-items">Cari</a>
                        </div>
                    </div>
                </div>
                <div className="table-container">
                    <table cellSpacing={3} className="admin-table">
                        <tbody className="table-head">
                            <tr>
                                <th className="th-number">No</th>
                                <th className="th-fullname">Nama</th>
                                <th className="th-email">Email</th>
                                <th className="th-phone">Tlp</th>
                                <th className="th-address">Alamat</th>
                                <th className="th-photo">Foto</th>
                            </tr>
                        </tbody>
                        <tbody className="admin-item-container"></tbody>
                    </table>
                </div>

                <div className="admin-photo-container">
                    <div className="admin-photo"></div>
                    <div className="cancel-admin-photo" title="Tutup"></div>
                    <div className="admin-photo-info-container">
                        <h1 className="admin-photo-info-head"></h1>
                        <p className="admin-photo-info-detail"></p>
                    </div>
                </div>

                <div className="search-admin-box">
                    <div className="form-group">
                        <input className="search-input" placeholder="Cari Admin" type="text" autoComplete="off" onKeyUp={({target}) => electron.database.search({db : "admins", key : target.value})}/>
                        <div className="search-admin-close" title="Tutup"></div>
                    </div>
                </div>

                <div className="admin-action">
                    <div className="action-box-container">
                        <div className="action-photo" style={{backgroundImage: "none"}}></div>
                        <h1 className="action-admin-name"></h1>
                        <p className="action-admin-phone"></p>
                        <div className="action-btns">
                            <button type="button" onClick={null} className="confirm-btn update-btn">Ubah</button>
                            <button type="button" onClick={null} className="confirm-btn delete-btn">Hapus</button>
                            <button type="button" className="confirm-btn cancel-btn">Batal</button>
                        </div>
                    </div>
                </div>

                <div className="new-admin-form">
                    <form className="new-admin-form-box">
                        <h1 className="form-title">Admin Baru</h1>
                        <div className="form-group">
                            <label>Nama</label>
                            <input type="text" className="admin-name" />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="text" className="admin-email" />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="text" className="admin-pass" />
                        </div>
                        <div className="form-group">
                            <label>Alamat</label>
                            <input type="text" className="admin-address" />
                        </div>
                        <div className="form-group">
                            <label>Tlp</label>
                            <input type="number" type="text" className="admin-phone" />
                        </div>
                        <div className="form-group">
                            <div className="new-admin-photo-preview"></div>
                            <p className="new-admin-photo-preview-btn" style={{width: "100%"}}>Pilih Foto</p>
                        </div>
                        <div className="form-group form-btns">
                            <button className="new-admin-form-save-btn" type="button">Simpan</button>
                            <button className="new-admin-form-cancel-btn" type="button">Batal</button>
                        </div>
                    </form>
                </div>

                <div className="update-admin-form">
                    <form action="">
                        <h1 className="form-title">Ubah Admin</h1>
                        <input type="hidden" className="admin-id" />
                        <input type="hidden" className="admin-timestamp" />
                        <div className="form-group">
                            <label>Nama</label>
                            <input type="text" className="admin-name" />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="text" className="admin-email" />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="text" className="admin-pass" />
                        </div>
                        <div className="form-group">
                            <label>Alamat</label>
                            <input type="text" className="admin-address" />
                        </div>
                        <div className="form-group">
                            <label>Tlp</label>
                            <input type="text" className="admin-phone" />
                        </div>
                        <div className="form-group">
                            <div className="update-admin-photo-preview"></div>
                            <p className="update-admin-photo-preview-btn" style={{width: "100%"}}>Pilih Foto</p>
                        </div>
                        <div className="form-group form-btns">
                            <button type="button" className="update-admin-form-save-btn">Simpan</button>
                            <button type="button" className="update-admin-form-cancel-btn">Batal</button>
                        </div>
                    </form>
                </div>
            </main>
        )
    }
}