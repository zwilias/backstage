/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { EntityAirbrakeWidget } from './EntityAirbrakeWidget';
import exampleData from '../../api/mock/airbrake-groups-api-mock.json';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { createEntity } from '../../api/mock/mock-entity';
import { airbrakeApiRef, MockAirbrakeApi } from '../../api';

describe('EntityAirbrakeContent', () => {
  it('renders all errors sent from Airbrake', async () => {
    const table = await renderInTestApp(
      <TestApiProvider apis={[[airbrakeApiRef, new MockAirbrakeApi()]]}>
        <EntityAirbrakeWidget entity={createEntity(123)} />
      </TestApiProvider>,
    );
    expect(exampleData.groups.length).toBeGreaterThan(0);
    for (const group of exampleData.groups) {
      expect(
        await table.getByText(group.errors[0].message),
      ).toBeInTheDocument();
    }
  });

  it('states that the annotation is missing if no annotation is provided', async () => {
    const table = await renderInTestApp(
      <TestApiProvider apis={[[airbrakeApiRef, new MockAirbrakeApi()]]}>
        <EntityAirbrakeWidget entity={createEntity()} />
      </TestApiProvider>,
    );
    expect(exampleData.groups.length).toBeGreaterThan(0);
    await expect(
      table.findByText('Missing Annotation'),
    ).resolves.toBeInTheDocument();
  });
});
