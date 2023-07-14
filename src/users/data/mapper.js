const User = require('../domain/user');

const UserMapper = {
  toEntity({ dataValues }) {
    const { id, firstName, lastName, email, deleted, createdAt, updatedAt } = dataValues;

    return new User({ id, firstName, lastName, email, deleted, createdAt, updatedAt });
  },

  toDatabase(user) {
    const { id, firstName, lastName, email, deleted, createdAt, updatedAt } = user;

    return { id, firstName, lastName, email, deleted, createdAt, updatedAt };
  },
};

module.exports = UserMapper;