import React from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import SetFilterDialog from "./SetFilterDialog";
import * as PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import * as Constants from "../../../Constants/Constants";
import {BeatLoader} from "react-spinners";

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
    },
    noContent: {
        width: "100%",
        textAlign: "center",
        paddingTop: 10
    }
});

class Filters extends React.Component {

    handleFiltersChange = () => {
        this.props.overviewCallback();
    };

    isLoading() {
        return this.props.categoryAttributesValues === null
            || this.props.selectedCategoryId === null
            || this.props.allCategories == null;
    }

    getSubcategories(category, selectedCategoryId) {
        if (category.category.id === selectedCategoryId) {
            return category.subCategories;
        } else if (category.subCategories !== null) {
            let result = null;
            for (let i = 0; result == null && i < category.subCategories.length; i++) {
                result = this.getSubcategories(category.subCategories[i], selectedCategoryId);
            }
            return result;
        }
        return null;
    }

    prepareCategoryFilters(categories, prefix) {
        let filterValues = [];
        categories.forEach((category) => {
            filterValues.push({
                id: category.category.id,
                label: prefix + category.category.name
            });
            let subCategoriesIds = this.prepareCategoryFilters(category.subCategories, prefix + "    \t");
            filterValues = filterValues.concat(subCategoriesIds);
        });
        return filterValues;
    }

    render() {
        const {classes, categoryAttributesValues, filters, selectedCategoryId, allCategories} = this.props;
        let setFiltersList = [];

        if (!this.isLoading() && categoryAttributesValues !== undefined) {
            let subcategories = this.getSubcategories(allCategories.shift(), selectedCategoryId);
            let categoryValues = this.prepareCategoryFilters(subcategories, "");

            const assetAttributes = [
                {
                    key: Constants.NAME_KEY, label: Constants.NAME_LABEL, values:
                        Array.from(new Set(categoryAttributesValues[Constants.NAME_KEY])).map(value => ({
                            id: value,
                            label: value
                        })).filter((el) => !(filters[Constants.NAME_KEY] || []).map(filter => filter.id).includes(el.id))
                },
                {
                    key: Constants.CATEGORY_KEY,
                    label: Constants.CATEGORY_LABEL,
                    values: categoryValues.filter((el) =>
                        !(filters[Constants.CATEGORY_KEY] || []).map(filter => filter.id).includes(el.id))
                }
            ];

            let categoryAttributesMapped = [];
            Object.keys(categoryAttributesValues).forEach(categoryAttribute => {
                if (categoryAttribute !== Constants.NAME_KEY) {
                    categoryAttributesMapped.push({
                        key: categoryAttribute,
                        label: categoryAttribute,
                        values: Array.from(new Set(categoryAttributesValues[categoryAttribute])).map(value => ({
                            id: value,
                            label: value
                        })).filter((el) => !(filters[categoryAttribute] || []).map(filter => filter.id).includes(el.id))
                    })
                }
            });

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
        }

        return (
            <div className={classes.root}>
                {categoryAttributesValues !== undefined &&
                <>
                    <div className={classes.header}>
                        <Typography className={classes.title} variant="h5">
                            Filters
                        </Typography>
                    </div>
                    < Divider className={classes.divider}/>
                    <div className={classes.filtersSection}>
                        <Grid container justify="flex-start">
                            {!this.isLoading() ? (
                                setFiltersList.length ? (
                                    setFiltersList
                                ) : (
                                    <Typography className={classes.noContent} color="textSecondary">
                                        There's no filters
                                    </Typography>
                                )
                            ) : (
                                <div className={classes.noContent}>
                                    <BeatLoader
                                        size={10}
                                        color={"#3f51b5"}
                                    />
                                </div>
                            )}
                        </Grid>
                    </div>
                </>
                }
            </div>
        );
    }
}

Filters.propTypes = {
    classes: PropTypes.object.isRequired,
    categoryAttributesValues: PropTypes.object,
    filters: PropTypes.object.isRequired,
    selectedCategoryId: PropTypes.string,
    allCategories: PropTypes.arrayOf(
        PropTypes.shape({
            category: PropTypes.object,
            subCategories: PropTypes.array
        })
    ),
    overviewCallback: PropTypes.func,
};

export default withStyles(styles)(Filters)