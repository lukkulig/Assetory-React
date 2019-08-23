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
        this.setState({value: ""});
    };

    isValid = () => {
        return true;
    };

    setFilters = () => {
        this.handleClose();
        let temp = this.state.filters;
        if (temp[this.props.attribute.key] === undefined)
            temp[this.props.attribute.key] = [];
        temp[this.props.attribute.key].push(this.state.value);
        this.setState({filters: temp});
        this.props.filtersCallback();
    };

    handleChange = name => event => {
        this.setState({[name]: event.target.value});
    };

    render() {
        const {classes, attribute} = this.props;

        let values = attribute.values.sort((a, b) => {
            return a.label - b.label;
        }).map(value => "["+value.id+":"+value.label+"]").join(", ");

        return (
            <div>
                <Fab className={classes.filterFab}
                     variant="extended"
                     color="primary"
                     onClick={this.handleClickOpen}>
                    {attribute.label}
                </Fab>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="set-filter-form"
                >
                    <DialogTitle id="set-filter-form">{attribute.key}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Set filters:<br/>
                            {values}
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
    attribute: PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        values: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                label: PropTypes.string.isRequired
            })
        )
    }),
    filters: PropTypes.object.isRequired,
    filtersCallback: PropTypes.func
};

export default withStyles(styles)(SetFilterDialog);