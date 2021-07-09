import React, { Component } from "react"

export default class Main extends Component
{
    constructor(props)
    {
        super(props)
    }
    componentDidMount()
    {
        // Get all members
        electron.database.getall({db : "members"})
    }
    render() {
        return(
            <main>
                <h1>Members</h1>
                <div className="members"></div>
            </main>
        )
    }
}