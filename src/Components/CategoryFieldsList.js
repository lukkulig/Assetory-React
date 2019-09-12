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
            localisationChangeCallback,
            licenseChangeCallback,
            ownerChangeCallback,
            userChangeCallback,
            assetValueChangeCallback,
            backupChangeCallback,
            attributeValuesChangeCallback,
            validateCallback,
        } = this.props;
        this.props.categoryAttributes.forEach((val) => {
            textFields.push(<TextField
                style={styles.textField}
                label={val.name}
                key={val.name}
                name={val.name}
                type={val.type}
                onChange={attributeValuesChangeCallback}/>);
        });
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <form noValidate id={"textFieldsForm"} onChange={validateCallback}>
                    <TextField
                        className={classes.textField}
                        label={"Asset Name"}
                        type={"text"}
                        onChange={assetNameChangeCallback}
                    />
                    <TextField
                        className={classes.textField}
                        label={"Location"}
                        type={"text"}
                        onChange={localisationChangeCallback}
                    />
                    <TextField
                        className={classes.textField}
                        label={"License"}
                        type={"text"}
                        onChange={licenseChangeCallback}
                    />
                    <TextField
                        className={classes.textField}
                        label={"Owner"}
                        type={"text"}
                        onChange={ownerChangeCallback}
                    />
                    <TextField
                        className={classes.textField}
                        label={"User"}
                        type={"text"}
                        onChange={userChangeCallback}
                    />
                    <TextField
                        className={classes.textField}
                        label={"Value"}
                        type={"number"}
                        onChange={assetValueChangeCallback}
                    />
                    <TextField
                        className={classes.textField}
                        label={"Backup"}
                        type={"text"}
                        onChange={backupChangeCallback}

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
    localisationChangeCallback: PropTypes.func,
    licenseChangeCallback: PropTypes.func,
    ownerChangeCallback: PropTypes.func,
    userChangeCallback: PropTypes.func,
    assetValueChangeCallback: PropTypes.func,
    backupChangeCallback: PropTypes.func,
    attributeValuesChangeCallback: PropTypes.func,
    validateCallback: PropTypes.func,
};

export default withStyles(styles)(CategoryFieldsList);
