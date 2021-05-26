import { Entity, Property, PrimaryKey, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "mongodb";
import { Field, ID, Int, ObjectType } from "type-graphql";


@ObjectType()
@Entity()
export class Post {
  
  @PrimaryKey()
  _id: ObjectId;

  @Field(() => ID)
  @SerializedPrimaryKey()
  id!: string
  
  @Field(() => String)
  @Property({ type: 'date' })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field(() => String)
  @Property({type: 'text'})
  title!: string;
}