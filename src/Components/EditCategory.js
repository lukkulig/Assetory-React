import React from "react";
import * as PropTypes from "prop-types";
import {
    withStyles,
    Button,
    Select,
    MenuItem,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText
} from "@material-ui/core";
import CategoryAttributes from "./CategoryAttributes"
import api from "../api";

const styles = ({
    root: {},
    content: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    textField: {
        width: 500,
    },
    select: {
        width: 100,
    }
});

class EditCategory extends React.Component {
    state = {
        attributes: [],
        newAttributeName: '',
        newAttributeType: 'text',
        newAttributeRequired: false,
        supercategoryAttributes: [],
        category: undefined,
        deleteDialogOpen: false,
        deleteWithContent: false,
        attributeNameError: false,
        oldEditedAttributeName: '',
        editedAttributeName: '',
        editedAttributeType: 'text',
        editedAttributeRequired: false,
        editAttributeDialogOpen: false,
        editedAttributeNameError: false,
    };

    componentDidMount() {
        this.fetchAndSetCategories();
    }

    fetchAndSetCategories() {
        document.body.style.cursor = 'wait';
        api.fetch(
            api.endpoints.getAllCategories(),
            (response) => {
                this.props.mainCategoryChangeCallback(response.content);
                document.body.style.cursor = 'default';
            });
    }

    findCategory = (categoryId) => {
        const foundCategory = this.props.categories.find(category => category.id === categoryId);
        return foundCategory === undefined ? null : foundCategory;
    };

    handleCategoryChange = (event) => {
        let newCategory = this.findCategory(event.target.value);
        this.setState({
            attributes: newCategory.additionalAttributes,
            newAttributeName: '',
            newAttributeType: 'text',
            category: newCategory
        }, () => {
            if (this.state.category !== undefined && this.state.category.parentCategoryId !== null) {
                api.fetch(
                    api.endpoints.getCategoryAttributes(newCategory.parentCategoryId),
                    (response) => {
                        this.setState({supercategoryAttributes: response})
                    }
                )
            }
        });
    };

    handleAttributeNameChange = (event) => {
        let allAttributes = this.state.attributes;
        allAttributes = allAttributes.concat(this.state.supercategoryAttributes);
        if (allAttributes.map(attribute => attribute.name).includes(event.target.value) && this.state.attributeNameError === false) {
            this.setState({attributeNameError: true})
        } else if (this.state.attributeNameError === true) {
            this.setState({attributeNameError: false})
        }
        this.setState({newAttributeName: event.target.value})
    };

    handleAttributeTypeChange = (event) => {
        this.setState({newAttributeType: event.target.value})
    };

    handleAttributeRequiredChange = (event) => {
        this.setState({newAttributeRequired: !this.state.newAttributeRequired})
    };

    handleDeleteAttributeButton = (removedAttributeName) => {
        this.setState({attributes: this.state.attributes.filter(attribute => attribute.name !== removedAttributeName)})
    };

    handleSaveAttributeButton = () => {
        const attribute = {
            name: this.state.newAttributeName,
            type: this.state.newAttributeType,
            required: this.state.newAttributeRequired,
        };
        this.setState({
            attributes: this.state.attributes.concat([attribute]),
            newAttributeName: '',
            newAttributeType: 'text',
            newAttributeRequired: false,
        });
    };

    handleEditedAttributeNameChange = (event) => {
        let allAttributes = this.state.attributes;
        allAttributes = allAttributes.concat(this.state.supercategoryAttributes);
        if (allAttributes.map(attribute => attribute.name).includes(event.target.value) && this.state.editedAttributeNameError === false) {
            this.setState({editedAttributeNameError: true})
        } else if (this.state.editedAttributeNameError === true) {
            this.setState({editedAttributeNameError: false})
        }
        this.setState({editedAttributeName: event.target.value})
    };

    handleEditedAttributeTypeChange = (event) => {
        this.setState({editedAttributeType: event.target.value})
    };

    handleEditedAttributeRequiredChange = (event) => {
        this.setState({editedAttributeRequired: !this.state.editedAttributeRequired})
    };

    handleEditAttributeButton = (attributeName) => {
        const foundAttribute = this.state.attributes.find(attribute => attribute.name === attributeName);
        this.setState({
            oldEditedAttributeName: foundAttribute.name,
            editedAttributeName: foundAttribute.name,
            editedAttributeType: foundAttribute.type,
            editedAttributeRequired: foundAttribute.required,
            editAttributeDialogOpen: true,
        })
    };

    handleSaveEditedAttributeButton = () => {
        let attribute = {
            name: this.state.editedAttributeName,
            type: this.state.editedAttributeType,
            required: this.state.editedAttributeRequired,
        };
        let newAttributes = this.state.attributes.filter(a => a.name !== this.state.oldEditedAttributeName);
        newAttributes = newAttributes.concat([attribute]);
        this.setState({
            attributes: newAttributes,
            oldEditedAttributeName: '',
            editedAttributeName: '',
            editedAttributeType: 'text',
            editedAttributeRequired: false,
            editAttributeDialogOpen: false,
            editedAttributeNameError: false,
        });
    };

