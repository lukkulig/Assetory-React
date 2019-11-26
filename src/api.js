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
    fetchFile: (opt) => {
        return fetch(opt.path, {
            method: opt.method,
            body: opt.body,
            headers: opt.headers,
            credentials: 'include'
        })
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
        getCategoryTrees: () => ({
            path: url(`categories/trees`),
            method: "GET"
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
        getFilteredAssets: (assetsFilter) => ({
            path: url(`assets/filter`),
            method: "POST",
            body: JSON.stringify(assetsFilter),
            headers: {
                "Content-Type": "application/json"
            }
        }),
        getAssetsByIds: (ids) => {
            let path = new URL(url(`assets/ids`));
            path.searchParams.append("ids", ids);
            return {
                path: path,
                method: "GET"
            }
        },
        getAssetsByCategory: (categoryId) => ({
            path: url(`assets/category/${categoryId}`),
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
        updateAssetAttributes: (attributesUpdate) => ({
            path: url(`assets/attributes`),
            method: "PUT",
            body: JSON.stringify(attributesUpdate),
            headers: {
                "Content-Type": "application/json"
            }
        }),
        addRelatedAssets: (assetId, relatedAssetsIds) => {
            let path = new URL(url(`assets/related-assets/${assetId}`));
            path.searchParams.append("relatedAssetsIds", relatedAssetsIds);
            return {
                path: path,
                method: "PUT"
            }
        },
        deleteRelatedAssets: (assetId, relatedAssetsIds) => {
            let path = new URL(url(`assets/related-assets/${assetId}`));
            path.searchParams.append("relatedAssetsIds", relatedAssetsIds);
            return {
                path: path,
                method: "DELETE"
            }
        },
        deleteAsset: (assetId) => ({
            path: url(`assets/${assetId}`),
            method: "DELETE"
        }),
        getReportByComputerIdAndDate: (computerId, date) => ({
            path: url(`info/${computerId}/${date}`),
            method: "GET",
        }),
        getRegisteredComputers: () => ({
            path: url(`info/registered/identifiers`),
            method: "GET",
        }),
        registerComputer: (assetId, computerIdentifier) => ({
            path: url(`assets/${assetId}/computer-info/register`),
            method: "PUT",
            body: JSON.stringify(computerIdentifier),
            headers: {
                "Content-Type": "application/json"
            }
        }),
        disconnectComputer: (assetId) => ({
            path: url(`assets/${assetId}/computer-info/register`),
            method: "DELETE",
        }),
        export: () => ({
            path: url(`export-assets`),
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
}