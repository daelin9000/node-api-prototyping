const UserMapper = require('./mapper');

class UsersDatabaseRepository {
  constructor({ UserModel }) {
    this.UserModel = UserModel;
  }

  async getAll(...args) {
    const users = await this.UserModel.findAll({
      ...args,
      where: {
        deleted: false,
      },
    });

    return users.map(UserMapper.toEntity);
  }

  async getById(id) {
    const user = await this._getById(id);

    return UserMapper.toEntity(user);
  }

  async add(user) {
    try {
      const newUser = await this.UserModel.create(UserMapper.toDatabase(user));

      return UserMapper.toEntity(newUser);
    } catch (error) {
      console.error(error);

      if (error.name === 'SequelizeUniqueConstraintError') {
        const notFoundError = new Error('UnprocessableEntity');
        notFoundError.details = `Cannot create user`;

        throw notFoundError;
      }

      throw error;
    }
  }

  async update(id, newData) {
    const user = await this._getById(id);

    const updatedUser = await user.update(UserMapper.toDatabase(newData));

    return UserMapper.toEntity(updatedUser);
  }

  async delete(id) {
    try {
      const user = await this.UserModel.findOne({
        where: {
          id,
          deleted: false,
        },
        rejectOnEmpty: true,
      });

      await user.update({ deleted: true });
    } catch (error) {
      if (error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = `User with id ${id} can't be found.`;

        throw notFoundError;
      }

      throw error;
    }
  }

  async _getById(id) {
    try {
      return await await this.UserModel.findOne({
        where: {
          id,
          deleted: false,
        },
        rejectOnEmpty: true,
      });
    } catch (error) {
      if (error.name === 'SequelizeEmptyResultError') {
        const notFoundError = new Error('NotFoundError');
        notFoundError.details = `User with id ${id} can't be found.`;

        throw notFoundError;
      }

      throw error;
    }
  }
}

module.exports = UsersDatabaseRepository;