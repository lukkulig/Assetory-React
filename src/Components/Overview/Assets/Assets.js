import React from "react";
import * as PropTypes from "prop-types";
import {withStyles} from '@material-ui/core/styles/index';
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import AssetView from "./AssetView";
import Paper from "@material-ui/core/Paper";
import ActiveFilters from "../Filters/ActiveFilters";

const styles = theme => ({
    root: {
        height: '100%',
        display: 'grid',
        gridTemplateRows: '40px 10px auto',
        gridTemplateAreas: `'header'
                            'divider'
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
    listSection: {
        gridArea: 'content',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        scrollPaddingRight: 10,
    },
    activeFilters: {
        flexGrow: 1,
    },
    list: {
        flexGrow: 99,
        display: "flex",
        flexDirection: "column",
    },
    assetView: {
        marginBottom: 10,
    },
    paper: {
        float: 'left',
        height: "100%",
        width: "100%",
    },
    assetViewsContainer: {
        margin: theme.spacing(1),
    }
});

class Assets extends React.Component {

    state = {
        assets: [],
        filters: {}
    };

    componentDidMount() {
        this.setState({assets: this.props.assets});
        this.setState({filters: this.props.filters});
    }

    handleFiltersChange = () => {
        this.props.overviewCallback();
    };

    render() {
        const {classes, assets, allCategories} = this.props;

        const cardList = [];

        if (assets !== undefined)
            assets.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (b.name < a.name) return 1;
                return 0;
            }).forEach((asset, i) => {
                cardList.push(
                    <div className={classes.assetViewsContainer} key={i}>
                        <Paper className={classes.paper} elevation={2}>
                            <AssetView
                                className={classes.assetView}

                                asset={({
                                    name: asset.name,
                                    category: allCategories.find(c => c.id === asset.categoryId).name,
                                    attributes: asset.attributes
                                })}
                            />
                        </Paper>
                    </div>
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
                <div className={classes.listSection}>
                    {Object.keys(this.props.filters).length !== 0 &&
                    <ActiveFilters className={classes.activeFilters}
                                   filters={this.state.filters}
                                   assetsCallback={this.handleFiltersChange}
                    />
                    }
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
    overviewCallback: PropTypes.func,
};

export default withStyles(styles)(Assets)