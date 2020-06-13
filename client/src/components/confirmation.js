import React from 'react';
import { Card, Col, Row, Form, Input, Button, Select } from 'antd';
// import { UserOutlined } from '@ant-design/icons';
const { Option } = Select;


const confirmation = (props) => {
  return (
    <React.Fragment>
      <Row>
        <Col span={12} offset={6}>
          <Card title="Thanks for shopping with us! A confirmation email has been sent">

          </Card>
        </Col>
        </Row>
    </React.Fragment>
  )

}

export default confirmation;