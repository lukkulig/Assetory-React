import React from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

const styles = ({
    root: {
        flexGrow: 1,
        width: '100%',
    },
    grid:{
        float: "left",
        marginLeft: 10,
        marginRight: 10,
    },
});

class ActiveFilters extends React.Component {
    render() {
        const {classes, filters} = this.props;

        const filtersList = [];

        console.log("asd: "+filters);
        filters.forEach((val, i) => {
            filtersList.push(
                <Button className={classes.filterButton}
                        variant="outlined"
                        filters={filters}
                        onClick={this.handleClickOpen}
                        key={i}>
                    {val+":"+i}
                </Button>);
        });

        return (
            <div className={classes.root}>
                <Grid className={classes.grid} container item xs={12} justify="flex-start">
                    Active filters: {filtersList}
                </Grid>
            </div>
        );
    }
}

ActiveFilters.propTypes = {
    classes: PropTypes.object.isRequired,
    filters: PropTypes.array.isRequired,
};

export default withStyles(styles)(ActiveFilters)