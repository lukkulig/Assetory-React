import React from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import SetFilterDialog from "./SetFilterDialog";
import * as PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";

const styles = ({
    root: {
        display: 'grid',
        gridTemplateRows: '40px 10px 100%',
        gridTemplateAreas: `'header'
                            'divider'
                            'content'`,
    },
    title: {
        float: "left",
        paddingLeft: 15,
        paddingTop: 5
    },
    header: {
        gridArea: 'header',
    },
    divider: {
        gridArea: 'divider',
    },
    filtersSection: {
        gridArea: 'content',
        marginLeft: 10,
        marginRight: 10,
        display: ''
    }
});

class Filters extends React.Component {

    state = {
        filters: {},
    };

    componentDidMount() {
        this.setState({filters: this.props.filters})
    }

    handleFiltersChange = () => {
        this.props.overviewCallback();
    };

    render() {
        const {classes, categoryAttributes, filters} = this.props;
        const setFiltersList = [];

        const assetAttributes = [{name: "Name"}, {name: "Category"}];

        assetAttributes.concat(categoryAttributes).forEach((attribute, i) => {
            setFiltersList.push(
                <SetFilterDialog
                    attribute={attribute.name}
                    filters={filters}
                    filtersCallback={this.handleFiltersChange}
                    key={i}
                />
            );
        });

        return (
            <div className={classes.root}>
                <div className={classes.header}>
                    <Typography className={classes.title} variant="h5" component="h2">
                        Filters
                    </Typography>
                </div>
                <Divider className={classes.divider}/>
                <div className={classes.filtersSection}>
                    <Grid container justify="flex-start">
                        {setFiltersList}
                    </Grid>
                </div>
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