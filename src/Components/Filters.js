import React from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ActiveFilters from "./ActiveFilters";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";

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
    activeFilters: {},
});

class Filters extends React.Component {

    state = {
        filters: [],
    };

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <div className={classes.header}>
                    <Typography variant="h5" component="h2" className={classes.title}>
                        Filters
                    </Typography>
                </div>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Divider className={classes.divider}/>
                    </Grid>
                    <Grid item xs={12}>
                        <ActiveFilters
                            filters={this.state.filters.map(f => ({
                                ...f
                            }))}
                            //filtersCallback={this.handleFiltersChange}
                        />
                    </Grid>
                </Grid>

            </div>
        );
    }
}

Filters.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Filters)