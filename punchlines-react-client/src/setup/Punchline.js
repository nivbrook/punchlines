import React, { Component } from 'react';
import './Punchline.css';
import { withRouter} from 'react-router-dom';
import { Avatar, Icon, Button, Form, Input, notification } from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';

class Punchline extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="poll-content">
                <div className="poll-header">
                    <div className="poll-creator-info">
                    <Link className="creator-link" to={`/users/${this.props.punchline.createdBy.username}`}>
                            <Avatar className="poll-creator-avatar"
                                style={{ backgroundColor: getAvatarColor(this.props.punchline.createdBy.name)}}>
                                    {this.props.punchline.createdBy.name[0].toUpperCase()}
                            </Avatar>
                            <span className="poll-creator-name">
                                {this.props.punchline.createdBy.name}
                            </span>
                            <span className="poll-creator-username">
                                @{this.props.punchline.createdBy.username}
                            </span>
                            <span className="poll-creation-date">
                                {formatDateTime(this.props.punchline.creationDateTime)}
                            </span>
                        </Link>
                    </div>
                    <div className="poll-question">
                        {this.props.punchline.text}
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Punchline);