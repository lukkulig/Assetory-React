import React from 'react';
import * as PropTypes from "prop-types";
import {withStyles} from '@material-ui/core/styles/index';
import styles from "./Overview.styles";
import api from "../api";
import Filters from "./Filters";
import CategoriesTree from "./CategoriesTree";
import Paper from "@material-ui/core/Paper";
import Assets from "./Assets";

class Overview extends React.Component {

    state = {
        greetings: "",
        allCategories: [],
        categories: [],
        selectedCategoryId: "",
        selectedCategoryAttributes: [],
        assets: [],
        filters: {},
    };

    fetchAndSetAllCategories() {
        document.body.style.cursor = 'wait';
        api.fetch(
            api.endpoints.getAllCategories(),
            (response) => {
                this.setState({allCategories: response.content});
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
            });
    }

    fetchAndSetCategoryAttributes(selectedCategoryId) {
        document.body.style.cursor = 'wait';
        api.fetch(
            api.endpoints.getCategoryAttributes(selectedCategoryId),
            (response) => {
                this.setState({selectedCategoryAttributes: response.reverse()});
                document.body.style.cursor = 'default';

            });

    }

    fetchAndSetAllAssets() {
        document.body.style.cursor = 'wait';
        api.fetch(
            api.endpoints.getAllAssets(),
            (response) => {
                this.setState({assets: response.content});
                document.body.style.cursor = 'default';
            });
    }

    fetchAndSetFilteredAssets(selectedCategoryId) {
        const data = {
            mainCategoryId: selectedCategoryId,
            filters: this.state.filters
        };
        api.fetch(
            api.endpoints.getFilteredAssets(data),
            (assets) => {
                this.setState({assets: assets.content});
            }
        );
    }


    componentDidMount() {
        this.fetchAndSetAllCategories();
        this.fetchAndSetCategoryTrees();
        this.fetchAndSetAllAssets();
        this.setState({selectedCategoryId: (this.state.categories[0] !== undefined) ? this.state.categories[0].id : ""});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    isCategorySelected() {
        return (this.state.selectedCategoryId !== "");
    }

    handleFiltersChange = () => {
        this.fetchAndSetFilteredAssets(this.state.selectedCategoryId);
    };

    handleCategoryChange = (selectedCategoryId) => {
        this.setState({selectedCategoryId: selectedCategoryId});
        this.fetchAndSetCategoryAttributes(selectedCategoryId);
        this.fetchAndSetFilteredAssets(selectedCategoryId);
    };

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <div className={classes.categoriesTreeSection}>
                        <Paper className={classes.paper}>
                            <CategoriesTree
                                categories={this.state.categories.map(c => ({
                                    category: c.category,
                                    subCategories: c.subCategories,
                                }))}
                                categoryChangeCallback={this.handleCategoryChange}
                                selectedCategoryId={this.state.selectedCategoryId}
                            />
                        </Paper>
                    </div>
                    <div className={classes.assetsSection}>
                        {this.isCategorySelected() &&
                        <div className={classes.filtersSection}>
                            <Paper className={classes.paper}>
                                <Filters
                                    categoryAttributes={this.state.selectedCategoryAttributes}
                                    filters={this.state.filters}
                                    overviewCallback={this.handleFiltersChange}
                                />
                            </Paper>
                        </div>
                        }
                        {this.state.allCategories.length !== 0 &&
                        <div className={classes.assetsViewSection}>
                            <Paper className={classes.paper}>
                                <Assets
                                    assets={this.state.assets}
                                    allCategories={this.state.allCategories}
                                />
                            </Paper>
                        </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

Overview.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Overview)