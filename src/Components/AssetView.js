import React from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

const styles = ({
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
});

const MyListItem = (primary, secondary) => {
    return (
        <ListItem>
            {primary + ": " + secondary}
        </ListItem>
    )
};

class AssetView extends React.Component {

    render() {
        const {classes, asset} = this.props;

        const attributesList = [];
        let i = 0;
        Object.keys(asset.attributesMap).forEach((key) => {
            attributesList.push(
                <div key={i}>
                    {MyListItem(key, asset.attributesMap[key])}
                </div>
            );
            i++;

        });

        return (
            <div className={classes.root}>
                <div className={classes.header}>
                    <Typography className={classes.title} variant="h5" component="h2">
                        {asset.name}
                    </Typography>
                </div>
                <Grid className={classes.grid} container spacing={2} justify="flex-start" alignItems="flex-start">
                    <Grid className={classes.gridItem} item xs={12}>
                        <Divider className={classes.divider}/>
                    </Grid>
                    <Grid className={classes.gridItem} container item xs={12}>
                        <Grid item xs={4}>
                            <List dense>
                                {MyListItem("Category", asset.category)}
                                {MyListItem("Backup", asset.backup)}
                                {MyListItem("User", asset.user)}
                            </List>
                        </Grid>
                        <Grid item xs={4}>
                            <List dense>
                                {MyListItem("Owner", asset.owner)}
                                {MyListItem("License", asset.license)}
                            </List>
                        </Grid>
                        <Grid item xs={4}>
                            <List dense>
                                {MyListItem("Localisation", asset.localisation)}
                                {MyListItem("Value", asset.value)}
                            </List>
                        </Grid>
                        <Grid item xs={4}>
                            <List dense>
                                {attributesList.filter(a => {return attributesList.indexOf(a)%3===0})}
                            </List>
                        </Grid>
                        <Grid item xs={4}>
                            <List dense>
                                {attributesList.filter(a => {return attributesList.indexOf(a)%3===1})}
                            </List>
                        </Grid>
                        <Grid item xs={4}>
                            <List dense>
                                {attributesList.filter(a => {return attributesList.indexOf(a)%3===2})}
                            </List>
                        </Grid>
                    </Grid>
                </Grid>

            </div>
        );
    }
}

AssetView.propTypes = {
    classes: PropTypes.object.isRequired,
    asset: PropTypes.shape({
        name: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        localisation: PropTypes.string.isRequired,
        backup: PropTypes.string.isRequired,
        license: PropTypes.string.isRequired,
        value: PropTypes.number.isRequired,
        owner: PropTypes.string.isRequired,
        user: PropTypes.string.isRequired,
        attributesMap: PropTypes.object.isRequired,
    }).isRequired,
};

export default withStyles(styles)(AssetView)