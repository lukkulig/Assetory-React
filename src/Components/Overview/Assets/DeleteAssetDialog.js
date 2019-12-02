import React from 'react';
import * as PropTypes from "prop-types";
import {withStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {DeleteForever} from "@material-ui/icons";
import api from "../../../api";

const styles = ({
    textField: {
        width: '100%',
    },
    icon: {
        marginLeft: 5,
    },
});

class DeleteAssetDialog extends React.Component {

    state = {
        open: false
    };

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleDeleteAsset = () => {
        this.handleClose();
        api.fetchDelete(api.endpoints.deleteAsset(this.props.assetId), () => {
            this.props.assetViewCallback(this.props.assetId, this.props.assetName);
        });
    };

    render() {
        const {classes, assetName} = this.props;
        return (
            <div>
                <Button
                    size="small"
                    color="secondary"
                    variant="contained"
                    onClick={this.handleClickOpen}>
                    Delete
                    <DeleteForever fontSize='small' className={classes.icon}/>
                </Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="delete-asset-form"
                >
                    <DialogTitle id="delete-asset-form">Delete Asset</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {"Are you sure you want to delete asset \"" + assetName + "\"?"}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="default">
                            Cancel
                        </Button>
                        <Button onClick={this.handleDeleteAsset} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

}

DeleteAssetDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    assetId: PropTypes.string.isRequired,
    assetName: PropTypes.string.isRequired,
    assetViewCallback: PropTypes.func.isRequired
};

export default withStyles(styles)(DeleteAssetDialog);