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
    // fetchString: (opt, action) => {
    //     fetch(opt.path, {
    //         method: opt.method,
    //         body: opt.body,
    //         headers: opt.headers,
    //         credentials: 'include'
    //     })
    //         .then(res => res.text())
    //         .then(response => {
    //             action(response);
    //         });
    // },
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
        getAllCategories: () => ({
            path: url(`categories`),
            method: "GET"
        }),
        addAsset: (asset) => ({
            path: url(`assets`),
            method: "POST",
            body: JSON.stringify(asset),
            headers: {
                "Content-Type": "application/json"
            }
        }),
        getCategoryAttributes: (categoryId) => ({
            path: url(`categories/${categoryId}/attributes`),
            method: "GET"
        }),

        getCategoryAttributesValues: (categoryId) => ({
            path: url(`categories/${categoryId}/attributes/values`),
            method: "GET"
        }),

        getCategoryTrees: () => ({
            path: url(`categories/trees`),
            method: "GET"
        }),

        getAllAssets: () => ({
            path: url(`assets`),
            method: "GET"
        }),

        getAssetByName: (name) => ({
            path: url(`assets/name/${name}`),
            method: "GET"
        }),

        getFilteredAssets: (assetsFilter) => ({
            path: url(`assets/filter`),
            method: "POST",
            body: JSON.stringify(assetsFilter),
            headers: {
                "Content-Type": "application/json"
            }
        }),

        addCategory: (category) => ({
            path: url(`categories`),
            method: "POST",
            body: JSON.stringify(category),
            headers: {
                "Content-Type": "application/json"
            }
        }),

        updateCategory: (category) => ({
            path: url(`categories`),
            method: "PUT",
            body: JSON.stringify(category),
            headers: {
                "Content-Type": "application/json"
            }
        }),

        deleteCategory: (categoryId) => ({
            path: url(`categories/${categoryId}`),
            method: "DELETE"
        }),

        deleteCategoryWithContent: (categoryId) => ({
            path: url(`categories/${categoryId}/with-content`),
            method: "DELETE"
        }),
    }
}