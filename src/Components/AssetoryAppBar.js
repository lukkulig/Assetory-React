import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    core: {
        marginTop: 65,
    },
    appBar: {
        height: 65,
    },
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
            <div className={classes.root}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            Assetory
                        </Typography>
                        <Button color="inherit" onClick={this.handleOverview}>Overview</Button>
                        <Button color="inherit" onClick={this.handleManageCategories}>Manage Categories</Button>
                        <Button color="inherit" onClick={this.handleAddAsset}>Add Asset</Button>
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