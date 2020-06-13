import React from 'react';
import { Card, Col, Row, Form, Input, Button } from 'antd';
// import { UserOutlined } from '@ant-design/icons';


const formPartTwo = (props) => {

  const onFinish = values => {
    console.log(values);
    props.formTwoComplete(true, values)
  };

  let { userOrigin } = props;

  return (
    <React.Fragment>
      <Row>
        <Col span={12} offset={6}>
          <Card title="Get A Container Quote From Bob">
            <Form onFinish={onFinish}>
              <Row>
                <Col  span={12} offset={0}>
                  <span className="form-label">First Name</span>
                  <Form.Item name="First" rules={[{ required: true }]}>
                    <Input name="First" rules={[{ required: true }]}/>
                  </Form.Item>
                </Col>
                <Col  span={12} offset={0}>
                  <span className="form-label">Last Name</span>
                  <Form.Item name="Last" rules={[{ required: true }]}>
                    <Input name="Last" rules={[{ required: true }]}/>
                  </Form.Item>
                </Col>
              </Row>

              <span className="form-label">Address</span>
              <Form.Item name="Address" rules={[{ required: true }]}>
                <Input />
              </Form.Item>


              {/* userOrigin */}
              <span className="form-label">City, State, Zip</span>
              <Form.Item name="City" >
                <Input disabled placeholder={userOrigin} />
              </Form.Item>

              <span className="form-label">Email</span>
              <Form.Item name="Email" rules={[{ required: true }]}>
                <Input type="email"/>
              </Form.Item>
              <span className="form-label">Phone Number</span>
              <Form.Item name="Phone" rules={[{ required: true }]}>
                <Input type="phone"/>
              </Form.Item>
              <Form.Item >
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default formPartTwo;