import 'reflect-metadata';
import 'module-alias/register';
import { MikroORM } from "@mikro-orm/core";
import __prod__  from "constants";
import express from'express';
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import { HelloResolver } from "@resolvers/hello";
import { PostResolver } from "@resolvers/post";
import { UserResolver } from '@resolvers/user';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis'
import mikroOrmConfig from './mikro-orm.config';
import { MyContext } from './types';
import cors from 'cors';


const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig);
    const PORT = process.env.PORT || 4000;

    const app = express();
    app.set('trust proxy',1);

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();
    app.use(cors({
        origin: 'http://localhost:4000/',
        credentials: true
    }))

    app.use(
        session({
            name: 'qid',
            store: new RedisStore({ 
                client: redisClient,
                disableTouch: true
                //To delete above line later
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365,
                // Set cookie age to 1 year for development settings, change to only 1 hour
                // format: milliseconds - seconds - minutes - hours - days - years
                httpOnly: true,
                sameSite: 'lax', //csrf
                secure: __prod__
            },
            saveUninitialized: false,
            secret: 'iuer09jhdbf34rw399y34bhqweeoiuq92341hadfh239',
            resave: false,
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({req, res}): MyContext => ({ em: orm.em, req, res })
    });

    apolloServer.applyMiddleware({ 
        app,
        cors: { origin: false} 
    });
    
    app.listen(PORT, () => {
        console.log(`server started on localhost: ${ PORT }`)
    })

    // const post = orm.em.create(Post, {title: 'my first post'});

    // await orm.em.persistAndFlush(post);
    // const posts = await orm.em.find(Post, {});
    // console.log(posts);

}

main().catch(err => console.log(err));

