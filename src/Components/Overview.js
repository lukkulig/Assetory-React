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
        categories: [{"id": "2", "name": "Software", "path": ["all", "software"], "attributes": ["Expiration date"]},
            {"id": "1", "name": "All", "path": ["all"], "attributes": ["Owner", "Asd", "Qwe", "Asd", "Qwe", "Asd", "Qwe", "Asd", "Qwe", "Asd", "Qwe"]},
            {"id": "3", "name": "Hardware", "path": ["all.hardware"], "attributes": ["Manufacturer"]}],
        categoryId: "1",
        filters: [],
    };

    fetchAndSetGreetings() {
        document.body.style.cursor = 'wait';
        api.fetchString(
            api.endpoints.getGreeting(),
            (response) => {
                this.setState({greetings: response});
            });
    }

    componentDidMount() {
        this.fetchAndSetGreetings();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    getActiveCategory() {
        return this.state.categories.find(c => c.id === this.state.categoryId) || null
    }

    handleFiltersChange = () => {
        console.log("Filters:");
        this.state.filters.map((value)=>
            console.log(value.attribute+": "+value.values));
    };

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.content}>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <Paper className={classes.categoriesTreeSection}>
                                <CategoriesTree
                                    categories={this.state.categories.map(c => ({
                                        ...c
                                    }))}
                                    //categoryChangeCallback={this.handleCategoryChange}
                                    selectedCategoryId={this.state.categoryId}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={8}>
                            <Paper className={classes.filtersSection} elevation={2}>
                                <Filters
                                    category={this.getActiveCategory()}
                                    filters={this.state.filters}
                                    parentUpdateCallback={this.handleFiltersChange}
                                />
                            </Paper>
                        </Grid>
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