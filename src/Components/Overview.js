import React from 'react';
import * as PropTypes from "prop-types";
import {withStyles} from '@material-ui/core/styles/index';
import styles from "./Overview.styles";
import api from "../api";
import Filters from "./Filters";
import Grid from "@material-ui/core/Grid";
import CategoriesTree from "./CategoriesTree";
import Paper from "@material-ui/core/Paper";

class Overview extends React.Component {

    state = {
        greetings: "",
        allCategories: [],
        categoryId: "2",
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
                    <Grid container spacing={2}>
                        <Grid container item xs={2}>
                            <Paper className={classes.categoriesTreeSection}>
                                <CategoriesTree
                                    categories={this.state.allCategories}
                                    //categoryChangeCallback={this.handleCategoryChange}
                                    selectedCategoryId={this.state.categoryId}
                                />
                            </Paper>
                        </Grid>
                        {this.getActiveCategory() &&
                        <Grid container item xs={8}>
                            <Paper className={classes.filtersSection}>
                                <Filters
                                    category={this.getActiveCategory()}
                                    filters={this.state.filters}
                                    overviewCallback={this.handleFiltersChange}
                                />
                            </Paper>
                        </Grid>
                        }
                    </Grid>
                </div>
            </div>
        );
    }
}

Overview.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Overview)