import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography/index';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import {Divider, Button, TextField} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

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
        //TODO: Problem z dynamicznym tworzeniem textfieldów bo potrzeba tyle samo zmiennych, zrobić jakis dict ktory sobie z tym poradzi albo hashmape :)
        const fields = [];
        const textFields = [];
        this.props.category.attributes.forEach((val, i) => {
            fields.push('');
        });
        this.props.category.attributes.forEach((val, i) => {
            textFields.push(<TextField
                label={val}
                value={fields[i]}
                onChange={fieldsChangeCallback}/>);
            textFields.push(<br/>)
        });
        const {classes} = this.props;

        const {
            assetName, localisation, license, owner, user, assetValue, backup,
            assetNameChangeCallback,
            localisationChangeCallback,
            licenseChangeCallback,
            ownerChangeCallback,
            userChangeCallback,
            assetValueChangeCallback,
            backupChangeCallback,
            fieldsChangeCallback,

        } = this.props;

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
    textFields: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
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
