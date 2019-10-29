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
                let result = response.map(category => ({
                    id: category.id,
                    name: category.name
                }));
                this.setState({allCategories: result});
                document.body.style.cursor = 'default';
            });
    };

    fetchAndSetCategoryTrees = () => {
        document.body.style.cursor = 'wait';
        return api.fetch(
            api.endpoints.getCategoryTrees(),
            (response) => {
                this.setState({categories: response});
                document.body.style.cursor = 'default';
                if (Array.isArray(response) && response.length) {
                    let initialSelectedCategoryId = response[0].category.id;
                    this.setState({
                        selectedCategoryId: initialSelectedCategoryId,
                        initialSelectedCategoryId: initialSelectedCategoryId
                    });
                }
            });
    };

    fetchAndSetCategoryAttributesValues() {
        document.body.style.cursor = 'wait';
        api.fetch(
            api.endpoints.getCategoryAttributesValues(this.state.selectedCategoryId, true),
            (response) => {
                this.setState({selectedCategoryAttributesValues: response});
                document.body.style.cursor = 'default';
            });
    };

    fetchAndSetAllAssets() {
        document.body.style.cursor = 'wait';
        api.fetch(
            api.endpoints.getAllAssets(),
            (response) => {
                this.setState({filteredAssets: response});
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
            .then(() => this.fetchAndSetCategoryAttributesValues());
        this.fetchAndSetAllAssets();
        this.fetchAndSetAllCategories();
    }

    handleFiltersChange = () => {
        this.setState({filteredAssets: null});
        this.fetchAndSetFilteredAssets(this.state.selectedCategoryId, this.state.filters);
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
                    <Paper className={classes.paper} elevation={4}>
                        <div className={classes.categoryTreeSection}>
                            <CategoriesTree
                                categories={this.state.categories !== null ? this.state.categories.map(c => ({
                                    category: c.category,
                                    subCategories: c.subCategories,
                                })) : this.state.categories}
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
                    <Paper className={classes.paper} elevation={4}>
                        <Assets
                            assets={this.state.filteredAssets}
                            allCategories={this.state.allCategories}
                            filters={this.state.filters}
                            categoryAttributes={this.state.selectedCategoryAttributesValues !== null ?
                                Object.keys(this.state.selectedCategoryAttributesValues)
                                    .filter(attribute => attribute !== Constants.NAME_KEY)
                                : null
                            }
                            overviewCallback={this.handleFiltersChange}
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