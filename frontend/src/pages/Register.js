import React from 'react'
import { useState } from 'react'
import { useApp } from '../UseApp'
import { Button, Form, Input, Select } from 'antd'
import { useNavigate } from 'react-router-dom'
import instance from '../api'

const layout = {
    labelCol: {
        span: 10,
    },
    wrapperCol: {
        span: 16,
    },
}

const bcrypt = require('bcryptjs')
const saltRounds = 10

const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(password, salt)
    return hash
}

const Register = ({ setLogin }) => {
    const [password, setPassword] = useState('')
    const { setStatus, setId, setMe, setSignIn } = useApp()
    const [form] = Form.useForm()

    const navigate = useNavigate()

    const navigateToMainPage = () => {
        navigate('/')
    }

    const onFinish = async (value) => {
        const password = value.user.password
        value.user.password = await encryptPassword(password)
        const {
            data: { message, content },
        } = await instance.post('/register', value)

        setStatus({
            type: message,
            msg: content,
        })
        if (message === 'success') {
            setId(value.user.id)
            setMe(value.user.name)
            setSignIn(true)
            setLogin(true)
            navigateToMainPage()
        }
        form.resetFields()
    }
    return (
        <div className="loginFormContainer">
            <Form
                {...layout}
                name="nest-messages"
                onFinish={onFinish}
                form={form}
            >
                <Form.Item
                    name={['user', 'name']}
                    label="Name"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name={['user', 'id']}
                    label="Id"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name={['user', 'password']}
                    label="Password"
                    rules={[
                        {
                            type: 'password',
                            required: true,
                        },
                    ]}
                >
                    <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="Bank account" />
                <Form.Item name={['user', 'bank_id']} label="Bank id">
                    <Select
                        style={{
                            width: 155,
                        }}
                        options={[
                            {
                                value: '812',
                                label: '812 台新銀行',
                            },
                            {
                                value: '822',
                                label: '822 中國信託',
                            },
                            {
                                value: '007',
                                label: '007 第一銀行',
                            },
                            {
                                value: '012',
                                label: '012 台北富邦',
                            },
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    name={['user', 'bankaccount_id']}
                    label="Bank account id"
                >
                    <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Register
