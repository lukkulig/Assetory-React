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
});



class Filters extends React.Component {

    state = {
        filters: {},
    };

    componentDidMount() {
        this.setState({filters: this.props.filters})
    }

    handleFiltersChange = () => {
        this.forceUpdate();
        this.props.overviewCallback();
    };

    render() {
        const {classes, categoryAttributes, filters} = this.props;
        const setFiltersList = [];

        const assetAttributes = ["Name", "Category","Localisation","Backup","License","Value","Owner","User"];

        assetAttributes.concat(categoryAttributes.reverse()).forEach((val, i) => {
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
                    {Object.keys(this.props.filters).length !== 0 &&
                    <Grid className={classes.gridItem} item xs={12}>
                        <ActiveFilters
                            filters={this.state.filters}
                            filtersCallback={this.handleFiltersChange}
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
    categoryAttributes: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired,
    overviewCallback: PropTypes.func,
};

export default withStyles(styles)(Filters)