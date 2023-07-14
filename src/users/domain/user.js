const { attributes } = require('structure');

const User = attributes({
  id: {
    type: String,
    guid: {
      version: ['uuidv4'],
    },
    required: true,
  },
  firstName: {
    type: String,
    required: false,
    minLength: 1,
    maxLength: 255,
  },
  lastName: {
    type: String,
    required: false,
    minLength: 1,
    maxLength: 255,
  },
  email: {
    type: String,
    required: false,
    email: true,
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    nullable: true,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    nullable: true,
  },
})(
  class User {
    getFullName() {
      return `${this.firstName || ''} ${this.lastName || ''}`.trim();
    }
  }
);

module.exports = User;