import React from 'react';
import * as PropTypes from 'prop-types';
import Select from 'react-select';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import {emphasize} from '@material-ui/core/styles/colorManipulator';

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
        margin: `${theme.spacing(1/2)}px ${theme.spacing(1/4)}px`,
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

const formatOptionLabel = (option) => {
    return (
        <div>
            {option.name}
        </div>
    );
};

const getOptionLabel = (option) => {
    return option.name.trim();
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

function getSortedCategories(categories) {
    return categories.slice().sort((a, b) => {
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

    handleChange = selectedCategory => {
        if (selectedCategory === null)
            this.props.categoryChangeCallback(null);
        else
            this.props.categoryChangeCallback(selectedCategory.id);
    };

    findCategory = (selectedCategory) => {
        const selected = this.props.categories.find(category => category.id === selectedCategory.id);
        return selected === undefined ? null : selected;
    };

    render() {
        const {classes, selectedCategoryId, categories} = this.props;

        return (
            <div className={classes.root}>
                <NoSsr>
                    <Select
                        classes={classes}
                        options={getSortedCategories(categories)}
                        components={components}
                        selectedCategoryId={selectedCategoryId}
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
            id: PropTypes.string,
            name: PropTypes.string,
            attributes: PropTypes.array,
        })
    ).isRequired,
    categoryChangeCallback: PropTypes.func,
    selectedCategoryId: PropTypes.string,
};

export default withStyles(styles, {withTheme: true})(AssetCategorySelect);
