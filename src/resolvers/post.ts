import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { ObjectId } from "@mikro-orm/mongodb";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(@Ctx() {em}: MyContext): Promise<Post[]> {
        return em.find(Post, {});
    }

    @Query(() => Post, {nullable: true})
    post(@Arg('_id') id: string
    ,@Ctx() {em}: MyContext): Promise<Post | null> {
        return em.findOne(Post, { id });
    }

    @Mutation(() => Post)
    async createPost(
        @Arg("title") title: string
        ,@Ctx() {em}: MyContext): Promise<Post> {
            const post = em.create(Post, {title});
            await em.persistAndFlush(post)
            return post;
        }
}