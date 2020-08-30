const {
    getDatabase
} = require('./mongo');

const {
    ObjectID
} = require('mongodb');


const collectionName = 'users';

const insertUser = async (user) => {
    const database = await getDatabase();
    database.collection(collectionName).insertOne(user)
        .then((response) => {
            console.log("Inserted record", response);
            return response.insertedId;
        }).catch((error) => {
            console.log('Failed to insert record');
            console.log(error);
            return null;
        });
};

const getUsers = async () => {
    const database = await getDatabase();
    return await database.collection(collectionName).find({}).toArray();
};

const getUserById = async (id) => {
    const database = await getDatabase();
    return database.collection(collectionName).findOne({
        _id: new ObjectID(id)
    });
};

const getUserByEmail = async (email) => {
    const database = await getDatabase();
    return database.collection(collectionName).findOne({
        email: email
    });
}

const deleteUser = async (id) => {
    const database = await getDatabase();
    database.collection(collectionName).deleteOne({
        _id: new ObjectID(id)
    }).then((response) => {
        console.log('Deleted record', response);
        return true;
    }).catch((error) => {
        console.log('Failed to delete record', error);
        return false;
    });
};

const updateUser = async (id, user) => {
    const database = await getDatabase();
    delete user._id;
    database.collection(collectionName).updateOne({
        _id: new ObjectID(id)
    }, {
        $set: {
            ...user,
        },
    }).then((response) => {
        console.log("Updated successfully");
        console.log(response);
        return response.returnedId;
    }).catch((error) => {
        console.log('Failed to update');
        console.log(error);
        return null;
    });
}

module.exports = {
    insertUser,
    getUsers,
    getUserById,
    getUserByEmail,
    deleteUser,
    updateUser
}