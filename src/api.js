const host = "stormy-stream-15739.herokuapp.com";
const port = "";
const url = endpoint => `https://${host}:${port}/${endpoint}`;

export default {
    fetch: (opt, action) => {
        return fetch(opt.path, {
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
    fetchDelete: (opt, action) => {
        fetch(opt.path, {
            method: opt.method,
            body: opt.body,
            headers: opt.headers,
            credentials: 'include'
        })
            .then(response => {
                action(response);
            });
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

        getCategoryAttributesValues: (categoryId, withSubcategories) => {
            let path = new URL(url(`categories/${categoryId}/attributes/values`));
            if (withSubcategories) {
                path.searchParams.append("withSubcategories", withSubcategories);
            }
            return {
                path: path,
                method: "GET"
            }
        },

        getCategoryTrees: () => ({
            path: url(`categories/trees`),
            method: "GET"
        }),

        getAllAssets: () => ({
            path: url(`assets`),
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
        deleteAsset: (assetId) => ({
            path: url(`assets/${assetId}`),
            method: "DELETE"
        })
    }
}