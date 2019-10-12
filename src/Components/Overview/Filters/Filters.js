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

    handleFiltersChange = () => {
        this.props.overviewCallback();
    };

    render() {
        const {classes, categoryAttributes, filters, assets, allCategories, selectedCategoryId} = this.props;
        const setFiltersList = [];

        const assetAttributes = [
            {
                key: Constants.NAME_KEY, label: Constants.NAME_LABEL, values:
                    Array.from(new Set(assets.map(asset => asset.name))).map(name => ({
                        id: name,
                        label: name
                    })).filter((el) => !(filters[Constants.NAME_KEY] || []).map(filter => filter.id).includes(el.id))
            },
            {key: Constants.CATEGORY_KEY, label: Constants.CATEGORY_LABEL, values:
                    Array.from(new Set(assets.map(asset => asset.categoryId))).map(categoryId => ({
                        id: categoryId,
                        label: allCategories.find(c => c.id === categoryId).label
                    })).filter((el) => !(filters[Constants.CATEGORY_KEY] || []).map(filter => filter.id).includes(el.id) && el.id!==selectedCategoryId)
            }
        ];

        let categoryAttributesMapped = categoryAttributes.map(categoryAttribute => ({
            key: categoryAttribute.name,
            label: categoryAttribute.name,
            values: Array.from(new Set(assets.map(asset => {
                let values = asset.attributes.filter(attribute => attribute.attribute.name === categoryAttribute.name).map(attribute => attribute.value);
                if (Array.isArray(values) && values.length)
                    return values.shift();
                return null;
        }).filter(values => values !== null)))
                .map(name => ({
                id: name,
                label: name
            })).filter((el) => !(filters[categoryAttribute.name] || []).map(filter => filter.id).includes(el.id))
        }));

        assetAttributes.concat(categoryAttributesMapped).forEach((attribute, i) => {
            if (Array.isArray(attribute.values) && attribute.values.length)
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
    selectedCategoryId: PropTypes.string.isRequired,
    overviewCallback: PropTypes.func,
};

export default withStyles(styles)(Filters)