import React from 'react';
import * as PropTypes from "prop-types";
import {withStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Delete} from "@material-ui/icons";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

const styles = ({
    textField: {
        width: '100%',
    },
    icon: {
        marginLeft: 5,
    },
});

class DeleteRelatedAssetDialog extends React.Component {

    state = {
        open: false
    };

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleDeleteRelatedAsset = () => {
        this.handleClose();
        this.props.assetViewCallback(this.props.relatedAsset.id);
    };

    render() {
        const {relatedAsset} = this.props;
        return (
            <div>
                <Tooltip title="Delete related asset">
                    <IconButton edge="end"
                                onClick={this.handleClickOpen}>
                        <Delete/>
                    </IconButton>
                </Tooltip>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="delete-related-asset-form"
                >
                    <DialogTitle id="delete-related-asset-form">Delete Related Asset</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {"Are you sure you want to delete related asset \"" + relatedAsset.name + "\"?"}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="default">
                            Cancel
                        </Button>
                        <Button onClick={this.handleDeleteRelatedAsset} color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

}

DeleteRelatedAssetDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    relatedAsset: PropTypes.object.isRequired,
    assetViewCallback: PropTypes.func.isRequired
};

export default withStyles(styles)(DeleteRelatedAssetDialog);