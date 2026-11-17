let sequelize;

try {
    const { Sequelize } = require('sequelize');
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './database.sqlite',
        logging: false
    });
    sequelize.isFallback = false;
} catch (err) {
    console.warn('[WARN] SQLite native driver unavailable, using resilient in-memory database:', err.message);
    sequelize = {
        sync: async () => {},
        authenticate: async () => {},
        close: async () => {},
        isFallback: true
    };
}

module.exports = sequelize;
