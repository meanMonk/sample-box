import React,{Component} from 'react'
import './inputSearch.css';
var FAILURE_COEFF = 10;
var MAX_SERVER_LATENCY = 200;

function getRandomBool(n) {
    var maxRandomCoeff = 1000;
    if(n > maxRandomCoeff) n = maxRandomCoeff;
    return Math.floor(Math.random() * maxRandomCoeff) % n === 0;
}

function getSuggestions(text) {
    var pre = 'pre';
    var post = 'post';
    var results = [];
    if(getRandomBool(2)) {
        results.push(pre + text);
    }
    // if (getRandomBool(1)) {
    results.push(text);
    // }
    if(getRandomBool(2)) {
        results.push(text + post);
    }
    if(getRandomBool(2)) {
        results.push(pre + text + post);
    }
    return new Promise((resolve,reject) => {
        var randomTimeout = Math.random() * MAX_SERVER_LATENCY;
        setTimeout(() => {
            if(getRandomBool(FAILURE_COEFF)) {
                reject();
            } else {
                resolve(results);
            }
        },randomTimeout);
    });
}


function debounce(callBack,wait) {
    let timeOut;
    return function funExecuted(...args) {
        const execute = () => {
            timeOut = null;
            callBack(...args);
        }
        clearTimeout(timeOut);
        timeOut = setTimeout(execute,wait);
    }
}

function throttle(callBack,wait) {
    let inThrottle;
    return function funExecuted(...args) {
        if(!inThrottle) {
            callBack(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false,wait);
        }
    }
}

export default class InputSearch extends Component {

    state = {
        searchTerm: '',
        searchResults: [1,2,3,4,5],
        isError: false,
        isSearching: false,
    }

    constructor(props) {
        super(props);
        this.autoCompleteDebounce = debounce(this.makeServiceCall,200);
        this.autoCompleteThrottle = throttle(this.makeServiceCall,100);
        this.latestQuery = '';
        this.queryCache = {}
    }

    onInputChange = (e) => {
        this.setState({
            searchTerm: e.target.value,
        },() => {
            if(this.state.searchTerm.length < 5 || this.state.searchTerm.endsWith(' ')) {
                this.autoCompleteThrottle(this.state.searchTerm);
            } else {
                this.autoCompleteDebounce(this.state.searchTerm);
            }
        });
    }
    clearSearch = () => {
        this.setState({
            searchTerm: '',
            searchResults: []
        })
    }

    makeServiceCall = (q) => {
        this.setState({
            ...this.state,
            isSearching: true
        });
        const cached = this.queryCache[q];
        if(!!cached) {
            console.log(`from cached it's loading`);
            Promise.resolve(cached).then((result) => {
                this.setState({
                    ...this.state,
                    searchResults: result,
                    isError: false,
                    isSearching: false,
                })
            });
        } else {
            console.log('making api call');
            this.latestQuery = q;
            getSuggestions(q).then((result) => {
                console.log('results form api',result);
                if(this.latestQuery == q) {
                    this.queryCache[q] = result;
                    this.setState({
                        ...this.state,
                        searchResults: result,
                        isError: false,
                        isSearching: false,
                    })
                }
            }).catch((error) => {
                console.log('something worng',error);
                this.setState({
                    ...this.state,
                    searchResults: [],
                    isError: true
                })
            })
        }
    }


    render() {
        return (
            <div className="container">
                <div className="mx-auto my-5 d-flex justify-content-center align-items-center position-relative">
                    <input type="text" className="form-control"
                        placeholder="Search by name..."
                        value={this.state.searchTerm}
                        onChange={this.onInputChange} />
                    <span onClick={this.clearSearch} className={`form-clear ${!this.state.searchTerm.length ? 'd-none' : ''}`}>
                        <i className="material-icons">clear</i>
                    </span>
                </div>
                <div className="search-result rounded w-100">
                    <ul className="list-group text-left">
                        {
                            this.state.isSearching ?
                                (<li className="list-group-item my-1 py-2 rounded">loading ....</li>)
                                :
                                !this.state.isError ?
                                    this.state.searchResults && Array.isArray(this.state.searchResults) && this.state.searchResults.length > 0 ?
                                        this.state.searchResults.map((item,i) => {
                                            return (<li className="list-group-item my-1 py-2 rounded" key={item + i}>{item}</li>)
                                        }) : <li className="lsit-group-item">No result found, Please search something !</li>
                                    :
                                    (<li className="list-group-item text-danger">Something went wrong!!</li>)}
                    </ul>
                </div>
            </div>
        )
    }
}
