import React from "react";
import * as PropTypes from "prop-types";
import {withStyles, TextField, Button, Select, MenuItem} from "@material-ui/core";
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

class AddCategory extends React.Component {
    state = {
        attributes: [],
        newAttributeName: '',
        newAttributeType: 'text',
        newAttributeRequired: false,
        supercategory: '',
        supercategoryAttributes: [],
        categoryName: '',
        categoryNameError: false,
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
                this.props.mainCategoryChangeCallback(response);
                this.setState({supercategory: this.props.categories.size === 0 ? undefined : this.props.categories.slice(-1)[0]},
                    () => {
                        if (this.state.supercategory !== undefined && this.state.supercategory !== null) {
                            api.fetch(
                                api.endpoints.getCategoryAttributes(this.state.supercategory.id),
                                (response) => {
                                    this.setState({supercategoryAttributes: response})
                                }
                            )
                        }
                    });
                document.body.style.cursor = 'default';
            });
    }

    findCategory = (categoryId) => {
        const foundCategory = this.props.categories.find(category => category.id === categoryId);
        return foundCategory === undefined ? null : foundCategory;
    };

    handleSupercategoryChange = (event) => {
        this.setState({supercategory: this.findCategory(event.target.value)},
            () => {
                if (this.state.supercategory !== undefined && this.state.supercategory !== null) {
                    api.fetch(
                        api.endpoints.getCategoryAttributes(this.state.supercategory.id),
                        (response) => {
                            this.setState({supercategoryAttributes: response})
                        }
                    )
                }
            });
    };

    handleCategoryNameChange = (event) => {
        if (this.props.categories.map(category => category.name).includes(event.target.value) && this.state.categoryNameError === false) {
            this.setState({categoryNameError: true})
        } else if (this.state.categoryNameError === true) {
            this.setState({categoryNameError: false})
        }
        this.setState({categoryName: event.target.value});
    };

    handleAttributeNameChange = (event) => {
        let allAttributes = this.state.attributes;
        if (this.state.supercategoryAttributes !== undefined) {
            allAttributes = allAttributes.concat(this.state.supercategoryAttributes);
        }
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
            newAttributeRequired: false
        });
    };

    handleEditedAttributeNameChange = (event) => {
        let allAttributes = this.state.attributes;
        if (this.state.supercategoryAttributes !== undefined) {
            allAttributes = allAttributes.concat(this.state.supercategoryAttributes);
        }
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

    handleAddCategoryButton = () => {
        const category = {
            additionalAttributes: this.state.attributes,
            name: this.state.categoryName,
            parentCategoryId: this.state.supercategory !== undefined ? this.state.supercategory.id : null
        };
        api.fetch(api.endpoints.addCategory(category),
            (category) => {
                let supercategory = this.state.supercategory;
                if (supercategory !== undefined) {
                    supercategory.subcategoryIds = supercategory.subcategoryIds.concat([category.id]);
                    api.fetch(api.endpoints.updateCategory(supercategory), () => null);
                    this.setState({
                        attributes: [],
                        newAttributeName: '',
                        newAttributeType: 'text',
                        supercategory: undefined,
                        supercategoryAttributes: [],
                        categoryName: '',
                    });
                }
                this.fetchAndSetCategories();
            });
    };

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <form className={classes.content} noValidate>
                    <div className={classes.content}>
                        <Select
                            label={"Supercategory"}
                            className={classes.select}
                            value={this.state.supercategory === undefined ? '' : this.state.supercategory.name}
                            onChange={this.handleSupercategoryChange}
                        >
                            {this.props.categories.map(category => <MenuItem
                                value={category.id}>{category.name}</MenuItem>)}
                        </Select>
                    </div>
                    <div className={classes.content}>
                        <TextField
                            error={this.state.categoryNameError}
                            className={classes.textField}
                            label={"Category name"}
                            value={this.state.categoryName}
                            onChange={this.handleCategoryNameChange}
                            variant="outlined"
                            helperText={this.state.categoryNameError === true ? 'Category with that name already exists' : ''}
                        />
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
                                onClick={this.handleAddCategoryButton}
                                disabled={this.state.categoryNameError}
                        >
                            Add category
                        </Button>
                    </div>
                </form>
            </div>
        );
    }
}

AddCategory.propTypes = {
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

export default withStyles(styles)(AddCategory)