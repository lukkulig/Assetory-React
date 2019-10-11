import React from "react";
import * as PropTypes from "prop-types";
import {
    withStyles,
    TextField,
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
        categories: [],
        attributes: [],
        newAttributeName: '',
        newAttributeType: 'text',
        newAttributeRequired: false,
        supercategoryAttributes: [],
        category: undefined,
        deleteDialogOpen: false,
        deleteWithContent: false,
        attributeNameError: false,
    };

    componentDidMount() {
        this.fetchAndSetCategories();
    }

    fetchAndSetCategories() {
        document.body.style.cursor = 'wait';
        api.fetch(
            api.endpoints.getAllCategories(),
            (response) => {
                this.setState({categories: response.content});
                document.body.style.cursor = 'default';
            });
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
        console.log(this.state.category);
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
                            {this.state.categories.map(category => <MenuItem
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

export default withStyles(styles)(EditCategory)