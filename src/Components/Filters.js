import React from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ActiveFilters from "./ActiveFilters";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import SetFilterDialog from "./SetFilterDialog";

const styles = ({
    root: {
        width: "100%",
        float: "left",
    },
    title: {
        float: "left",
        paddingLeft: 15,
        paddingTop: 5
    },
    header: {
        float: "left",
        width: "100%",
    },
    divider: {
        marginTop: 10,
        marginBottom: 10,
    },
    grid:{
        float: "left",
    },
    gridItem:{
        marginLeft: 10,
        marginRight: 10,
    },
    activeFilters: {},
});



class Filters extends React.Component {

    state = {
        filters: [],
    };

    componentDidMount() {
        this.setState({filters: this.props.filters})
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        console.log(true);
    }

    handleFiltersChange = () => {
       //this.setState({filters: this.state.filters});
        console.log("Filters filters:");
        console.log(this.state.filters);
        console.log(this.hasFilters());
        this.forceUpdate();
        this.props.overviewCallback();

    };

    // hasFilters(){
    //     return this.state.filters.length || null
    // }

    // handleFiltersDeleteChange = (filters) => {
    //     let array = [...this.state.filters];
    //     let index = array.indexOf(filters.target.value);
    //     if (index !== -1) {
    //         array.splice(index, 1);
    //         this.setState({filters: array});
    //     };
    //     this.props.filtersChangeCallback(this.state.filters);
    // };

    render() {
        const {classes, category, filters} = this.props;
        const setFiltersList = [];

        category.attributes.forEach((val, i) => {
            setFiltersList.push(
                <SetFilterDialog
                    attribute={val}
                    filters={filters}
                    filtersCallback={this.handleFiltersChange}
                    key={i}
                />);
        });

        return (
            <div className={classes.root}>
                <div className={classes.header}>
                    <Typography className={classes.title} variant="h5" component="h2">
                        Filters
                    </Typography>
                </div>
                <Grid className={classes.grid} container spacing={2} justify="flex-start" alignItems="flex-start">
                    <Grid className={classes.gridItem} item xs={12}>
                        <Divider className={classes.divider}/>
                    </Grid>
                    <Grid className={classes.gridItem} container item xs={12} justify="flex-start">
                        {setFiltersList}
                    </Grid>
                    {//this.hasFilters() &&
                    <Grid className={classes.gridItem} item xs={12}>
                        {console.log("elo")}
                        <ActiveFilters
                            filters={filters}
                            //parentUpdateCallback={this.handleFiltersDeleteChange}
                        />
                    </Grid>
                    }
                </Grid>

            </div>
        );
    }
}

Filters.propTypes = {
    classes: PropTypes.object.isRequired,
    category: PropTypes.object.isRequired,
    filters: PropTypes.array.isRequired,
    overviewCallback: PropTypes.func,
};

export default withStyles(styles)(Filters)