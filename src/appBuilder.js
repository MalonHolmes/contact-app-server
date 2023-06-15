const express = require("express"); // handles http requests
const cors = require("cors");

const appBuilder = (dbConnection) => {
    const app = express();

    // set up middleware
    app.use(express.json()); 
    app.use(cors());

    // create post request
    app.post("/contact", async (req, res) => {
        const {firstName, lastName, email} = req.body;

        // if any of these fields are missing return error
        if(!firstName || !lastName || !email) {
            return res.status(400).send({
                status: "error",
                message: "Required fields are missing"
            })
        }

        try {
            const id = await dbConnection.createContact(firstName, lastName, email);
            res.status(201).send({
                status: 'created',
                data: {
                    id: id,
                    firstName: firstName,
                    lastName: lastName,
                    email: email
                }
            });

        } catch(err) {
            res.status(500).send({
                status: 'error',
                message: 'database connection failed'
            })
        }
    })
    return app;
}

module.exports = appBuilder;