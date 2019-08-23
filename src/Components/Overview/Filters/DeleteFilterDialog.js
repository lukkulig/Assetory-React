import React from 'react';
import * as PropTypes from "prop-types";
import {withStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Fab from "@material-ui/core/Fab";

const styles = theme => ({
    textField: {
        width: '100%',
    },
    filterFab: {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
        height: 30,
        textTransform: "none",
    },
    icon: {
        marginLeft: 5,
    },
});

class DeleteFilterDialog extends React.Component {

    state = {
        open: false,
        value: "",
        filters: {},
    };

    componentDidMount() {
        this.setState({filters: this.props.filters})
    }

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    deleteFilter = () => {
        this.handleClose();
        let temp = this.state.filters;
        let index = temp[this.props.filterKey].indexOf(this.props.attribute);
        if (index !== -1) {
            temp[this.props.filterKey].splice(index, 1);
            if (temp[this.props.filterKey].length === 0) {
                delete temp[this.props.filterKey];
            }
        }
        this.props.activeFiltersCallback(this.state.filters);
    };

    render() {
        const {classes, filterKey, filterLabel, attribute} = this.props;

        return (
            <div>
                <Fab className={classes.filterFab}
                     variant="extended"
                     filters={this.state.filters}
                     onClick={this.handleClickOpen}>
                    {filterLabel + ": " + attribute}
                    <HighlightOffIcon fontSize='small' className={classes.icon}/>
                </Fab>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="delete-filter-form"
                >
                    <DialogTitle id="delete-filter-form">{filterKey}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete filter "{attribute}" for {filterLabel}?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.deleteFilter} color="primary">
                            Delete filter
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

}

DeleteFilterDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    filterKey: PropTypes.string.isRequired,
    filterLabel: PropTypes.string.isRequired,
    attribute: PropTypes.string.isRequired,
    filters: PropTypes.object.isRequired,
    activeFiltersCallback: PropTypes.func
};

export default withStyles(styles)(DeleteFilterDialog);