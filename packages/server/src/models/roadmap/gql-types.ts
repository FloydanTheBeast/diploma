import { Field, InputType, ID } from '@nestjs/graphql';

@InputType()
export class RoadmapEdgeInput {
  @Field(() => ID)
  id: string;
  @Field()
  source: string;
  @Field()
  target: string;
  @Field({ nullable: true })
  targetHandle: string;
}

@InputType()
export class RoadmapNodePositionInput {
  @Field()
  x: number;
  @Field()
  y: number;
}

@InputType()
export class RoadmapNodeInput {
  @Field(() => ID)
  id: string;
  @Field()
  title: string;
  @Field({ nullable: true })
  description: string;
  @Field()
  position: RoadmapNodePositionInput;
  @Field()
  type: string;
}

@InputType()
export class CreateRoadmapInput {
  @Field()
  title: string;
  @Field({ nullable: true })
  description: string;
  @Field(() => [RoadmapNodeInput])
  nodes: RoadmapNodeInput[];
  @Field(() => [RoadmapEdgeInput])
  edges: RoadmapEdgeInput[];
}
