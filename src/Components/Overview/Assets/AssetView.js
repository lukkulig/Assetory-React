import React from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";

const styles = ({
    title: {
        marginRight: 5
    },
    titleTag: {},
    deleteButton: {
        float: "right",
    },
    grid: {
        float: "left",
    }
});

const MyListItem = (primary, secondary) => {
    return (
        <ListItem component={"li"}>
            {primary + ": " + secondary}
        </ListItem>
    )
};

class AssetView extends React.Component {

    render() {
        const {classes, asset} = this.props;

        const attributesList = [];
        let i = 0;
        asset.attributes.forEach((attribute) => {
            attributesList.push(
                <div key={i}>
                    {MyListItem(attribute.attribute.name, attribute.value)}
                </div>
            );
            i++;

        });

        return (
            <ExpansionPanel>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography className={classes.title} variant="h6">
                        {asset.name}
                    </Typography>
                    <Typography className={classes.titleTag} variant="overline" color="textSecondary">
                        {asset.category}
                    </Typography>
                </ExpansionPanelSummary>
                <Divider/>
                <ExpansionPanelDetails>
                    <Grid container item xs={12}>
                        <Grid item xs={4}>
                            <List dense component={"ul"}>
                                {attributesList.filter(a => {
                                    return attributesList.indexOf(a) % 3 === 0
                                })}
                            </List>
                        </Grid>
                        <Grid item xs={4}>
                            <List dense component={"ul"}>
                                {attributesList.filter(a => {
                                    return attributesList.indexOf(a) % 3 === 1
                                })}
                            </List>
                        </Grid>
                        <Grid item xs={4}>
                            <List dense component={"ul"}>
                                {attributesList.filter(a => {
                                    return attributesList.indexOf(a) % 3 === 2
                                })}
                            </List>
                        </Grid>
                    </Grid>
                </ExpansionPanelDetails>
                <Divider/>
                <ExpansionPanelActions>
                    <Button size="small" color="secondary" variant="contained">
                        Delete
                    </Button>
                </ExpansionPanelActions>
            </ExpansionPanel>
        );
    }
}

AssetView.propTypes = {
    classes: PropTypes.object.isRequired,
    asset: PropTypes.shape({
        name: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        attributes: PropTypes.array.isRequired,
    }).isRequired,
};

export default withStyles(styles)(AssetView)