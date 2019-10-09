import React from "react";
import * as PropTypes from "prop-types";
import {withStyles} from '@material-ui/core/styles/index';
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import AssetView from "./AssetView";
import ActiveFilters from "../Filters/ActiveFilters";

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
    }
});

class Assets extends React.Component {

    state = {
        assets: [],
        filters: {}
    };

    componentDidMount() {
        this.setState({filteredAssets: this.props.assets});
        this.setState({filters: this.props.filters});
    }

    handleFiltersChange = () => {
        this.props.overviewCallback();
    };

    render() {
        const {classes, assets, allCategories, categoryAttributes} = this.props;

        const cardList = [];

        let collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
        if (assets !== undefined)
            assets.sort((a, b) => {
                return collator.compare(a.name, b.name);
            }).forEach((asset, i) => {
                cardList.push(
                    <AssetView
                        key={i}
                        asset={({
                            name: asset.name,
                            category: allCategories.find(c => c.id === asset.categoryId).label,
                            attributes: asset.attributes
                        })}
                    />
                )
            });

        return (
            <div className={classes.root}>
                <div className={classes.header}>
                    <Typography className={classes.title} variant="h5" component="h2">
                        Assets
                    </Typography>
                </div>
                <Divider className={classes.divider}/>
                {Object.keys(this.props.filters).length !== 0 &&
                <div className={classes.activeFilters}>
                    <ActiveFilters
                                   filters={this.state.filters}
                                   categoryAttributes={categoryAttributes}
                                   assetsCallback={this.handleFiltersChange}
                    />
                </div>
                }
                <div className={classes.listSection}>
                    <List className={classes.list} component={"ul"}>
                        {cardList}
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
            attributes: PropTypes.array.isRequired
        })
    ),
    allCategories: PropTypes.array.isRequired,
    filters: PropTypes.object.isRequired,
    categoryAttributes: PropTypes.array.isRequired,
    overviewCallback: PropTypes.func,
};

export default withStyles(styles)(Assets)