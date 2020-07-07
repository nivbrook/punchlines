import React, { Component } from 'react';
import './SetupPage.css';
import { SETUP_LIST_SIZE } from '../constants';
import { getSetupById, getPunchlinesBySetupId } from '../util/APIUtils';
import { Button, Icon, notification } from 'antd';
import Setup from './Setup';
import Punchline from './Punchline'
import { withRouter } from 'react-router-dom';
import LoadingIndicator from '../common/LoadingIndicator';

class SetupPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            setup: null,
            punchlines: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: true
        };
        this.loadSetupAndPunchlineList = this.loadSetupAndPunchlineList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.refreshPunchlineList = this.refreshPunchlineList.bind(this);
    }

    loadSetupAndPunchlineList(setupId, page = 0, size = SETUP_LIST_SIZE) {

        getSetupById(setupId).then( response => {
            this.setState({
                setup: response,
                isLoading: false
            })
            getPunchlinesBySetupId(page, size, setupId).then( response => {
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
        }).catch(error => {
            this.props.history.push("/404");
        })
    }

    componentDidMount() {
        console.log("Test")
        const setupId = this.props.match.params.setupId;
        this.loadSetupAndPunchlineList(setupId);
    }

    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated || this.props.match.params.setupId !== nextProps.match.params.setupId) {
            // Reset State
            this.setState({
                setup: null,
                punchlines: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                isLoading: false
            });    
            this.loadSetupAndPunchlineList(nextProps.match.params.setupId);
        }
    }

    handleLoadMore() {
        this.loadSetupAndPunchlineList(this.state.setup.id, this.state.page + 1);
    }

    refreshPunchlineList() {
        console.log("refreshPunchlineList")
        this.setState({
            punchlines: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false
        });
        this.loadSetupAndPunchlineList(this.state.setup.id);
    }
    render() {
        const punchlineViews = [];
        this.state.punchlines.forEach((punchline, punchlineIndex) => {
            punchlineViews.push(<Punchline key={punchline.id} punchline = {punchline}/>)
        })
        console.log(this.state.setup)
        if(this.state.isLoading) {
            return <LoadingIndicator/>
        }
        return (
            <div className="polls-container">
                <Setup setup= {this.state.setup} refreshPunchlineList={this.refreshPunchlineList}/>
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
                {
                    this.state.isLoading ?
                    <LoadingIndicator />: null
                }
            </div>
        )
    }
}

export default withRouter(SetupPage)