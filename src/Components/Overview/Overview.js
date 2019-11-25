import React from 'react';
import * as PropTypes from "prop-types";
import {withStyles} from '@material-ui/core/styles/index';
import styles from "./Overview.styles";
import api from "../../api";
import Filters from "./Filters/Filters";
import CategoriesTree from "./CategoriesTree/CategoriesTree";
import Paper from "@material-ui/core/Paper";
import Assets from "./Assets/Assets";
import * as Constants from "../../Constants/Constants";
import {CATEGORY_KEY, NAME_KEY} from "../../Constants/Constants";

export function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

class Overview extends React.Component {

    state = {
        greetings: "",
        allCategories: null,
        categories: null,
        selectedCategoryId: null,
        initialSelectedCategoryId: null,
        selectedCategoryAttributesValues: null,
        filteredAssets: null,
        filters: {},
    };

    fetchAndSetAllCategories() {
        document.body.style.cursor = 'wait';
        api.fetch(
            api.endpoints.getAllCategories(),
            (response) => {
                if (response.status !== 500) {
                    let result = response.map(category => ({
                        id: category.id,
                        name: category.name,
                        parentCategoryId: category.parentCategoryId
                    }));
                    this.setState({allCategories: result});
                    document.body.style.cursor = 'default';
                }
            });
    };

    fetchAndSetCategoryTrees = () => {
        document.body.style.cursor = 'wait';
        return api.fetch(
            api.endpoints.getCategoryTrees(),
            (response) => {
                if (response.status !== 500) {
                    this.setState({categories: response});
                    document.body.style.cursor = 'default';
                    if (Array.isArray(response) && response.length) {
                        let initialSelectedCategoryId = response[0].category.id;
                        this.setState({
                            selectedCategoryId: initialSelectedCategoryId,
                            initialSelectedCategoryId: initialSelectedCategoryId
                        });
                    }
                }
            });
    };

    fetchAndSetCategoryAttributesValues = () => {
        document.body.style.cursor = 'wait';
        return api.fetch(
            api.endpoints.getCategoryAttributesValues(this.state.selectedCategoryId, true),
            (response) => {
                this.setState({selectedCategoryAttributesValues: response});
                document.body.style.cursor = 'default';
            });
    };

    fetchAndSetFilteredAssets() {
        let filters = this.state.filters;
        if (Object.keys(filters).length !== 0) {
            filters = Object.keys(filters).reduce((result, key) => {
                result[key] = this.state.filters[key].map((filter) => {
                    return filter.id
                });
                return result
            }, {});
        }
        this.fetchAndSetFilteredAssetsByFilters(filters);
    }

    fetchAndSetFilteredAssetsByFilters(filters) {
        const data = {
            mainCategoryId: this.state.selectedCategoryId,
            filters: filters
        };
        api.fetch(
            api.endpoints.getFilteredAssets(data),
            (assets) => {
                this.setState({filteredAssets: assets});
            }
        );
    }

    componentDidMount() {
        this.fetchAndSetCategoryTrees()
            .then(() => {
                this.fetchAndSetCategoryAttributesValues();
                this.fetchAndSetFilteredAssets();
            });
        this.fetchAndSetAllCategories();
    }

    handleFiltersChange = () => {
        this.setState({filteredAssets: null});
        this.fetchAndSetFilteredAssets();
    };

    handleUpdateAsset = (updatedAttribute) => {
        let attributeName = Object.keys(updatedAttribute)[0];
        let newAttributeValue = {
            id: updatedAttribute[attributeName],
            label: updatedAttribute[attributeName]
        };
        sleep(1000).then(() => {
            this.fetchAndSetCategoryAttributesValues().then(() => {
                let filters = this.state.filters;
                if (Object.keys(filters).length !== 0 && filters[attributeName]) {
                    const filterAllowedValues = this.state.selectedCategoryAttributesValues[attributeName];

                    const isNewValueInFiltersAlready = filters[attributeName].some((value) => {
                            return JSON.stringify(value) === JSON.stringify(newAttributeValue)
                        }
                    );
                    const isOldValueInvalid = filters[attributeName].some((value) => {
                            return !filterAllowedValues.includes(value.label)
                        }
                    );

                    if (isNewValueInFiltersAlready) {
                        if (isOldValueInvalid) {
                            const valueToChange = filters[attributeName].find((value) =>
                                !filterAllowedValues.includes(value.label)
                            );
                            const indexToChange = filters[attributeName].indexOf(valueToChange);
                            filters[attributeName].splice(indexToChange, 1);
                            if (filters[attributeName].length === 0) {
                                delete filters[attributeName];
                            }
                        }
                    } else {
                        if (isOldValueInvalid) {
                            const valueToChange = filters[attributeName].find((value) =>
                                !filterAllowedValues.includes(value.label)
                            );
                            const indexToChange = filters[attributeName].indexOf(valueToChange);
                            filters[attributeName][indexToChange] = newAttributeValue
                        } else {
                            filters[attributeName].push(newAttributeValue)
                        }
                    }
                }
                this.setState({filters: filters});
            });
        });
    };

