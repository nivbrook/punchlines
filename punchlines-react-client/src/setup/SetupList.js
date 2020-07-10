import React, { Component } from 'react';
import { getAllSetups, getUserCreatedSetups } from '../util/APIUtils';
import Setup from './Setup';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Select, Button, Icon } from 'antd';
import { SETUP_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './SetupList.css';

const { Option } = Select;

class SetupList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setups: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false,
            category: "all",
            sort: "newest"
        };
        this.loadSetupList = this.loadSetupList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.handleCategory = this.handleCategory.bind(this);
        this.handleSort = this.handleSort.bind(this);
    }

    loadSetupList(page = 0, size = SETUP_LIST_SIZE) {
        let promise;
        if(this.props.username) {
            promise = getUserCreatedSetups(this.props.username, page, size, this.state.category, this.state.sort)
        } else {
            promise = getAllSetups(page, size, this.state.category, this.state.sort);
        }

        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise
        .then(response => {
            const setups = this.state.setups.slice();
            
            this.setState({
                setups: setups.concat(response.content),
                page: response.page,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                last: response.last,
                isLoading: false
            })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });
    }

    componentDidMount() {
        this.loadSetupList();
    }

    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            // Reset State
            this.setState({
                setups: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                isLoading: false
            });    
            this.loadSetupList();
        }
    }

    handleLoadMore() {
        this.loadSetupList(this.state.page + 1);
    }

    handleCategory(value) {
        this.setState({
            setups: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false,
            category: value,
            sort: this.state.sort,
        }, ()=> {this.loadSetupList()})
    }
    handleSort(value) {
        this.setState({
            setups: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false,
            category: this.state.category,
            sort: value,
        }, ()=> {this.loadSetupList()})
    } 

    render() {
        const setupViews = [];
        this.state.setups.forEach((setup, setupIndex) => {
            setupViews.push(<Setup
                currentUser={this.props.currentUser}
                key={setup.id}
                setup = {setup}/>)
        });
        return (
            <div className="polls-container">
                <div className="filters">
                    <div className="single-filter">
                        <label>Category:</label> <Select style={{width: 120}} value={this.state.category} onChange={this.handleCategory}>
                            <Option value="all">All</Option>
                            <Option value="Jokes">Jokes</Option>
                            <Option value="In the News">In the News</Option>
                            <Option value="Premises">Premises</Option>
                        </Select>  
                    </div>
                    <div className="single-filter">
                        <label>Sort by:</label> <Select style={{width: 150}} value={this.state.sort} onChange={this.handleSort}>
                            <Option value="newest">Newest</Option>
                            <Option value="most_laughs">Most Laughs</Option>
                        </Select>
                    </div>
                </div>
                {setupViews}
                {
                    !this.state.isLoading && this.state.setups.length === 0 ? (
                        <div className="no-polls-found">
                            {this.props.isAuthenticated ? <span>No Setups Found.</span> : <span>Please <a href="/login">Login</a> or <a href="/signup">Signup</a></span>}
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
                {
                    this.state.isLoading ?
                    <LoadingIndicator />: null
                }
            </div>
        )
    }
}

export default withRouter(SetupList)