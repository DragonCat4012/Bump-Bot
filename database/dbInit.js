const { Sequelize, DataTypes } = require('sequelize');

const serversql = new Sequelize('server_table', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'server.sqlite',
});

const Server = serversql.define('server_table', {
    key: {
        type: DataTypes.TEXT,
        unique: true,
    },
    prefix: {
        type: DataTypes.TEXT,
        defaultValue: "%"
    },
    description: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    color: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    time: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    channel: {
        type: DataTypes.TEXT,
        defaultValue: 0
    },
    wlc: {
        type: DataTypes.TEXT,
    },
    gb: {
        type: DataTypes.TEXT,
    },


    partner: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    ban: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
});


const syncDatabase = async () => {
    try {
        await serversql.sync();
        console.log(' > 🗸 Server Cache');
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
}

module.exports = { Server, syncDatabase }
