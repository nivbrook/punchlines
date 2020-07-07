import React, { Component } from 'react';
import { getAllSetups } from '../util/APIUtils';
import Setup from './Setup';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Button, Icon, notification } from 'antd';
import { SETUP_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './SetupList.css';

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
            isLoading: false
        };
        this.loadSetupList = this.loadSetupList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadSetupList(page = 0, size = SETUP_LIST_SIZE) {
        let promise;
        //Later add user created Setups;

        promise = getAllSetups(page, size);

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
        console.log("Mounted")
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
                {setupViews}
                {
                    !this.state.isLoading && this.state.setups.length === 0 ? (
                        <div className="no-polls-found">
                            <span>No Setups Found.</span>
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