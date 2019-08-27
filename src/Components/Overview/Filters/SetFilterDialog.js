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
    MenuItem,
    NoSsr,
    Paper,
    TextField,
    Typography
} from "@material-ui/core";

const styles = theme => ({
    root: {
        width: 400,
        height: 400
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

function inputComponent({inputRef, ...props}) {
    return <div style={{height: 50}} ref={inputRef} {...props} />;
}

function Control(props) {
    const {
        children,
        innerProps,
        innerRef,
        selectProps: {classes, TextFieldProps},
    } = props;
    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    className: classes.input,
                    inputRef: innerRef,
                    children: children,
                    ...innerProps,
                },
            }}
            {...TextFieldProps}
        />
    );
}

function Option(props) {
    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            component="div"
            className={props.selectProps.classes.option}
            style={{
                background: props.isSelected ? 'primary' : 'secondary',
            }}
            {...props.innerProps}
        >
            {props.children}

        </MenuItem>

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

function SingleValue(props) {
    return (
        <div>{props.children}</div>
    );
}

function Menu(props) {
    return (
        <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    );
}

const components = {
    Control,
    Menu,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
};

class SetFilterDialog extends React.Component {

    state = {
        open: false,
        selectedFilter: null,
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

    setFilters = () => {
        this.handleClose();
        console.log(this.state.selectedFilter.id);
        let temp = this.state.filters;
        if (temp[this.props.attribute.key] === undefined)
            temp[this.props.attribute.key] = [];
        temp[this.props.attribute.key].push(this.state.selectedFilter.id);
        this.setState({filters: temp});
        this.setState({
            selectedFilter: null,
        });
        this.props.filtersCallback();
    };

    handleFilterChange = selectedFilter => {
        this.setState({
            selectedFilter: selectedFilter,
        });
    };

    render() {
        const {classes, attribute} = this.props;

        let values = attribute.values.sort((a, b) => {
            return a.label - b.label;
        }).map(value => "[" + value.id + ":" + value.label + "]").join(", ");

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
                    <DialogTitle id="set-filter-form">{attribute.label}</DialogTitle>
                    <DialogContent className={classes.root}>
                        <DialogContentText>
                            Set filters:<br/>
                        </DialogContentText>
                        <NoSsr>
                            <Select
                                classes={classes}
                                options={attribute.values}
                                components={components}
                                value={this.state.selectedFilter}
                                onChange={this.handleFilterChange}
                                placeholder="Add new filter"
                                isClearable
                                filterOption={this.customFilterOption}
                            />
                        </NoSsr>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.setFilters} color="primary" disabled={!this.state.selectedFilter}>
                            Set filters
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    customFilterOption = (option, rawInput) => {
        if (rawInput === "")
            return true;
        const words = rawInput.toUpperCase().split(' ');
        const labelWords = option.label.toUpperCase().split(' ');

        return words.reduce(
            (acc, cur) => acc && (labelWords.includes(cur)),
            true,
        );
    };

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