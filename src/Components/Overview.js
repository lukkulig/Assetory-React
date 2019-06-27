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
        allCategories: [],
        categoryId: "1",
        filters: {},
    };

    fetchAndSetCategories() {
        document.body.style.cursor = 'wait';
        api.fetch(
            api.endpoints.getAllCategories(),
            (response) => {
                this.setState({allCategories: response.content});
                console.log(this.state.allCategories);
                document.body.style.cursor = 'default';
            });
    }

    componentDidMount() {
        this.fetchAndSetCategories();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    getActiveCategory() {
        return this.state.allCategories.find(c => c.id === this.state.categoryId) || null
    }

    handleFiltersChange = () => {
        console.log("Filters overview:");
        console.log(this.state.filters);
    };

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <div className={classes.categoriesTreeSection}>
                        <Paper className={classes.paper}>
                            <CategoriesTree
                                categories={this.state.allCategories}
                                //categoryChangeCallback={this.handleCategoryChange}
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