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
            fields = [],
            assetName, localisation, license, owner, user, assetValue, backup,
            textFields = [],
            assetNameChangeCallback,
            localisationChangeCallback,
            licenseChangeCallback,
            ownerChangeCallback,
            userChangeCallback,
            assetValueChangeCallback,
            backupChangeCallback,
            fieldsChangeCallback,

        } = this.props;
        this.props.category.attributes.forEach((val) => {
            textFields.push(<TextField
                style={styles.textField}
                label={val}
                key={val}
                name={val}
                value={fields[val]}
                onChange={fieldsChangeCallback}/>);
        });
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <form noValidate>
                    <TextField
                        className={classes.textField}
                        label={"Asset Name"}
                        value={assetName}
                        onChange={assetNameChangeCallback}
                    />
                    <TextField
                        className={classes.textField}
                        label={"Localisation"}
                        value={localisation}
                        onChange={localisationChangeCallback}
                    />
                    <TextField
                        className={classes.textField}
                        label={"License"}
                        value={license}
                        onChange={licenseChangeCallback}
                    />
                    <TextField
                        className={classes.textField}
                        label={"Owner"}
                        value={owner}
                        onChange={ownerChangeCallback}
                    />
                    <TextField
                        className={classes.textField}
                        label={"User"}
                        value={user}
                        onChange={userChangeCallback}
                    />
                    <TextField
                        className={classes.textField}
                        label={"Value"}
                        value={assetValue}
                        onChange={assetValueChangeCallback}
                    />
                    <TextField
                        className={classes.textField}
                        label={"Backup"}
                        value={backup}
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
    fields: PropTypes.objectOf(PropTypes.string),
    assetName: PropTypes.string,
    localisation: PropTypes.string,
    license: PropTypes.string,
    owner: PropTypes.string,
    user: PropTypes.string,
    assetValue: PropTypes.string,
    backup: PropTypes.string,
    assetNameChangeCallback: PropTypes.func,
    localisationChangeCallback: PropTypes.func,
    licenseChangeCallback: PropTypes.func,
    ownerChangeCallback: PropTypes.func,
    userChangeCallback: PropTypes.func,
    assetValueChangeCallback: PropTypes.func,
    backupChangeCallback: PropTypes.func,
    fieldsChangeCallback: PropTypes.func,
};

export default withStyles(styles)(CategoryFieldsList);
