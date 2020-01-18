const request = require('supertest');
const { User } = require("../models/user");
let server;

describe(":POST /api/users/register", () => {

    let newUser;

    const exec = () => {
        return request(server)
            .post('/api/users/register')
            .send(newUser);
    }

    beforeEach(() => {

        newUser = { "name": "Christian Uche", "email": "test@email.com", "password": "1234565" };
        server = require("../app");

    });

    afterEach(async() => {
        await server.close();
        await User.deleteMany({})
    });


    it('should return 400 if any of the required input for user creation is missing', async() => {

        newUser = {};
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if a user already exist', async() => {

        const user = new User(newUser);
        await user.save();

        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 201 if a valid input request is sent and user was created.', async() => {
        const res = await exec();
        expect(res.status).toBe(201);
    });

    it('should return a valid user object if user was successfully created.', async() => {
        const res = await exec();
        expect(res.body).toHaveProperty('_id');
    });

    it('should return a valid jwt token in the header if a user was successfully created.', async() => {
        const res = await exec();

        console.log(res.header);

        expect(res.header).toHaveProperty('x-auth-token');
    });
});