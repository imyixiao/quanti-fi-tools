import React from 'react';
import { Row } from 'antd';

const BasicRow = (props: { children: any }) => (
    <Row type="flex" justify="center" gutter={12}>
        {props.children}
    </Row>
);

export default BasicRow;
