import React from "react";
import * as PropTypes from "prop-types";
import {withStyles} from '@material-ui/core/styles/index';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";

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
    list: {
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
    },
    card: {
        marginBottom: 10,
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

        Object.keys(assets).forEach((key) => {
            cardList.push(
                <Card
                    className={classes.card}
                    key={key}
                >
                    <p>Name: {assets[key].name}</p>
                    <p>Category: {allCategories.find(c => c.id === assets[key].categoryId).name}</p>
                    <p>Localisation: {assets[key].localisation}</p>
                    <p>Backup: {assets[key].backup}</p>
                    <p>License: {assets[key].license}</p>
                    <p>Value: {assets[key].value}</p>
                    <p>Owner: {assets[key].owner}</p>
                    <p>User: {assets[key].user}</p>
                </Card>)
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