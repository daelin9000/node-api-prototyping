const Operation = require('../../shared/actions/operation');

class ReadUser extends Operation {
  constructor({ UsersDatabaseRepository }) {
    super();
    this.UsersDatabaseRepository = UsersDatabaseRepository;
  }

  async execute(userId) {
    const { SUCCESS, NOT_FOUND, ERROR } = this.outputs;

    try {
      const user = await this.UsersDatabaseRepository.getById(userId);

      this.emit(SUCCESS, user);
    } catch (error) {
      if (error.message === 'NotFoundError') {
        this.emit(NOT_FOUND, {
          type: error.message,
          details: error.details,
        });
        return;
      }

      this.emit(ERROR, {
        type: error.message,
        details: error.details,
      });
    }
  }
}

ReadUser.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = ReadUser;