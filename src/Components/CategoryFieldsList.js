import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import {TextField} from "@material-ui/core";

const styles = theme => ({
    root: {
        float: "left",
        padding: 15,
        paddingRight: 30,
    },
    title: {
        float: "left",
        paddingLeft: 15,
        paddingTop: 5
    },
    button: {
        float: "right",
        marginTop: 5
    },
    header: {
        float: "left",
        width: "100%",
    },
    content: {
        paddingTop: 10,
        clear: "left"
    },
    divider: {
        marginLeft: 10,
        marginTop: 5,
        marginBottom: 10,
    },
    dialogCloseSprint: {
        float: "left",
        marginLeft: 30,
        marginTop: 5
    },
    textField: {
        width: '250px',
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
        this.props.category.attributes.forEach((val, i) => {
            textFields.push(<TextField
                label={val}
                key={val}
                name={val}
                value={fields[val]}
                onChange={fieldsChangeCallback}/>);
            textFields.push(<br/>)
        });
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <form className={classes.container} noValidate>
                    <TextField
                        label={"Asset Name"}
                        value={assetName}
                        onChange={assetNameChangeCallback}
                    />
                    <br/>
                    <TextField
                        label={"Localisation"}
                        value={localisation}
                        onChange={localisationChangeCallback}
                    />
                    <br/>
                    <TextField
                        label={"License"}
                        value={license}
                        onChange={licenseChangeCallback}
                    />
                    <br/>
                    <TextField
                        label={"Owner"}
                        value={owner}
                        onChange={ownerChangeCallback}
                    />
                    <br/>
                    <TextField
                        label={"User"}
                        value={user}
                        onChange={userChangeCallback}
                    />
                    <br/>
                    <TextField
                        label={"Value"}
                        value={assetValue}
                        onChange={assetValueChangeCallback}
                    />
                    <br/>
                    <TextField
                        label={"Backup"}
                        value={backup}
                        onChange={backupChangeCallback}
                    />
                    <br/>
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
