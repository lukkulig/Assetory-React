import React from "react";
import * as PropTypes from "prop-types";
import {withStyles, TextField, Button, Select, MenuItem} from "@material-ui/core";
import CategoryAttributes from "./CategoryAttributes"
import api from "../api";

const styles = ({
    root: {},
    content: {
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
    }
});

class AddCategory extends React.Component {
    state = {
        categories: [],
        attributes: [],
        newAttributeName: '',
        newAttributeType: 'text',
        supercategory: '',
        categoryName: ''
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
                this.setState({supercategory: this.state.categories.slice(-1)[0]});
                document.body.style.cursor = 'default';
            });
    }

    findCategory = (categoryId) => {
        const foundCategory = this.state.categories.find(category => category.id === categoryId);
        return foundCategory === undefined ? null : foundCategory;
    };

    handleSupercategoryChange = (event) => {
        this.setState({supercategory: this.findCategory(event.target.value)});
    };

    handleCategoryNameChange = (event) => {
        this.setState({categoryName: event.target.value})
    };

    handleAttributeNameChange = (event) => {
        this.setState({newAttributeName: event.target.value})
    };

    handleAttributeTypeChange = (event) => {
        this.setState({newAttributeType: event.target.value})
    };

    handleDeleteAttributeButton = (removedAttributeName) => {
        console.log(removedAttributeName);
        this.setState({attributes: this.state.attributes.filter(attribute => attribute.name !== removedAttributeName)})
    };

    handleSaveAttributeButton = () => {
        const attribute = {
            name: this.state.newAttributeName,
            type: this.state.newAttributeType
        };
        this.setState({attributes: this.state.attributes.concat([attribute])});
        this.setState({newAttributeName: '', newAttributeType: 'text'})
    };

    handleAddCategoryButton = () => {
        const category = {
            additionalAttributes: this.state.attributes,
            name: this.state.categoryName,
            parentCategoryId: this.state.supercategory.id
        };
        api.fetch(api.endpoints.addCategory(category),
            (category) => {
                let supercategory = this.state.supercategory;
                supercategory.subcategoryIds = supercategory.subcategoryIds.concat([category.id]);
                api.fetch(api.endpoints.updateCategory(supercategory));
                this.setState({
                    categories: [],
                    attributes: [],
                    newAttributeName: '',
                    newAttributeType: 'text',
                    supercategory: '',
                    categoryName: ''
                })
            });
    };

    render() {
        const {classes} = this.props;
        console.log(this.state);
        return (
            <div className={classes.root}>
                <form className={classes.content} noValidate>
                    <div className={classes.content}>
                        <h4>Supercategory</h4>
                        <Select
                            classes={classes}
                            value={this.state.supercategory.name}
                            onChange={this.handleSupercategoryChange}
                        >
                            {this.state.categories.map(category => <MenuItem
                                value={category.id}>{category.name}</MenuItem>)}
                        </Select>
                    </div>
                    <div className={classes.content}>
                        <TextField
                            className={classes.textField}
                            label={"Category name"}
                            value={this.state.categoryName}
                            onChange={this.handleCategoryNameChange}
                            variant="outlined"
                        />
                    </div>
                    <div className={classes.content}>
                        <TextField
                            className={classes.textField}
                            label={"Additional attribute"}
                            value={this.state.newAttributeName}
                            onChange={this.handleAttributeNameChange}
                            variant="outlined"
                            helperText="Attribute required for all assets in this category"
                        />
                        <Select
                            classes={classes}
                            value={this.state.newAttributeType}
                            onChange={this.handleAttributeTypeChange}
                        >
                            <MenuItem value={"text"}>Text</MenuItem>
                            <MenuItem value={"number"}>Number</MenuItem>
                            <MenuItem value={"date"}>Date</MenuItem>
                        </Select>
                        <Button variant="outlined"
                                color="primary"
                                className={classes.button}
                                onClick={this.handleSaveAttributeButton}
                        >
                            Save attribute
                        </Button>
                    </div>
                    <div className={classes.content}>
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
                                onClick={this.handleAddCategoryButton}
                        >
                            Add category
                        </Button>
                    </div>
                </form>
            </div>
        );
    }
}

export default withStyles(styles)(AddCategory)