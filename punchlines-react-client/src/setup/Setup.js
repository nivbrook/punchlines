import React, { Component } from 'react';
import './Setup.css';
import { createPunchline, deleteSetup, likeSetup, unlikeSetup } from '../util/APIUtils';
import { withRouter} from 'react-router-dom';
import { Button, Form, Input, notification } from 'antd';
import { PUNCHLINE_TEXT_MAX_LENGTH } from '../constants';
import { Link } from 'react-router-dom';
import { formatDateTime } from '../util/Helpers';

const FormItem = Form.Item;
const { TextArea } = Input

class Setup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            punchline: {
                text: ""
            },
            likeCount: 0,
            isLiked: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validatePunchline = this.validatePunchline.bind(this);
        this.handlePunchlineChange = this.handlePunchlineChange.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleLike = this.handleLike.bind(this);
    }

    componentDidMount() {
        const likeIds = this.props.setup.likeIds;
        if(likeIds.includes(this.props.currentUser.id)){
            this.setState({
                isLiked: true
            })
        }
        this.setState({
            likeCount: this.props.setup.likeIds.length
        })
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

    handleLike() {
        likeSetup(this.props.setup.id);
        this.setState(prevState => {
            return {
                likeCount: prevState.likeCount + 1,
                isLiked: true
            }
         })
    }

    handleUnlike() {
        unlikeSetup(this.props.setup.id);
        this.setState(prevState => {
            return {
                likeCount: prevState.likeCount - 1,
                isLiked: false
            }
         })
    }

    validatePunchline(punchlineText) {
        if(punchlineText.length === 0) {
            return {
                validateStatus: 'empty',
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

    handleDelete(setupId) {
        deleteSetup(setupId);
        this.props.history.push("/");
        window.location.reload();
    }

    render() {
        return (
            <div className="poll-content">
                <div className="poll-header">
                    <div className="top-bar">
                        <div className="like-button">
                            {!this.state.isLiked ? 
                                <img 
                                    onClick={()=>this.handleLike()}
                                    style={{cursor:'pointer'}}
                                    onMouseOver={e => (e.currentTarget.src = "/laughicon.svg")}
                                    onMouseOut={e => (e.currentTarget.src = "/laughbw.svg")}
                                    height="30" src="/laughbw.svg" alt=""/> :
                                <img 
                                    onClick={()=>this.handleUnlike()}
                                    style={{cursor:'pointer'}}
                                    onMouseOver={e => (e.currentTarget.src = "/laughbw.svg")}
                                    onMouseOut={e => (e.currentTarget.src = "/laughicon.svg")}
                                    height="30" src="/laughicon.svg" alt=""/>}
                        </div>
                        <div className="like-count">
                            <span style={{fontSize: "20px", fontWeight: "700"}}>{this.state.likeCount}</span>
                            laughs
                        </div>
                        <div className="poll-creator-info">
                            <Link className="creator-link" to={`/users/${this.props.setup.createdBy.username}`}>
                                {/* <Avatar className="poll-creator-avatar"
                                    style={{ backgroundColor: getAvatarColor(this.props.setup.createdBy.name)}}>
                                        {this.props.setup.createdBy.name[0].toUpperCase()}
                                </Avatar> */}
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
                    </div>
                    <div className="category">
                        Category: {this.props.setup.category}
                    </div>
                    <div className="poll-question">
                        {this.props.setup.text}
                    </div>
                    <div className="punchline-count">
                        <a href={"/setups/"+this.props.setup.id}>{this.props.setup.punchlineCount} {this.props.setup.punchlineCount === 1 ? "Punchline" : "Punchlines"}</a>
                        {(this.props.currentUser && this.props.currentUser.id === this.props.setup.createdBy.id) && <a className="delete-button" onClick={()=>this.handleDelete(this.props.setup.id)}>Delete</a>}
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
                                className="create-setup-form-button">submit</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default withRouter(Setup);