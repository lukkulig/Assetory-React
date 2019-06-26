import React from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import DeleteFilterDialog from "./DeleteFilterDialog";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
    },
    grid: {
        float: "left",
        marginLeft: 10,
        marginRight: 10,
    },
    text: {
        marginRight: theme.spacing(1)
    }
});

class ActiveFilters extends React.Component {

    state = {
        filters: {},
    };

    componentDidMount() {
        this.setState({filters: this.props.filters});
    }

    handleFiltersChange = (filters) => {
        this.setState({filters: filters});
        this.props.filtersCallback();
    };

    render() {
        const {classes, filters} = this.props;

        const filtersList = [];
        let i = 0;
        for (let key in filters) {
            if (filters.hasOwnProperty(key)) {
                for (let attr_ind in filters[key]) {
                    if (filters[key].hasOwnProperty(attr_ind)) {
                        filtersList.push(
                            <DeleteFilterDialog
                                filterKey={key}
                                attribute={filters[key][attr_ind]}
                                filters={filters}
                                activeFiltersCallback={this.handleFiltersChange}
                                key={i}
                            />);
                        i++;
                    }
                }
            }
        }
        return (

            <div className={classes.root}>
                <Grid className={classes.grid} container item xs={12} justify="flex-start">
                    <Typography className={classes.text}>
                        Active filters:
                    </Typography>
                    {filtersList}
                </Grid>
            </div>
        )
            ;
    }
}

ActiveFilters.propTypes = {
    classes: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
    filtersCallback: PropTypes.func
};

export default withStyles(styles)(ActiveFilters)