    handleRedirectToRelatedAsset = (categoryId, assetId) => {
        this.setState({selectedCategoryAttributesValues: null, filteredAssets: null});
        this.setState({selectedCategoryId: categoryId, initialSelectedCategoryId: categoryId, filters: {}}, () => {
            this.fetchAndSetCategoryAttributesValues();
            let filter = {
                id: Array.of(assetId)
            };
            this.fetchAndSetFilteredAssetsByFilters(filter);
        });
    };

    handleDeleteAsset = () => {
        this.setState({filteredAssets: null});
        sleep(1000).then(() => {
            this.fetchAndSetCategoryAttributesValues().then(() => {
                let filters = this.state.filters;
                if (Object.keys(filters).length !== 0) {
                    Object.keys(filters).filter(key => key !== CATEGORY_KEY && key !== NAME_KEY)
                        .forEach(key => {
                            let filterAllowedValues = this.state.selectedCategoryAttributesValues[key];
                            let valuesToDelete = Object.keys(filters[key])
                                .filter((value) =>
                                    !filterAllowedValues.includes(filters[key][value].label)
                                );
                            valuesToDelete.forEach(value => {
                                filters[key].splice(value, 1);
                                if (filters[key].length === 0) {
                                    delete filters[key];
                                }
                            });
                        });
                }
                this.setState({filters: filters});
            });
            this.fetchAndSetFilteredAssets();
        });
    };

    handleCategoryChange = (selectedCategoryId) => {
        this.setState({selectedCategoryAttributesValues: null, filteredAssets: null});
        this.setState({selectedCategoryId: selectedCategoryId, filters: {}}, () => {
            this.fetchAndSetCategoryAttributesValues();
            this.fetchAndSetFilteredAssets();
        });
    };

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.content}>
                <div className={classes.sideBarSection}>
                    <Paper className={classes.sideBarPaper} elevation={4}>
                        <div className={classes.categoryTreeSection}>
                            <CategoriesTree
                                categories={this.state.categories !== null ? this.state.categories.map(c => ({
                                    category: c.category,
                                    subCategories: c.subCategories,
                                })) : this.state.categories}
                                selectedCategoryId={this.state.selectedCategoryId}
                                allCategories={this.state.allCategories}
                                categoryChangeCallback={this.handleCategoryChange}
                                initialSelectedCategoryId={this.state.initialSelectedCategoryId}
                            />
                        </div>
                        <div className={classes.filtersSection}>
                            <Filters
                                categoryAttributesValues={this.state.selectedCategoryAttributesValues}
                                filters={this.state.filters}
                                selectedCategoryId={this.state.selectedCategoryId}
                                allCategories={this.state.categories !== null ? this.state.categories.map(c => ({
                                    category: c.category,
                                    subCategories: c.subCategories,
                                })) : this.state.categories}
                                overviewCallback={this.handleFiltersChange}
                            />
                        </div>
                    </Paper>
                </div>
                <div className={classes.assetsSection}>
                    <Paper className={classes.assetsPaper} elevation={4}>
                        <Assets
                            assets={this.state.filteredAssets}
                            categories={this.state.categories}
                            allCategories={this.state.allCategories}
                            filters={this.state.filters}
                            categoryAttributes={this.state.selectedCategoryAttributesValues !== null ?
                                Object.keys(this.state.selectedCategoryAttributesValues)
                                    .filter(attribute => attribute !== Constants.NAME_KEY)
                                : null
                            }
                            overviewFiltersCallback={this.handleFiltersChange}
                            overviewUpdateAssetCallback={this.handleUpdateAsset}
                            overviewRedirectAssetCallback={this.handleRedirectToRelatedAsset}
                            overviewDeleteAssetCallback={this.handleDeleteAsset}
                        />
                    </Paper>
                </div>
            </div>
        );
    }
}

Overview.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Overview)