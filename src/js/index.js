import React, { Component } from "react"
import ReactDOM from "react-dom"

// Style
import "../scss/index.scss"
import "../scss/nav.scss"
import "../scss/footer.scss"

// Admins Style
import "../scss/admins/main.scss"
import "../scss/admins/photo.scss"
import "../scss/admins/action.scss"
import "../scss/admins/update.scss"

// Main components
import Navbar from "./components/navbar/Main"
import Home from "./components/homepage/Main"
import Footer from "./components/footer/Main"

class Entrypoint extends Component
{
    constructor(props)
    {
        super(props)

        this.state = {
            page : <Home />
        }
    }

    reloadPage = _page => this.setState({page : null}, () => setTimeout(() => this.setState({page : _page}),500))

    render()
    {
        return(
            <main>
                <Navbar reloadPage={page => this.reloadPage(page)} loadPage={page => this.setState({page})}/>
                {this.state.page}
                <Footer />
            </main>
        )
    }
}

// Render Process
ReactDOM.render(<Entrypoint />, document.getElementById("root"))