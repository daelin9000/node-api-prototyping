const UserSerializer = {
    serialize({ id, firstName, lastName, email, createdAt, updatedAt }) {
      const formattedCreateAt = createdAt ? createdAt.toISOString() : null;
      const formattedUpdatedAt = createdAt ? updatedAt.toISOString() : null;
  
      return {
        id: id || null,
        firstName: firstName || null,
        lastName: lastName || null,
        email: email || null,
        createdAt: formattedCreateAt,
        updatedAt: formattedUpdatedAt,
      };
    },
  };
  
  module.exports = UserSerializer;