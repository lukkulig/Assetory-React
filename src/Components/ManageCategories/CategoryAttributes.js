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
import Fab from "@material-ui/core/Fab";
import {Cancel, CheckCircle, Delete, Edit} from '@material-ui/icons';
import ListSubheader from "@material-ui/core/ListSubheader";

const styles = ({
    root: {
        height: "100%",
        minHeight: '210px',
        display: 'grid',
        gridTemplateRows: 'min-content auto',
        gridTemplateAreas: `'form'
                             'attributes'`
    },
    form: {
        minHeight: '110px',
        gridArea: 'form',
        float: 'left'
    },
    attributeTypeSelect: {
        width: 150,
        textAlign: 'left',
    },
    attributesListBox: {
        minHeight: '90px',
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
        marginTop: 7.5,
        marginLeft: 0,
        marginRight: 0,
    },
    listItem: {
        display: 'grid',
        gridTemplateColumns: '400px 90px 90px 100px',
        gridTemplateAreas: `'name type required buttons'`,
    },
    name: {
        gridArea: 'name',
        wordWrap: "break-word",
        marginRight: 10
    },
    type: {
        gridArea: 'type',
        marginRight: 10
    },
    required: {
        gridArea: 'required',
        textAlign: 'center',
        marginRight: 10
    },
    buttons: {
        gridArea: 'buttons'
    },
    button: {
        marginLeft: '5px',
        marginRight: '5px'
    },
    smallButton: {
        height: 36,
        width: 36,
    },
    list: {
        paddingTop: 0,
        paddingBottom: 0
    },
    listSubheaderText: {
        verticalAlign: 'top',
        paddingTop: 0,
        paddingBottom: 0,
        height: 30,
        textAlign: 'left',
        paddingLeft: 10,
        fontSize: 12,
        color: "#6B778C"
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
                        <TextField inputProps={{maxLength: 18}}
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

const AttributeListItem = (i, classes, name, type, required, handleChange, fromSupercategory, id, editAttributeCallback, editAttributeDialogProps, deleteAttributeCallback) => {
    return (
        <ListItem key={i} component={"li"} className={classes.listItem}>
            <div className={classes.name}>{name}</div>
            <div className={classes.type}>{type.charAt(0).toUpperCase() + type.slice(1)}</div>
            <div className={classes.required}>
                {required ?
                    <CheckCircle color={"primary"}/>
                    :
                    <Cancel color={"disabled"}/>
                }
            </div>
            <div className={classes.buttons}>
                {!fromSupercategory &&
                <Fab className={classes.button} classes={{sizeSmall: classes.smallButton}}
                     size="small" color="primary"
                     onClick={() => editAttributeCallback(name)}>
                    <Edit/>
                </Fab>
                }
                {!fromSupercategory &&
                <Fab className={classes.button} classes={{sizeSmall: classes.smallButton}}
                     size="small" color="secondary"
                     onClick={() => deleteAttributeCallback(name)}>
                    <Delete/>
                </Fab>
                }
            </div>
            {EditAttributeDialog(classes,
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
        const inheritedAttributesList = [];
        const attributesList = [];
        if (this.props.superCategoryAttributes !== undefined) {
            this.props.superCategoryAttributes.forEach((attribute) => {
                inheritedAttributesList.push(
                    AttributeListItem(i, this.props.classes, attribute.name, attribute.type, attribute.required, this.props.attributeRequiredChangeCallback, true, i.toString(), this.props.editAttributeCallback, editAttributeDialogProps)
                );
                i++;
            });
        }
        this.props.attributes.forEach((attribute) => {
            attributesList.push(
                AttributeListItem(i, this.props.classes, attribute.name, attribute.type, attribute.required, this.props.attributeRequiredChangeCallback, false, i.toString(), this.props.editAttributeCallback, editAttributeDialogProps, this.props.deleteAttributeCallback)
            );
            i++;
        });

        return (
            <div className={classes.root}>
                <div className={classes.form}>
                    <div className={classes.attributeContent}>
                        <TextField inputProps={{maxLength: 18}}
                            error={this.props.attributeNameError}
                            className={classes.attributeNameTextField}
                            label={"New attribute name"}
                            value={this.props.newAttributeName}
                            variant={"outlined"}
                            onChange={this.props.attributeNameChangeCallback}
                            helperText={this.props.attributeNameError === true ? 'There is already attribute with that name in this category' : 'New attribute for all assets in this category'}
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
                        <FormControlLabel classes={{labelPlacementStart: classes.checkbox}}
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
                    <List disablePadding={true}>
                        <ListItem component={"li"} className={classes.listItem} divider={true}>
                            <div className={classes.name} style={{fontWeight: 1000, color: "darkgray"}}>Name</div>
                            <div className={classes.type} style={{fontWeight: 1000, color: "darkgray"}}>Type</div>
                            <div className={classes.required} style={{fontWeight: 1000, color: "darkgray"}}>Required
                            </div>
                        </ListItem>
                    </List>
                    {inheritedAttributesList.length !== 0 &&
                    <List disablePadding={true}
                          subheader={
                              <ListSubheader component='div' classes={{root: classes.listSubheaderText}}
                                             disableSticky={true}>
                                  Attributes inherited from supercategories
                              </ListSubheader>
                          }>
                        {inheritedAttributesList}
                    </List>
                    }
                    {attributesList.length !== 0 &&
                    <List disablePadding={true}
                          subheader={
                              <ListSubheader component='div' classes={{root: classes.listSubheaderText}}
                                             disableSticky={true}>
                                  Specific attributes
                              </ListSubheader>
                          }>
                        {attributesList}
                    </List>
                    }
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
