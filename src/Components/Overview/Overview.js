import React from 'react';
import * as PropTypes from "prop-types";
import {withStyles} from '@material-ui/core/styles/index';
import styles from "./Overview.styles";
import api from "../../api";
import Filters from "./Filters/Filters";
import CategoriesTree from "./CategoriesTree/CategoriesTree";
import Paper from "@material-ui/core/Paper";
import Assets from "./Assets/Assets";

class Overview extends React.Component {

    state = {
        greetings: "",
        allCategories: [],
        categories: [],
        selectedCategoryId: null,
        initialSelectedCategoryId: null,
        selectedCategoryAttributes: null,
        filteredAssets: [],
        filters: {},
    };

    fetchAndSetAllCategories() {
        document.body.style.cursor = 'wait';
        api.fetch(
            api.endpoints.getAllCategories(),
            (response) => {
                let result = response.content.map(category => ({
                    id: category.id,
                    label: category.name
                }));
                this.setState({allCategories: result});
                document.body.style.cursor = 'default';
            });
    }

    fetchAndSetCategoryTrees() {
        document.body.style.cursor = 'wait';
        api.fetch(
            api.endpoints.getCategoryTrees(),
            (response) => {
                this.setState({categories: response});
                document.body.style.cursor = 'default';
                if (Array.isArray(response) && response.length) {
                    let initialSelectedCategoryId = response[0].category.id;
                    this.setState({selectedCategoryId: initialSelectedCategoryId});
                    this.setState({initialSelectedCategoryId: initialSelectedCategoryId});
                }
            });
    }

    fetchAndSetCategoryAttributes(selectedCategoryId) {
        document.body.style.cursor = 'wait';
        api.fetch(
            api.endpoints.getCategoryAttributes(selectedCategoryId),
            (response) => {
                this.setState({selectedCategoryAttributes: response});
                document.body.style.cursor = 'default';
            });
    }

    fetchAndSetAllAssets() {
        document.body.style.cursor = 'wait';
        api.fetch(
            api.endpoints.getAllAssets(),
            (response) => {
                this.setState({filteredAssets: response.content});
                document.body.style.cursor = 'default';
            });
    }

    fetchAndSetFilteredAssets(selectedCategoryId, filters) {
        let filtersReduced = filters;
        if (Object.keys(filters).length !== 0) {
            filtersReduced = Object.keys(filters).reduce((result, key) => {
                result[key] = this.state.filters[key].map((filter) => {
                    return filter.id
                });
                return result
            }, {});
        }
        const data = {
            mainCategoryId: selectedCategoryId,
            filters: filtersReduced
        };
        api.fetch(
            api.endpoints.getFilteredAssets(data),
            (assets) => {
                this.setState({filteredAssets: assets.content});
            }
        );
    }


    componentDidMount() {
        this.fetchAndSetAllCategories();
        this.fetchAndSetCategoryTrees();
        this.fetchAndSetAllAssets();
    }

    handleFiltersChange = () => {
        this.fetchAndSetFilteredAssets(this.state.selectedCategoryId, this.state.filters);
    };

    handleCategoryChange = (selectedCategoryId) => {
        this.setState({selectedCategoryId: selectedCategoryId});
        this.setState({filters: {}});
        this.fetchAndSetCategoryAttributes(selectedCategoryId);
        this.fetchAndSetFilteredAssets(selectedCategoryId, {});
    };

    render() {
        const {classes} = this.props;

        if (this.state.selectedCategoryId !== null && this.state.selectedCategoryAttributes === null) {
            this.fetchAndSetCategoryAttributes(this.state.selectedCategoryId);
        }
        return (
            (this.state.selectedCategoryAttributes !== null &&
                <div className={classes.content}>
                    <div className={classes.sideBarSection}>
                        <Paper className={classes.paper} elevation={4}>
                            {this.state.initialSelectedCategoryId !== null &&
                            <div className={classes.categoryTreeSection}>
                                <CategoriesTree
                                    categories={this.state.categories.map(c => ({
                                        category: c.category,
                                        subCategories: c.subCategories,
                                    }))}
                                    categoryChangeCallback={this.handleCategoryChange}
                                    initialSelectedCategoryId={this.state.initialSelectedCategoryId}
                                />
                            </div>
                            }
                            {this.state.selectedCategoryId !== null &&
                            <div className={classes.filtersSection}>
                                <Filters
                                    categoryAttributes={this.state.selectedCategoryAttributes}
                                    filters={this.state.filters}
                                    assets={this.state.filteredAssets}
                                    allCategories={this.state.allCategories}
                                    selectedCategoryId={this.state.selectedCategoryId}
                                    overviewCallback={this.handleFiltersChange}
                                />
                            </div>
                            }
                        </Paper>
                    </div>
                    <div className={classes.assetsSection}>
                        {this.state.allCategories.length !== 0 &&
                        <Paper className={classes.paper} elevation={4}>
                            <Assets
                                assets={this.state.filteredAssets}
                                allCategories={this.state.allCategories}
                                filters={this.state.filters}
                                categoryAttributes={this.state.selectedCategoryAttributes}
                                overviewCallback={this.handleFiltersChange}
                            />
                        </Paper>
                        }
                    </div>
                </div>
            )
        );
    }
}

Overview.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Overview)