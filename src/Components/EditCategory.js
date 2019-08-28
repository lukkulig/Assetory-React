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
    attributeContent: {
        float: 'left',
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
        supercategory: '',
        category: undefined
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
        let category = this.findCategory(event.target.value);
        this.setState({
            attributes: category.additionalAttributes,
            newAttributeName: '',
            newAttributeType: 'text',
            supercategory: this.findCategory(category.parentCategoryId),
            category: category
        });
    };

    handleAttributeNameChange = (event) => {
        this.setState({newAttributeName: event.target.value})
    };

    handleAttributeTypeChange = (event) => {
        this.setState({newAttributeType: event.target.value})
    };

    handleDeleteAttributeButton = (removedAttributeName) => {
        this.setState({attributes: this.state.attributes.filter(attribute => attribute.name !== removedAttributeName)})
    };

    handleSaveAttributeButton = () => {
        const attribute = {
            name: this.state.newAttributeName,
            type: this.state.newAttributeType
        };
        this.setState({attributes: this.state.attributes.concat([attribute])});
        this.setState({newAttributeName: '', newAttributeType: 'text'});
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
                    supercategory: undefined,
                    category: undefined,
                })
            });
    };

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <form className={classes.content} noValidate>
                    <div className={classes.content}>
                        <TextField
                            label={"Supercategory"}
                            className={classes.select}
                            value={this.state.supercategory === undefined ? '' : this.state.supercategory.name}
                            onChange={this.handleSupercategoryChange}
                            disabled
                        >
                            {this.state.categories.map(category => <MenuItem
                                value={category.id}>{category.name}</MenuItem>)}
                        </TextField>
                    </div>
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
                    </div>
                    <div className={classes.content}>
                        <div className={classes.attributeContent}>
                            <TextField
                                className={classes.textField}
                                label={"Additional attribute"}
                                value={this.state.newAttributeName}
                                onChange={this.handleAttributeNameChange}
                                variant="outlined"
                                helperText="Attribute required for all assets in this category"
                            />
                        </div>
                        <div className={classes.attributeContent}>
                            <Select
                                className={classes.select}
                                value={this.state.newAttributeType}
                                onChange={this.handleAttributeTypeChange}
                            >
                                <MenuItem value={"text"}>Text</MenuItem>
                                <MenuItem value={"number"}>Number</MenuItem>
                                <MenuItem value={"date"}>Date</MenuItem>
                            </Select>
                        </div>
                        <div className={classes.attributeContent}>
                            <Button variant="outlined"
                                    color="primary"
                                    className={classes.button}
                                    onClick={this.handleSaveAttributeButton}
                            >
                                Save attribute
                            </Button>
                        </div>
                    </div>
                    <div className={classes.content} style={{clear: "both"}}>
                        <CategoryAttributes
                            classes={classes}
                            attributes={this.state.attributes}
                            deleteAttributeCallback={this.handleDeleteAttributeButton}
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