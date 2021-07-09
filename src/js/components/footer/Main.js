import React, { Component } from "react"

export default class Main extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            year : new Date().getFullYear()
        }
    }
    render()
    {
        return(
            <footer>
                <div className="footer-admin-container">
                    <div className="footer-admin-logo"></div>
                    <p className="footer-admin">Admin | Izzat Alharis</p>
                </div>
                <div className="footer-copyright">
                    <p>&copy; Rombax Family Brebes {this.state.year == "2021" ? this.state.year : "2021 - " + this.state.year}</p>
                </div>
            </footer>
        )
    }
}