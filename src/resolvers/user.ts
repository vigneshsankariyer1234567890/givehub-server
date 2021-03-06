import { User } from "@entities/User";
import { MyContext } from "types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from 'argon2';

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string
    @Field()
    password: string
    @Field()
    email: string
}

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field(() => User, {nullable: true})
    user?: User;
}

@Resolver()
export class UserResolver {

    @Query(() => User, {nullable: true})
    async me(
        @Ctx() { req, em } : MyContext
    ) {
        if (!req.session.userId) {
            return null;
            // not logged in 
        }

        const user = await em.findOne(User, {id: req.session.userId});

        return user;
    }


    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em, req}: MyContext
    ): Promise<UserResponse> {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        
        if (options.username.length <= 7) {
            return {
                errors: [{
                    field: 'username',
                    message: 'length must be greater than 2'
                }]
            }
        }
        if (!regEx.test(options.email)){
            return {
                errors: [{
                    field: 'email',
                    message: 'valid email must be provided'
                }]
            }
        }

        if (options.password.length <= 8) {
            return {
                errors: [{
                    field: 'username',
                    message: 'length must be greater than 2'
                }]
            }
        }
        const hashedPassword = await argon2.hash(options.password);
        const user = em.create(User, {username: options.username, password: hashedPassword});
        try {
            await em.persistAndFlush(user);
        } catch (error) {
            if (error.code === '23505') {
                // duplicate username error
                return {
                    errors: [{
                        field: 'username',
                        message: 'Username has already been taken.'
                    }]
                }
            }
        }

        // stores user id session and sets 
        // a cookie on the user, keeping them logged in 
        req.session.userId = user.id;

        return {user};
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() {em, req}: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, {username: options.username});
        if (!user) {
            return {
                errors: [{
                    field: 'username.',
                    message: "That username doesn't exist."
                }]
            }
        }
        const valid = await argon2.verify(user.password, options.password);
        if (!valid) {
            return {
                errors: [{
                    field: 'password.',
                    message: "incorrect password."
                }]
            }
        }

        req.session.userId = user.id;
        // managing sessions with express

        return {
            user,
        };
    }
}