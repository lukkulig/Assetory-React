import React from "react";
import * as PropTypes from "prop-types";
import {withStyles} from '@material-ui/core/styles/index';
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import AssetView from "./AssetView";
import ActiveFilters from "../Filters/ActiveFilters";
import {BeatLoader} from "react-spinners";
import Button from "@material-ui/core/Button";
import api from "../../../api";
import FileSaver from "file-saver";
import Tooltip from "@material-ui/core/Tooltip";

const styles = ({
    root: {
        height: '100%',
        display: 'grid',
        gridTemplateRows: '40px 10px min-content auto',
        gridTemplateAreas: `'header'
                            'divider'
                            'activeFilters'
                            'content'`,
    },
    header: {
        gridArea: 'header',
    },
    title: {
        float: "left",
        paddingLeft: 15,
        paddingTop: 5
    },
    divider: {
        gridArea: 'divider',
    },
    activeFilters: {
        gridArea: 'activeFilters',
        paddingBottom: "10",
        borderBottom: "10px solid #e0e0e0",
    },
    listSection: {
        gridArea: 'content',
        overflow: 'auto',
        scrollPaddingRight: 10,
        backgroundColor: "#e0e0e0"
    },
    list: {
        padding: 10
    },
    noContent: {
        width: "100%",
        textAlign: "center",
        paddingTop: 10
    }
});

class Assets extends React.Component {

    handleFiltersChange = () => {
        this.props.overviewFiltersCallback();
    };

    handleUpdateAsset = (updatedAttribute) => {
        this.props.overviewUpdateAssetCallback(updatedAttribute);
    };

    handleRedirectToRelatedAsset = (categoryId, assetId) => {
        this.props.overviewRedirectAssetCallback(categoryId, assetId);
    };

    handleDeleteAsset = (assetId, assetName) => {
        this.props.overviewDeleteAssetCallback(assetId, assetName);
    };

    handleExportButton = () => {
        api.fetchFile(
            api.endpoints.export()
        ).then(function (response) {
            return response.blob();
        }).then(function (blob) {
            FileSaver.saveAs(blob, "assets.csv");
        })
    };

    isLoading() {
        return this.props.allCategories === null
            || this.props.assets === null
            || this.props.categories === null;
    }

    render() {
        const {classes, assets, categories, allCategories, filters, categoryAttributes} = this.props;

        let cardList = [];

        if (!this.isLoading()) {
            let collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
            if (assets !== undefined)
                assets.sort((a, b) => {
                    return collator.compare(a.name, b.name);
                }).forEach((asset, i) => {
                    cardList.push(
                        <AssetView
                            key={i}
                            asset={({
                                id: asset.id,
                                name: asset.name,
                                category: allCategories.find(c => c.id === asset.categoryId).name,
                                attributes: asset.attributes,
                                relatedAssetsIds: asset.relatedAssetsIds,
                                connectedComputerId: asset.connectedComputerId
                            })}
                            open={assets.length === 1}
                            categories={categories}
                            assetsUpdateCallback={this.handleUpdateAsset}
                            assetsRedirectCallback={this.handleRedirectToRelatedAsset}
                            assetsDeleteCallback={this.handleDeleteAsset}
                        />
                    )
                });
        }
        return (
            <div className={classes.root}>
                <div className={classes.header}>
                    <Typography className={classes.title} variant="h5">
                        Assets
                    </Typography>
                    <div style={{'textAlign': 'right'}}>
                        <Tooltip title="Download CSV file that contains data about all existing assets">
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={this.handleExportButton}
                            >
                                Export assets to csv
                            </Button>
                        </Tooltip>
                    </div>
                </div>
                <Divider className={classes.divider}/>
                {Object.keys(filters).length !== 0 &&
                <div className={classes.activeFilters}>
                    <ActiveFilters
                        filters={filters}
                        categoryAttributes={categoryAttributes}
                        assetsCallback={this.handleFiltersChange}
                    />
                </div>
                }
                <div className={classes.listSection}>
                    <List className={classes.list} component={"ul"}>
                        {!this.isLoading() ? (
                            cardList.length ? (
                                cardList
                            ) : (
                                <Typography className={classes.noContent} color="textSecondary">
                                    There's no assets
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
                    </List>
                </div>
            </div>
        );
    }
}

Assets.propTypes = {
    classes: PropTypes.object.isRequired,
    assets: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            categoryId: PropTypes.string.isRequired,
            attributes: PropTypes.array.isRequired,
            relatedAssetsIds: PropTypes.array.isRequired,
            connectedComputerId: PropTypes.string,
        })
    ),
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            category: PropTypes.object,
            subCategories: PropTypes.array
        })
    ),
    allCategories: PropTypes.array,
    filters: PropTypes.object.isRequired,
    categoryAttributes: PropTypes.array,
    overviewFiltersCallback: PropTypes.func,
    overviewUpdateAssetCallback: PropTypes.func,
    overviewRedirectAssetCallback: PropTypes.func,
    overviewDeleteAssetCallback: PropTypes.func
};

export default withStyles(styles)(Assets)