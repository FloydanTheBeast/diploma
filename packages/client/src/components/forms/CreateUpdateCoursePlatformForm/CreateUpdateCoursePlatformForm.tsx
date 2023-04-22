import React from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Group, TextInput } from '@mantine/core';
import { SubmitHandler, useForm } from 'react-hook-form';

import { CoursePlatformLogo, FormField } from 'src/components/common';
import { useDebounce } from 'src/hooks';

import { createCoursePlatformValidationSchema } from './constants';
import type { CreateCoursePlatformFormData } from './types';

type CreateEditCoursePlatformFormProps = {
  onSubmit: SubmitHandler<CreateCoursePlatformFormData>;
  onCancel: () => void;
  defaultValues?: CreateCoursePlatformFormData;
  isUpdate?: boolean;
};

export const CreateUpdateCoursePlatformForm: React.FC<CreateEditCoursePlatformFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues,
  isUpdate,
}) => {
  const { register, handleSubmit, control, watch } = useForm<CreateCoursePlatformFormData>({
    resolver: yupResolver(createCoursePlatformValidationSchema),
    defaultValues,
  });

  const logoUrl = useDebounce(watch('logoUrl'), 500);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        component={TextInput}
        fieldProps={{
          ...register('name'),
          control,
          label: 'Name',
          placeholder: 'Course platform name',
          mb: 'md',
          required: true,
        }}
      />
      <FormField
        component={TextInput}
        fieldProps={{
          ...register('url'),
          control,
          label: 'Url',
          placeholder: 'Course platform url',
          mb: 'md',
          required: true,
        }}
      />
      <Group align="center">
        <FormField
          component={TextInput}
          fieldProps={{
            ...register('logoUrl'),
            control,
            label: 'Logo Url',
            placeholder: 'Course platform logo url',
            mb: 'md',
            sx: { flexGrow: 1, input: { height: 50, paddingRight: '3rem' } },
            rightSection: <CoursePlatformLogo logoUrl={logoUrl} sx={{ marginRight: 12 }} />,
          }}
        />
      </Group>
      <Group spacing="1rem" position="right">
        <Button onClick={onCancel} variant="outline" color="red">
          Cancel
        </Button>
        <Button type="submit" variant="light">
          {isUpdate ? 'Update' : 'Create'}
        </Button>
      </Group>
    </form>
  );
};
