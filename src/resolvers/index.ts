import { NonEmptyArray } from "type-graphql";
import { PostResolver } from "./post";
import { UserResolver } from "./user";

export default [
    PostResolver,
    UserResolver
] as (NonEmptyArray<Function> | NonEmptyArray<string>);