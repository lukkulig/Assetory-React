import React from 'react';
import * as PropTypes from "prop-types";
import {withStyles} from '@material-ui/core/styles';
import Select from "react-select";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Fab,
    NoSsr,
    Typography
} from "@material-ui/core";

const styles = theme => ({
    root: {
        width: 600,
        height: 250
    },
    filterFab: {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
        height: 30,
        textTransform: "none",
    },
    dialog: {
        height: "1000"
    },
    input: {
        display: 'flex',
        padding: 0,
    },
    option: {
        fontSize: 14,

    },
    noOptionsMessage: {
        padding: `${theme.spacing()}px ${theme.spacing(2)}px`,
    },
    singleValue: {
        fontSize: 14,
    },
    placeholder: {
        position: 'absolute',
        left: 10,
        fontSize: 14,
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: 0,
        left: 0,
        right: 0,
    },
});

function NoOptionsMessage(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.noOptionsMessage}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function Placeholder(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.placeholder}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}


const components = {
    NoOptionsMessage,
    Placeholder
};

class SetFilterDialog extends React.Component {

    state = {
        open: false,
        selectedFilters: null,
        filters: {},
    };

    componentDidMount() {
        this.setState({filters: this.props.filters})
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.filters !== this.props.filters) {
            this.setState({filters: this.props.filters})

        }
    }

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
        this.setState({selectedFilters: null});
    };

    setFilters = () => {
        this.handleClose();
        let temp = this.state.filters;
        if (temp[this.props.attribute.key] === undefined)
            temp[this.props.attribute.key] = [];
        Array.prototype.push.apply(temp[this.props.attribute.key],this.state.selectedFilters);
        this.setState({filters: temp});
        this.setState({selectedFilters: null});
        this.props.filtersCallback();
    };

    handleFilterChange = selectedFilter => {
        this.setState({
            selectedFilters: selectedFilter,
        });
    };

    render() {
        const {classes, attribute} = this.props;

        let collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
        let attributeValues = attribute.values.sort((a, b) => {
            return collator.compare(a.label, b.label);
        });
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
                    disableBackdropClick
                >
                    <DialogTitle id="set-filter-form">{attribute.label}</DialogTitle>
                    <DialogContent className={classes.root}>
                        <DialogContentText>
                            Set filters:<br/>
                        </DialogContentText>
                        <NoSsr>
                            <Select
                                classes={classes}
                                options={attributeValues}
                                components={components}
                                value={this.state.selectedFilters}
                                maxMenuHeight={150}
                                onChange={this.handleFilterChange}
                                placeholder="Add new filter"
                                isClearable
                                isMulti
                                closeMenuOnSelect={false}
                                getOptionValue={option => option.id}
                                getLabelValue={option => option.label}
                            />
                        </NoSsr>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.setFilters} color="primary" disabled={!this.state.selectedFilters}>
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