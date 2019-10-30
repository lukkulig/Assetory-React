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
    root: {},
    content: {},
    select: {},
    attributesListBox: {
        maxHeight: 280,
        overflow: 'auto',
    },
    textField: {
        width: 400,
    },
    attributeContent: {
        float: 'left',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
    },
});

const EditAttributeDialog = (classes, dialogOpen, nameError, name, nameChangeCallback, type, typeChangeCallback, required, requiredChangeCallback, saveAttributeCallback) => {
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
                            className={classes.textField}
                            label={"Attribute name"}
                            value={name}
                            onChange={nameChangeCallback}
                            variant="outlined"
                            helperText={nameError === true ? 'There is already attribute with that name in this category' : 'Attribute required for all assets in this category'}
                        />
                    </div>
                    <div className={classes.attributeContent}>
                        <Select
                            className={classes.select}
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
                    <Button
                        color="primary"
                        className={classes.button}
                        onClick={saveAttributeCallback}
                        disabled={nameError}
                    >
                        Add attribute
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
};

const AttributeListItem = (name, type, required, handleChange, fromSupercategory, id, editAttributeCallback, editAttributeDialogProps) => {
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
            <Button variant="contained"
                    disabled={fromSupercategory}
                    onClick={() => editAttributeCallback(name)}
            >
                Edit
            </Button>
            {EditAttributeDialog(editAttributeDialogProps.classes,
                editAttributeDialogProps.dialogOpen,
                editAttributeDialogProps.nameError,
                editAttributeDialogProps.name,
                editAttributeDialogProps.nameChangeCallback,
                editAttributeDialogProps.type,
                editAttributeDialogProps.typeChangeCallback,
                editAttributeDialogProps.required,
                editAttributeDialogProps.requiredChangeCallback,
                editAttributeDialogProps.saveAttribute)}
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
        };
        let i = 0;
        // console.log(this.props.superCategoryAttributes);
        const attributesList = [];
        if (this.props.superCategoryAttributes !== undefined) {
            this.props.superCategoryAttributes.forEach((attribute) => {
                attributesList.push(
                    <div key={i}>
                        {AttributeListItem(attribute.name, attribute.type, attribute.required, this.props.attributeRequiredChangeCallback, true, i.toString(), this.props.editAttributeCallback, editAttributeDialogProps)}
                        <br/>
                    </div>
                );
                i++;
            });
        }
        this.props.attributes.forEach((attribute) => {
            attributesList.push(
                <div key={i}>
                    {AttributeListItem(attribute.name, attribute.type, attribute.required, this.props.attributeRequiredChangeCallback, false, i.toString(), this.props.editAttributeCallback, editAttributeDialogProps)}
                    <Button style={{float: "left"}}
                            className={classes.button}
                            variant="contained"
                            color="secondary"
                            onClick={() => this.props.deleteAttributeCallback(attribute.name)}
                    >
                        Delete
                    </Button>
                    <br/>
                </div>
            );
            i++;
        });

        return (
            <div>
                <div style={{float: 'left'}}>
                    <div className={classes.attributeContent}>
                        <TextField
                            error={this.props.attributeNameError}
                            className={classes.textField}
                            label={"Additional attribute"}
                            value={this.props.newAttributeName}
                            onChange={this.props.attributeNameChangeCallback}
                            helperText={this.props.attributeNameError === true ? 'There is already attribute with that name in this category' : 'Attribute for all assets in this category'}
                        />
                    </div>
                    <div className={classes.attributeContent}>
                        <Select
                            className={classes.select}
                            value={this.props.newAttributeType}
                            onChange={this.props.attributeTypeChangeCallback}
                        >
                            <MenuItem value={"text"}>Text</MenuItem>
                            <MenuItem value={"number"}>Number</MenuItem>
                            <MenuItem value={"date"}>Date</MenuItem>
                        </Select>
                    </div>
                    <div className={classes.attributeContent}>
                        <FormControlLabel
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
                        <Button variant="outlined"
                                color="primary"
                                className={classes.button}
                                onClick={this.props.saveAttributeCallback}
                                disabled={this.props.attributeNameError}
                        >
                            Save attribute
                        </Button>
                    </div>
                </div>
                <Paper className={classes.attributesListBox} elevation={4} style={{clear: "both"}}>
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
};

export default withStyles(styles)(CategoryAttributes)