    handleSaveCategoryButton = () => {
        let category = this.state.category;
        category.additionalAttributes = this.state.attributes;
        api.fetch(api.endpoints.updateCategory(category),
            () => {
                this.setState({
                    attributes: [],
                    newAttributeName: '',
                    newAttributeType: 'text',
                    newAttributeRequired: false,
                    supercategoryAttributes: [],
                    category: undefined,
                })
            });
    };

    handleDeleteCategoryButton = () => {
        this.setState({deleteDialogOpen: true});
    };

    handleDeleteOptionChange = (event) => {
        this.setState({deleteWithContent: event.target.value === "with-content"});
    };

    handleDeleteConfirmButton = () => {
        if (this.state.deleteWithContent === true) {
            api.fetch(api.endpoints.deleteCategoryWithContent(this.state.category.id), () => {
                this.setState({
                    deleteDialogOpen: false,
                    deleteWithContent: false,
                    attributes: [],
                    newAttributeName: '',
                    newAttributeType: 'text',
                    newAttributeRequired: false,
                    supercategoryAttributes: [],
                    category: undefined,
                })
            })
        } else {
            api.fetch(api.endpoints.deleteCategory(this.state.category.id), () => {
                this.setState({
                    deleteDialogOpen: false,
                    deleteWithContent: false,
                    attributes: [],
                    newAttributeName: '',
                    newAttributeType: 'text',
                    newAttributeRequired: false,
                    supercategoryAttributes: [],
                    category: undefined,
                })
            })
        }

    };

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.root}>
                <form className={classes.content} noValidate>
                    <div className={classes.content}>
                        <Select
                            className={classes.textField}
                            label={"Category"}
                            value={this.state.category === undefined ? '' : this.state.category.name}
                            onChange={this.handleCategoryChange}
                            variant="outlined"
                        >
                            {this.props.categories.map(category => <MenuItem
                                value={category.id}>{category.name}</MenuItem>)}
                        </Select>
                        <React.Fragment>
                            <Button style={{float: "left"}}
                                    className={classes.button}
                                    variant="contained"
                                    color="secondary"
                                    onClick={this.handleDeleteCategoryButton}
                                    disabled={this.state.category === undefined || this.state.category === null}
                            >
                                Delete
                            </Button>
                            <Dialog
                                open={this.state.deleteDialogOpen}
                            >
                                <DialogTitle id="delete-category">Delete category</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Delete options
                                    </DialogContentText>
                                    <form className={classes.form} noValidate>
                                        <FormControl>
                                            <RadioGroup name="delete-options" onChange={this.handleDeleteOptionChange}>
                                                <FormControlLabel value="with-content" control={<Radio/>}
                                                                  label="Category with all its assets and subcategories"/>
                                                <FormControlLabel value="without-content" control={<Radio/>}
                                                                  label="Only the category"/>
                                            </RadioGroup>
                                        </FormControl>
                                    </form>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={this.handleDeleteConfirmButton} color="primary">
                                        Delete
                                        category {this.state.category === undefined ? "" : this.state.category.name}
                                    </Button>
                                    <Button onClick={() => this.setState({deleteDialogOpen: false})} color="secondary">
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </React.Fragment>
                    </div>
                    <div className={classes.content} style={{clear: "both"}}>
                        <CategoryAttributes
                            classes={classes}
                            attributes={this.state.attributes}
                            supercategoryAttributes={this.state.supercategoryAttributes}
                            newAttributeName={this.state.newAttributeName}
                            newAttributeType={this.state.newAttributeType}
                            newAttributeRequired={this.state.newAttributeRequired}
                            attributeNameChangeCallback={this.handleAttributeNameChange}
                            attributeTypeChangeCallback={this.handleAttributeTypeChange}
                            attributeRequiredChangeCallback={this.handleAttributeRequiredChange}
                            saveAttributeCallback={this.handleSaveAttributeButton}
                            deleteAttributeCallback={this.handleDeleteAttributeButton}
                            attributeNameError={this.state.attributeNameError}
                            editedAttributeName={this.state.editedAttributeName}
                            editedAttributeType={this.state.editedAttributeType}
                            editedAttributeRequired={this.state.newAttributeRequired}
                            editedAttributeNameChangeCallback={this.handleEditedAttributeNameChange}
                            editedAttributeTypeChangeCallback={this.handleEditedAttributeTypeChange}
                            editedAttributeRequiredChangeCallback={this.handleEditedAttributeRequiredChange}
                            saveEditedAttributeCallback={this.handleSaveEditedAttributeButton}
                            editAttributeCallback={this.handleEditAttributeButton}
                            editAttributeDialogOpen={this.state.editAttributeDialogOpen}
                        />
                    </div>
                    <div className={classes.content}>
                        <Button variant="outlined"
                                color="primary"
                                className={classes.button}
                                onClick={this.handleSaveCategoryButton}
                        >
                            Save category
                        </Button>
                    </div>
                </form>
            </div>
        );
    }
}

EditCategory.propTypes = {
    mainCategoryChangeCallback: PropTypes.func.isRequired,
    categories: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        parentCategoryId: PropTypes.string.isRequired,
        subCategoryId: PropTypes.arrayOf(PropTypes.string).isRequired,
        additionalAttributes: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            required: PropTypes.string.isRequired,
        })).isRequired,
    })).isRequired,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EditCategory)