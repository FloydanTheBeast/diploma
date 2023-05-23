import { Avatar, Group, Rating, Text, Tooltip } from '@mantine/core';
import { RoadmapInfoFragment } from '@shared/graphql';
import { IconUserCircle } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { MRT_ColumnDef } from 'mantine-react-table';

export const ROADMAPS_TABLE_COLUMNS: MRT_ColumnDef<RoadmapInfoFragment>[] = [
  {
    header: 'Title',
    accessorKey: 'title',
  },
  {
    header: 'Title',
    accessorKey: 'title',
  },
  {
    header: 'Description',
    accessorFn: ({ description }) => (
      <Tooltip label={description} maw={300} multiline withArrow openDelay={500} withinPortal>
        <Text lineClamp={3} sx={{ cursor: 'help', maw: 400 }}>
          {description}
        </Text>
      </Tooltip>
    ),
  },
  {
    header: 'Internal rating',
    accessorFn: ({ reviewsAggregate }) => (
      <Group>
        <Rating value={reviewsAggregate?.node?.rating.average ?? 0} fractions={2} readOnly />
        <Text>({reviewsAggregate?.count ?? 0})</Text>
      </Group>
    ),
  },
  {
    header: 'Created by',
    accessorFn: ({ createdBy }) => (
      <Group>
        <Avatar size="md" radius="xl" color="blue" />
        <Text>
          {createdBy.firstName} {createdBy.lastName}
        </Text>
      </Group>
    ),
  },
  {
    header: 'Created at',
    accessorFn: ({ createdAt }) => dayjs(createdAt).format('DD/MM/YYYY HH:mm:ss'),
  },
  {
    header: 'Updated at',
    accessorFn: ({ updatedAt }) =>
      updatedAt ? dayjs(updatedAt).format('DD/MM/YYYY HH:mm:ss') : 'None',
  },
];
