import React from "react";
import * as PropTypes from "prop-types";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    withStyles
} from "@material-ui/core";
import CategoryAttributes from "./CategoryAttributes"
import api from "../../api";
import InputLabel from "@material-ui/core/InputLabel";
import {BeatLoader} from "react-spinners";
import {sleep} from "../Overview/Overview";

const styles = ({
    root: {},
    content: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    select: {
        textAlign: 'left',
        paddingLeft: 10,
        width: 400,
    }
});

class EditCategory extends React.Component {
    state = {
        categories: null,
        category: null,
        superCategoryAttributes: null,
        attributes: [],
        newAttributeName: '',
        newAttributeType: 'text',
        newAttributeRequired: false,
        newAttributesNames: [],
        deleteDialogOpen: false,
        deleteWithContent: "without-content",
        attributeNameError: false,
        oldEditedAttributeName: '',
        editedAttributeName: '',
        editedAttributeType: 'text',
        editedAttributeRequired: false,
        editAttributeDialogOpen: false,
        editedAttributeNameError: false,
        attributeChanges: new Map(),
    };

    isLoading() {
        return this.state.categories === null
            || this.state.category === null
            || this.state.superCategoryAttributes == null;
    }

    componentDidMount() {
        this.fetchAndSetCategories()
            .then(() => this.fetchAndSetSuperCategoryAttributes());
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            this.setState({
                categories: null,
                superCategory: null,
                superCategoryAttributes: null
            });
            this.fetchAndSetCategories()
                .then(() => this.fetchAndSetSuperCategoryAttributes());
        }
    }

    fetchAndSetCategories() {
        document.body.style.cursor = 'wait';
        return api.fetch(
            api.endpoints.getCategoryTrees(),
            (response) => {
                let result = response.map(c => {
                    return {
                        category: c.category,
                        subCategories: c.subCategories,
                    }
                });
                let categories = this.prepareCategories(result, 15);
                this.setState({
                    categories: categories,
                    category: categories[0],
                });
                api.fetch(
                    api.endpoints.getCategoryAttributes(this.state.category.id),
                    (response) => {
                        this.setState({attributes: response});
                    }
                );
                document.body.style.cursor = 'default';
            });
    }

    fetchAndSetSuperCategoryAttributes() {
        document.body.style.cursor = 'wait';
        if (this.state.category.parentCategoryId !== null) {
            api.fetch(
                api.endpoints.getCategoryAttributes(this.state.category.parentCategoryId),
                (response) => {
                    this.setState({superCategoryAttributes: response});
                    document.body.style.cursor = 'default';
                }
            )
        } else {
            this.setState({superCategoryAttributes: []});
            document.body.style.cursor = 'default';
        }
    }

    prepareCategories(categories, paddingLeft) {
        let result = [];
        categories.forEach((category) => {
            result.push({
                id: category.category.id,
                name: category.category.name,
                subcategoryIds: category.category.subcategoryIds,
                parentCategoryId: category.category.parentCategoryId,
                additionalAttributes: category.category.additionalAttributes,
                paddingLeft: paddingLeft
            });
            let subCategoriesIds = this.prepareCategories(category.subCategories, (paddingLeft + 20));
            result = result.concat(subCategoriesIds);
        });
        return result;
    }

    findCategory = (categoryId) => {
        const foundCategory = this.state.categories.find(category => category.id === categoryId);
        return foundCategory === undefined ? null : foundCategory;
    };

    handleCategoryChange = (event) => {
        let newCategory = this.findCategory(event.target.value);
        this.setState({
            attributes: newCategory.additionalAttributes,
            newAttributeName: '',
            newAttributeType: 'text',
            newAttributesNames: [],
            attributeChanges: {},
            category: newCategory
        }, () => {
            if (this.state.category !== undefined && this.state.category.parentCategoryId !== null) {
                api.fetch(
                    api.endpoints.getCategoryAttributes(newCategory.parentCategoryId),
                    (response) => {
                        this.setState({superCategoryAttributes: response})
                    }
                )
            } else {
                this.setState({superCategoryAttributes: []});
            }
        });
    };

    handleAttributeNameChange = (event) => {
        let allAttributes = this.state.attributes;
        allAttributes = allAttributes.concat(this.state.superCategoryAttributes);
        if (allAttributes.map(attribute => attribute.name).includes(event.target.value) && this.state.attributeNameError === false) {
            this.setState({attributeNameError: true})
        } else if (!allAttributes.map(attribute => attribute.name).includes(event.target.value) && this.state.attributeNameError === true) {
            this.setState({attributeNameError: false})
        }
        this.setState({newAttributeName: event.target.value})
    };

    handleAttributeTypeChange = (event) => {
        this.setState({newAttributeType: event.target.value})
    };

    handleAttributeRequiredChange = () => {
        this.setState({newAttributeRequired: !this.state.newAttributeRequired})
    };

    handleDeleteAttributeButton = (removedAttributeName) => {
        if (this.state.newAttributesNames.some(name => name === removedAttributeName)) {
            this.setState({newAttributesNames: this.state.newAttributesNames.filter(attr => attr !== removedAttributeName)})
        }
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
            newAttributesNames: this.state.newAttributesNames.concat([attribute.name]),
            newAttributeName: '',
            newAttributeType: 'text',
            newAttributeRequired: false,
        });
    };

    handleEditedAttributeNameChange = (event) => {
        let allAttributes = this.state.attributes;
        allAttributes = allAttributes.concat(this.state.superCategoryAttributes);
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

    handleEditedAttributeRequiredChange = () => {
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
        let newMap = this.state.attributeChanges;
        newMap[this.state.oldEditedAttributeName] = this.state.editedAttributeName;
        if (this.state.newAttributesNames.some(name => name === this.state.oldEditedAttributeName)) {
            this.setState({
                newAttributesNames: this.state.newAttributesNames
                    .filter(name => name !== this.state.oldEditedAttributeName)
                    .concat([attribute.name]),
            })
        } else {
            this.setState({
                attributeChanges: newMap,
            });
        }
        let index = this.state.attributes.map(attribute => attribute.name).indexOf(this.state.oldEditedAttributeName);
        let newAttributes = this.state.attributes.filter(a => a.name !== this.state.oldEditedAttributeName);
        newAttributes.splice(index, 0, attribute);
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

    handleCancelAttributeEdition = () => {
        this.setState({
            oldEditedAttributeName: '',
            editedAttributeName: '',
            editedAttributeType: 'text',
            editedAttributeRequired: false,
            editAttributeDialogOpen: false,
            editedAttributeNameError: false,
        })
    };

    handleSaveCategoryButton = () => {
        let category = this.state.category;
        category.additionalAttributes = this.state.attributes;
        let categoryUpdate = {
            category: category,
            attributeChanges: this.state.attributeChanges,
        };
        api.fetch(api.endpoints.updateCategory(categoryUpdate),
            () => {
                this.setState({
                    attributes: [],
                    newAttributeName: '',
                    newAttributeType: 'text',
                    newAttributeRequired: false,
                    newAttributesNames: [],
                    attributeChanges: {},
                    categories: null,
                    category: null,
                    superCategoryAttributes: []
                });
                this.fetchAndSetCategories()
                    .then(() => this.fetchAndSetSuperCategoryAttributes());
            });
    };

    handleDeleteCategoryButton = () => {
        this.setState({deleteDialogOpen: true});
    };

    handleDeleteOptionChange = (event) => {
        this.setState({deleteWithContent: event.target.value});
    };

    handleDeleteConfirmButton = () => {
        if (this.state.deleteWithContent === "with-content") {
            api.fetchDelete(api.endpoints.deleteCategoryWithContent(this.state.category.id), () => {
                this.setState({
                    deleteDialogOpen: false,
                    deleteWithContent: "without-content",
                    attributes: [],
                    newAttributeName: '',
                    newAttributeType: 'text',
                    newAttributeRequired: false,
                    newAttributesNames: [],
                    categories: null,
                    category: null,
                    superCategoryAttributes: []
                });
                this.fetchAndSetCategories()
                    .then(() => this.fetchAndSetSuperCategoryAttributes());
            })
        } else {
            api.fetchDelete(api.endpoints.deleteCategory(this.state.category.id), () => {
                this.setState({
                    deleteDialogOpen: false,
                    deleteWithContent: "without-content",
                    attributes: [],
                    newAttributeName: '',
                    newAttributeType: 'text',
                    newAttributeRequired: false,
                    newAttributesNames: [],
                    categories: null,
                    category: null,
                    superCategoryAttributes: []

                });
                sleep(1000).then(() => {
                    this.fetchAndSetCategories()
                        .then(() => this.fetchAndSetSuperCategoryAttributes());
                });
            });
        }
    };

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                {!this.isLoading() ? (
                    <form className={classes.content} noValidate>
                        <div className={classes.content}>
                            <FormControl>
                                <InputLabel id="category-select-label">Category</InputLabel>
                                <Select className={classes.select}
                                        id="category-select"
                                        labelId="category-select-label"
                                        value={this.state.category.id}
                                        onChange={this.handleCategoryChange}
                                >
                                    {this.state.categories.map(category =>
                                        <MenuItem style={{paddingLeft: category.paddingLeft}}
                                                  key={category.id}
                                                  value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                            {this.state.category !== this.state.categories[0] &&
                            <React.Fragment>
                                <Button style={{float: "left"}}
                                        className={classes.button}
                                        variant="contained"
                                        color="secondary"
                                        onClick={this.handleDeleteCategoryButton}
                                        disabled={this.state.category === undefined}
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
                                                <RadioGroup name="delete-options" value={this.state.deleteWithContent}
                                                            onChange={this.handleDeleteOptionChange}>
                                                    <FormControlLabel value="with-content" control={<Radio/>}
                                                                      label="Category with all its assets and subcategories"/>
                                                    <FormControlLabel value="without-content" control={<Radio/>}
                                                                      label="Only the category"/>
                                                </RadioGroup>
                                            </FormControl>
                                        </form>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button color="default"
                                                onClick={() => this.setState({deleteDialogOpen: false})}>
                                            Cancel
                                        </Button>
                                        <Button onClick={this.handleDeleteConfirmButton} color="secondary">
                                            Delete
                                            category {this.state.category === undefined ? "" : this.state.category.name}
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </React.Fragment>
                            }
                        </div>
                        <div className={classes.content} style={{clear: "both"}}>
                            <CategoryAttributes
                                classes={classes}
                                attributes={this.state.attributes}
                                superCategoryAttributes={this.state.superCategoryAttributes}
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
                                cancelAttributeEditCallback={this.handleCancelAttributeEdition}
                            />
                        </div>
                        <div className={classes.content}>
                            <Button variant="contained"
                                    color="primary"
                                    className={classes.button}
                                    onClick={this.handleSaveCategoryButton}
                            >
                                Save category
                            </Button>
                        </div>
                    </form>
                ) : (
                    <BeatLoader
                        size={10}
                        color={"#3f51b5"}
                    />
                )}
            </div>
        );
    }
}

EditCategory.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EditCategory)