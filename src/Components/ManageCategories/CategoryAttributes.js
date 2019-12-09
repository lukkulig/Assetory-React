import React from "react";
import * as PropTypes from "prop-types";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    List,
    ListItem,
    MenuItem,
    Paper,
    Select,
    TextField,
    withStyles
} from "@material-ui/core";

const styles = ({
    root: {
        height: "100%",
        display: 'grid',
        gridTemplateRows: 'max-content auto',
        gridTemplateAreas: `'form'
                             'attributes'`
    },
    form: {
        gridArea: 'form',
        float: 'left'
    },
    attributeTypeSelect: {
        width: 150,
        textAlign: 'left',

    },
    attributesListBox: {
        gridArea: 'attributes',
        overflow: 'auto',
        scrollPaddingRight: 10
    },
    attributeNameTextField: {
        width: 300
    },
    attributeContent: {
        float: 'left',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10
    },
    checkbox: {
        marginTop: 7.5
    }
});

const EditAttributeDialog = (classes, dialogOpen, nameError, name, nameChangeCallback, type, typeChangeCallback, required, requiredChangeCallback, saveAttributeCallback, cancelEditCallback) => {
    return (
        <React.Fragment>
            <Dialog
                open={dialogOpen}
            >
                <DialogTitle id="edit-attribute">Edit attribute</DialogTitle>
                <DialogContent>
                    <div className={classes.attributeContent}>
                        <TextField
                            error={nameError}
                            className={classes.attributeNameTextField}
                            label={"Attribute name"}
                            value={name}
                            onChange={nameChangeCallback}
                            variant="outlined"
                            helperText={nameError === true ? 'There is already attribute with that name in this category' : 'Attribute required for all assets in this category'}
                        />
                    </div>
                    <div className={classes.attributeContent}>
                        <Select
                            className={classes.attributeTypeSelect}
                            value={type}
                            onChange={typeChangeCallback}
                        >
                            <MenuItem value={"text"}>Text</MenuItem>
                            <MenuItem value={"number"}>Number</MenuItem>
                            <MenuItem value={"date"}>Date</MenuItem>
                        </Select>
                    </div>
                    <div className={classes.attributeContent}>
                        <FormControlLabel
                            control={<Checkbox
                                id={"edited"}
                                checked={required}
                                onChange={requiredChangeCallback}
                                value="required"
                                color="primary"/>}
                            label="Required"
                            labelPlacement="start"
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button color="default"
                            onClick={cancelEditCallback}>
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        onClick={saveAttributeCallback}
                        disabled={nameError || name === ''}
                    >
                        Save attribute
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
};

const AttributeListItem = (name, type, required, handleChange, fromSupercategory, id, editAttributeCallback, editAttributeDialogProps, withDelete, deleteAttributeCallback) => {
    return (
        <ListItem component={"li"} style={{float: "left"}}>
            {name + " (" + type + ")"}
            <FormControlLabel
                control={<Checkbox
                    id={id}
                    disabled={true}
                    checked={required}
                    onChange={handleChange}
                    value="required"
                    color="primary"/>}
                label="Required"
                labelPlacement="start"
            />
            {!fromSupercategory &&
            <Button variant="contained"
                    onClick={() => editAttributeCallback(name)}
            >
                Edit
            </Button>
            }
            {!fromSupercategory && withDelete &&
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => deleteAttributeCallback(name)}
                >
                    Delete
                </Button>
            }
            {EditAttributeDialog(editAttributeDialogProps.classes,
                editAttributeDialogProps.dialogOpen,
                editAttributeDialogProps.nameError,
                editAttributeDialogProps.name,
                editAttributeDialogProps.nameChangeCallback,
                editAttributeDialogProps.type,
                editAttributeDialogProps.typeChangeCallback,
                editAttributeDialogProps.required,
                editAttributeDialogProps.requiredChangeCallback,
                editAttributeDialogProps.saveAttribute,
                editAttributeDialogProps.cancelEditCallback,)}
        </ListItem>
    )
};

