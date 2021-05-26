import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { MikroORM } from '@mikro-orm/core'

export default {
    entities: [Post],
    dbName: "givehub2",
    clientUrl: 'mongodb+srv://user1:runningoceanuniverse@cluster0.yk0ig.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',  
    type: "mongo",
    debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];