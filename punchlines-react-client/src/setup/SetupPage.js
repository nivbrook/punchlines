import React, { Component } from 'react';
import './SetupPage.css';
import { SETUP_LIST_SIZE } from '../constants';
import { getSetupById, getPunchlinesBySetupId, deletePunchline } from '../util/APIUtils';
import { Select, Button, Icon } from 'antd';
import Setup from './Setup';
import Punchline from './Punchline'
import { withRouter } from 'react-router-dom';
import LoadingIndicator from '../common/LoadingIndicator';

const { Option } = Select;

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
            isLoading: true,
            sort: "newest"
        };
        this.loadSetupAndPunchlineList = this.loadSetupAndPunchlineList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
        this.refreshPunchlineList = this.refreshPunchlineList.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSort = this.handleSort.bind(this);
    }

    loadSetupAndPunchlineList(setupId, page = 0, size = SETUP_LIST_SIZE) {

        getSetupById(setupId).then( response => {
            this.setState({
                setup: response,
                isLoading: false
            })
            getPunchlinesBySetupId(page, size, setupId, this.state.sort).then( response => {
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
        }, ()=>{this.loadSetupAndPunchlineList(this.props.match.params.setupId)})
    }

    render() {
        const punchlineViews = [];
        this.state.punchlines.forEach((punchline, punchlineIndex) => {
            punchlineViews.push(<Punchline handleDelete={this.handleDelete} currentUser= {this.props.currentUser} key={punchline.id} punchline = {punchline}/>)
        })
        if(this.state.isLoading) {
            return <LoadingIndicator/>
        }
        return (
            <div className="polls-container">
                <Setup currentUser= {this.props.currentUser} setup= {this.state.setup} refreshPunchlineList={this.refreshPunchlineList}/>
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
                {
                    this.state.isLoading ?
                    <LoadingIndicator />: null
                }
            </div>
        )
    }
}

export default withRouter(SetupPage)