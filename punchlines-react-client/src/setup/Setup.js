import React, { Component } from 'react';
import './Setup.css';
import { createPunchline } from '../util/APIUtils';
import { withRouter} from 'react-router-dom';
import { Avatar, Icon, Button, Form, Input, notification } from 'antd';
import { PUNCHLINE_TEXT_MAX_LENGTH } from '../constants';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';

const FormItem = Form.Item;
const { TextArea } = Input

class Setup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            punchline: {
                text: ''
            }
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validatePunchline = this.validatePunchline.bind(this);
        this.handlePunchlineChange = this.handlePunchlineChange.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const punchlineData = {
            text: this.state.punchline.text,
            setupId: this.props.setup.id
        }
        console.log(punchlineData);
        createPunchline(punchlineData)
        .then(response => {
            this.setState({
                punchline: {
                    text:''
                }
            });
            this.props.setup.punchlineCount++;
            this.forceUpdate();
            if (this.props.refreshPunchlineList){
                this.props.refreshPunchlineList();
            }
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

    validatePunchline(punchlineText) {
        if(punchlineText === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter your Punchline!'
            }
        }  else if(punchlineText.length > PUNCHLINE_TEXT_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Punchline is too long (Maximum ${PUNCHLINE_TEXT_MAX_LENGTH} characters allowed)`
            } 
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    handlePunchlineChange(event) {
        const value = event.target.value;
        this.setState({
            punchline: {
                text: value,
                ...this.validatePunchline(value)
            }
        })
    }

    isFormInvalid() {
        if(this.state.punchline.validateStatus !== 'success') {
            return true;
        }
    }

    render() {
        return (
            <div className="poll-content">
                <div className="poll-header">
                    <div className="poll-creator-info">
                        <Link className="creator-link" to={`/users/${this.props.setup.createdBy.username}`}>
                            <Avatar className="poll-creator-avatar"
                                style={{ backgroundColor: getAvatarColor(this.props.setup.createdBy.name)}}>
                                    {this.props.setup.createdBy.name[0].toUpperCase()}
                            </Avatar>
                            <span className="poll-creator-name">
                                {this.props.setup.createdBy.name}
                            </span>
                            <span className="poll-creator-username">
                                @{this.props.setup.createdBy.username}
                            </span>
                            <span className="poll-creation-date">
                                {formatDateTime(this.props.setup.creationDateTime)}
                            </span>
                        </Link>
                    </div>
                    <div className="category">
                        Category: {this.props.setup.category}
                    </div>
                    <div className="poll-question">
                        {this.props.setup.text}
                    </div>
                    <div className="punchline-count">
                        <a href={"/setups/"+this.props.setup.id}>{this.props.setup.punchlineCount} {this.props.setup.punchlineCount === 1 ? "Punchline" : "Punchlines"}</a>
                        {this.props.currentUser.id === this.props.setup.createdBy.id && <a className="delete-button" href="#">DELETE</a>}
                    </div>
                    <Form onSubmit={this.handleSubmit} className="create-punchline-form">
                        <FormItem validateStatus={this.state.punchline.validateStatus}
                            help={this.state.punchline.errorMsg}>
                            <TextArea
                                placeholder="Enter a punchline"
                                style = {{ fontSize: '16px'}}
                                autosize={{ minRows: 1, maxRows: 6 }}
                                name = "punchline"
                                value = {this.state.punchline.text}
                                onChange = {this.handlePunchlineChange}/>
                            <Button type="primary" 
                                htmlType="submit" 
                                size="default" 
                                disabled={this.isFormInvalid()}
                                className="create-poll-form-button">submit</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default withRouter(Setup);