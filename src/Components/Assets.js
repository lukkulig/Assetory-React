import React from "react";
import * as PropTypes from "prop-types";
import {withStyles} from '@material-ui/core/styles/index';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import AssetView from "./AssetView";
import Paper from "@material-ui/core/Paper";

const styles = theme => ({
    root: {
        width: "100%",
        float: "left",
    },
    title: {
        float: "left",
        paddingLeft: 15,
        paddingTop: 5
    },
    header: {
        float: "left",
        width: "100%",
    },
    divider: {
        marginTop: 10,
        marginBottom: 10,
        flexGrow: 1,
    },
    grid: {
        float: "left",
    },
    gridItem: {
        marginLeft: 10,
        marginRight: 10,
    },
    list: {
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
        margin: theme.spacing(1)
    }
});

class Assets extends React.Component {

    state = {
        assets: [],
    };

    componentDidMount() {
        this.setState({assets: this.props.assets})
    }

    render() {
        const {classes, assets, allCategories} = this.props;

        const cardList = [];

        Object.keys(assets.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (b.name < a.name) return 1;
            return 0;
        })).forEach((key) => {
            cardList.push(
                <div className={classes.assetViewsContainer} key={key}>
                    <Paper className={classes.paper}>
                        <AssetView
                            className={classes.assetView}
                            asset={({
                                name: assets[key].name,
                                category: allCategories.find(c => c.id === assets[key].categoryId).name,
                                localisation: assets[key].localisation,
                                backup: assets[key].backup,
                                license: assets[key].license,
                                value: assets[key].value,
                                owner: assets[key].owner,
                                user: assets[key].user,
                                attributesMap: assets[key].attributesMap
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
                <Grid className={classes.grid} container spacing={2} justify="flex-start" alignItems="flex-start">
                    <Grid className={classes.gridItem} item xs={12}>
                        <Divider className={classes.divider}/>
                    </Grid>
                    <Grid className={classes.gridItem} item xs={12}>
                        <List className={classes.list}>
                            {cardList}
                        </List>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

Assets.propTypes = {
    classes: PropTypes.object.isRequired,
    assets: PropTypes.array.isRequired,
    allCategories: PropTypes.array.isRequired,
};

export default withStyles(styles)(Assets)