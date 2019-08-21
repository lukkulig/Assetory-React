import React from 'react';
import * as PropTypes from "prop-types";
import {withStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
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
});

class SetFilterDialog extends React.Component {

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

    isValid = () => {
        return true;
    };

    setFilters = () => {
        this.handleClose();
        let temp = this.state.filters;
        if (temp[this.props.attribute] === undefined)
            temp[this.props.attribute] = [];
        temp[this.props.attribute].push(this.state.value);
        this.setState({filters: temp});
        this.props.filtersCallback();
    };

    handleChange = name => event => {
        this.setState({[name]: event.target.value});
    };

    render() {
        const {classes, attribute} = this.props;

        return (
            <div>
                <Fab className={classes.filterFab}
                     variant="extended"
                     color="primary"
                     onClick={this.handleClickOpen}>
                    {attribute}
                </Fab>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="set-filter-form"
                >
                    <DialogTitle id="set-filter-form">{attribute}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Setting filters
                        </DialogContentText>
                        <TextField
                            id="filters"
                            label="Filter"
                            className={classes.textField}
                            value={this.state.value}
                            onChange={this.handleChange("value")}
                            margin="normal"
                            type="string"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.setFilters} color="primary" disabled={!this.isValid()}>
                            Set filters
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

}

SetFilterDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    attribute: PropTypes.string.isRequired,
    filters: PropTypes.object.isRequired,
    filtersCallback: PropTypes.func
};

export default withStyles(styles)(SetFilterDialog);