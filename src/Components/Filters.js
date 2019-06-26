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
        float: "left",
        padding: 15,
        paddingRight: 30,
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
        marginLeft: 10,
        marginBottom: 10,
    },
    grid:{
        float: "left",
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

    handleFiltersChange = () => {
        console.log("Filters:");
        this.state.filters.map((value)=>
            console.log(value.attribute+": "+value.values));
        this.props.parentUpdateCallback(this.state.filters);
    };

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
        const buttonListElements = [];

        // eslint-disable-next-line array-callback-return
        category.attributes.map((val, i) => {
            buttonListElements.push(
                <SetFilterDialog
                    attribute={val}
                    filters={filters}
                    parentUpdateCallback={this.handleFiltersChange}
                    key={i}
                />);
        });

        return (
            <div className={classes.root}>
                <div className={classes.header}>
                    <Typography variant="h5" component="h2" className={classes.title}>
                        Filters
                    </Typography>
                </div>
                <Grid className={classes.grid} container spacing={2} justify="flex-start" alignItems="flex-start">
                    <Grid item xs={12}>
                        <Divider className={classes.divider}/>
                    </Grid>
                    <Grid container item xs={12} justify="flex-start">
                        {buttonListElements}
                    </Grid>
                    <Grid item xs={12}>
                        <ActiveFilters
                            filters={this.state.filters}
                            //parentUpdateCallback={this.handleFiltersDeleteChange}
                        />
                    </Grid>
                </Grid>

            </div>
        );
    }
}

Filters.propTypes = {
    classes: PropTypes.object.isRequired,
    category: PropTypes.object.isRequired,
    filters: PropTypes.array.isRequired,
    parentUpdateCallback: PropTypes.func,
};

export default withStyles(styles)(Filters)