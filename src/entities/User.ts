import { Entity, Property, PrimaryKey, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "mongodb";
import { Field, ID, ObjectType } from "type-graphql";


@ObjectType()
@Entity()
export class User {
  
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
  @Property({type: 'text', unique: true})
  username!: string;

  @Property({type: 'text'})
  password!: string;
}