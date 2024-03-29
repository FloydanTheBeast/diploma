import { CourseInfoFragment } from '@shared/graphql';
import type { Nullable } from '@shared/types';
import type { Node } from 'reactflow';

import { CourseSelectItemProps } from 'src/components/RoadmapBuilder/components';

export enum RoadmapNodeType {
  basic = 'basic',
}

export type RoadmapNodeData = {
  title: string;
  description?: Nullable<string>;
  suggestedCourses?: Nullable<CourseSelectItemProps[]>;
};

export type RoadmapNode = Node<RoadmapNodeData, RoadmapNodeType>;
