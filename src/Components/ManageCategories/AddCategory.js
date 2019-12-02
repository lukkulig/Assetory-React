import React from "react";
import * as PropTypes from "prop-types";
import {Button, MenuItem, Select, TextField, withStyles} from "@material-ui/core";
import CategoryAttributes from "./CategoryAttributes"
import api from "../../api";
import {BeatLoader} from "react-spinners";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import {sleep} from "../Overview/Overview";
import SuccessSnackBar from "../SuccessSnackBar";

const styles = ({
    root: {},
    content: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    textField: {
        width: 400,
    },
    select: {
        textAlign: 'left',
        paddingLeft: 10,
        width: 400,
    }
});

class AddCategory extends React.Component {
    state = {
        categories: null,
        superCategory: null,
        superCategoryAttributes: null,
        attributes: [],
        newAttributeName: '',
        newAttributeType: 'text',
        newAttributeRequired: false,
        categoryName: '',
        categoryNameError: false,
        attributeNameError: false,
        oldEditedAttributeName: '',
        editedAttributeName: '',
        editedAttributeType: 'text',
        editedAttributeRequired: false,
        editAttributeDialogOpen: false,
        editedAttributeNameError: false,
        snackOpen: false,
        snackMsg: ''
    };

    isLoading() {
        return this.state.categories === null
            || this.state.superCategory === null
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
                        subCategories: c.subCategories
                    }
                });
                let categories = this.prepareCategories(result, 15);
                this.setState({categories: categories});
                this.setState({superCategory: categories[0]});
                document.body.style.cursor = 'default';
            });
    }

    fetchAndSetSuperCategoryAttributes() {
        document.body.style.cursor = 'wait';
        api.fetch(
            api.endpoints.getCategoryAttributes(this.state.superCategory.id),
            (response) => {
                this.setState({superCategoryAttributes: response});
                document.body.style.cursor = 'default';
            }
        )
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
        let foundCategory = this.state.categories.find(category => category.id === categoryId);
        return foundCategory === undefined ? null : foundCategory;
    };

    handleSuperCategoryChange = (event) => {
        this.setState({
            superCategory: this.findCategory(event.target.value),
            newAttributeName: '',
            newAttributeType: 'text',
            newAttributeRequired: false,
            attributeNameError: false
        }, () => {
            if (this.state.superCategory !== null) {
                api.fetch(
                    api.endpoints.getCategoryAttributes(this.state.superCategory.id),
                    (response) => {
                        this.setState({superCategoryAttributes: response})
                    }
                )
            }
        });
    };

    handleCategoryNameChange = (event) => {
        if (this.state.categories.map(category => category.name).includes(event.target.value) && this.state.categoryNameError === false) {
            this.setState({categoryNameError: true})
        } else if (!this.state.categories.map(category => category.name).includes(event.target.value) && this.state.categoryNameError === true) {
            this.setState({categoryNameError: false})
        }
        this.setState({categoryName: event.target.value});
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
        if (this.state.superCategoryAttributes !== undefined) {
            allAttributes = allAttributes.concat(this.state.superCategoryAttributes);
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

    handleAddCategoryButton = () => {
        const category = {
            additionalAttributes: this.state.attributes,
            name: this.state.categoryName,
            parentCategoryId: this.state.superCategory !== undefined ? this.state.superCategory.id : null
        };
        api.fetch(api.endpoints.addCategory(category),
            () => {
                this.setState({
                    attributes: [],
                    newAttributeName: '',
                    newAttributeType: 'text',
                    categories: null,
                    superCategory: null,
                    superCategoryAttributes: null,
                    categoryName: '',
                });
                this.handleSnackbarOpen(category.name);
                sleep(1000).then(() => {
                    this.fetchAndSetCategories()
                        .then(() => this.fetchAndSetSuperCategoryAttributes());
                })
            })
    };

    handleSnackbarClose = () => {
        this.setState({snackOpen: false});
    };

    handleSnackbarOpen = (name) => {
        this.setState({snackOpen: true, snackMsg: "Category " + name + " was created!"})
    };

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <SuccessSnackBar
                    open={this.state.snackOpen}
                    message={this.state.snackMsg}
                    callback={this.handleSnackbarClose}
                />
                {!this.isLoading() ? (
                    <form className={classes.content} noValidate>
                        <div className={classes.content}>
                            <FormControl>
                                <InputLabel id="super-category-select-label">Supercategory</InputLabel>
                                <Select className={classes.select}
                                        id="super-category-select"
                                        labelId="super-category-select-label"
                                        value={this.state.superCategory.id}
                                        onChange={this.handleSuperCategoryChange}
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
                        </div>
                        <div className={classes.content}>
                            <TextField
                                error={this.state.categoryNameError}
                                className={classes.textField}
                                label={"Category name"}
                                value={this.state.categoryName}
                                onChange={this.handleCategoryNameChange}
                                helperText={this.state.categoryNameError === true ? 'Category with that name already exists' : ''}
                            />
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
                                editedAttributeRequired={this.state.editedAttributeRequired}
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
                                    onClick={this.handleAddCategoryButton}
                                    disabled={this.state.categoryNameError || this.state.categoryName === ''}
                            >
                                Add category
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

AddCategory.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddCategory)