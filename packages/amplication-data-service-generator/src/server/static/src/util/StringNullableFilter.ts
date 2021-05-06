import { Field, InputType } from "@nestjs/graphql";
import { QueryMode } from "./QueryMode";

@InputType({
  isAbstract: true,
})
export class StringNullableFilter {
  @Field(() => String, {
    nullable: true,
  })
  equals?: string | null;

  @Field(() => [String], {
    nullable: true,
  })
  in?: string[] | null;

  @Field(() => [String], {
    nullable: true,
  })
  notIn?: string[] | null;

  @Field(() => String, {
    nullable: true,
  })
  lt?: string;

  @Field(() => String, {
    nullable: true,
  })
  lte?: string;

  @Field(() => String, {
    nullable: true,
  })
  gt?: string;

  @Field(() => String, {
    nullable: true,
  })
  gte?: string;

  @Field(() => String, {
    nullable: true,
  })
  contains?: string;

  @Field(() => String, {
    nullable: true,
  })
  startsWith?: string;

  @Field(() => String, {
    nullable: true,
  })
  endsWith?: string;

  @Field(() => QueryMode, {
    nullable: true,
  })
  mode?: QueryMode;

  @Field(() => String, {
    nullable: true,
  })
  not?: string;
}
