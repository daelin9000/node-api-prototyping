const Operation = require('../../shared/actions/operation');
const User = require('../domain/user');

class AddUser extends Operation {
  constructor({ UsersDatabaseRepository, utilities: { uuidv4 } }) {
    super();
    this.UsersDatabaseRepository = UsersDatabaseRepository;
    this.uuidv4 = uuidv4;
  }

  async execute(userData) {
    const { SUCCESS, VALIDATION_ERROR, UNPROCESSABLE_ENTITY, ERROR } = this.outputs;

    try {
      const user = new User({
        id: this.uuidv4(),
        ...userData,
      });

      const { valid, errors } = user.validate();

      if (!valid) {
        const error = new Error('ValidationError');
        error.details = errors;

        throw error;
      }

      const newUser = await this.UsersDatabaseRepository.add(user);

      this.emit(SUCCESS, newUser);
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }

      if (error.message === 'UnprocessableEntity') {
        return this.emit(UNPROCESSABLE_ENTITY, error);
      }

      this.emit(ERROR, error);
    }
  }
}

AddUser.setOutputs(['SUCCESS', 'VALIDATION_ERROR', 'UNPROCESSABLE_ENTITY', 'ERROR']);

module.exports = AddUser;