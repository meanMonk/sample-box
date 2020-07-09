import React,{Component} from 'react';

function getRandomBool(n) {
    var maxRandomCoeff = 1000;
    if(n > maxRandomCoeff) n = maxRandomCoeff;
    return Math.floor(Math.random() * maxRandomCoeff) % n === 0;
}
//api to fetch a single article
function getArticle(articleId) {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            if(getRandomBool(10)) {
                reject(`Failed article ${articleId}`);
            } else {
                resolve(`Resolved article ${articleId}`);
                // console.log('resolving article',articleId);
            }
        },Math.random() * 1000);
    });
}

function getArticleIds(page) {
    let ids = [];
    const pageSize = 10;
    for(let i = 0; i < pageSize; i++) {
        ids.push(page * pageSize + i);
    }
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(ids);
        },Math.random() * 1000);
    });
}



export default class ArticlePage extends Component {

    state = {
        articleIdList: [],
        articleDetailsList: [],
        isError: false,
        cache: {}
    }

    componentDidMount() {
        this.loadArticles(0);
    }

    loadArticles = async (page) => {
        try {
            const articleIds = await getArticleIds(page);
            if(articleIds && articleIds.length > 0) {
                this.setState({
                    ...this.state,
                    articleIdList: articleIds,
                    isError: false,
                });
            } else {
                throw new Error('No article found');
            }
        } catch(error) {
            console.log('error',error);
            this.setState({
                ...this.state,
                isError: true,
                errorText: error.message
            });
        }
    }


    cache = {}

    onResolveUpdateCache = (articleId,article) => {
        this.setState({
            ...this.state,
            cache: {
                ...this.state.cache,
                [articleId]: article
            }
        })
    }


    render() {
        return (
            <div className="article-container row">
                {!!this.state.isError ?
                    (<div className="w-100">
                        <p className="text-danger">Something went wrong!</p>
                    </div>)
                    :
                    !!this.state.articleIdList && Array.isArray(this.state.articleIdList)
                        && this.state.articleIdList.length > 0 ?
                        this.state.articleIdList.map((articleId,i) => {
                            return <div className="col-md-3" key={articleId + i}>
                                <ArticleItem
                                    articleId={articleId}
                                    cache={this.state.cache}
                                    onResolveUpdateCache={this.onResolveUpdateCache}
                                />
                            </div>
                        }) : <div className="col-12 d-flex justify-content-center align-items-center">
                            <p className="text-warning">No result found!!</p>
                        </div>
                }
            </div>
        )
    }
}



class ArticleItem extends Component {

    state = {
        articleDetails: '',
        isError: false,
    }

    componentDidMount() {
        this.loadArticleDetail(this.props.articleId);
    }

    loadArticleDetail = async (artId) => {
        try {
            const article = await getArticle(artId);
            if(!!article) {
                console.log(article);
                //  update the disctionary with article and it's id.
                // used for purpose of checking wether it's already rendered or not.
                this.props.onResolveUpdateCache(artId,article);
            } else {
                throw new Error('No found');
            }
        } catch(error) {
            console.log('ERROR: getArticle(artId)',error);
            this.setState({
                ...this.state,
                isError: true
            })
        }
    }

    render() {
        const {articleId,cache} = this.props;
        console.log('props = cache',cache);
        // 
        //  We will show the article if it's previous article available in disctionary
        // 
        const prevArticle = articleId > 0 ? articleId - 1 : articleId;
        if(!this.props.cache[prevArticle]) {
            return <></>;
        }
        return (
            <div>
                {cache[this.props.articleId]}
            </div>
        )
    }
}
