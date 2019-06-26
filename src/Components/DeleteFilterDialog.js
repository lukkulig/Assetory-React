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

const styles = theme => ({
    textField: {
        width: '100%',
    },
    filterButton: {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
        height: 30,
    },
    test: {
        padding: -10,
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
            this.setState({filters: temp});
        }
        console.log("Filters delete:");
        console.log(this.state.filters);
        this.props.activeFiltersCallback(this.state.filters);
    };

    render() {
        const {classes, filterKey, attribute} = this.props;

        return (
            <div>
                <Button className={classes.filterButton}
                        variant="outlined"
                        filters={this.state.filters}
                        onClick={this.handleClickOpen}>
                    <p>{filterKey + " : " + attribute}</p>
                    <HighlightOffIcon fontSize='small' className={classes.test}/>
                </Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="delete-filter-form"
                >
                    <DialogTitle id="delete-filter-form">{filterKey}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete filter "{attribute}" for {filterKey}?
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
    attribute: PropTypes.string.isRequired,
    filters: PropTypes.object.isRequired,
    activeFiltersCallback: PropTypes.func
};

export default withStyles(styles)(DeleteFilterDialog);