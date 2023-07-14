const Operation = require('../../shared/actions/operation');

class DeleteUser extends Operation {
  constructor({ UsersDatabaseRepository }) {
    super();
    this.UsersDatabaseRepository = UsersDatabaseRepository;
  }

  async execute(userId) {
    const { SUCCESS, NOT_FOUND, ERROR } = this.outputs;

    try {
      await this.UsersDatabaseRepository.delete(userId);

      this.emit(SUCCESS);
    } catch (error) {
      if (error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }

      this.emit(ERROR, error);
    }
  }
}

DeleteUser.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = DeleteUser;