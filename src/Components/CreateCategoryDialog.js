import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import api from "../api";
import AddIcon from '@material-ui/icons/Add';

const styles = theme => ({
    textField: {
        width: "100%",
        height: 60
    },
    dialogSubtitle: {
        marginBottom: 10
    },
    button: {
        float: "right"
    }
});

class CreateSprintDialog extends React.Component {

    state = {
        open: false,
        showStartDateError: false,
    };

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({
            open: false,
            showStartDateError: false
        });
    };

    render() {
        const {classes} = this.props;

        return (
            <div>
                <Button className={classes.button}
                        variant="outlined"
                        onClick={this.handleClickOpen}
                        size='small'
                        disabled={this.props.disabled}>
                    <AddIcon fontSize='small'/>
                    New
                </Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="create-category-form"
                    PaperProps={{style: {width: 450}}}
                >
                    <DialogTitle id="create-category-form">New Category</DialogTitle>
                    <DialogContent>
                        <DialogContentText className={classes.dialogSubtitle}>
                            Creating a category
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button color="primary">
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

CreateSprintDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
    category: PropTypes.object,
    parentUpdateCallback: PropTypes.func,
    defaultStartDate: PropTypes.object,
    history: PropTypes.object,
};

export default withStyles(styles)(CreateSprintDialog);
