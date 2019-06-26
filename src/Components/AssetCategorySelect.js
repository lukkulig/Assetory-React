import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import {emphasize} from '@material-ui/core/styles/colorManipulator';
import {Tooltip} from "@material-ui/core";
import PeopleIcon from '@material-ui/icons/People';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";


const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
    },
    input: {
        display: 'flex',
        padding: 0,
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
        overflow: 'hidden',
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    chipFocused: {
        backgroundColor: emphasize(
            theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
            0.08,
        ),
    },
    option: {
        fontSize: 14,
    },
    noOptionsMessage: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
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
    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    className: props.selectProps.classes.input,
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps,
                },
            }}
            {...props.selectProps.textFieldProps}
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

const getOptionLabel = (option) => {
    return option.name.trim();
};

const formatOptionLabel = (option) => {
    return (
        <div>
            {option.name}
            <ListItemSecondaryAction>
                {!option.isOpen &&
                <Tooltip disableFocusListener
                         disableTouchListener
                         placement="left"
                         title="Project closed"
                         style={{float: "right", paddingRight: 10, color: "#666666"}}
                         PopperProps={option.id > 6 && option.id !== 3 ? {style: {paddingRight: 30}} : {}} //TODO in im scrum master
                >
                    <NotInterestedIcon fontSize='small'/>
                </Tooltip>
                }
                {option.id > 6 && option.id !== 3 && //TODO if im scrum master
                <Tooltip disableFocusListener disableTouchListener placement="left" title="Scrum master permissions"
                         style={{float: "right", paddingRight: 10, color: "#666666"}}>
                    <PeopleIcon fontSize='small'/>
                </Tooltip>
                }
            </ListItemSecondaryAction>
        </div>
    );
};

const customFilterOption = (option, rawInput) => {
    const inputWords = rawInput.toUpperCase().split(/ +|-|_/);
    const labelWords = option.label.toUpperCase().split(/ +|-|_/);

    return inputWords.reduce(
        (acc, cur) => acc && labelWords.some(labelWord => labelWord.startsWith(cur)),
        true,
    );
};


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
        <div>
            {props.data.name}
        </div>
    );
}

function Menu(props) {
    return (
        <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    );
}

function getSortedProjects(categories) {
    return categories.slice().sort((a, b) => {
        if (a.isOpen === true && b.isOpen === false)
            return 1;

        if (a.isOpen === false && b.isOpen === true)
            return -1;

        return a.name < b.name ? 1 : (a.name === b.name ? 0 : -1)
    }).reverse();
}

const components = {
    Control,
    Menu,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
};

class AssetCategorySelect extends React.Component {

    handleChange = selectedProject => {
        if (selectedProject === null)
            this.props.categoryChangeCallback(null);
        else
            this.props.categoryChangeCallback(selectedProject.id);
    };

    findCategory = (selectedCategoryId) => {
        const selectedCategory = this.props.categories.find(category => category.id === selectedCategoryId);
        return selectedCategory === undefined ? null : selectedCategory;
    };

    render() {
        const {classes, categories, selectedCategoryId} = this.props;

        return (
            <div className={classes.root}>
                <NoSsr>
                    <Select
                        classes={classes}
                        options={getSortedProjects(categories)}
                        components={components}
                        value={this.findCategory(selectedCategoryId)}
                        onChange={this.handleChange}
                        placeholder="Start typing category name..."
                        isClearable
                        formatOptionLabel={formatOptionLabel}
                        getOptionLabel={getOptionLabel}
                        filterOption={customFilterOption}
                    />
                </NoSsr>
            </div>
        );
    }
}

AssetCategorySelect.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
        })
    ).isRequired,
    categoryChangeCallback: PropTypes.func,
    selectedCategoryId: PropTypes.number,
};

export default withStyles(styles, {withTheme: true})(AssetCategorySelect);
