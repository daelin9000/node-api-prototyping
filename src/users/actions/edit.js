const Operation = require('../../shared/actions/operation');
const User = require('../domain/user');

class EditUser extends Operation {
  constructor({ UsersDatabaseRepository }) {
    super();
    this.UsersDatabaseRepository = UsersDatabaseRepository;
  }

  async execute(userId, userData) {
    const { SUCCESS, NOT_FOUND, VALIDATION_ERROR, ERROR } = this.outputs;

    try {
      const user = new User(userData);

      const { valid, errors } = user.validate();

      if (!valid) {
        const error = new Error('ValidationError');
        error.details = errors;

        throw error;
      }

      const updatedUser = await this.UsersDatabaseRepository.update(userId, user);

      this.emit(SUCCESS, updatedUser);
    } catch (error) {
      switch (error.message) {
        case 'ValidationError':
          return this.emit(VALIDATION_ERROR, error);
        case 'NotFoundError':
          return this.emit(NOT_FOUND, error);
        default:
          this.emit(ERROR, error);
      }
    }
  }
}

EditUser.setOutputs(['SUCCESS', 'NOT_FOUND', 'VALIDATION_ERROR', 'ERROR']);

module.exports = EditUser;