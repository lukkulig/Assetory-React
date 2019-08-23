import React from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import SetFilterDialog from "./SetFilterDialog";
import * as PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import * as Constants from "../../../Constants/Constants";

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

    static getLabel(string) {
        return string[0].toUpperCase() + string.slice(1).toLowerCase();
    }

    componentDidMount() {
        this.setState({filters: this.props.filters})
    }

    handleFiltersChange = () => {
        this.props.overviewCallback();
    };

    render() {
        const {classes, categoryAttributes, filters, assets, allCategories} = this.props;
        const setFiltersList = [];

        const assetAttributes = [
            {
                key: Constants.NAME_KEY, label: Constants.NAME_LABEL, values: assets.map(asset => ({
                    id: asset.name,
                    label: asset.name
                }))
            },
            {key: Constants.CATEGORY_KEY, label: Constants.CATEGORY_LABEL, values: allCategories}
        ];

        let categoryAttributesMapped = categoryAttributes.map(categoryAttribute => ({
            key: categoryAttribute.name,
            label: Filters.getLabel(categoryAttribute.name),
            values: assets.map(function(asset) {
                let value = asset.attributes.filter(attribute => attribute.attribute.name === categoryAttribute.name).map(attribute => attribute.value).shift();
                return {
                    id: value,
                    label: value
                }})
        }));

        assetAttributes.concat(categoryAttributesMapped).forEach((attribute, i) => {
            setFiltersList.push(
                <SetFilterDialog
                    attribute={attribute}
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
    assets: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            categoryId: PropTypes.string.isRequired,
            attributes: PropTypes.array.isRequired
        })
    ),
    allCategories: PropTypes.array.isRequired,
    overviewCallback: PropTypes.func,
};

export default withStyles(styles)(Filters)