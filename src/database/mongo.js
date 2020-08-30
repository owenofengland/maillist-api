const {
    MongoClient,
    ObjectID
} = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017/charity-maillist'

let database = null;

const startDatabase = async () => {
    const connection = await MongoClient.connect(connectionURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    database = connection.db();
}

const getDatabase = async () => {
    if (!database) await startDatabase();
    return database;
}

module.exports = {
    getDatabase,
    startDatabase
}