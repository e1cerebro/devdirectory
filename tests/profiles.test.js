const request = require('supertest');

const { User } = require("../models/user");
const { Profile } = require("../models/profile");
const jwt = require('jsonwebtoken');

let server, newUser, url, token, data, user_id, bio;

describe('/profile', () => {


    const dummyUser = async() => {
        const user = new User(data);
        await user.save();
        data.user_id = user._id;
        //delete data.password;
        token = jwt.sign(data, process.env.jwtprivatekey);
        return user._id;
    };

    const dummyProfile = async() => {
        bio.user = user_id;
        const profile = new Profile(bio);
        await profile.save();
    }

    const exec = () => {
        return request(server)
            .post(url)
            .set("x-auth-token", token)
            .send(bio);
    };


    beforeEach(() => {
        server = require("../app");

        data = { "name": "Christian Uche", "email": "test@email.com", "password": "1234565" };
        token = jwt.sign(data, process.env.jwtprivatekey);
        url = "/api/profile/create";

        bio = {
            "gender": "male",
            "country": "Nigeria",
            "age": "29",
            "stacks": ["Javascript", "PHP", "NODEJS"],
            "bio": "I am a friendly person"
        };
    });


    afterEach(async() => {
        await server.close();
        await User.deleteMany({});
        await Profile.deleteMany({});
    });
    describe('POST: /create', () => {


        it('should return 401 if a user makes a request without token.', async() => {
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 401 if an  unverified user makes a request.', async() => {
            data.verified = false;
            await dummyUser();
            const res = await exec();
            expect(res.status).toBe(401);
        });


        it('should return 400 if user makes a request with bad input data', async() => {

            data.verified = true; //verify user
            await dummyUser(); //create a test user account and assign token
            bio = {}; //invalidate the user bio
            const res = await exec(); //send a post request to the end point
            expect(res.status).toBe(400);
        });


        it('should return 201 if user profile was successfully created', async() => {
            data.verified = true; //verify user
            const id = await dummyUser(); //create a test user account and assign token

            const res = await exec(); //send a post request to the end point
            expect(res.status).toBe(201);
        });
    });


    describe('POST: /delete', () => {

        it('should return 401 if a user makes a delete request without token.', async() => {
            token = '';
            url = "/api/profile/delete";
            const res = await request(server)
                .delete(url)
                .set("x-auth-token", token)
                .send({});

            expect(res.status).toBe(401);
        });

        it('should return 401 if a user profile does not exist', async() => {
            url = "/api/profile/delete";
            const uid = await dummyUser(); //create a test user account and assign token
            user_id = uid;
            //await dummyProfile();
            const res = await request(server)
                .delete(url)
                .set("x-auth-token", token)
                .send({});

            expect(res.status).toBe(401);
        });

        it('should return 200 if a user profile was successfully deleted.', async() => {
            url = "/api/profile/delete";
            const uid = await dummyUser(); //create a test user account and assign token
            user_id = uid;
            await dummyProfile();
            const res = await request(server)
                .delete(url)
                .set("x-auth-token", token)
                .send({});
            expect(res.status).toBe(200);
        });

    });
});