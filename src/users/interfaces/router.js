class UsersRouter {
  constructor() {}

  get router() {
    // TODO: Set custom error messages
    return (app, opts, done) => {
      // Handle Schema Registrations
      app.addSchema({
        $id: 'User',
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
          firstName: { type: 'string', example: 'Jane' },
          lastName: { type: 'string', example: 'Doe' },
          email: { type: 'string', format: 'email', example: 'jane.doe@example.com' },
          createdAt: { type: 'string', example: '2020-10-19T15:23:54.000Z' },
          updatedAt: { type: 'string', example: '2020-10-19T15:23:54.000Z' },
        },
      });

      // Browse
      app.get(
        '/users',
        {
          schema: {
            summary: 'Browse all users',
            description: 'Get a listing of all users',
            tags: ['User'],
            response: {
              200: {
                description: 'Success',
                type: 'array',
                items: { $ref: 'User#' },
              },
              400: {
                description: 'Bad Request',
                $ref: 'BadRequestSchema#',
              },
              500: {
                description: 'Internal Error',
                $ref: 'InternalErrorSchema#',
              },
            },
          },
        },
        this.browse,
      );

      // Read
      app.get(
        '/users/:id',
        {
          schema: {
            summary: 'Read an individual user',
            description: 'Return a single user',
            tags: ['User'],
            params: {
              required: ['id'],
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                },
              },
            },
            response: {
              200: {
                description: 'Success',
                $ref: 'User#',
              },
              400: {
                description: 'Bad Request',
                $ref: 'BadRequestSchema#',
              },
              404: {
                description: 'Not Found',
                $ref: 'NotFoundSchema#',
              },
              500: {
                description: 'Internal Error',
                $ref: 'InternalErrorSchema#',
              },
            },
          },
        },
        this.read,
      );

      // Add
      app.post(
        '/users',
        {
          schema: {
            summary: 'Add a user',
            description: 'Create a user',
            tags: ['User'],
            body: {
              required: ['firstName', 'lastName', 'email'],
              type: 'object',
              properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                email: { type: 'string', format: 'email' },
              },
            },
            response: {
              201: {
                description: 'Success',
                $ref: 'User#',
              },
              400: {
                description: 'Bad Request',
                $ref: 'BadRequestSchema#',
              },
              404: {
                description: 'Not Found',
                $ref: 'NotFoundSchema#',
              },
              500: {
                description: 'Internal Error',
                $ref: 'InternalErrorSchema#',
              },
            },
          },
        },
        this.add,
      );

      // Edit
      app.put(
        '/users/:id',
        {
          schema: {
            summary: 'Edit a user',
            description: 'Modify a user',
            tags: ['User'],
            params: {
              required: ['id'],
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                },
              },
            },
            body: {
              required: ['id', 'firstName', 'lastName', 'email'],
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                email: { type: 'string', format: 'email' },
              },
            },
            response: {
              201: {
                description: 'Success',
                $ref: 'User#',
              },
              400: {
                description: 'Bad Request',
                $ref: 'BadRequestSchema#',
              },
              404: {
                description: 'Not Found',
                $ref: 'NotFoundSchema#',
              },
              500: {
                description: 'Internal Error',
                $ref: 'InternalErrorSchema#',
              },
            },
          },
        },
        this.edit,
      );

      // Delete
      app.delete(
        '/users/:id',
        {
          schema: {
            summary: 'Delete a user',
            description: 'Remove a user',
            tags: ['User'],
            params: {
              required: ['id'],
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  format: 'uuid',
                },
              },
            },
            response: {
              204: {
                description: 'Success',
                type: 'object',
                properties: {},
              },
              400: {
                description: 'Bad Request',
                $ref: 'BadRequestSchema#',
              },
              404: {
                description: 'Not Found',
                $ref: 'NotFoundSchema#',
              },
              500: {
                description: 'Internal Error',
                $ref: 'InternalErrorSchema#',
              },
            },
          },
        },
        this.delete,
      );

      done();
    };
  }

  browse(request, reply) {
    const BrowseUsers = request.diScope.resolve('BrowseUsers');
    const UserSerializer = request.diScope.resolve('UserSerializer');
    const { SUCCESS, ERROR } = BrowseUsers.outputs;

    BrowseUsers.on(SUCCESS, (users) => {
      reply.code(200).send(users.map(UserSerializer.serialize));
    }).on(ERROR, (error) => {
      // TODO: Handle error
      console.error(error);

      reply.code(500).send();
    });

    BrowseUsers.execute();
  }

  read(request, reply) {
    const { id } = request.params;
    const ReadUser = request.diScope.resolve('ReadUser');
    const UserSerializer = request.diScope.resolve('UserSerializer');
    const { SUCCESS, NOT_FOUND, ERROR } = ReadUser.outputs;

    ReadUser.on(SUCCESS, (user) => {
      reply.code(200).send(UserSerializer.serialize(user));
    })
      .on(NOT_FOUND, (error) => {
        reply.code(404).send({
          type: 'Not Found',
          details: error.details,
        });
      })
      .on(ERROR, (error) => {
        // TODO: Handle error
        console.error(error);

        reply.code(500).send({
          type: 'Internal Server Error',
          details: error.details,
        });
      });

    ReadUser.execute(id);
  }

  edit(request, reply) {
    const { id } = request.params;
    const { body } = request;
    const EditUser = request.diScope.resolve('EditUser');
    const UserSerializer = request.diScope.resolve('UserSerializer');
    const { SUCCESS, NOT_FOUND, VALIDATION_ERROR, ERROR } = EditUser.outputs;

    EditUser.on(SUCCESS, (user) => {
      reply.code(200).send(UserSerializer.serialize(user));
    })
      .on(VALIDATION_ERROR, (error) => {
        reply.code(400).send({
          type: 'Bad Request',
          details: error.details,
        });
      })
      .on(NOT_FOUND, (error) => {
        reply.code(404).send({
          type: 'Not Found',
          details: error.details,
        });
      })
      .on(ERROR, (error) => {
        // TODO: Handle error
        console.error(error);

        reply.code(500).send({
          type: 'Internal Server Error',
          details: error.details,
        });
      });

    EditUser.execute(id, body);
  }

  add(request, reply) {
    const { body } = request;
    const AddUser = request.diScope.resolve('AddUser');
    const UserSerializer = request.diScope.resolve('UserSerializer');
    const { SUCCESS, VALIDATION_ERROR, UNPROCESSABLE_ENTITY, ERROR } = AddUser.outputs;

    AddUser.on(SUCCESS, (user) => {
      reply.code(201).send(UserSerializer.serialize(user));
    })
      .on(VALIDATION_ERROR, (error) => {
        reply.code(400).send({
          type: 'Bad Request',
          details: error.details,
        });
      })
      .on(UNPROCESSABLE_ENTITY, (error) => {
        reply.code(422).send({
          type: 'Unprocessable Entity',
          details: error.details,
        });
      })
      .on(ERROR, (error) => {
        // TODO: Handle error
        console.error(error);

        reply.code(500).send({
          type: 'Internal Server Error',
          details: error.details,
        });
      });

    AddUser.execute(body);
  }

  delete(request, reply) {
    const { id } = request.params;
    const DeleteUser = request.diScope.resolve('DeleteUser');
    const { SUCCESS, NOT_FOUND, ERROR } = DeleteUser.outputs;

    DeleteUser.on(SUCCESS, () => {
      return reply.code(204).send();
    })
      .on(NOT_FOUND, (error) => {
        return reply.code(404).send({
          type: 'Not Found',
          details: error.details,
        });
      })
      .on(ERROR, (error) => {
        // TODO: Handle error
        console.error(error);

        return reply.code(500).serialize({
          type: 'Internal Server Error',
          details: error.details,
        });
      });

    DeleteUser.execute(id);
  }
}

module.exports = UsersRouter;
