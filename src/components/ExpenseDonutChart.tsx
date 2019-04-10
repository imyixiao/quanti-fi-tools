import { Chart, Tooltip, Axis, Legend, Coord, Pie } from 'viser-react';
import React, { Component } from 'react';
import _ from 'lodash';
import DataSet from '@antv/data-set';

const scale = [
    {
        dataKey: 'percent',
        min: 0,
        formatter: '.0%',
    },
];

interface Props {
    expense: any;
}

export default class ExpenseDonutChart extends Component<Props> {
    render() {
        let sourceData: any[] = [];
        _.forEach(_.omit(this.props.expense, 'total'), (value: number, key: string) => {
            if (value > 0) {
                sourceData.push({ item: key, count: value });
            }
        });
        const dv = new DataSet.View().source(sourceData);
        dv.transform({
            type: 'percent',
            field: 'count',
            dimension: 'item',
            as: 'percent',
        });
        const data = dv.rows;
        return (
            <div className="expense-donut-chart">
                <Chart forceFit height={400} data={data} scale={scale}>
                    <Tooltip showTitle={false} />
                    <Axis />
                    <Legend dataKey="item" />
                    <Coord type="theta" radius={0.75} innerRadius={0.7} />
                    <Pie
                        position="percent"
                        color="item"
                        style={{ stroke: '#fff', lineWidth: 1 }}
                        label={[
                            'percent',
                            {
                                formatter: (val, item) => {
                                    return item.point.item + ': ' + val;
                                },
                            },
                        ]}
                    />
                </Chart>
            </div>
        );
    }
}
