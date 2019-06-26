const host = "localhost";
const port = 5444;
const url = endpoint => `http://${host}:${port}/${endpoint}`;

export default {
    fetch: (opt, action) => {
        fetch(opt.path, {
            method: opt.method,
            body: opt.body,
            headers: opt.headers,
            credentials: 'include'
        })
            .then(res => res.json())
            .then(response => {
                action(response);
            });
    },
    fetchString: (opt, action) => {
        fetch(opt.path, {
            method: opt.method,
            body: opt.body,
            headers: opt.headers,
            credentials: 'include'
        })
            .then(res => res.text())
            .then(response => {
                action(response);
            });
    },
    fetchNoContent: (opt, action) => {
        fetch(opt.path, {
            method: opt.method,
            body: opt.body,
            headers: opt.headers,
            credentials: 'include'
        }).then(response => {
            action(response);
        });
    },
    fetchHandleError: (opt, action, errorCallback) => {
        fetch(opt.path, {
            method: opt.method,
            body: opt.body,
            headers: opt.headers,
            credentials: 'include'
        })
            .then(res => res.json())
            .then(response => {
                action(response);
            })
            .catch(errorCallback);
    },
    endpoints: {
        getGreeting: () => ({
            path: url(`greeting`),
            method: "GET"
        }),

        getCategories: categoryId => ({
            path: url(`categories`),
            method: "GET"
        }),

    }
}