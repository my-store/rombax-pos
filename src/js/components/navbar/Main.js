import React, { Component } from "react"

import Home from "../homepage/Main"
import Rekap from "../rekap/Main"
import Product from "../products/Main"
import Admin from "../admins/Main"
import Member from "../members/Main"
import Backup from "../backup/Main"
import Spending from "../spendings/Main"

export default class Main extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            _page : null,
            _isNavbarOpen : false,
            _isResetOpen : false,
            _isAboutOpen : false,
            _isDonationOpen : false,
            _isOfficeUpdateOpen : false,
        }
    }
    reloadPage = () => 
    {
        this.props.reloadPage(this.state._page)
    }
    openNavbarMenu = () =>
    {
        this.setState({_isNavbarOpen : !this.state._isNavbarOpen})
    }
    componentDidMount()
    {
        // Set navbar-title-dragable
        document.getElementsByClassName("nav-bar-head-title")[0].style.webkitAppRegion = "drag"
    }
    render()
    {
        return(
            <nav>
                <div className="nav-bar-head">
                    <div className="nav-bar-head-logo"></div>
                    <h1 className="nav-bar-head-title">Rombax Family</h1>
                </div>
                <div className="nav-bar-menu-container">
                    <p className="nav-bar-menu-items" onClick={() => this.openNavbarMenu()}>Menu</p>
                    <p className="nav-bar-menu-items" onClick={() => {this.setState({_isNavbarOpen : false, _page : <Home />}); this.props.loadPage(<Home />)}}>Beranda</p>
                    <p className="nav-bar-menu-items" onClick={() => {this.setState({_isNavbarOpen : false, _page : <Rekap />}); this.props.loadPage(<Rekap />)}}>Rekap</p>
                    <p className="nav-bar-menu-items" onClick={() => {this.setState({_isNavbarOpen : false, _page : <Product />}); this.props.loadPage(<Product />)}}>Produk</p>
                    <p className="nav-bar-menu-items" onClick={() => {this.setState({_isNavbarOpen : false, _page : <Admin />}); this.props.loadPage(<Admin />)}}>Admin</p>
                    <p className="nav-bar-menu-items" onClick={() => {this.setState({_isNavbarOpen : false, _page : <Member />}); this.props.loadPage(<Member />)}}>Member</p>
                    <p className="nav-bar-menu-items" onClick={() => {this.setState({_isNavbarOpen : false, _page : <Spending />}); this.props.loadPage(<Spending />)}}>Pengeluaran</p>
                    <p className="nav-bar-menu-items" onClick={() => {this.setState({_isNavbarOpen : false, _page : <Backup />}); this.props.loadPage(<Backup />)}}>Backup</p>
                </div>
                <div className="header-window-btns">
                    <p className="header-minimize-btn" onClick={() => electron.app.minimize()} title="Minimize"></p>
                    <p className="header-reload-btn" onClick={() => this.reloadPage()} title="Reload"></p>
                    <p className="header-close-btn" onClick={() => electron.app.quit()} title="Close"></p>
                </div>

{/* HIDDEN MENU */}
                <div className={this.state._isNavbarOpen ? "hidden-menu hidden-menu-active" : "hidden-menu"}>
                    <p className="hidden-menu-items" onClick={() => {this.setState({_isNavbarOpen : false}); this.setState({_isOfficeUpdateOpen : true})}}>Profile</p>
                    <p className="hidden-menu-items" onClick={() => {this.setState({_isNavbarOpen : false}); document.getElementsByClassName("about-box-text")[0].scrollTop = 0; this.setState({_isAboutOpen : true})}}>Tentang</p>
                    <p className="hidden-menu-items" onClick={() => {this.setState({_isNavbarOpen : false}); document.getElementsByClassName("donation-box-text")[0].scrollTop = 0; this.setState({_isDonationOpen : true})}}>Donasi</p>
                    <p className="hidden-menu-items" onClick={() => {this.setState({_isNavbarOpen : false}); this.setState({_isResetOpen : true})}}>Reset</p>
                    <p className="hidden-menu-items" onClick={() => {this.setState({_isNavbarOpen : false}); alert("OKE")}}>Logout</p>
                </div>

{/* RESET CONFIRM */}
                <div className={this.state._isResetOpen ? "reset-confirm reset-confirm-active" : "reset-confirm"}>
                    <div className="reset-confirm-box">
                        <h1>Reset data?</h1>
                        <p>Seluruh data pada aplikasi akan hilang.</p>
                        <div className="reset-confirm-btns">
                            <button onClick={() => {this.setState({_isResetOpen : false}); alert("Oke")}}>Iya</button>
                            <button onClick={() => this.setState({_isResetOpen : false})}>Tidak</button>
                        </div>
                    </div>
                </div>

{/* OFFICE UPDATE */}
                <div className={this.state._isOfficeUpdateOpen ? "office-update office-update-active" : "office-update"}>
                    <div className="office-update-form">
                        <h1>Ubah data toko</h1>
                        <label>Nama</label>
                        <input className="office-update-name" />
                        <label>Alamat</label>
                        <input className="office-update-address" />
                        <label>Tlp</label>
                        <input className="office-update-phone" />
                        <label>Deskripsi</label>
                        <input className="office-update-description" />
                        <div className="office-update-photo-container">
                            <div className="office-update-photo-preview"></div>
                            <button className="office-update-photo-btn">Ubah Foto</button>
                        </div>
                        <div className="office-update-form-btns">
                            <button>Simpan</button>
                            <button onClick={() => this.setState({_isOfficeUpdateOpen : false})}>Batal</button>
                        </div>
                    </div>
                </div>

{/* ABOUT */}
                <div className={this.state._isAboutOpen ? "about-box-container about-box-container-active" : "about-box-container"}>
                    <div className="about-box">
                        <h1 className="about-box-title">Tentang Kami</h1>
                        <p className="about-box-text">                            
                            <span>
                                Kami keluarga besar Rombax Brebes mengucapkan terimakasih dan salam santun 
                                kepada siapapun yang menggunakan aplikasi ini.
                            </span>
                            <span></span>
                            <span>
                                Aplikasi ini tersedia untuk beberapa sistem operasi komputer diantaranya :
                            </span>
                            <span>
                                1. MacOS (64 bit) <br />
                                2. Linux (64 bit) <br />
                                3. Windows (32 & 64 bit)
                            </span>
                            <span></span>
                            <span>
                                Harapan utama kami setelah bekerja keras membangun aplikasi ini 
                                adalah dapat memberikan manfa'at bagi siapapun yang menggunakannya.
                            </span>
                            <span>
                                Aplikasi ini cukup mudah untuk digunakan dan memiliki interface yang menurut kami cukup 
                                menyenenangkan.
                            </span>
                            <span>
                                Ada beberapa fitur yang memang kami kenakan biaya setiap kali digunakan, 
                                misalnya backup dan restore data secara online, fitur ini kami kenakan biaya 
                                sebesar Rp50.000 untuk satu kali backup dan restore.
                            </span>
                            <span>
                                Biaya tersebut akan membantu kami dalam membayar sewa server setiap bulannya.
                            </span>
                            <span>
                                Untuk fitur backup dan restore data secara offline sepenuhnya gratis, 
                                karna data hasil backup tersebut akan disimpan kedalam memori internal komputer.
                            </span>
                            <span>
                                Kami juga menyediakan layanan pengambilan atau pengamanan data apabila komputer mengalami kerusakan, 
                                untuk layanan ini kami kenakan biaya sebesar Rp350.000.
                            </span>
                        </p>
                        <button className="about-box-close-btn" onClick={() => this.setState({_isAboutOpen : false})}>Tutup</button>
                    </div>
                </div>

{/* DONATION */}
                <div className={this.state._isDonationOpen ? "donation-box-container donation-box-container-active" : "donation-box-container"}>
                    <div className="donation-box">
                        <h1 className="donation-box-title">Donasi</h1>
                        <p className="donation-box-text">
                            <span>
                                Tertarik untuk mendukung kami?
                            </span>
                            <span>
                                Kami sangat berterimakasih 
                                karna berapapun bantuan yang anda berikan sangat membantu kami agar kami bisa terus berkembang.
                            </span>
                            <span></span>
                            <span>
                                Rekening kami :
                            </span>
                            <span>
                                <strong>BCA : 361-0349-268</strong> <br />
                                <strong>BRI : 5859-0102-4269-535</strong>
                            </span>
                            <span></span>
                            <span>
                                Mohon untuk memberikan kami informasi berupa pesan konfirmasi melalui sms/ whatsapp ke nomor berikut :
                            </span>
                            <span>0813-9355-2220 (Izzat Alharis)</span>
                            <span></span>
                            <span>Sekian dan terimakasih.</span>
                        </p>
                        <button className="donation-box-close-btn" onClick={() => this.setState({_isDonationOpen : false})}>Tutup</button>
                    </div>
                </div>
            </nav>
        )
    }
}