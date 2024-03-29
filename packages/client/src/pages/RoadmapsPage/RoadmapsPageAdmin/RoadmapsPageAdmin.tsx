import React from 'react';

import { Button, Menu } from '@mantine/core';
import {
  GetRoadmapsDocument,
  useDeleteRoadmapMutation,
  useGetRoadmapsQuery,
} from '@shared/graphql';
import { IconDatabasePlus, IconListDetails, IconTrash } from '@tabler/icons-react';
import { Link, generatePath } from 'react-router-dom';

import { ContentPageLayout, DataGrid } from 'src/components';
import { RouteEntityType, appRoutes } from 'src/constants';
import { usePagination, usePaginationQueryOptions, useSearchQueryOptions } from 'src/hooks';
import { PaginationActionType } from 'src/providers';

import { ROADMAPS_TABLE_COLUMNS } from '../constants';

export const RoadmapsPageAdmin: React.FC = () => {
  const { paginationState, dispatchPaginationState } = usePagination();
  const paginationOptions = usePaginationQueryOptions();
  const searchOptions = useSearchQueryOptions(['title', 'description']);

  const { data, loading: loadingRoadmaps } = useGetRoadmapsQuery({
    variables: {
      where: searchOptions,
      options: paginationOptions,
    },
    notifyOnNetworkStatusChange: true,
  });
  const [deleteRoadmap] = useDeleteRoadmapMutation();

  const roadmaps = data?.roadmaps;

  const handleDeleteRoadmap = async (id: string) => {
    // TODO: Confirmation modal
    if (window.confirm('Are you sure you want to delete the course platform?')) {
      await deleteRoadmap({ variables: { id }, refetchQueries: [GetRoadmapsDocument] });
    }
  };

  React.useEffect(() => {
    if (!loadingRoadmaps) {
      dispatchPaginationState({
        type: PaginationActionType.changeCount,
        payload: { count: data?.roadmapsAggregate.count || 0 },
      });
    }
  }, [dispatchPaginationState, loadingRoadmaps, data?.roadmapsAggregate.count]);

  return (
    <ContentPageLayout title="Roadmaps">
      <DataGrid
        state={{ isLoading: loadingRoadmaps }}
        columns={ROADMAPS_TABLE_COLUMNS}
        data={roadmaps ?? []}
        rowCount={paginationState.count}
        enableRowActions
        initialState={{
          showGlobalFilter: true,
        }}
        positionGlobalFilter="left"
        renderRowActionMenuItems={({ row }) => (
          <React.Fragment>
            <Menu.Item
              icon={<IconListDetails size="1rem" />}
              component={Link}
              to={generatePath(appRoutes.roadmaps.details, {
                [RouteEntityType.roadmap]: row.original.id,
              })}
            >
              View details
            </Menu.Item>
            <Menu.Item
              icon={<IconTrash size="1rem" />}
              color="red"
              onClick={async () => await handleDeleteRoadmap(row.original.id)}
            >
              Delete roadmap
            </Menu.Item>
          </React.Fragment>
        )}
        renderTopToolbarCustomActions={() => {
          return (
            <Button
              component={Link}
              to={appRoutes.roadmaps.new}
              leftIcon={<IconDatabasePlus size="1rem" />}
              variant="outline"
            >
              Create new roadmap
            </Button>
          );
        }}
      />
    </ContentPageLayout>
  );
};
