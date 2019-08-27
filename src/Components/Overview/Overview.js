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
        selectedCategoryId: "",
        selectedCategoryAttributes: [],
        allAssets: [],
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
                this.setState({allAssets: response.content});
                this.setState({filteredAssets: response.content});
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
                this.setState({filteredAssets: assets.content});
            }
        );
    }


    componentDidMount() {
        this.fetchAndSetAllCategories();
        this.fetchAndSetCategoryTrees();
        this.fetchAndSetAllAssets();
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
            <div className={classes.content}>
                <div className={classes.sideBarSection}>
                    <Paper className={classes.paper} elevation={4}>
                        <div className={classes.categoryTreeSection}>
                            <CategoriesTree
                                categories={this.state.categories.map(c => ({
                                    category: c.category,
                                    subCategories: c.subCategories,
                                }))}
                                categoryChangeCallback={this.handleCategoryChange}
                                selectedCategoryId={this.state.selectedCategoryId}
                            />
                        </div>
                        {this.isCategorySelected() &&
                        <div className={classes.filtersSection}>
                            <Filters
                                categoryAttributes={this.state.selectedCategoryAttributes}
                                filters={this.state.filters}
                                assets={this.state.allAssets}
                                allCategories={this.state.allCategories}
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
                            overviewCallback={this.handleFiltersChange}
                        />
                    </Paper>
                    }
                </div>
            </div>
        );
    }
}

Overview.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Overview)