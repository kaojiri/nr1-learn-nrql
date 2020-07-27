import Overview from './lessons/Overview';
import AggregateQuery4 from './lessons/AggregateQuery4';
import UsingRegex from './lessons/UsingRegex';
import SubQuery from './lessons/SubQuery';
import DiscoverEventsAndAttributes from './lessons/DiscoverEventsAndAttributes';
import AdvancedMath from './lessons/AdvancedMath';

export default [
  {
    title: 'Introduction',
    component: Overview
  },
  {
    title: 'Aggregation and bucketing',
    component: AggregateQuery4
  },
  {
    title: 'Advanced maths',
    component: AdvancedMath
  },
  {
    title: 'Discover events and attributes',
    component: DiscoverEventsAndAttributes
  },
  {
    title: 'Filter with regex',
    component: UsingRegex
  },
  {
    title: 'Nested aggregation',
    component: SubQuery
  }
];
