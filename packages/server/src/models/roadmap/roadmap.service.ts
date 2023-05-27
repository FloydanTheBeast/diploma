import { Injectable } from '@nestjs/common';

import { CreateRoadmapInput } from './gql-types';
import { GqlService } from '../../gql/gql.service';

@Injectable()
export class RoadmapService {
  constructor(private readonly gqlService: GqlService) {}

  async createRoadmap(data: CreateRoadmapInput, userId: string) {
    const session = this.gqlService.driver.session();

    try {
      const res = await session.run(
        `
        CREATE (rm:Roadmap { id: randomUUID() })
        SET rm.title = $data.title
        SET rm.description = $data.description
        SET rm.createdAt = datetime.realtime()
        SET rm.difficulty = $data.difficulty

        WITH rm
        MATCH (lang:Language { countryCodeISO: $data.countryCodeISO })
        MERGE (rm)-[:TRANSLATED_INTO]->(lang)

        WITH rm
        MATCH (u:User { id: $userId })
        MERGE (rm)-[:CREATED_BY]->(u)

        WITH $data.tagsIds as tagsIds, rm
        FOREACH (tagId in tagsIds |
          MERGE (t:TopicTag { id: tagId })
          MERGE (rm)-[:INCLUDES_TOPIC]->(t)
        )

        WITH $data.nodes AS nodes, rm
        FOREACH (n IN nodes | 
          CREATE (node:RoadmapNode { id: n.id })
          SET node.title = n.title
          SET node.description = n.description
          SET node.positionX = n.position.x
          SET node.positionY = n.position.y
          SET node.type = n.type
          FOREACH (sg IN n.suggestedCourses |
            MERGE (c:Course { id: sg.id })
            MERGE (node)-[:SUGGESTS_COURSE]->(c)
          )
        )
        
        WITH $data.nodes as nodes, rm
        MATCH (n:RoadmapNode { id: nodes[0].id })
        MERGE (rm)-[:CONSISTS_OF]->(n)
        
        WITH $data.edges AS edges, rm
        UNWIND edges AS edgeObj
        MATCH (n1:RoadmapNode { id: edgeObj.source })
        MATCH (n2:RoadmapNode { id: edgeObj.target })
        MERGE (n1)-[r:HAS_CHILD { id: edgeObj.id }]->(n2)
        RETURN rm
      `,
        {
          data,
          userId,
        },
      );

      await session.close();

      return res.records[0];
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteRoadmap(id: string) {
    const session = this.gqlService.driver.session();

    try {
      const res = await session.run(
        `
        MATCH (r:Roadmap { id: $id })
        OPTIONAL MATCH (r)-[:CONSISTS_OF]->(rn:RoadmapNode)
        DETACH DELETE r, rn
      `,
        {
          id,
        },
      );

      await session.close();

      console.log(res.summary);

      return res.summary.counters.updates().nodesDeleted;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
