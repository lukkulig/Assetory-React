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
        marginTop: '4px',
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
        this.props.assetsCallback();
    };

    render() {
        const {classes, filters} = this.props;

        const filtersList = [];
        let i = 0;
        Object.keys(filters).forEach((key) => {
            Object.keys(filters[key]).forEach((attr_ind) => {
                        filtersList.push(
                            <DeleteFilterDialog
                                filterKey={key}
                                attribute={filters[key][attr_ind]}
                                filters={filters}
                                activeFiltersCallback={this.handleFiltersChange}
                                key={i}
                            />);
                        i++;
                })
            });

        return (

            <div className={classes.root}>
                <Grid className={classes.grid} container justify="flex-start">
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
    assetsCallback: PropTypes.func
};

export default withStyles(styles)(ActiveFilters)