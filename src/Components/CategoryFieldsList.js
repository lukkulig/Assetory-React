import React from 'react';
import * as PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {TextField} from "@material-ui/core";

const styles = ({
    root: {
        paddingLeft: 30,
        paddingRight: 30,
    },
    textField: {
        width: '100%',
    },
});

class CategoryFieldsList extends React.Component {

    render() {
        const {
            textFields = [],
            assetNameChangeCallback,
            validateAssertNameCallback,
            attributeValuesChangeCallback,
            validateCallback,
            isAssetNameUnique
        } = this.props;
        this.props.categoryAttributes.forEach((val) => {
            textFields.push(<TextField
                style={styles.textField}
                label={val.name}
                key={val.name}
                name={val.name}
                type={val.type}
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={attributeValuesChangeCallback}
            />);
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
            </div>

        );
    }
}

CategoryFieldsList.propTypes = {
    classes: PropTypes.object.isRequired,
    category: PropTypes.object,
    categoryAttributes: PropTypes.array,
    assetNameChangeCallback: PropTypes.func,
    validateAssertNameCallback: PropTypes.func,
    attributeValuesChangeCallback: PropTypes.func,
    validateCallback: PropTypes.func,
    isAssetNameUnique: PropTypes.bool,
};

export default withStyles(styles)(CategoryFieldsList);
