import React, { Component } from 'react';
import { createSetup } from '../util/APIUtils';
import { SETUP_TEXT_MAX_LENGTH } from '../constants';
import './NewSetup.css';
import { Form, Input, Button, Icon, Select, Col, notification } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input

class newSetup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setup: {
                text: ""
            },
            category: "Jokes"
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateSetup = this.validateSetup.bind(this);
        this.handleSetupChange = this.handleSetupChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const setupData = {
            text: this.state.setup.text,
            category: this.state.category
        }
        createSetup(setupData)
        .then(response => {
            this.props.history.push("/");
        }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create poll.');    
            } else {
                notification.error({
                    message: 'Polling App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });              
            }
        });
    }

    validateSetup(setupText) {
        if(setupText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter your Setup!'
            }
        } else if(setupText.length > SETUP_TEXT_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Setup is too long (Maximum ${SETUP_TEXT_MAX_LENGTH} characters allowed)`
            }    
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    handleSetupChange(event) {
        const value = event.target.value;
        this.setState({
            setup: {
                text: value,
                ...this.validateSetup(value)
            }
        })
    }

    handleCategoryChange(value) {
        this.setState({
            category: value
        });
    }

    isFormInvalid() {
        if(this.state.setup.validateStatus !== 'success') {
            return true;
        }
    }

    render() {
        return (
            <div className="new-poll-container">
                <h1 className="page-title">Create Setup</h1>
                <div className="new-poll-content">
                    <Form onSubmit={this.handleSubmit} className="create-poll-form">
                    <FormItem validateStatus={this.state.setup.validateStatus}
                            help={this.state.setup.errorMsg} className="poll-form-row">
                        <TextArea 
                            placeholder="Enter your Setup"
                            style = {{ fontSize: '16px' }} 
                            autosize={{ minRows: 3, maxRows: 6 }} 
                            name = "question"
                            value = {this.state.setup.text}
                            onChange = {this.handleSetupChange} />
                    </FormItem>
                    <FormItem className="poll-form-row">
                        <Col xs={24} sm={4}>
                            Category: 
                        </Col>
                        <Select
                            name = "category"
                            onChange={this.handleCategoryChange}
                            value={this.state.category}
                            style={{width: 200}}>
                                <Option value="Jokes">Jokes</Option>
                                <Option value="News">In the News</Option>
                                <Option value="Premises">Premises</Option>
                        </Select>
                    </FormItem>
                    <FormItem className="poll-form-row">
                        <Button type="primary" 
                            htmlType="submit" 
                            size="large" 
                            disabled={this.isFormInvalid()}
                            className="create-poll-form-button">Create Setup</Button>
                    </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default newSetup;