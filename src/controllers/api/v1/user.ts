import { Request, Response } from 'express';
import { catchErrors, CustomError, CreateEntityError } from 'errors';
import { User } from 'entities';

import { createEntity, findEntityOrThrow } from 'utils/typeorm';

export const createTestUser = catchErrors(async (_req: Request, res: Response) => {
    try {
        const newUser = new User();
        newUser.username = 'Test One';
        newUser.password = 'abc123';
        await newUser.save();
        res.respond(200, { status: 'ok' });
    } catch (error) {
        CustomError.toss('Unable to create test user!', {
            debug: error.message,
            id: error.code,
        });
    }
});

/*
export const createNewUser = catchErrors(async (req: Request, res: Response) => {
    try {
        const argsCount = Object.keys(req.query).length;
        if (argsCount === 2 && req.query.un && req.query.pw) {
            const nu = new User();
            nu.username = req.query.un;
            nu.password = req.query.pw;
            await nu.save();
            res.respond(200, { success: true });
        } else {
            CustomError.toss('Incorrect parameter set!', {});
        }
    } catch (error) {
        CustomError.toss('Unable to create user!', {
            debug: error.message,
            id: error.code,
        });
    }
});
*/

export const createNewUser = catchErrors(async (req: Request, res: Response) => {
    try {
        const nu = await createEntity(User, {
            username: req.query.un,
            password: req.query.pw,
        });
        res.respond(200, { ...nu });
    } catch (error) {
        throw new CreateEntityError('User', { ...error });
    }
    /*
    const argsCount = Object.keys(req.query).length;
    if (argsCount === 2 && req.query.un && req.query.pw) {
        const nu = new User();
        nu.username = req.query.un;
        nu.password = req.query.pw;
        await nu.save();
        res.respond(200, { success: true });
    } else {
        res.respond(200, { success: false });
    }
    */
});

/*
export const findUser = catchErrors(async (req: Request, res: Response) => {
    try {
        const argsCount = Object.keys(req.query).length;
        if (argsCount === 1 && req.query.un) {
            const foundUser = await User.findOne({ username: req.query.un });
            if (!foundUser) {
                throw Error('Unable to find user!');
            } else {
                res.respond(200, { ...foundUser });
            }
        } else {
            CustomError.toss('Incorrect parameter set!', {});
        }
    } catch (error) {
        CustomError.toss('Unable to find user!', {});
    }
});
*/

export const findUser = catchErrors(async (req: Request, res: Response) => {
    const f = await findEntityOrThrow(User, { where: { username: req.query.un } });
    res.respond(200, { ...f });
});

export const validateUserPassword = catchErrors(async (req: Request, res: Response) => {
    try {
        const argsCount = Object.keys(req.query).length;
        if (argsCount === 2 && req.query.un && req.query.pw) {
            const foundUser = await User.findOne({ username: req.query.un });
            if (!foundUser) {
                res.respond(200, { status: false });
            } else {
                res.respond(200, { status: foundUser.validatePassword(req.query.pw) });
            }
        } else {
            res.respond(200, '');
        }
    } catch (error) {
        CustomError.toss('Unable to find user!', {});
    }
});
