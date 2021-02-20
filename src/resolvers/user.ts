import { User } from "../entities/User";
import { MyContext } from "../types";
import crypto from "crypto";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const hashedPass = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const user = em.create(User, { username, password: hashedPass });

    await em.persistAndFlush(user);
    return { user };
  }

  @Query(() => UserResponse)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username });

    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "doesn't exist",
          },
        ],
      };
    }

    const hashedPass = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    if (hashedPass !== user.password) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect pass",
          },
        ],
      };
    }

    return { user };
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @Arg("username") username: string,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    try {
      await em.nativeDelete(User, { username });
      return true;
    } catch {
      return false;
    }
  }
}
