import React from 'react';
import * as PropTypes from "prop-types";
import {withStyles} from '@material-ui/core/styles/index';
import styles from "./Overview.styles";
import api from "../api";
import Filters from "./Filters";
import CategoriesTree from "./CategoriesTree";
import Paper from "@material-ui/core/Paper";

class Overview extends React.Component {

    state = {
        greetings: "",
        categories: [],
        categoryId: "",
        filters: {},
    };

    fetchAndSetCategories() {
        document.body.style.cursor = 'wait';
        api.fetch(
            api.endpoints.getAllCategories(),
            (response) => {
                this.setState({categories: response.content});
                document.body.style.cursor = 'default';
            });
    }

    // fetchAndSetSubcategories(categoryId) {
    //     document.body.style.cursor = 'wait';
    //     api.fetch(
    //         api.endpoints.getSubcategories(categoryId),
    //         (response) => {
    //             this.setState({subcategories1: response.content});
    //             console.log(this.state.subcategories1);
    //             document.body.style.cursor = 'default';
    //         });
    // }


    componentDidMount() {
        //this.fetchAndSetCategories();
        this.setState(
            {
                categories: [
                    {
                        "id": "1", "name": "All", "path": "all", "attributes": ["Owner"], "subcategories": [
                            {
                                "id": "2",
                                "name": "Software",
                                "path": "all:software",
                                "attributes": ["Expiration date"],
                                "subcategories": [
                                    {
                                        "id": "4",
                                        "name": "SubSoftware",
                                        "path": "all:software:subsoftware",
                                        "attributes": ["Expiration date2"]
                                    },
                                ]
                            },
                            {"id": "3", "name": "Hardware", "path": "all:hardware", "attributes": ["Manufacturer"]}]
                    }
                ]
            });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    getActiveCategory() {
        return this.state.categories.find(c => c.id === this.state.categoryId) || null
    }

    handleFiltersChange = () => {
        console.log("Filters overview:");
        console.log(this.state.filters);
    };

    handleCategoryChange = () => {
        console.log("Category change overview:");
        console.log(this.state.categoryId);
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
                                    id: c.id,
                                    name: c.name,
                                    subcategories: c.subcategories
                                }))}
                                categoryChangeCallback={this.handleCategoryChange}
                                selectedCategoryId={this.state.categoryId}
                            />
                        </Paper>
                    </div>
                    <div className={classes.assetsSection}>
                        {this.getActiveCategory() &&
                        <div className={classes.filtersSection}>
                            <Paper className={classes.paper}>
                                <Filters
                                    category={this.getActiveCategory()}
                                    filters={this.state.filters}
                                    overviewCallback={this.handleFiltersChange}
                                />
                            </Paper>
                        </div>
                        }
                        <div className={classes.assetsViewSection}>
                            <Paper className={classes.paper}>
                                Tu bedndom assety cnie
                            </Paper>
                        </div>

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