import React from 'react';
import { Button, Col, Divider, Form, Input, notification, Row } from 'antd';
import { createUserApi } from '../util/api';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const RegisterPage = () => {
    const navigate = useNavigate();

    const onFinish = async (values) => {
        const { name, email, password } = values;

        const res = await createUserApi(name, email, password);

        if (res) {
            notification.success({
                message: "Đăng ký tài khoản",
                description: "Tạo tài khoản thành công"
            });
            navigate("/login");
        } else {
            notification.error({
                message: "Đăng ký tài khoản",
                description: "Không thể tạo tài khoản"
            })
        }
    };

    return (
        <Row justify={'center'} style={{ marginTop: '30px' }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset style={{
                    padding: "15px",
                    margin: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px"
                }}>
                    <legend>Đăng ký tài khoản</legend>
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        autoComplete="off"
                        layout='vertical'
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="Tên hiển thị"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên hiển thị!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Đăng ký
                            </Button>
                        </Form.Item>
                    </Form>
                    <Link to={"/"}><ArrowLeftOutlined /> Quay lại trang chủ</Link>
                    <Divider />
                    <div style={{ textAlign: 'center' }}>
                        Đã có tài khoản? <Link to={"/login"}>Đăng nhập</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>
    )
}

export default RegisterPage;
