import React from 'react';
import * as PropTypes from "prop-types";
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {Add, Tune, ViewList} from "@material-ui/icons";

const styles = theme => ({
    appBarSpacer: theme.mixins.toolbar,
});

class AssetoryAppBar extends React.Component {

    state = {
        renderDashboard: true,
        renderAddProject: false,
    };

    handleManageCategories = () => {
        this.props.history.push('/manage-categories')
    };

    handleAddAsset = () => {
        this.props.history.push('/add-asset')
    };

    handleOverview = () => {
        this.props.history.push('/overview')
    };

    render() {
        const {classes} = this.props;

        return (
            <div>
                <AppBar>
                    <Toolbar>
                        <Typography variant="h4" color="inherit" style={{flexGrow: 1}}>
                            Assetory
                        </Typography>
                        <Button color="inherit" size="small" onClick={this.handleOverview}>
                            <ViewList style={{marginRight: 3}}/>
                            Overview
                        </Button>
                        <Button color="inherit" size="small" onClick={this.handleManageCategories}>
                            <Tune style={{marginRight: 3}}/>
                            Manage Categories
                        </Button>
                        <Button color="inherit" size="small" onClick={this.handleAddAsset}>
                            <Add style={{marginRight: 3}}/>
                            Add Asset
                        </Button>
                    </Toolbar>
                </AppBar>
                <div className={classes.appBarSpacer}/>
            </div>
        );
    }
}

AssetoryAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AssetoryAppBar);