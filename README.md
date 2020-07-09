This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## inupt text autocomplete smart search with showing results from api
## Unit test cases which has to be passed.
- [x] Input field should make call to api on every input change
- [x] should show the list as suggestion to user
- [x] should have option to clear the entered text on signle click
- [x] should show the loader while getting response from backend
- [x] should show the error message if api fails.
- [x] If user enters few chars then make call immediately and get result.
- [x] If user continuousy typing without worrying about suggest so let them finish and then make call to api to avoid performance or unecessory backend server load.
- [x] All 3 xhr are async so might be unpredictable order so we need to only show the latest query result
- [x] Caching is good idea to show the result if user enters back space rather than making new call to api
- [x] Watch for empty spaces and make call to throttle to give response.
- [ ] We can also provide result like how google gives from service for few words before completion of whole sentence or else give whole search results.

```
    {
        term: 'q',
        count: 123
    },
    {
        term: 'que',
        count: 30
    }
```

```
    {
        term: 'qquery is going to run the code',
        url: 'https://google.com/to-api'
    }
```