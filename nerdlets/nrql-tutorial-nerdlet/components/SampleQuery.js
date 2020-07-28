import React from 'react';
import PropTypes from 'prop-types';
import { LessonContextConsumer } from '../contexts/LessonContext';
import copy from 'copy-to-clipboard';

import {
  LineChart,
  BillboardChart,
  TableChart,
  PieChart,
  BarChart,
  Grid,
  GridItem,
  Button,
  navigation,
  FunnelChart,
  HistogramChart,
  JsonChart,
  Icon,
  Toast,
  NrqlQuery
} from 'nr1';

const ReactMarkdown = require('react-markdown');
const JSONPretty = require('react-json-pretty');

export default class SampleQuery extends React.Component {
  static propTypes = {
    chartType: PropTypes.string,
    nrql: PropTypes.string,
    span: PropTypes.string,
    markdown: PropTypes.string
  };

  state = {
    showButton: true
  };

  getChart() {
    function JSONView({ query, accountId }) {
      return (
        <NrqlQuery accountId={accountId} query={query}>
          {({ data }) => {
            if (data && data[0] && data[0].data[0]) {
              return (
                <div>
                  <JSONPretty
                    style={{ height: '20em', overflow: 'scroll' }}
                    id="json-pretty"
                    data={data[0].data[0]}
                  />
                </div>
              );
            } else {
              return (
                <div>
                  <pre>Loading data...</pre>
                </div>
              );
            }
          }}
        </NrqlQuery>
      );
    }

    const { chartType, nrql } = this.props;
    if (chartType === 'line') {
      return LineChart;
    } else if (chartType === 'billboard') {
      return BillboardChart;
    } else if (chartType === 'table') {
      return TableChart;
    } else if (chartType === 'bar') {
      return BarChart;
    } else if (chartType === 'pie') {
      return PieChart;
    } else if (chartType === 'funnel') {
      return FunnelChart;
    } else if (chartType === 'json') {
      // return JsonChart
      return JSONView;
    } else if (chartType === 'jsonchart') {
      return JsonChart;
    } else if (chartType === 'histogram') {
      return HistogramChart;
    } else if (nrql.match(/timeseries/i)) {
      return LineChart;
    } else if (nrql.match(/facet/i)) {
      return TableChart;
    } else {
      return BillboardChart;
    }
  }

  render() {
    const { nrql, span, markdown } = this.props;
    let nrqlPlain = nrql
      .replace(/\*\*/g, '')
      .replace(/\\\*/g, '*')
      .replace(/\\_/g, '_')
      .replace(/\\\[/g, '[');

    if (markdown === 'no') {
      nrqlPlain = nrql;
    }
    const numSpan = Number(span);
    const { showButton } = this.state;

    const Chart = this.getChart();

    return (
      <LessonContextConsumer>
        {context => {
          return (
            <Grid className="sample-query">
              <GridItem columnSpan={numSpan} style={{ height: '100%' }}>
                <div
                  onMouseEnter={() => this.setState({ showButton: true })}
                  // onMouseLeave={() => this.setState({showButton: false})}
                  style={{ height: '100%' }}
                >
                  <h3>NRQL</h3>
                  <div className="nrql">
                    {markdown === 'no' ? (
                      <p>{nrqlPlain}</p>
                    ) : (
                      <ReactMarkdown source={nrql} />
                    )}
                  </div>
                  <div className="try-button">
                    {showButton && (
                      <>
                        <Button
                          type="plain"
                          onClick={() =>
                            openChartBuilder({
                              query: nrqlPlain,
                              accountId: context.accountId
                            })
                          }
                        >
                          <Icon
                            type={Icon.TYPE.DATAVIZ__DATAVIZ__DASHBOARD__A_EDIT}
                            spacingType={[
                              Icon.SPACING_TYPE.NONE,
                              Icon.SPACING_TYPE.MEDIUM,
                              Icon.SPACING_TYPE.NONE,
                              Icon.SPACING_TYPE.NONE
                            ]}
                          />
                          Try this query
                        </Button>
                        <Button
                          type="plain"
                          onClick={() => {
                            copy(nrqlPlain);
                            Toast.showToast({
                              title: 'Query copied to clipboard',
                              type: Toast.TYPE.NORMAL
                            });
                          }}
                        >
                          <Icon
                            spacingType={[
                              Icon.SPACING_TYPE.NONE,
                              Icon.SPACING_TYPE.MEDIUM,
                              Icon.SPACING_TYPE.NONE,
                              Icon.SPACING_TYPE.NONE
                            ]}
                            type={Icon.TYPE.INTERFACE__OPERATIONS__COPY_TO}
                          />
                          Copy
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </GridItem>
              <GridItem columnSpan={numSpan}>
                <h3>Result</h3>
                <div className="chart">
                  <Chart
                    fullWidth
                    query={nrqlPlain}
                    accountId={context.accountId}
                  />
                </div>
              </GridItem>
            </Grid>
          );
        }}
      </LessonContextConsumer>
    );
  }
}

function openChartBuilder({ query, accountId }) {
  const nerdlet = {
    id: 'wanda-data-exploration.data-explorer',
    urlState: {
      initialActiveInterface: 'nrqlEditor',
      initialAccountId: accountId,
      initialNrqlValue: query,
      isViewingQuery: true
    }
  };
  navigation.openStackedNerdlet(nerdlet);
}
