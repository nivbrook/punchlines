import React, { Component } from 'react';
import './Punchline.css';
import { withRouter} from 'react-router-dom';
import { Link } from 'react-router-dom';
import { formatDateTime } from '../util/Helpers';
import { likePunchline, unlikePunchline } from '../util/APIUtils';

class Punchline extends Component {

    constructor(props) {
        super(props);
        this.state = {
            likeCount: 0,
            isLiked: false
        }
    }

    componentDidMount() {
        const likeIds = this.props.punchline.likeIds;
        if (likeIds.includes(this.props.currentUser.id)) {
            this.setState({
                isLiked: true
            })
        }
        this.setState({
            likeCount: this.props.punchline.likeIds.length
        })
    }

    handleLike() {
        likePunchline(this.props.punchline.id);
        this.setState(prevState=> {
            return {
                likeCount: prevState.likeCount + 1,
                isLiked: true
            }
        })
    }

    handleUnlike() {
        unlikePunchline(this.props.punchline.id);
        this.setState(prevState=> {
            return {
                likeCount: prevState.likeCount - 1,
                isLiked: false
            }
        })
    }

    render() {
        return (
            <div className="punchline-content">
                <div className="poll-header">
                    {this.props.username && <a href={"/setups/"+this.props.punchline.setup.id}><i>{this.props.punchline.setup.text}</i></a>}
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
                                    height="30" src="/laughicon.svg" alt=""/> }
                        </div>
                        <div className="like-count">
                            <span style={{fontSize: "20px", fontWeight: "700"}}>{this.state.likeCount}</span>
                            laughs
                        </div>
                        <div className="poll-creator-info">
                            <Link className="creator-link" to={`/users/${this.props.punchline.createdBy.username}`}>
                                {/* <Avatar className="poll-creator-avatar"
                                    style={{ backgroundColor: getAvatarColor(this.props.punchline.createdBy.name)}}>
                                        {this.props.punchline.createdBy.name[0].toUpperCase()}
                                </Avatar> */}
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
                    </div>
                    <div className="punchline-text">
                        {this.props.punchline.text}
                    </div>
                </div>
                {this.props.currentUser.id === this.props.punchline.createdBy.id && <a className="delete-button" onClick={()=>this.props.handleDelete(this.props.punchline.id)}>Delete</a>}
            </div>
        )
    }
}

export default withRouter(Punchline);