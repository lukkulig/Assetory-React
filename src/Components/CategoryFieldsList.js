import React from 'react';
import * as PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {TextField} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

const styles = ({
    root: {
        paddingLeft: 30,
        paddingRight: 30,
    },
    textField: {
        width: '100%',
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

const currencies = [
    {
        value: 'USD',
        label: '$',
    },
    {
        value: 'EUR',
        label: '€',
    },
    {
        value: 'BTC',
        label: '฿',
    },
    {
        value: 'JPY',
        label: '¥',
    },
];

const handleChange = name => event => {
};

class CategoryFieldsList extends React.Component {

    render() {
        const {
            textFields = [],
            assetNameChangeCallback,
            validateAssertNameCallback,
            attributeValuesChangeCallback,
            validateCallback,
            isAssetNameUnique,
            categoryAttributesValues
        } = this.props;
        let result = categoryAttributesValues.name;
        let aaa = Array.of(categoryAttributesValues.name);
        console.log(result);
        console.log(aaa);
        this.props.categoryAttributes.forEach((val) => {
            const name = val.name;
            textFields.push(<TextField
                style={styles.textField}
                label={name}
                key={name}
                name={name}
                type={val.type}
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={attributeValuesChangeCallback}
            />);
            // console.log(name);
            // console.log(categoryAttributesValues[name]);
        });
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <form noValidate id={"textFieldsForm"} onChange={validateCallback}>
                    <TextField
                        error={!isAssetNameUnique}
                        helperText={!isAssetNameUnique ? "This name is already in database" : ''}
                        className={classes.textField}
                        label={"Asset Name"}
                        type={"text"}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={assetNameChangeCallback}
                        onBlur={validateAssertNameCallback}
                    />
                    {textFields}
                </form>
                <form className={classes.container} noValidate autoComplete="off">
                    <TextField
                        id="related-asset"
                        select
                        label="Related Asset"
                        className={classes.textField}
                        onChange={handleChange('currency')}
                        SelectProps={{
                            native: true,
                            MenuProps: {
                                className: classes.menu,
                            },
                        }}
                        helperText="Please select related asset"
                        margin="normal"
                        variant="outlined"
                    >
                    </TextField>
                </form>
            </div>
        );
    }
}

CategoryFieldsList.propTypes = {
    classes: PropTypes.object.isRequired,
    category: PropTypes.object,
    categoryAttributes: PropTypes.array,
    categoryAttributesValues: PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        values: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                label: PropTypes.string.isRequired
            })
        )
    }),
    assetNameChangeCallback: PropTypes.func,
    validateAssertNameCallback: PropTypes.func,
    attributeValuesChangeCallback: PropTypes.func,
    validateCallback: PropTypes.func,
    isAssetNameUnique: PropTypes.bool,
};

export default withStyles(styles)(CategoryFieldsList);