class CategoryAttributes extends React.Component {
    render() {
        const {classes} = this.props;
        let editAttributeDialogProps = {
            classes: this.props.classes,
            dialogOpen: this.props.editAttributeDialogOpen,
            required: this.props.editedAttributeRequired,
            requiredChangeCallback: this.props.editedAttributeRequiredChangeCallback,
            name: this.props.editedAttributeName,
            nameChangeCallback: this.props.editedAttributeNameChangeCallback,
            type: this.props.editedAttributeType,
            typeChangeCallback: this.props.editedAttributeTypeChangeCallback,
            nameError: this.props.editedAttributeNameError,
            saveAttribute: this.props.saveEditedAttributeCallback,
            cancelEditCallback: this.props.cancelAttributeEditCallback,
        };
        let i = 0;
        const attributesList = [];
        if (this.props.superCategoryAttributes !== undefined) {
            this.props.superCategoryAttributes.forEach((attribute) => {
                attributesList.push(
                    <div key={i}>
                        {AttributeListItem(attribute.name, attribute.type, attribute.required, this.props.attributeRequiredChangeCallback, true, i.toString(), this.props.editAttributeCallback, editAttributeDialogProps, false)}
                        <br/>
                    </div>
                );
                i++;
            });
        }
        this.props.attributes.forEach((attribute) => {
            attributesList.push(
                <div key={i}>
                    {AttributeListItem(attribute.name, attribute.type, attribute.required, this.props.attributeRequiredChangeCallback, false, i.toString(), this.props.editAttributeCallback, editAttributeDialogProps,true, this.props.deleteAttributeCallback)}
                    <br/>
                </div>
            );
            i++;
        });

        return (
            <div className={classes.root}>
                <div className={classes.form}>
                    <div className={classes.attributeContent}>
                        <TextField
                            error={this.props.attributeNameError}
                            className={classes.attributeNameTextField}
                            label={"Additional attribute"}
                            value={this.props.newAttributeName}
                            variant={"outlined"}
                            onChange={this.props.attributeNameChangeCallback}
                            helperText={this.props.attributeNameError === true ? 'There is already attribute with that name in this category' : 'Attribute for all assets in this category'}
                        />
                    </div>
                    <div className={classes.attributeContent}>
                        <Select
                            className={classes.attributeTypeSelect}
                            value={this.props.newAttributeType}
                            variant={"outlined"}
                            onChange={this.props.attributeTypeChangeCallback}
                        >
                            <MenuItem value={"text"}>Text</MenuItem>
                            <MenuItem value={"number"}>Number</MenuItem>
                            <MenuItem value={"date"}>Date</MenuItem>
                        </Select>
                    </div>
                    <div className={classes.attributeContent}>
                        <FormControlLabel className={classes.checkbox}
                             control={<Checkbox
                                id={"new"}
                                checked={this.props.newAttributeRequired}
                                onChange={this.props.attributeRequiredChangeCallback}
                                value="required"
                                color="primary"/>}
                            label="Required"
                            labelPlacement="start"
                        />
                    </div>
                    <div className={classes.attributeContent}>
                        <Button style={{marginTop: 7.625}}
                                variant="contained"
                                color="primary"
                                size={"large"}
                                onClick={this.props.saveAttributeCallback}
                                disabled={this.props.attributeNameError || this.props.newAttributeName === ''}
                        >
                            Add attribute
                        </Button>
                    </div>
                </div>
                <Paper className={classes.attributesListBox} elevation={4}>
                    <List component={"ul"}>
                        {attributesList}
                    </List>
                </Paper>
            </div>
        )
    }
}

CategoryAttributes.propTypes = {
    classes: PropTypes.object.isRequired,
    attributes: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        required: PropTypes.bool.isRequired,
    })).isRequired,
    superCategoryAttributes: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        required: PropTypes.bool.isRequired,
    })).isRequired,
    newAttributeName: PropTypes.string.isRequired,
    newAttributeType: PropTypes.string.isRequired,
    newAttributeRequired: PropTypes.bool.isRequired,
    attributeNameChangeCallback: PropTypes.func.isRequired,
    attributeTypeChangeCallback: PropTypes.func.isRequired,
    attributeRequiredChangeCallback: PropTypes.func.isRequired,
    saveAttributeCallback: PropTypes.func.isRequired,
    deleteAttributeCallback: PropTypes.func.isRequired,
    editedAttributeName: PropTypes.string.isRequired,
    editedAttributeType: PropTypes.string.isRequired,
    editedAttributeRequired: PropTypes.bool.isRequired,
    saveEditedAttributeCallback: PropTypes.func.isRequired,
    editedAttributeNameChangeCallback: PropTypes.func.isRequired,
    editedAttributeTypeChangeCallback: PropTypes.func.isRequired,
    editedAttributeRequiredChangeCallback: PropTypes.func.isRequired,
    editAttributeDialogOpen: PropTypes.bool.isRequired,
    editAttributeCallback: PropTypes.func.isRequired,
    cancelAttributeEditCallback: PropTypes.func.isRequired,
};

export default withStyles(styles)(CategoryAttributes)
