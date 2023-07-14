const Operation = require('../../shared/actions/operation');

class BrowseUsers extends Operation {
  constructor({ UsersDatabaseRepository }) {
    super();
    this.UsersDatabaseRepository = UsersDatabaseRepository;
  }

  async execute() {
    const { SUCCESS, ERROR } = this.outputs;

    try {
      const users = await this.UsersDatabaseRepository.getAll({
        attributes: ['id', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt'],
      });

      this.emit(SUCCESS, users);
    } catch (error) {
      this.emit(ERROR, error);
    }
  }
}

BrowseUsers.setOutputs(['SUCCESS', 'ERROR']);

module.exports = BrowseUsers;