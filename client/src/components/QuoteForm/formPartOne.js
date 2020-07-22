import React from 'react';
import { Card, Col, Row, Form, Input, Button, Select } from 'antd';
// import { UserOutlined } from '@ant-design/icons';
const { Option } = Select;


const formPartOne = (props) => {

  const onFinish = values => {
    console.log(values);
    props.formOneComplete(true, values)
  };

  return (
    <React.Fragment>
      <Row>
        <Col span={12} offset={6}>
          <Card title="Get A Container Quote From Bob">
            <Form onFinish={onFinish}>
              <span className="form-label">Zip Code</span>
              <Form.Item name="Zip" rules={[{ required: true }]}>
                <Input type="number" max={99999}/>
              </Form.Item>
              <span className="form-label">Container Size</span>
              <Form.Item name="Size" rules={[{ required: true }]}>
                <Select
                  allowClear
                >
                  <Option value="20,STD,NEW">20' Standard New</Option>
                  <Option value="20,HC,NEW">20' High Cube New</Option>
                  <Option value="40,STD,NEW">40' Standard New</Option>
                  <Option value="40,HC,NEW">40' High Cube New</Option>
                  <Option value="20,STD,USED">20' Standard Used</Option>
                  <Option value="20,HC,USED">20' High Cube Used</Option>
                  <Option value="40,STD,USED">40' Standard Used</Option>
                  <Option value="40,HC,USED">40' High Cube Used</Option>
                </Select>
              </Form.Item>
              <span className="form-label">Quantity</span>
              <Form.Item name="Quantity" rules={[{ required: true }]}>
                <Input type="number"/>
              </Form.Item>
              <Form.Item >
                <Button type="primary" htmlType="submit">
                  Get Quote
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default formPartOne;