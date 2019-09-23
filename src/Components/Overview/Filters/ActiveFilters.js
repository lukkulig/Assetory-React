import React from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import DeleteFilterDialog from "./DeleteFilterDialog";
import Typography from "@material-ui/core/Typography";
import * as Constants from "../../../Constants/Constants";

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
        const {classes, filters, categoryAttributes} = this.props;

        const filtersList = [];
        filtersList.push(
            <DeleteFilterDialog
                filterLabel={"Delete All"}
                attribute={{key: "delete_all", label: "Delete All"}}
                filters={filters}
                activeFiltersCallback={this.handleFiltersChange}
                key={0}
            />);
        let i = 1;

        let categoryAttributesNames = [Constants.NAME_KEY, Constants.CATEGORY_KEY].concat(categoryAttributes.map(categoryAttribute => {
            return categoryAttribute.name;
        }));

        Object.keys(filters).sort((a, b) =>{
            return categoryAttributesNames.indexOf(a) - categoryAttributesNames.indexOf(b);
        }).forEach((key) => {
            let filterLabel = ActiveFilters.getLabel(key);
            filtersList.push(
                <Typography className={classes.text} key={i}>
                    <b>{filterLabel}</b>:
                </Typography>
            );
            i++;
            Object.keys(filters[key]).forEach((attr_ind) => {
                filtersList.push(
                    <DeleteFilterDialog
                        filterKey={key}
                        filterLabel={filterLabel}
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
                    {filtersList}
                </Grid>
            </div>
        )
            ;
    }

    static getLabel(key) {
        if (key === Constants.NAME_KEY)
            return Constants.NAME_LABEL;
        if (key === Constants.CATEGORY_KEY)
            return Constants.CATEGORY_LABEL;
        return key;
    }
}

ActiveFilters.propTypes = {
    classes: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
    categoryAttributes: PropTypes.array.isRequired,
    assetsCallback: PropTypes.func
};

export default withStyles(styles)(ActiveFilters)