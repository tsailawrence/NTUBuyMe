import React from 'react'
import '../index.css'
import { useApp } from '../UseApp'
import { Button, Checkbox, Form, Input } from 'antd'
import { useState } from 'react'
import axios from 'axios'
const bcrypt = require('bcryptjs')

const instance = axios.create({
    baseURL: 'http://localhost:4000/api',
})

const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(saltRounds)
    const hash = await bcrypt.hash(password, salt)
    return hash
}

const Login = ({ setLogin, setRegister }) => {
    const { me, setMe, status, setStatus } = useApp()
    const [id, setId] = useState('123')
    const [password, setPassword] = useState('')

    const handleLogin = async () => {
        if (!id) {
            setStatus({
                type: 'error',
                msg: 'Missing user name',
            })
        } else if (!password) {
            setStatus({
                type: 'error',
                msg: 'Missing password',
            })
        } else {
            const {
                data: { message, content },
            } = await instance.post('/login', {
                userId: id,
                password: await encryptPassword(password),
            })

            switch (message) {
                case 'error':
                    setStatus({
                        type: 'error',
                        msg: content,
                    })
                    break
                case 'success':
                    setStatus({
                        type: 'success',
                        msg: content,
                    })
                    break
            }
        }
    }
    return (
        <div className="loginFormContainer">
            <Form
                name="basic"
                className="loginForm"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input value={id} onChange={(e) => setId(e.target.value)} />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Item>

                <Form.Item
                    name="remember"
                    valuePropName="checked"
                    wrapperCol={{ offset: 8, span: 16 }}
                >
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button
                        type="primary"
                        style={{
                            margin: 5,
                            width: 80,
                        }}
                        onClick={handleLogin}
                    >
                        Submit
                    </Button>
                    <Button
                        type="default"
                        style={{
                            margin: 5,
                            width: 80,
                        }}
                    >
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Login
