const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');

const {
    startDatabase,
    getDatabase
} = require('./database/mongo');
const {
    insertUser,
    getUsers,
    getUserById,
    getUserByEmail,
    deleteUser,
    updateUser
} = require('./database/users');
const {
    verifySchema
} = require('./database/userSchema');



const app = express();

app.use(helmet());

app.use(bodyParser.json());

app.use(cors());

app.use(morgan('combined'));

app.get('/', async (req, res) => {
    await getUsers().then((response) => {
        res.status(200);
        res.send(response);
    }).catch((error) => {
        console.log(error);
        res.status(400);
        res.send({
            "email": "Failed to fetch records"
        });
    });
});

app.get('/id/:id', async (req, res) => {
    await getUserById(req.params.id).then((response) => {
        if (response) {
            console.log(response)
            res.status(200);
            res.send(response);
        } else {
            console.log(response);
            res.status(404);
            res.send({
                "error": `Nothing found for id ${id}`
            })
        }
    }).catch((error) => {
        console.log("error", error);
        res.status(400);
        res.send({
            'error': 'Failed to get by id'
        });
    });
});

app.get('/email/:email', async (req, res) => {
    await getUserByEmail(req.params.email).then((response) => {
        if (response) {
            console.log(response);
            res.status(200);
            res.send(response);
        } else {
            console.log(response)
            res.status(404);
            res.send({
                "error": `Nothing found for email ${req.params.email}`
            })
        }
    }).catch((error) => {
        console.log("error", error);
        res.status(400);
        res.send(error);
    });
});

app.post('/', async (req, res) => {
    const newUser = req.body;
    if (verifySchema(newUser)) {
        await getUserByEmail(req.body.email).then((response) => {
            if (response) {
                res.status(403)
                res.send({
                    "error": `Account with this email already exists`
                })
            }
        }).catch((error) => {
            console.log('error', error);
            res.status(400)
            res.send({
                "error": "Error validating email in/not in use"
            })
        });
        await insertUser(newUser).then((response) => {
            res.status(200)
            res.send({
                'status': 'success',
                'message': 'New user added'
            })
        }).catch((error) => {
            console.log(error);
            res.status(400)
            res.send({
                "error": `Could not create new user with your parameters`
            });
        });
    } else {
        console.log("Invalid schema");
        res.status(422);
        res.send({
            "error": "Invalid request data"
        })

    }
});

app.delete('/id/:id', async (req, res) => {
    await deleteUser(req.params.id).then((response) => {
        if (response) {
            res.status(200)
            res.send({
                "message": "User removed"
            });
        } else {
            res.status(404)
            res.send({
                "error": "Failed to find and delete"
            })
        }
    }).catch((error) => {
        console.log(error);
        res.status(400);
        res.send({
            "error": `Could not delete ${id}`
        });
    });
});

app.put('/id/:id', async (req, res) => {
    const updatedUser = req.body;
    if (verifySchema(updatedUser)) {
        await updateUser(req.params.id, updatedUser).then((response) => {
            res.status(201)
            res.send({
                message: 'User Updated'
            })
        }).catch((error) => {
            console.log(error);
            res.status(400)
            res.send({
                "error": `Could not update ${id}`
            });
        });
    } else {
        console.log("Invalid schema");
        res.status(422);
        res.send({
            "error": "Invalid request data"
        })

    }

});

app.get('*', (req, res) => {
    res.status(404)
    res.send({
        "error": "Invalid route"
    })
})

const PORT = process.env.PORT || 3001;


startDatabase().then(async () => {
    app.listen(PORT, async () => {
        console.log(`Listening on port ${PORT}`)
    });
}).catch((error) => {
    console.log('Error with starting database', error)
});