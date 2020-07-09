import React, { Component } from 'react';
import { Select, Button, Icon, notification } from 'antd';
import { SETUP_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './PunchlineList.css'
import { getUserCreatedPunchlines, deletePunchline } from '../util/APIUtils';
import Punchline from './Punchline';
import LoadingIndicator from '../common/LoadingIndicator';

const { Option } = Select;

class PunchlineList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            punchlines: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: true,
            sort: "newest"
        };
        this.loadPunchlineList = this.loadPunchlineList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.refreshPunchlineList = this.refreshPunchlineList.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSort = this.handleSort.bind(this);
    }
    loadPunchlineList(page = 0, size = SETUP_LIST_SIZE) {
        getUserCreatedPunchlines(this.props.username, page, size, this.state.sort).then( response => {
            const punchlines = this.state.punchlines.slice();

            this.setState({
                punchlines: punchlines.concat(response.content),
                page: response.page,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                last: response.last,
                isLoading: false
            })
        })
    }

    componentDidMount() {
        this.loadPunchlineList();
    }

    handleLoadMore() {
        this.loadPunchlineList(this.state.page+1);
    }

    refreshPunchlineList() {
        this.setState({
            punchlines: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false
        });
        this.loadPunchlineList();
    }

    handleDelete(punchlineId) {
        deletePunchline(punchlineId);
        this.refreshPunchlineList();
    }

    handleSort(value) {
        this.setState({
            punchlines: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: true,
            sort: value
        }, ()=>{this.loadPunchlineList()})
    }

    render() {
        const punchlineViews = [];
        this.state.punchlines.forEach((punchline, punchlineIndex) => {
            punchlineViews.push(<Punchline 
                handleDelete={this.handleDelete} 
                currentUser={this.props.currentUser}
                key={punchline.id}
                punchline={punchline}
                username={this.props.username}/>
            )
        })

        if(this.state.isLoading) {
            return <LoadingIndicator/>
        }

        return (
            <div className="polls-container">
                <div className="filters">
                    <div className="single-filter">
                        <label>Sort by:</label> <Select style={{width: 150}} value={this.state.sort} onChange={this.handleSort}>
                            <Option value="newest">Newest</Option>
                            <Option value="most_laughs">Most Laughs</Option>
                        </Select>
                    </div>
                </div>
                {punchlineViews}
                {
                    !this.state.isLoading && this.state.punchlines.length === 0 ? (
                        <div className="no-polls-found">
                            <span>No Punchlines Found.</span>
                        </div>
                    ): null
                }
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-polls">
                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                <Icon type="plus" /> Load more
                            </Button>
                        </div>
                    ): null
                }
            </div>
        )
    }
}

export default PunchlineList;